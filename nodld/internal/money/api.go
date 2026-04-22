package money

import (
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

// Handler handles HTTP requests for the Money domain.
type Handler struct {
	svc *Service
	log *zap.Logger
}

// NewHandler creates a new Money handler.
func NewHandler(svc *Service, log *zap.Logger) *Handler {
	return &Handler{
		svc: svc,
		log: log,
	}
}

// HandleMoneyOverview returns the financial overview for an operator.
func (h *Handler) HandleMoneyOverview(c *fiber.Ctx) error {
	email := c.Query("email")
	if email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "email is required"})
	}

	overview, err := h.svc.GetMoneyOverview(c.Context(), email)
	if err != nil {
		h.log.Error("failed to get money overview", zap.Error(err), zap.String("email", email))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(overview)
}

// HandleMoneyIntegrity returns the operational integrity snapshot.
func (h *Handler) HandleMoneyIntegrity(c *fiber.Ctx) error {
	email := c.Query("email")
	if email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "email is required"})
	}

	overview, err := h.svc.GetMoneyOverview(c.Context(), email)
	if err != nil {
		h.log.Error("failed to get money integrity snapshot", zap.Error(err), zap.String("email", email))
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	if overview == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "operator not found"})
	}

	return c.JSON(overview.Integrity)
}

// HandleMoneyAcquisition returns the acquisition and due-diligence summary.
func (h *Handler) HandleMoneyAcquisition(c *fiber.Ctx) error {
	email := c.Query("email")
	if email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "email is required"})
	}

	summary, err := h.svc.GetAcquisitionSummary(c.Context(), email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(summary)
}

// HandleMoneyTransactions returns the full authoritative ledger history.
func (h *Handler) HandleMoneyTransactions(c *fiber.Ctx) error {
	email := c.Query("email")
	if email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "email is required"})
	}

	txs, err := h.svc.GetTransactions(c.Context(), email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(txs)
}

// HandleMoneyBalance returns the authoritative current balance.
func (h *Handler) HandleMoneyBalance(c *fiber.Ctx) error {
	email := c.Query("email")
	if email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "email is required"})
	}

	balance, err := h.svc.GetBalance(c.Context(), email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"balance": balance})
}
