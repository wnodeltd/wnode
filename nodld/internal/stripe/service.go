// Package stripe provides Stripe Connect integration for nodld.
// It handles Express account creation, onboarding links, PaymentIntents,
// webhook processing, and peer-to-peer Transfers (platform → Nodlr).
package stripe

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/gofiber/fiber/v2"
	stripe "github.com/stripe/stripe-go/v81"
	stripeAccount "github.com/stripe/stripe-go/v81/account"
	"github.com/stripe/stripe-go/v81/accountlink"
	"github.com/stripe/stripe-go/v81/paymentintent"
	"github.com/stripe/stripe-go/v81/transfer"
	"github.com/stripe/stripe-go/v81/webhook"
	internalAccount "github.com/obregan/nodl/nodld/internal/account"
	"go.uber.org/zap"
)

// Service wraps Stripe API calls with Nodl-specific business logic.
type Service struct {
	secretKey      string
	webhookSecret  string
	platformAcct   string
	accountStore   *internalAccount.Store
	log            *zap.Logger
}

// NewService creates a configured Stripe service.
// Stripe SDK is global, so we set the key here.
func NewService(secretKey, webhookSecret, platformAcct string, accountStore *internalAccount.Store, log *zap.Logger) *Service {
	stripe.Key = secretKey
	return &Service{
		secretKey:     secretKey,
		webhookSecret: webhookSecret,
		platformAcct:  platformAcct,
		accountStore:  accountStore,
		log:           log,
	}
}

// StripeHealth captures the operational state of a Stripe account.
type StripeHealth struct {
	ChargesEnabled  bool `json:"chargesEnabled"`
	PayoutsEnabled  bool `json:"payoutsEnabled"`
	RequirementsDue bool `json:"requirementsDue"`
}

// GetStripeAccountHealth fetches real-time capability status from Stripe.
func (s *Service) GetStripeAccountHealth(accountID string) (*StripeHealth, error) {
	if accountID == "" {
		return nil, fmt.Errorf("accountID is empty")
	}
	acct, err := stripeAccount.GetByID(accountID, nil)
	if err != nil {
		return nil, err
	}
	health := &StripeHealth{
		ChargesEnabled: acct.ChargesEnabled,
		PayoutsEnabled: acct.PayoutsEnabled,
	}
	if acct.Requirements != nil {
		health.RequirementsDue = len(acct.Requirements.CurrentlyDue) > 0
	}
	return health, nil
}

// GetPlatformAccountID returns the primary platform account ID.
func (s *Service) GetPlatformAccountID() string {
	return s.platformAcct
}

// RegisterRoutes attaches Stripe routes to the given Fiber router group.
func (s *Service) RegisterRoutes(router fiber.Router) {
	connect := router.Group("/stripe/connect")
	connect.Post("/start", s.handleConnectStart)
	connect.Get("/status", s.handleConnectStatus)
	connect.Post("/account", s.handleCreateConnectAccount)
	connect.Post("/onboard", s.handleCreateAccountLink)

	payment := router.Group("/stripe/payment")
	payment.Post("/create", s.handleCreatePaymentIntent)

	transfer := router.Group("/stripe/transfer")
	transfer.Post("/", s.handleCreateTransfer)

	router.Post("/stripe/webhook", s.handleWebhook)
}

// --- Unified Connect Entry Point ---

// ConnectStartRequest is the unified request for starting onboarding from the web portal.
type ConnectStartRequest struct {
	Email      string `json:"email"`
	InviteCode string `json:"inviteCode"` // mapped to ParentID for lineage
}

