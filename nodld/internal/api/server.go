// Package api provides the HTTP and WebSocket server for nodld.
// It uses Fiber v2 for high-throughput request handling and exposes
// endpoints for job management, peer inspection, and real-time event streaming.
package api

import (
	"encoding/json"
	"fmt"
	"io"
	"strings"
	"sync"
	"time"
	"os"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"go.uber.org/zap"

	"github.com/obregan/nodl/nodld/internal/jobs"
	"github.com/obregan/nodl/nodld/internal/p2p"
	"github.com/obregan/nodl/nodld/internal/pricing"
	"github.com/obregan/nodl/nodld/internal/account"
	"github.com/obregan/nodl/nodld/internal/impact"
	"github.com/obregan/nodl/nodld/internal/stripe"
	"github.com/obregan/nodl/nodld/internal/money"
	"github.com/obregan/nodl/nodld/internal/acquisition"
	"github.com/obregan/nodl/nodld/internal/institutional"
	"github.com/obregan/nodl/nodld/internal/governance"
)

// Server is the Fiber-based HTTP/WebSocket API server.
type Server struct {
	app          *fiber.App
	dispatcher   *jobs.Dispatcher
	store        *jobs.Store
	host         *p2p.Host
	hub          *wsHub
	pricingStore *pricing.Store
	accountStore *account.Store
	stripeSvc    *stripe.Service
	moneyHandler *money.Handler
	acqHandler   *acquisition.Handler
	instHandler  *institutional.Handler
	govHandler   *governance.API
	log          *zap.Logger
	startTime    time.Time
}

// wsHub manages active WebSocket connections and broadcasts events.
type wsHub struct {
	mu      sync.RWMutex
	clients map[*websocket.Conn]struct{}
}

func newWSHub() *wsHub {
	return &wsHub{clients: make(map[*websocket.Conn]struct{})}
}

func (h *wsHub) add(c *websocket.Conn) {
	h.mu.Lock()
	h.clients[c] = struct{}{}
	h.mu.Unlock()
}

func (h *wsHub) remove(c *websocket.Conn) {
	h.mu.Lock()
	delete(h.clients, c)
	h.mu.Unlock()
}

func (h *wsHub) broadcast(msg []byte) {
	h.mu.RLock()
	defer h.mu.RUnlock()
	for c := range h.clients {
		_ = c.WriteMessage(1, msg)
	}
}

// New constructs the API server and registers all routes.
func New(dispatcher *jobs.Dispatcher, store *jobs.Store, pricingStore *pricing.Store, accountStore *account.Store, govStore *governance.Store, stripeSvc *stripe.Service, moneyHandler *money.Handler, acqHandler *acquisition.Handler, instHandler *institutional.Handler, host *p2p.Host, log *zap.Logger, startTime time.Time) *Server {
	hub := newWSHub()

	app := fiber.New(fiber.Config{
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		// Return structured JSON on panics
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		},
	})

	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: os.Getenv("ALLOWED_ORIGINS"),
		AllowHeaders: "Origin, Content-Type, Accept",
	}))
	app.Use(logger.New())

	s := &Server{
		app:          app,
		dispatcher:   dispatcher,
		store:        store,
		pricingStore: pricingStore,
		accountStore: accountStore,
		stripeSvc:    stripeSvc,
		moneyHandler: moneyHandler,
		acqHandler:   acqHandler,
		instHandler:  instHandler,
		govHandler:   governance.NewAPI(govStore),
		host:         host,
		hub:          hub,
		log:          log,
		startTime:    startTime,
	}

	s.registerRoutes()
	return s
}

