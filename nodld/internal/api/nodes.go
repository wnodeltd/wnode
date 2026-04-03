package api

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"time"

	"github.com/gofiber/fiber/v2"
)

// handleGetRegistrationToken generates a one-time token for node registration.
func (s *Server) handleGetRegistrationToken(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)

	// Generate a random 16-byte token
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to generate token"})
	}
	token := hex.EncodeToString(b)

	// Store in Redis with TTL (e.g., 15 minutes)
	if s.accountStore.Redis() != nil {
		key := "nodl:reg_token:" + token
		err := s.accountStore.Redis().Set(context.Background(), key, userID, 15*time.Minute).Err()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to store token"})
		}
	} else {
		// In-memory fallback
		s.regTokens.Store(token, userID)
		// Auto-delete after 15m
		time.AfterFunc(15*time.Minute, func() {
			s.regTokens.Delete(token)
		})
	}

	return c.JSON(fiber.Map{
		"token":     token,
		"expiresIn": "15m",
	})
}

// validateRegistrationToken checks if a token is valid and returns the associated userID.
func (s *Server) validateRegistrationToken(token string) (string, bool) {
	if s.accountStore.Redis() != nil {
		key := "nodl:reg_token:" + token
		userID, err := s.accountStore.Redis().Get(context.Background(), key).Result()
		if err == nil {
			s.accountStore.Redis().Del(context.Background(), key)
			return userID, true
		}
	}

	// Try in-memory fallback
	if val, ok := s.regTokens.LoadAndDelete(token); ok {
		return val.(string), true
	}

	return "", false
}

func (s *Server) handleRegisterNode(c *fiber.Ctx) error {
	var req struct {
		Token      string `json:"registration_token"`
		OS         string `json:"os"`
		Arch       string `json:"arch"`
		CPUCores   int    `json:"cpu_cores"`
		MemoryGB   int    `json:"memory_gb"`
		GPUPresent bool   `json:"gpu_present"`
		GPUModel   string `json:"gpu_model"`
		Version    string `json:"version"`
		P2PPort    int    `json:"p2p_port"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	userID, ok := s.validateRegistrationToken(req.Token)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "invalid or expired registration token"})
	}

	nodeID := "node_" + req.Token[:8] // Simple ID for now
	tier := AssignTier(req.CPUCores, req.MemoryGB, req.GPUModel)

	// Store in Redis
	if s.accountStore.Redis() != nil {
		key := "nodl:node:" + nodeID
		data := map[string]interface{}{
			"user_id":        userID,
			"os":             req.OS,
			"arch":           req.Arch,
			"cpu_cores":      req.CPUCores,
			"memory_gb":      req.MemoryGB,
			"gpu_model":      req.GPUModel,
			"tier":           tier,
			"status":         "online",
			"last_heartbeat": time.Now().Format(time.RFC3339),
			"version":        req.Version,
		}
		s.accountStore.Redis().HSet(context.Background(), key, data)
		// Add to user's node list
		s.accountStore.Redis().SAdd(context.Background(), "nodl:user_nodes:"+userID, nodeID)
	}

	return c.JSON(fiber.Map{
		"node_id":                nodeID,
		"assigned_tier":          tier,
		"heartbeat_interval_sec": 30,
	})
}

func (s *Server) handleHeartbeat(c *fiber.Ctx) error {
	var req struct {
		NodeID     string  `json:"node_id"`
		CPULoad    float64 `json:"cpu_load"`
		MemoryUsed float64 `json:"memory_used_gb"`
		GPULoad    float64 `json:"gpu_load"`
		Version    string  `json:"version"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}

	// Update Redis
	if s.accountStore.Redis() != nil {
		key := "nodl:node:" + req.NodeID
		s.accountStore.Redis().HSet(context.Background(), key, map[string]interface{}{
			"status":         "online",
			"cpu_load":       req.CPULoad,
			"memory_used":    req.MemoryUsed,
			"gpu_load":       req.GPULoad,
			"last_heartbeat": time.Now().Format(time.RFC3339),
		})
	}

	return c.SendStatus(fiber.StatusOK)
}

func (s *Server) handleListNodes(c *fiber.Ctx) error {
	val := c.Locals("userID")
	userID, ok := val.(string)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "missing user ID"})
	}

	if s.accountStore.Redis() == nil {
		return c.JSON([]interface{}{})
	}

	nodeIDs, err := s.accountStore.Redis().SMembers(context.Background(), "nodl:user_nodes:"+userID).Result()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch nodes"})
	}

	var nodes []map[string]string
	for _, id := range nodeIDs {
		data, _ := s.accountStore.Redis().HGetAll(context.Background(), "nodl:node:"+id).Result()
		if len(data) > 0 {
			data["node_id"] = id
			nodes = append(nodes, data)
		}
	}

	return c.JSON(nodes)
}

func (s *Server) handleListAllNodes(c *fiber.Ctx) error {
	if s.accountStore.Redis() == nil {
		return c.JSON([]interface{}{})
	}

	// In a real system, we'd use a set of all node IDs or scan
	keys, err := s.accountStore.Redis().Keys(context.Background(), "nodl:node:*").Result()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch nodes"})
	}

	var nodes []map[string]string
	for _, key := range keys {
		data, _ := s.accountStore.Redis().HGetAll(context.Background(), key).Result()
		if len(data) > 0 {
			data["node_id"] = key[10:] // Remove "nodl:node:"
			nodes = append(nodes, data)
		}
	}

	return c.JSON(nodes)
}