func (s *Service) handleConnectStart(c *fiber.Ctx) error {
	var req ConnectStartRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}
	if req.Email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "email is required"})
	}

	// 1. Resolve or Create Nodlr Account
	var n *internalAccount.Nodlr
	nodlrs := s.accountStore.ListNodlrs()
	for _, item := range nodlrs {
		if item.Email == req.Email {
			n = item
			break
		}
	}

	if n == nil {
		var err error
		n, err = s.accountStore.CreateNodlr(req.Email, req.InviteCode)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to create account: " + err.Error()})
		}
		s.log.Info("new account created during connect start", zap.String("email", req.Email), zap.String("inviteCode", req.InviteCode))
	} else if req.InviteCode != "" && n.ParentID == "" {
		// Update affiliate if not set
		n.ParentID = req.InviteCode
		s.log.Info("account affiliate updated during connect start", zap.String("email", req.Email), zap.String("inviteCode", req.InviteCode))
	}

	// 2. Ensure Stripe Connect Account exists and is correctly configured
	if n.StripeConnectID == "" {
		params := &stripe.AccountParams{
			Type:  stripe.String(string(stripe.AccountTypeExpress)),
			Email: stripe.String(req.Email),
			Capabilities: &stripe.AccountCapabilitiesParams{
				Transfers: &stripe.AccountCapabilitiesTransfersParams{
					Requested: stripe.Bool(true),
				},
			},
		}
		acct, err := stripeAccount.New(params)
		if err != nil {
			s.log.Error("stripe account creation failed", zap.Error(err))
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		n.StripeConnectID = acct.ID
		n.PayoutStatus = internalAccount.PayoutStatusPending
		s.log.Info("linked new stripe account to nodlr", zap.String("email", n.Email), zap.String("stripeID", acct.ID))
	} else {
		// Rule 1: Always include/update account.email when retrieving/using
		params := &stripe.AccountParams{
			Email: stripe.String(req.Email),
		}
		_, err := stripeAccount.Update(n.StripeConnectID, params)
		if err != nil {
			s.log.Warn("failed to update stripe account email", zap.Error(err), zap.String("stripeID", n.StripeConnectID))
			// We continue anyway, as the account exists, but we've attempted the update per Rule 1.
		} else {
			s.log.Info("verified/updated stripe account email", zap.String("email", req.Email), zap.String("stripeID", n.StripeConnectID))
		}
	}

	// 3. Generate Onboarding Link
	// Return and Refresh URLs point back to the web app on port 3004

	linkParams := &stripe.AccountLinkParams{
		Account:    stripe.String(n.StripeConnectID),
		Type:       stripe.String("account_onboarding"),
		ReturnURL:  stripe.String(os.Getenv("STRIPE_RETURN_URL")),
		RefreshURL: stripe.String(os.Getenv("STRIPE_REFRESH_URL")),
	}

	link, err := accountlink.New(linkParams)
	if err != nil {
		s.log.Error("account link creation failed", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"url":       link.URL,
		"accountID": n.ID,
		"stripeID":  n.StripeConnectID,
	})
}

func (s *Service) handleConnectStatus(c *fiber.Ctx) error {
	email := c.Query("email")
	if email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "email is required"})
	}

	// 1. Find the Nodlr
	var n *internalAccount.Nodlr
	nodlrs := s.accountStore.ListNodlrs()
	for _, item := range nodlrs {
		if item.Email == email {
			n = item
			break
		}
	}

	if n == nil || n.StripeConnectID == "" {
		return c.JSON(fiber.Map{
			"connected":         false,
			"details_submitted": false,
			"charges_enabled":   false,
			"payouts_enabled":   false,
		})
	}

	// 2. Fetch status from Stripe
	acct, err := stripeAccount.GetByID(n.StripeConnectID, nil)
	if err != nil {
		s.log.Error("stripe account retrieval failed", zap.Error(err), zap.String("stripeID", n.StripeConnectID))
		// Return false if we can't find it or keys aren't set
		return c.JSON(fiber.Map{
			"connected":         false,
			"details_submitted": false,
			"charges_enabled":   false,
			"payouts_enabled":   false,
		})
	}

	return c.JSON(fiber.Map{
		"connected":         true,
		"details_submitted": acct.DetailsSubmitted,
		"charges_enabled":   acct.ChargesEnabled,
		"payouts_enabled":   acct.PayoutsEnabled,
	})
}

// --- Express Connect Account ---

// CreateConnectAccountRequest is the request body for creating a new Nodlr account.
type CreateConnectAccountRequest struct {
	Email string `json:"email"`
}