func (s *Server) registerRoutes() {
	// Upgrade WebSocket connections before any other middleware
	s.app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	// Liveness probe
	s.app.Get("/health", s.handleHealth)

	// Phase 3: Vertical Slice - Real Metrics
	s.app.Get("/stats", s.handleStats)

	// Peer information
	s.app.Get("/peers", s.handlePeers)

	// Job CRUD
	s.app.Get("/jobs", s.handleListJobs)
	s.app.Post("/jobs", s.handleSubmitJob)
	s.app.Get("/jobs/:id", s.handleGetJob)

	// Pricing
	s.app.Get("/pricing", s.handleGetPricing)
	s.app.Get("/pricing/history/:tier", s.handleGetPricingHistory)
	s.app.Get("/pricing/alerts", s.handleGetPricingAlerts)

	// Account & Affiliates
	s.app.Get("/account/me", s.handleGetMyAccount)
	// Account & Affiliates
	s.app.Get("/account/me", s.handleGetMyAccount)
	s.app.Get("/account/:id", s.requireLevel(account.RoleVisitor), s.handleGetAccount)
	s.app.Put("/account/:id", s.requireLevel(account.RoleCustomerService), s.handleUpdateAccount)
	s.app.Post("/account/onboard", s.handleOnboardAccount)
	s.app.Get("/affiliates/tree/:id", s.requireLevel(account.RoleVisitor), s.handleGetAffiliateTree)
	s.app.Post("/affiliates/transfer", s.requireLevel(account.RoleStandard), s.handleTransferAffiliate) // Standard since it checks self-auth
	s.app.Post("/affiliates/genesis/activate", s.requireLevel(account.RoleOwner), s.handleActivateFounder)
	s.app.Post("/affiliates/genesis/toggle", s.requireLevel(account.RoleOwner), s.handleToggleFounderStatus)
	s.app.Post("/admin/accounts/freeze", s.requireLevel(account.RoleManagement), s.handleFreezeAccount)
	s.app.Post("/admin/accounts/unfreeze", s.requireLevel(account.RoleManagement), s.handleUnfreezeAccount)
	s.app.Post("/api/v1/validate-id", s.validateMeshClientID)

	// Business & RBAC
	s.app.Post("/admin/business/profile", s.requireLevel(account.RoleOwner), s.handleUpdateBusinessProfile)
	s.app.Post("/admin/role", s.requireLevel(account.RoleManagement), s.handleAssignRole)

	// Overrides
	s.app.Post("/pricing/override", s.requireLevel(account.RoleManagement), s.handleUpdatePricingRule)
	s.app.Get("/v1/meta/tiers", s.handleGetMetaTiers)
	s.app.Patch("/v1/admin/tiers/:id", s.requireLevel(account.RoleManagement), s.handleUpdateAdminTier)
	s.app.Post("/api/admin/resolve-flag", s.requireLevel(account.RoleManagement), s.handleResolveFlag)

	// Registry
	s.app.Get("/registry", s.handleGetRegistry)
	s.app.Post("/registry/register", s.requireLevel(account.RoleCustomerService), s.handleRegisterHardware)
	s.app.Post("/registry/release", s.requireLevel(account.RoleCustomerService), s.handleReleaseHardware)
	// Node Connectivity & Pairing
	apiV1 := s.app.Group("/api/v1")
	apiV1.Get("/system/pulse", s.handleGetSystemPulse)
	apiV1.Get("/impact", s.handleGetImpact)
	apiV1.Get("/meta/tiers", s.handleGetMetaTiers)
	apiV1.Post("/nodes/pairing-code/create", s.handleCreatePairingCode)
	apiV1.Post("/nodes/pairing-code/consume", s.handleConsumePairingCode)
	apiV1.Post("/nodes/register", s.handleRegisterNode)
	apiV1.Get("/nodes", s.handleListNodes)
	apiV1.Get("/nodes/verify-token", s.requireDeviceToken(), s.handleVerifyToken)
	
	// Stripe Routes
	if s.stripeSvc != nil {
		s.stripeSvc.RegisterRoutes(apiV1)
	}

	// Money Routes (Canonical 8080)
	apiV1.Get("/money/overview", s.moneyHandler.HandleMoneyOverview)
	apiV1.Get("/money/integrity", s.moneyHandler.HandleMoneyIntegrity)
	apiV1.Get("/money/acquisition", s.moneyHandler.HandleMoneyAcquisition)
	apiV1.Get("/money/transactions", s.moneyHandler.HandleMoneyTransactions)
	apiV1.Get("/money/balance", s.moneyHandler.HandleMoneyBalance)

	// Acquisition Routes (Canonical 8080)
	apiV1.Get("/acquisition/overview", s.acqHandler.HandleOverview)
	apiV1.Get("/acquisition/referrals", s.acqHandler.HandleReferrals)
	apiV1.Get("/acquisition/graph", s.acqHandler.HandleGraph)
	apiV1.Get("/acquisition/tree", s.acqHandler.HandleTree)
	apiV1.Get("/acquisition/children", s.acqHandler.HandleChildren)
	apiV1.Get("/acquisition/stats", s.acqHandler.HandleStats)
	apiV1.Get("/acquisition/integrity", s.acqHandler.HandleIntegrity)

	// Institutional Routes (Canonical 8080)
	s.instHandler.RegisterRoutes(apiV1, s.requireLevel(account.RoleOwner), s.requireLevel(account.RoleManagement))

	// Governance Routes (RBAC Level 4+)
	s.govHandler.RegisterRoutes(apiV1, s.requireLevel(account.RoleManagement))

	// Real-time event stream
	s.app.Get("/ws", websocket.New(s.handleWebSocket))
}

