package api

import (
	"context"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/obregan/nodl/nodld/internal/pricing"
)

// handleGetGlobalStats returns network-wide metrics for the CDM dashboard.
func (s *Server) handleGetGlobalStats(c *fiber.Ctx) error {
	if s.accountStore.Redis() == nil {
		return c.JSON(fiber.Map{"error": "Redis not available"})
	}

	ctx := context.Background()
	
	// Count nodes
	nodeKeys, _ := s.accountStore.Redis().Keys(ctx, "nodl:node:*").Result()
	onlineCount := 0
	totalCores := 0
	totalRAM := 0
	
	for _, key := range nodeKeys {
		data, _ := s.accountStore.Redis().HGetAll(ctx, key).Result()
		if data["status"] == "online" {
			onlineCount++
		}
		// Sum up capacity (simulated if data missing)
		if cores := data["cpu_cores"]; cores != "" {
			var c int
			fmt.Sscanf(cores, "%d", &c)
			totalCores += c
		}
		if ram := data["memory_gb"]; ram != "" {
			var r int
			fmt.Sscanf(ram, "%d", &r)
			totalRAM += r
		}
	}

	return c.JSON(fiber.Map{
		"totalNodes":     len(nodeKeys),
		"onlineNodes":    onlineCount,
		"offlineNodes":   len(nodeKeys) - onlineCount,
		"totalCPUCores":  totalCores,
		"totalRAMGB":     totalRAM,
		"activeJobs":     len(s.store.List()),
		"completedJobs":  142, // Mock for now
		"pendingPayouts": 12500, // Cents
		"timestamp":      time.Now().UTC(),
	})
}

// handleGetSystemStatus returns internal health metrics for the Owner.
func (s *Server) handleGetSystemStatus(c *fiber.Ctx) error {
	redisStatus := "disconnected"
	if s.accountStore.Redis() != nil {
		if err := s.accountStore.Redis().Ping(context.Background()).Err(); err == nil {
			redisStatus = "connected"
		}
	}

	return c.JSON(fiber.Map{
		"redis":       redisStatus,
		"p2p":         "online",
		"peerID":      s.host.ID(),
		"version":     "0.1.0",
		"uptime":      time.Since(s.startTime).String(),
		"logLevel":    "info",
		"environment": "development",
	})
}

// handleGetLedger returns simulated/mock financial entries for the admin.
func (s *Server) handleGetLedger(c *fiber.Ctx) error {
	// In a real system, we'd query a Redis list or DB
	// For now, return seeded mock data
	entries := []fiber.Map{
		{
			"id": "tx_001",
			"jobId": "job_sh_123",
			"userId": "0xFD-USER-1",
			"amount": 450,
			"fee": 45,
			"status": "paid",
			"timestamp": time.Now().Add(-1 * time.Hour),
		},
		{
			"id": "tx_002",
			"jobId": "job_sh_124",
			"userId": "0xFD-USER-2",
			"amount": 1200,
			"fee": 120,
			"status": "pending",
			"timestamp": time.Now().Add(-10 * time.Minute),
		},
	}
	return c.JSON(entries)
}

// handleUpdatePricing updates the TH/sec rate for a specific tier.
func (s *Server) handleUpdatePricing(c *fiber.Ctx) error {
	var req struct {
		TierID    string              `json:"tier_id"`
		RateTHSec float64             `json:"rate_th_sec"`
		Rule      pricing.PricingRule `json:"rule"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	state := s.pricingStore.GetState()
	tierID := pricing.TierID(req.TierID)
	tier, ok := state.Tiers[tierID]
	if !ok {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "tier not found"})
	}

	tier.RateTHSec = req.RateTHSec
	
	// Update rule if provided
	if req.Rule.Mode != "" {
		tier.Rule = req.Rule
		if tier.Rule.Mode == "manual" {
			tier.Rule.ManualOverride = req.RateTHSec
		}
	}
	
	tier.LastUpdate = time.Now()
	s.pricingStore.UpdateTierState(tierID, tier)

	s.Broadcast(fiber.Map{
		"event": "tier.updated",
		"id":    tierID,
		"rate":  tier.RateTHSec,
		"mode":  tier.Rule.Mode,
	})

	return c.JSON(tier)
}
