// Package api provides the HTTP and WebSocket server for nodld.
// It uses Fiber v2 for high-throughput request handling and exposes
// endpoints for job management, peer inspection, and real-time event streaming.
package api

import (
	"encoding/json"
	"fmt"
	"io"
	"sync"
	"time"

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
func New(dispatcher *jobs.Dispatcher, store *jobs.Store, pricingStore *pricing.Store, accountStore *account.Store, host *p2p.Host, log *zap.Logger, startTime time.Time) *Server {
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
	app.Use(cors.New())
	app.Use(logger.New())

	s := &Server{
		app:          app,
		dispatcher:   dispatcher,
		store:        store,
		pricingStore: pricingStore,
		accountStore: accountStore,
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
	s.app.Post("/pricing/override", s.handleUpdatePricingRule)
	s.app.Get("/pricing/history/:tier", s.handleGetPricingHistory)
	s.app.Get("/pricing/alerts", s.handleGetPricingAlerts)

	// Account & Affiliates
	s.app.Get("/account/me", s.handleGetMyAccount)
	s.app.Get("/account/:id", s.handleGetAccount)
	s.app.Put("/account/:id", s.handleUpdateAccount)
	s.app.Post("/account/onboard", s.handleOnboardAccount)
	s.app.Get("/affiliates/tree/:id", s.handleGetAffiliateTree)
	s.app.Post("/affiliates/transfer", s.handleTransferAffiliate)

	// Real-time event stream
	s.app.Get("/ws", websocket.New(s.handleWebSocket))
}

// Listen starts the HTTP server on the given port.
func (s *Server) Listen(port int) error {
	return s.app.Listen(fmt.Sprintf("127.0.0.1:%d", port))
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

	return c.JSON(fiber.Map{
		"activeNodes": peerCount + 1,                  // Include self
		"networkLoad": 15,                             // Mock Load for now
		"version":     fmt.Sprintf("Go %s", "1.25.8"), // User specifically asked for this version string logic or similar
		"uptime":      uptime.String(),
		"status":      "online",
		"timestamp":   time.Now().UTC(),
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
	acc, ok := s.accountStore.GetNodlr("0xFD-OWNER-SYSTEM")
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

func (s *Server) handleTransferAffiliate(c *fiber.Ctx) error {
	var req struct {
		ChildID     string `json:"childId"`
		NewParentID string `json:"newParentId"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	if err := s.accountStore.TransferAffiliate(req.ChildID, req.NewParentID); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.SendStatus(fiber.StatusOK)
}