// Listen starts the HTTP server on the given port.
func (s *Server) Listen(port int) error {
	return s.app.Listen(fmt.Sprintf(":%d", port))
}

// Shutdown gracefully stops the server.
func (s *Server) Shutdown() error {
	return s.app.Shutdown()
}

// App returns the underlying Fiber app (used in tests).
func (s *Server) App() *fiber.App {
	return s.app
}

// Broadcast sends a JSON event to all WebSocket clients.
func (s *Server) Broadcast(event map[string]any) {
	b, _ := json.Marshal(event)
	s.hub.broadcast(b)
}

// --- Handlers ---

func (s *Server) handleHealth(c *fiber.Ctx) error {
	peerCount := 0
	if s.host != nil {
		peerCount = s.host.PeerCount()
	}
	return c.JSON(fiber.Map{
		"status":    "ok",
		"peers":     peerCount,
		"timestamp": time.Now().UTC(),
	})
}

func (s *Server) handleStats(c *fiber.Ctx) error {
	peerCount := 0
	if s.host != nil {
		peerCount = s.host.PeerCount()
	}

	uptime := time.Since(s.startTime).Round(time.Second)

	// Calculate Monthly Metrics (UTC)
	now := time.Now().UTC()
	thisMonthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, time.UTC)
	lastMonthStart := thisMonthStart.AddDate(0, -1, 0)
	lastMonthEnd := thisMonthStart

	var uThis, uLast, nThis, nLast int

	if s.accountStore != nil {
		users := s.accountStore.ListNodlrs()
		for _, u := range users {
			if u.CreatedAt.After(thisMonthStart) || u.CreatedAt.Equal(thisMonthStart) {
				uThis++
			} else if (u.CreatedAt.After(lastMonthStart) || u.CreatedAt.Equal(lastMonthStart)) && u.CreatedAt.Before(lastMonthEnd) {
				uLast++
			}
		}

		nodes := s.accountStore.ListAllNodes()
		for _, n := range nodes {
			if n.CreatedAt.After(thisMonthStart) || n.CreatedAt.Equal(thisMonthStart) {
				nThis++
			} else if (n.CreatedAt.After(lastMonthStart) || n.CreatedAt.Equal(lastMonthStart)) && n.CreatedAt.Before(lastMonthEnd) {
				nLast++
			}
		}
	}

	return c.JSON(fiber.Map{
		"activeNodes":         peerCount + 1,
		"networkLoad":         15,
		"version":             fmt.Sprintf("Go %s", "1.25.8"),
		"uptime":              uptime.String(),
		"status":              "online",
		"timestamp":           time.Now().UTC(),
		"newUsersThisMonth":   uThis,
		"newUsersLastMonth":   uLast,
		"newNodesThisMonth":   nThis,
		"newNodesLastMonth":   nLast,
		"redisStatus":         "active",  // Keep for internal API compatibility if needed
		"registrySyncStatus": "synced", // Keep for internal API compatibility if needed
	})
}

func (s *Server) handlePeers(c *fiber.Ctx) error {
	if s.host == nil {
		return c.JSON([]fiber.Map{})
	}

	peers := s.host.ConnectedPeers()
	result := make([]fiber.Map, 0, len(peers))
	for _, p := range peers {
		addrs := make([]string, 0, len(p.Addrs))
		for _, a := range p.Addrs {
			addrs = append(addrs, a.String())
		}
		result = append(result, fiber.Map{
			"id":    p.ID.String(),
			"addrs": addrs,
		})
	}
	return c.JSON(result)
}

func (s *Server) handleListJobs(c *fiber.Ctx) error {
	all := s.store.List()
	result := make([]fiber.Map, 0, len(all))
	for _, j := range all {
		result = append(result, jobToMap(j))
	}
	return c.JSON(result)
}

