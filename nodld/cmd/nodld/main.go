// nodld — the Nodl mesh daemon.
// It bootstraps the libp2p host, starts the WASM runner,
// initialises the job dispatcher, registers Stripe routes,
// and starts the Fiber HTTP/WebSocket API server.
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"

	"github.com/obregan/nodl/nodld/internal/account"
	"github.com/obregan/nodl/nodld/internal/api"
	"github.com/obregan/nodl/nodld/internal/config"
	"github.com/obregan/nodl/nodld/internal/jobs"
	"github.com/obregan/nodl/nodld/internal/p2p"
	"github.com/obregan/nodl/nodld/internal/pricing"
	stripeService "github.com/obregan/nodl/nodld/internal/stripe"
	"github.com/obregan/nodl/nodld/internal/wasm"
)

func main() {
	// ── Logger ──────────────────────────────────────────────────────────────
	log, err := zap.NewProduction()
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to initialise logger: %v\n", err)
		os.Exit(1)
	}
	defer log.Sync()

	startTime := time.Now()
	log.Info("▶ nodld starting", zap.String("version", "0.1.0"), zap.Time("startTime", startTime))

	// ── Config ───────────────────────────────────────────────────────────────
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("config load failed", zap.Error(err))
	}
	log.Info("config loaded",
		zap.Int("apiPort", cfg.APIPort),
		zap.Int("p2pPort", cfg.P2PPort),
		zap.String("logLevel", cfg.LogLevel),
	)

	// ── Context with graceful shutdown ───────────────────────────────────────
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// ── Redis Client ─────────────────────────────────────────────────────────
	var rdb *redis.Client
	opts, err := redis.ParseURL(cfg.RedisURL)
	if err != nil {
		log.Warn("invalid Redis URL, falling back to in-memory only", zap.Error(err))
	} else {
		rdb = redis.NewClient(opts)
		// Check connection
		if err := rdb.Ping(ctx).Err(); err != nil {
			log.Warn("Redis not available, falling back to in-memory only", zap.Error(err))
			rdb = nil
		} else {
			log.Info("connected to Redis", zap.String("url", cfg.RedisURL))
		}
	}

	// ── P2P Identity ─────────────────────────────────────────────────────────
	priv, err := p2p.LoadOrCreateIdentity("peer.key")
	if err != nil {
		log.Fatal("failed to load/create p2p identity", zap.Error(err))
	}

	// ── P2P Host ──────────────────────────────────────────────────────────────
	p2pHost, err := p2p.New(ctx, cfg.P2PPort, priv, cfg.P2PBootstrapPeers, rdb, log)
	if err != nil {
		log.Fatal("p2p host failed to start", zap.Error(err))
	}
	defer p2pHost.Close()
	log.Info("libp2p host online", zap.String("peerID", p2pHost.ID()))

	// ── Account & Affiliate Store ─────────────────────────────────────────────
	accountStore := account.NewStore(rdb)

	// ── Job Store + Dispatcher ────────────────────────────────────────────────
	store := jobs.NewStore()
	dispatcher := jobs.NewDispatcher(store, p2pHost.Registry(), accountStore, log)
	go dispatcher.Run(ctx)

	// ── WASM Runner ───────────────────────────────────────────────────────────
	_, err = wasm.NewRunner(ctx, p2pHost.ID(), log)
	if err != nil {
		log.Fatal("WASM runner failed to start", zap.Error(err))
	}
	log.Info("Wazero runtime online", zap.String("status", "ready"))

	// ── Stripe Service ────────────────────────────────────────────────────────
	stripeSvc := stripeService.NewService(
		cfg.StripeSecretKey,
		cfg.StripeWebhookSecret,
		cfg.StripePlatformAccount,
		accountStore,
		store,
		log,
	)
	if !stripeSvc.IsConfigured() {
		log.Warn("Stripe is not configured — payment routes will return errors until STRIPE_SECRET_KEY is set")
	}

	// ── Pricing Engine ────────────────────────────────────────────────────────
	pricingStore := pricing.NewStore(rdb)
	pricingEngine := pricing.NewEngine(pricingStore, log)
	go pricingEngine.Run(ctx)

	// ── Account & Affiliate Store ─────────────────────────────────────────────
	// (Moved up)
	
	// Seed Data — Persistent Real Accounts
	ownerID := "0xFD-OWNER-SYSTEM"
	accountStore.SetFounder(1, ownerID)
	
	ownerHash, _ := api.HashPassword("command")
	owner := &account.Nodlr{
		// Identity
		ID:          ownerID,
		DisplayName: "Stephen Soos",
		Email:       "stephen@nodl.one",
		Role:        account.RoleOwner,
		ProtocolID:  "100001-0426-01-AA",
		NetID:       "01",
		// Profile
		AvatarURL:    "",
		Bio:          "Founder & CEO, Nodl Protocol",
		Organization: "Nodl",
		// Network
		NodeCount:           3,
		ActiveNodes:         3,
		NodeStatusSummary:   "3 active, 0 offline",
		NetworkArchitecture: "Mesh v2",
		ConnectedPeers:      12,
		LastSeen:            time.Now(),
		// Registry
		RegistryEntryID:      "REG-001",
		RegistryStatus:       "verified",
		ProtocolVersion:      "1.2.0",
		ProtocolCapabilities: []string{"compute", "storage", "relay", "governance"},
		// Financial
		AccruedFounderBalance: 250000,
		PendingPayouts:        12500,
		LifetimeEarnings:      1250000,
		CommissionRate:        0.03,
		PayoutStatus:          account.PayoutStatusActive,
		PayoutFrequency:       account.PayoutDaily,
		StripeConnectID:       "acct_1test",
		// Security
		PasswordHash:  ownerHash,
		MFAEnabled:    true,
		LastLogin:     time.Now(),
		SessionStatus: "active",
		Permissions:   []string{"admin", "finance", "nodes", "users", "settings"},
		// Telemetry
		IntegrityScore: 980,
		APILatency:     12,
		SyncStatus:     "synced",
		StorageMode:    "redis",
		ErrorCount:     0,
		// Founder
		IsFounder:    true,
		FounderIndex: 1,
		// Metadata
		CreatedAt: time.Date(2025, 1, 15, 0, 0, 0, 0, time.UTC),
		UpdatedAt: time.Now(),
		Source:    "registry",
	}
	accountStore.AddNodlr(owner)

	// Eldesskar — Second Founder (Persistent Real Account)
	eldesskarID := "0xFD-ELDESSKAR-02"
	accountStore.SetFounder(2, eldesskarID)
	eldesskarHash, _ := api.HashPassword("command")
	eldesskar := &account.Nodlr{
		// Identity
		ID:          eldesskarID,
		DisplayName: "Eldesskar",
		Email:       "eldesskar@protocol.nodl",
		Role:        account.RoleManager,
		ProtocolID:  "100002-0426-02-AA",
		NetID:       "02",
		// Profile
		AvatarURL:    "",
		Bio:          "",
		Organization: "",
		// Network
		NodeCount:           0,
		ActiveNodes:         0,
		NodeStatusSummary:   "No nodes registered",
		NetworkArchitecture: "Mesh v2",
		ConnectedPeers:      0,
		LastSeen:            time.Now(),
		// Registry
		RegistryEntryID:      "REG-002",
		RegistryStatus:       "verified",
		ProtocolVersion:      "1.2.0",
		ProtocolCapabilities: []string{"compute", "storage"},
		// Financial
		AccruedFounderBalance: 125000,
		PendingPayouts:        6250,
		LifetimeEarnings:      625000,
		CommissionRate:        0.02,
		PayoutStatus:          account.PayoutStatusActive,
		PayoutFrequency:       account.PayoutDaily,
		StripeConnectID:       "acct_2test",
		// Security
		PasswordHash:  eldesskarHash,
		MFAEnabled:    false,
		LastLogin:     time.Now(),
		SessionStatus: "active",
		Permissions:   []string{"nodes", "finance"},
		// Telemetry
		IntegrityScore: 950,
		APILatency:     18,
		SyncStatus:     "synced",
		StorageMode:    "redis",
		ErrorCount:     0,
		// Founder
		IsFounder:    true,
		FounderIndex: 2,
		// Metadata
		CreatedAt: time.Date(2025, 1, 16, 0, 0, 0, 0, time.UTC),
		UpdatedAt: time.Now(),
		Source:    "registry",
	}
	accountStore.AddNodlr(eldesskar)

	// Create a small tree with Manager/CS roles
	for i := 1; i <= 3; i++ {
		l1, _ := accountStore.CreateNodlr(fmt.Sprintf("l1_%d@example.com", i), ownerID)
		l1.Role = account.RoleManager
		l1.PasswordHash, _ = api.HashPassword("manager")
		accountStore.AddNodlr(l1)

		for j := 1; j <= 2; j++ {
			l2, _ := accountStore.CreateNodlr(fmt.Sprintf("l1_%d_l2_%d@example.com", i, j), l1.ID)
			l2.Role = account.RoleCustomerService
			l2.PasswordHash, _ = api.HashPassword("assistant")
			accountStore.AddNodlr(l2)
		}
	}

	log.Info("account store online with seeded data", zap.String("ownerID", ownerID), zap.String("eldesskarID", eldesskarID))

	// ── API Server ────────────────────────────────────────────────────────────
	srv := api.New(dispatcher, store, pricingStore, accountStore, p2pHost, log, startTime)

	// ── Settlement Scheduler ──────────────────────────────────────────────────
	scheduler := account.NewScheduler(accountStore, stripeSvc, log)
	go scheduler.Run(ctx)

	// Register Stripe routes under /api/v1
	stripeSvc.RegisterRoutes(srv.App().Group("/api/v1"))

	// ── Heartbeat broadcaster (real-time WS events) ───────────────────────────
	go func() {
		ticker := time.NewTicker(5 * time.Second)
		defer ticker.Stop()
		heartbeatPath := "/home/obregan/Documents/nodl/heartbeat.json"
		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				peerCount := 0
				if p2pHost != nil {
					peerCount = p2pHost.PeerCount()
				}

				// Broadcast to WebSockets
				srv.Broadcast(map[string]any{
					"event":     "heartbeat",
					"peers":     peerCount,
					"jobs":      len(store.List()),
					"timestamp": time.Now().UTC(),
				})

				// Write to heartbeat.json for Phase 2
				logEntry := map[string]any{
					"timestamp": time.Now().Format(time.RFC3339),
					"message":   fmt.Sprintf("SYSTEM STATUS: NOMINAL | ACTIVE_PEERS: %d | BRIDGE_ID: %s", peerCount, p2pHost.ID()),
					"type":      "success",
				}

				var logs []map[string]any
				if data, err := os.ReadFile(heartbeatPath); err == nil {
					_ = json.Unmarshal(data, &logs)
				}

				logs = append(logs, logEntry)
				if len(logs) > 30 { // Shift old logs
					logs = logs[len(logs)-30:]
				}

				if newData, err := json.MarshalIndent(logs, "", "  "); err == nil {
					_ = os.WriteFile(heartbeatPath, newData, 0644)
				}
			}
		}
	}()

	// ── Start HTTP server in background ──────────────────────────────────────
	go func() {
		log.Info("API server listening", zap.Int("port", cfg.APIPort))
		if err := srv.Listen(cfg.APIPort); err != nil {
			log.Error("API server error", zap.Error(err))
		}
	}()

	// ── Graceful Shutdown ────────────────────────────────────────────────────
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Info("shutting down nodld…")
	cancel()

	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer shutdownCancel()
	_ = shutdownCtx

	if err := srv.Shutdown(); err != nil {
		log.Warn("API shutdown error", zap.Error(err))
	}
	log.Info("▶ nodld halted cleanly")
}