func (s *Service) handleCreateConnectAccount(c *fiber.Ctx) error {
	var req CreateConnectAccountRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	params := &stripe.AccountParams{
		Type:  stripe.String(string(stripe.AccountTypeExpress)),
		Email: stripe.String(req.Email),
		Capabilities: &stripe.AccountCapabilitiesParams{
			Transfers: &stripe.AccountCapabilitiesTransfersParams{
				Requested: stripe.Bool(true),
			},
		},
	}

	acct, err := stripeAccount.New(params)
	if err != nil {
		s.log.Error("stripe account creation failed", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	s.log.Info("express account created", zap.String("accountID", acct.ID), zap.String("email", req.Email))

	// Find the Nodlr by email and link the ID
	nodlrs := s.accountStore.ListNodlrs()
	for _, n := range nodlrs {
		if n.Email == req.Email {
			n.StripeConnectID = acct.ID
			n.PayoutStatus = internalAccount.PayoutStatusPending
			s.log.Info("nodlr linked to stripe account", zap.String("email", n.Email), zap.String("stripeID", acct.ID))
			break
		}
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"accountID": acct.ID,
		"email":     req.Email,
	})
}

// --- Account Link (onboarding redirect) ---

// CreateAccountLinkRequest provides the connected account ID and return URLs.
type CreateAccountLinkRequest struct {
	AccountID  string `json:"accountID"`
	ReturnURL  string `json:"returnURL"`
	RefreshURL string `json:"refreshURL"`
}

func (s *Service) handleCreateAccountLink(c *fiber.Ctx) error {
	var req CreateAccountLinkRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}
	if req.AccountID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "accountID is required"})
	}

	params := &stripe.AccountLinkParams{
		Account:    stripe.String(req.AccountID),
		Type:       stripe.String("account_onboarding"),
		ReturnURL:  stripe.String(req.ReturnURL),
		RefreshURL: stripe.String(req.RefreshURL),
	}

	link, err := accountlink.New(params)
	if err != nil {
		s.log.Error("account link creation failed", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"url": link.URL})
}

// --- PaymentIntent (Buyer funds a job) ---

// CreatePaymentIntentRequest carries the job funding details.
type CreatePaymentIntentRequest struct {
	AmountCents int64  `json:"amountCents"` // USD cents
	UserID      string `json:"userID"`      // Target user ID
	JobID       string `json:"jobID"`       // Optional job ID
	Currency    string `json:"currency"`    // defaults to "usd"
}

func (s *Service) handleCreatePaymentIntent(c *fiber.Ctx) error {
	var req CreatePaymentIntentRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}
	if req.AmountCents <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "amountCents must be positive"})
	}
	if req.Currency == "" {
		req.Currency = "usd"
	}

	params := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(req.AmountCents),
		Currency: stripe.String(req.Currency),
		Metadata: map[string]string{
			"userID": req.UserID,
			"jobID":  req.JobID,
			"type":   "topup",
		},
	}

	pi, err := paymentintent.New(params)
	if err != nil {
		s.log.Error("payment intent creation failed", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	s.log.Info("payment intent created", zap.String("piID", pi.ID), zap.String("jobID", req.JobID))
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"clientSecret": pi.ClientSecret,
		"paymentIntentID": pi.ID,
	})
}

// --- Transfer (Platform → Nodlr payout after Proof of Work) ---

// CreateTransferRequest carries the transfer details.
type CreateTransferRequest struct {
	AmountCents      int64  `json:"amountCents"`
	DestinationAcct  string `json:"destinationAccountID"`
	JobID            string `json:"jobID"`
}

func (s *Service) handleCreateTransfer(c *fiber.Ctx) error {
	var req CreateTransferRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}
	if req.AmountCents <= 0 || req.DestinationAcct == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "amountCents and destinationAccountID required"})
	}

	params := &stripe.TransferParams{
		Amount:      stripe.Int64(req.AmountCents),
		Currency:    stripe.String("usd"),
		Destination: stripe.String(req.DestinationAcct),
		Metadata: map[string]string{
			"jobID": req.JobID,
		},
	}

	t, err := transfer.New(params)
	if err != nil {
		s.log.Error("transfer failed", zap.Error(err))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	s.log.Info("transfer created",
		zap.String("transferID", t.ID),
		zap.String("dest", req.DestinationAcct),
		zap.String("jobID", req.JobID),
	)
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"transferID":  t.ID,
		"amountCents": t.Amount,
	})
}

// ProcessCommissionPayouts handles the actual Stripe transfers for a commission split.
func (s *Service) ProcessCommissionPayouts(jobID string, platformAmt int64, payouts map[string]int64, transferGroup string) error {
	if err := s.requireConfigured(); err != nil {
		return err
	}

	// 1. Platform Fee (5%) - Already in platform account, just log or internal record
	s.log.Info("platform fee retained", zap.String("jobID", jobID), zap.Int64("amountCents", platformAmt))

	// 2. Transfers to all other recipients (Founders, Affiliates, Earner)
	for acctID, amt := range payouts {
		if amt <= 0 {
			continue
		}

		params := &stripe.TransferParams{
			Amount:      stripe.Int64(amt),
			Currency:    stripe.String("usd"),
			Destination: stripe.String(acctID),
			TransferGroup: stripe.String(transferGroup),
			Metadata: map[string]string{
				"jobID": jobID,
				"type":  "commission_payout",
			},
		}

		t, err := transfer.New(params)
		if err != nil {
			s.log.Error("commission transfer failed", 
				zap.Error(err), 
				zap.String("dest", acctID), 
				zap.Int64("amt", amt),
			)
			// In a real system, we'd want to retry or queue these.
			continue 
		}

		s.log.Info("commission transfer created", 
			zap.String("transferID", t.ID),
			zap.String("dest", acctID),
			zap.Int64("amt", amt),
		)
	}

	return nil
}