// JobSubmitRequest is the JSON manifest included with job submission.
type JobSubmitRequest struct {
	Budget       float64 `json:"budget"`
	TargetCycles int64   `json:"targetCycles"`
}

func (s *Server) handleSubmitJob(c *fiber.Ctx) error {
	// Read WASM file from multipart
	file, err := c.FormFile("wasm")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "missing 'wasm' file in multipart form",
		})
	}

	f, err := file.Open()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	defer f.Close()

	wasmBytes, err := io.ReadAll(f)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// Parse the JSON manifest from form field
	var req JobSubmitRequest
	if manifestStr := c.FormValue("manifest"); manifestStr != "" {
		if err := json.Unmarshal([]byte(manifestStr), &req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid manifest JSON"})
		}
	}

	job, err := s.dispatcher.Submit(c.Context(), wasmBytes, req.Budget, req.TargetCycles)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// Notify WebSocket clients
	s.Broadcast(fiber.Map{"event": "job.submitted", "jobID": job.ID})

	return c.Status(fiber.StatusCreated).JSON(jobToMap(job))
}

func (s *Server) handleGetJob(c *fiber.Ctx) error {
	id := c.Params("id")
	job := s.store.Get(id)
	if job == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "job not found"})
	}
	return c.JSON(jobToMap(job))
}

func (s *Server) handleWebSocket(c *websocket.Conn) {
	s.hub.add(c)
	defer s.hub.remove(c)

	// Send welcome event
	_ = c.WriteJSON(fiber.Map{
		"event":     "connected",
		"nodeID":    "nodld",
		"timestamp": time.Now().UTC(),
	})

	// Keep alive: read until disconnect
	for {
		_, _, err := c.ReadMessage()
		if err != nil {
			break
		}
	}
}

func jobToMap(j *jobs.Job) fiber.Map {
	return fiber.Map{
		"id":           j.ID,
		"status":       j.Status,
		"budget":       j.Budget,
		"targetCycles": j.TargetCycles,
		"proofCount":   j.ProofCount,
		"createdAt":    j.CreatedAt,
		"updatedAt":    j.UpdatedAt,
	}
}

func (s *Server) handleGetPricing(c *fiber.Ctx) error {
	return c.JSON(s.pricingStore.GetState())
}

func (s *Server) handleUpdatePricingRule(c *fiber.Ctx) error {
	var req struct {
		TierID pricing.TierID      `json:"tierID"`
		Rule   pricing.PricingRule `json:"rule"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	state := s.pricingStore.GetState()
	tier, ok := state.Tiers[req.TierID]
	if !ok {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "tier not found"})
	}

	// Update the rule
	tier.Rule = req.Rule
	s.pricingStore.UpdateTierState(req.TierID, tier)

	return c.JSON(tier)
}

func (s *Server) handleGetPricingHistory(c *fiber.Ctx) error {
	tierID := pricing.TierID(c.Params("tier"))
	state := s.pricingStore.GetState()
	tier, ok := state.Tiers[tierID]
	if !ok {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "tier not found"})
	}
	return c.JSON(tier.History)
}

func (s *Server) handleGetPricingAlerts(c *fiber.Ctx) error {
	state := s.pricingStore.GetState()
	allAlerts := []pricing.Alert{}
	for _, tier := range state.Tiers {
		allAlerts = append(allAlerts, tier.Alerts...)
	}
	return c.JSON(allAlerts)
}

func (s *Server) handleGetMyAccount(c *fiber.Ctx) error {
	// For testing, we return the seeded owner account
	acc, ok := s.accountStore.GetNodlr(account.AuthoritativeOwnerID)
	if !ok {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "my account not found"})
	}
	return c.JSON(acc)
}

func (s *Server) handleGetAccount(c *fiber.Ctx) error {
	id := c.Params("id")
	acc, ok := s.accountStore.GetNodlr(id)
	if !ok {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "account not found"})
	}
	return c.JSON(acc)
}

func (s *Server) handleUpdateAccount(c *fiber.Ctx) error {
	id := c.Params("id")
	var req struct {
		PayoutFrequency string `json:"payoutFrequency"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	acc, ok := s.accountStore.GetNodlr(id)
	if !ok {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "account not found"})
	}

	if req.PayoutFrequency != "" {
		acc.PayoutFrequency = account.PayoutFrequency(req.PayoutFrequency)
	}

	return c.JSON(acc)
}

func (s *Server) handleOnboardAccount(c *fiber.Ctx) error {
	var req struct {
		Email    string `json:"email"`
		ParentID string `json:"parentId"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	acc, err := s.accountStore.CreateNodlr(req.Email, req.ParentID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(acc)
}

func (s *Server) handleGetAffiliateTree(c *fiber.Ctx) error {
	id := c.Params("id")
	all := s.accountStore.ListNodlrs()
	
	// Filter for L1 and L2
	type TreeNode struct {
		ID    string `json:"id"`
		Level int    `json:"level"`
	}
	tree := []TreeNode{}
	
	for _, n := range all {
		l1, l2 := s.accountStore.ResolveTree(n.ID)
		if l1 == id {
			tree = append(tree, TreeNode{ID: n.ID, Level: 1})
		} else if l2 == id {
			tree = append(tree, TreeNode{ID: n.ID, Level: 2})
		}
	}
	
	return c.JSON(tree)
}

// isOwner checks if the request is from the authoritative owner (Stephen).
func (s *Server) isOwner(c *fiber.Ctx) bool {
	email := c.Get("X-Owner-Email")
	id := c.Get("X-Owner-ID")
	return (email == "stephen@wnode.one" || email == "stephen@nodl.one") && id == "100001-0426-01-AA"
}

// requireLevel enforces the RBAC levels.
func (s *Server) requireLevel(minLevel account.UserRole) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Owner bypass
		if s.isOwner(c) {
			return c.Next()
		}

		// Check the requester's role
		requesterID := c.Get("X-User-ID")
		if requesterID == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "missing authentication"})
		}

		requester, ok := s.accountStore.GetNodlr(requesterID)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "user not found"})
		}

		// RBAC hierarchy check
		rolePriority := map[account.UserRole]int{
			account.RoleOwner:           100,
			account.RoleExecutive:       95,
			account.RoleShareholder:     85,
			account.RoleManagement:      80,
			account.RoleCustomerService: 60,
			account.RoleVisitor:         40,
			account.RoleFounder:         30, // economic only, but higher than buyer
			account.RoleOperator:        25,
			account.RoleBuyer:           20,
			account.RoleStandard:        10,
		}

		if rolePriority[requester.Role] < rolePriority[minLevel] {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "insufficient permissions"})
		}

		// Set locals for handlers
		c.Locals("user_id", requesterID)
		c.Locals("user_role", string(requester.Role))

		return c.Next()
	}
}

func (s *Server) handleUpdateBusinessProfile(c *fiber.Ctx) error {
	if !s.isOwner(c) {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "owner only"})
	}

	var req struct {
		FounderStripeID string `json:"founderStripeAccountId"`
		NodlrStripeID   string `json:"nodlrStripeAccountId"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	if err := s.accountStore.UpdateBusinessProfile(req.FounderStripeID, req.NodlrStripeID); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"status": "business profile updated"})
}

func (s *Server) handleAssignRole(c *fiber.Ctx) error {
	var req struct {
		ID   string           `json:"id"`
		Role account.UserRole `json:"role"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	actorID := c.Locals("user_id").(string)
	actorRole := c.Locals("user_role").(string)

	if err := s.accountStore.AssignUserRole(actorID, actorRole, req.ID, req.Role); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"status": "role assigned", "id": req.ID, "role": req.Role})
}

func (s *Server) handleToggleFounderStatus(c *fiber.Ctx) error {
	if !s.isOwner(c) {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "owner only"})
	}

	var req struct {
		ID     string `json:"id"`
		Status string `json:"status"` // active or dormant
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	if req.Status != "active" && req.Status != "dormant" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid status"})
	}

	s.accountStore.UpdateFounderStatus(req.ID, req.Status)
	return c.JSON(fiber.Map{"status": "updated", "id": req.ID, "new_status": req.Status})
}

func (s *Server) handleSwapGenesisSlot(c *fiber.Ctx) error {
	// In a real system, verify RBAC Lvl 4 here
	var req struct {
		Index    int    `json:"index"` // 1-5
		NewEmail string `json:"newEmail"`
		StripeID string `json:"stripeId"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	if req.Index < 1 || req.Index > 10 {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "invalid index (1-10 required)"})
	}

	if !s.isOwner(c) {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "owner only"})
	}

	nodlrs := s.accountStore.ListNodlrs()
	var founder *account.Nodlr
	for _, n := range nodlrs {
		if n.IsFounder && n.FounderIndex == req.Index {
			founder = n
			break
		}
	}

	if founder == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "founder slot not found"})
	}

	oldEmail := founder.Email
	founder.Email = req.NewEmail
	founder.StripeConnectID = req.StripeID
	
	s.log.Info("genesis slot swapped", 
		zap.Int("index", req.Index), 
		zap.String("old", oldEmail), 
		zap.String("new", req.NewEmail))

	return c.JSON(fiber.Map{
		"status":         "success",
		"accruedBalance": founder.AccruedFounderBalance,
		"message":        "Slot unlocked. Future payouts will hit the new Stripe ID.",
	})
}