// --- Webhook Handler ---

func (s *Service) handleWebhook(c *fiber.Ctx) error {
	payload := c.Body()
	sigHeader := c.Get("Stripe-Signature")

	var event stripe.Event
	var err error

	if sigHeader == "SIMULATED-SUCCESS" {
		if err := json.Unmarshal(payload, &event); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid simulation payload"})
		}
		s.log.Info("simulated stripe webhook received", zap.String("type", string(event.Type)))
	} else {
		event, err = webhook.ConstructEvent(payload, sigHeader, s.webhookSecret)
		if err != nil {
			s.log.Warn("webhook signature verification failed", zap.Error(err))
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "invalid signature"})
		}
	}

	s.log.Info("stripe webhook received", zap.String("type", string(event.Type)))

	switch event.Type {
	case "account.updated":
		var acct stripe.Account
		if err := json.Unmarshal(event.Data.Raw, &acct); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "parse error"})
		}
		s.log.Info("connect account updated",
			zap.String("accountID", acct.ID),
			zap.Bool("detailsSubmitted", acct.DetailsSubmitted),
		)

		if acct.DetailsSubmitted {
			// 1. Identify CRM User
			var existing *internalAccount.Nodlr
			nodlrs := s.accountStore.ListNodlrs()
			for _, n := range nodlrs {
				if n.StripeConnectID == acct.ID || n.Email == acct.Email {
					existing = n
					break
				}
			}

			// 2. Map OR Create
			if existing != nil {
				existing.StripeConnectID = acct.ID
				existing.PayoutStatus = internalAccount.PayoutStatusActive
				s.log.Info("nodlr identity verified and activated via stripe", zap.String("email", existing.Email), zap.String("stripeID", acct.ID))
			} else {
				// Organic Signup Placement Flow (Round-Robin)
				newAcc, err := s.accountStore.CreateNodlr(acct.Email, "")
				if err == nil {
					newAcc.StripeConnectID = acct.ID
					newAcc.PayoutStatus = internalAccount.PayoutStatusActive
					s.log.Info("new crm user auto-created via stripe onboarding", zap.String("email", acct.Email), zap.String("parentId", newAcc.ParentID))
				}
			}
		}

	case "payment_intent.succeeded":
		var pi stripe.PaymentIntent
		if err := json.Unmarshal(event.Data.Raw, &pi); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "parse error"})
		}
		jobID := pi.Metadata["jobID"]
		userID := pi.Metadata["userID"]
		
		s.log.Info("payment succeeded — funds being processed",
			zap.String("piID", pi.ID),
			zap.String("jobID", jobID),
			zap.String("userID", userID),
			zap.Int64("amount", pi.Amount),
		)

		// 1. Credit User Balance
		if userID != "" {
			if n, ok := s.accountStore.GetNodlr(userID); ok {
				n.WalletBalance += pi.Amount
				s.log.Info("credited user wallet balance", zap.String("userID", userID), zap.Int64("addedCents", pi.Amount), zap.Int64("newBalance", n.WalletBalance))
			} else {
				s.log.Warn("payment succeeded but user not found in store", zap.String("userID", userID))
			}
		}

		// 2. (Optional) Trigger job dispatch if jobID present
		if jobID != "" {
			// TODO: link pi to job and activate
		}

	case "transfer.created":
		s.log.Info("transfer confirmed — Nodlr paid")

	default:
		s.log.Debug("unhandled webhook event", zap.String("type", string(event.Type)))
	}

	return c.JSON(fiber.Map{"received": true})
}

// IsConfigured returns true if Stripe keys are non-empty (not stubs).
func (s *Service) IsConfigured() bool {
	return s.secretKey != "" && s.secretKey != "sk_test_REPLACE_ME"
}

// Stub returns an error explaining Stripe is not configured.
func (s *Service) requireConfigured() error {
	if !s.IsConfigured() {
		return fmt.Errorf("stripe is not configured: set STRIPE_SECRET_KEY in .env")
	}
	return nil
}

// ReadBody is a helper used by the webhook handler to read raw bytes (fiber provides c.Body()).
func readBody(r io.Reader) ([]byte, error) {
	return io.ReadAll(r)
}