func (s *Server) handleTransferAffiliate(c *fiber.Ctx) error {
	requesterID := c.Get("X-User-ID")
	var req struct {
		ChildID     string `json:"childId"`
		NewParentID string `json:"newParentId"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	if err := s.accountStore.TransferAffiliate(requesterID, req.ChildID, req.NewParentID); err != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"status": "lineage updated", "id": req.ChildID})
}

func (s *Server) handleActivateFounder(c *fiber.Ctx) error {
	var req struct {
		ID string `json:"id"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	actorID := c.Locals("user_id").(string)
	actorRole := c.Locals("user_role").(string)

	if err := s.accountStore.ActivateFounder(actorID, actorRole, req.ID); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"status": "founder activated", "id": req.ID})
}

func (s *Server) handleFreezeAccount(c *fiber.Ctx) error {
	var req struct {
		ID string `json:"id"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	actorID := c.Locals("user_id").(string)
	actorRole := c.Locals("user_role").(string)

	if err := s.accountStore.FreezeAccount(actorID, actorRole, req.ID); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"status": "account frozen", "id": req.ID})
}

func (s *Server) handleUnfreezeAccount(c *fiber.Ctx) error {
	var req struct {
		ID string `json:"id"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	actorID := c.Locals("user_id").(string)
	actorRole := c.Locals("user_role").(string)

	if err := s.accountStore.UnfreezeAccount(actorID, actorRole, req.ID); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"status": "account unfrozen", "id": req.ID})
}

func (s *Server) handleGetRegistry(c *fiber.Ctx) error {
	if s.host == nil {
		return c.JSON(fiber.Map{})
	}
	return c.JSON(s.host.Registry().List())
}

func (s *Server) handleGetSystemPulse(c *fiber.Ctx) error {
	if s.host == nil {
		return c.JSON(fiber.Map{})
	}
	// Return the same registry list but under the pulse endpoint
	return c.JSON(s.host.Registry().List())
}

func (s *Server) handleGetImpact(c *fiber.Ctx) error {
	if s.host == nil {
		return c.JSON(fiber.Map{})
	}

	totalUptime := time.Duration(0)
	list := s.host.Registry().List()
	for _, session := range list {
		totalUptime += session.TotalUptime
	}

	metrics := impact.CalculateSavings(totalUptime)
	return c.JSON(metrics)
}
func (s *Server) handleRegisterHardware(c *fiber.Ctx) error {
	var req struct {
		HardwareDNA string `json:"hardwareDNA"`
		SessionID   string `json:"sessionId"`
		IsVM        bool   `json:"isVM"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	if s.host == nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "p2p host not initialized"})
	}

	success := s.host.Registry().Register(req.HardwareDNA, req.SessionID, req.IsVM)
	return c.JSON(fiber.Map{"success": success})
}

func (s *Server) handleReleaseHardware(c *fiber.Ctx) error {
	var req struct {
		HardwareDNA string `json:"hardwareDNA"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	if s.host == nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "p2p host not initialized"})
	}

	s.host.Registry().Release(req.HardwareDNA)
	return c.SendStatus(fiber.StatusOK)
}

func (s *Server) handleResolveFlag(c *fiber.Ctx) error {
	var req struct {
		HardwareDNA string `json:"hardwareDNA"`
		Action      string `json:"action"` // "clear" or "shadow-bench"
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	if s.host == nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "p2p host not initialized"})
	}

	s.host.Registry().ResolveFlag(req.HardwareDNA, req.Action)
	return c.SendStatus(fiber.StatusOK)
}

// requireDeviceToken authenticates a machine using its long-lived device token.
func (s *Server) requireDeviceToken() fiber.Handler {
	return func(c *fiber.Ctx) error {
		auth := c.Get("Authorization")
		if auth == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "missing device token"})
		}

		token := strings.TrimPrefix(auth, "Bearer ")
		node, ok := s.accountStore.GetNodeByToken(token)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "invalid device token"})
		}

		// Attach node context for handlers
		c.Locals("nodeId", node.ID)
		c.Locals("userId", node.UserID)

		return c.Next()
	}
}

// handleGetMetaTiers returns all active compute tiers and their metadata.
func (s *Server) handleGetMetaTiers(c *fiber.Ctx) error {
	state := s.pricingStore.GetState()
	var list []*pricing.TierState
	
	order := []pricing.TierID{
		pricing.TierTiny, 
		pricing.TierStandard, 
		pricing.TierHighRAM, 
		pricing.TierBoost, 
		pricing.TierUltra, 
		pricing.TierDeccTee,
	}

	for _, id := range order {
		if t, ok := state.Tiers[id]; ok {
			list = append(list, t)
		}
	}
	return c.JSON(list)
}

// handleUpdateAdminTier allows CMD portal to update tier specs/pricing.
func (s *Server) handleUpdateAdminTier(c *fiber.Ctx) error {
	id := pricing.TierID(c.Params("id"))
	
	var req struct {
		RateTHSec   *float64 `json:"rate_th_sec"`
		CPUCores    *int     `json:"cpu_cores"`
		GPUModel    *string  `json:"gpu_model"`
		RAMGB       *int     `json:"ram_gb"`
		Description *string  `json:"description"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	state := s.pricingStore.GetState()
	tier, ok := state.Tiers[id]
	if !ok {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "tier not found"})
	}

	if req.RateTHSec != nil { tier.RateTHSec = *req.RateTHSec }
	if req.CPUCores != nil { tier.CPUCores = *req.CPUCores }
	if req.GPUModel != nil { tier.GPUModel = *req.GPUModel }
	if req.RAMGB != nil { tier.RAMGB = *req.RAMGB }
	if req.Description != nil { tier.Description = *req.Description }

	tier.LastUpdate = time.Now()
	s.pricingStore.UpdateTierState(id, tier)

	s.Broadcast(fiber.Map{
		"event": "tier.updated",
		"id":    id,
		"rate":  tier.RateTHSec,
	})

	return c.JSON(tier)
}

func (s *Server) handleCreatePairingCode(c *fiber.Ctx) error {
	// For simulation, assume the user is the seeded owner (or get from session in real app)
	userId := account.AuthoritativeOwnerID 
	
	pc, err := s.accountStore.CreatePairingCode(userId)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"code":      pc.Code,
		"expiresAt": pc.ExpiresAt,
	})
}

func (s *Server) handleConsumePairingCode(c *fiber.Ctx) error {
	var req struct {
		Code     string               `json:"code"`
		Metadata account.NodeMetadata `json:"metadata"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	token, err := s.accountStore.ConsumePairingCode(req.Code, req.Metadata)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"deviceToken": token,
		"status":      "connected",
	})
}

func (s *Server) handleRegisterNode(c *fiber.Ctx) error {
	var req struct {
		Metadata account.NodeMetadata `json:"metadata"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	userId := account.AuthoritativeOwnerID 

	token, err := s.accountStore.RegisterNode(userId, req.Metadata)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"deviceToken": token,
		"status":      "connected",
	})
}

func (s *Server) handleListNodes(c *fiber.Ctx) error {
	userId := account.AuthoritativeOwnerID 
	nodes := s.accountStore.ListNodes(userId)
	return c.JSON(nodes)
}

func (s *Server) handleVerifyToken(c *fiber.Ctx) error {
	nodeId := c.Locals("nodeId").(string)
	userId := c.Locals("userId").(string)
	
	return c.JSON(fiber.Map{
		"valid":  true,
		"nodeId": nodeId,
		"userId": userId,
		"status": "authorized",
	})
}
func (s *Server) validateMeshClientID(c *fiber.Ctx) error {
	var req struct {
		MeshClientID string `json:"meshClientId"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	if !account.MeshClientIDRegex.MatchString(req.MeshClientID) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid mesh client id format",
			"expected": "M{bucket}-{sequence}-{MMYY}",
		})
	}

	return c.JSON(fiber.Map{"status": "valid"})
}
