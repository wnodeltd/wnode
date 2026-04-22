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

	"go.uber.org/zap"

	"github.com/obregan/nodl/nodld/internal/api"
	"github.com/obregan/nodl/nodld/internal/config"
	"github.com/obregan/nodl/nodld/internal/jobs"
	"github.com/obregan/nodl/nodld/internal/p2p"
	"github.com/obregan/nodl/nodld/internal/pricing"
	stripeService "github.com/obregan/nodl/nodld/internal/stripe"
	"github.com/obregan/nodl/nodld/internal/wasm"
	"github.com/obregan/nodl/nodld/internal/account"
	"github.com/obregan/nodl/nodld/internal/money"
	"github.com/obregan/nodl/nodld/internal/acquisition"
	"github.com/obregan/nodl/nodld/internal/forensics"
	"github.com/obregan/nodl/nodld/internal/institutional"
	"github.com/obregan/nodl/nodld/internal/governance"
)

func main() {
	// ── Config ───────────────────────────────────────────────────────────────
	cfg, err := config.Load()
	if err != nil {
		fmt.Fprintf(os.Stderr, "config load failed: %v\n", err)
		os.Exit(1)
	}

	// ── Logger ──────────────────────────────────────────────────────────────
	var zapCfg zap.Config
	if cfg.LogLevel == "debug" {
		zapCfg = zap.NewDevelopmentConfig()
	} else {
		zapCfg = zap.NewProductionConfig()
	}
	
	log, err := zapCfg.Build()
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to initialise logger: %v\n", err)
		os.Exit(1)
	}
	defer log.Sync()

	startTime := time.Now()
	log.Info("▶ nodld starting", zap.String("version", "0.1.0"), zap.Time("startTime", startTime), zap.String("logLevel", cfg.LogLevel))
	log.Info("config loaded",
		zap.Int("apiPort", cfg.APIPort),
		zap.Int("p2pPort", cfg.P2PPort),
		zap.String("logLevel", cfg.LogLevel),
	)

	// ── Context with graceful shutdown ───────────────────────────────────────
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// ── P2P Identity ─────────────────────────────────────────────────────────
	priv, err := p2p.LoadOrCreateIdentity("peer.key")
	if err != nil {
		log.Fatal("failed to load/create p2p identity", zap.Error(err))
	}

	// ── P2P Host ──────────────────────────────────────────────────────────────
	p2pHost, err := p2p.New(ctx, cfg.P2PPort, priv, cfg.P2PBootstrapPeers, log)
	if err != nil {
		log.Fatal("p2p host failed to start", zap.Error(err))
	}
	defer p2pHost.Close()
	log.Info("libp2p host online", zap.String("peerID", p2pHost.ID()))

	// ── Forensic Integrity Layer ─────────────────────────────────────────────
	forensicsStore := forensics.NewStore("SOVEREIGN_SECRET_2026", "NODL_SALT")

	// ── Account & Affiliate Store ─────────────────────────────────────────────
	accountStore := account.NewStore(forensicsStore, "nodld/state/engine.json")

	// ── Governance Store (Personnel RBAC) ───────────────────────────────────
	govStore := governance.NewStore()

	// ── Job Store + Dispatcher ────────────────────────────────────────────────
	store := jobs.NewStore()
	dispatcher := jobs.NewDispatcher(store, p2pHost.Registry(), accountStore, forensicsStore, log)
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
		log,
	)
	if !stripeSvc.IsConfigured() {
		log.Warn("Stripe is not configured — payment routes will return errors until STRIPE_SECRET_KEY is set")
	}

	// ── Pricing Engine ────────────────────────────────────────────────────────
	pricingStore := pricing.NewStore()
	pricingEngine := pricing.NewEngine(pricingStore, log)
	go pricingEngine.Run(ctx)

	// ── Account & Affiliate Store ─────────────────────────────────────────────
	// (Moved up)
	
	// Seed Data for Authoritative Founder Layer (5 Live, 5 Dormant)
	founders := []struct {
		id     string
		email  string
		name   string
		status string
	}{
		{id: "100001-0426-01-AA", email: "stephen@nodl.one", name: "Stephen Soos", status: "active"},
		{id: "100002-0426-02-AA", email: "eldesskar@protocol.nodl", name: "Eldesskar", status: "active"},
		{id: "100003-0426-03-AA", email: "ava@wnode.one", name: "Ava Chen", status: "active"},
		{id: "100004-0426-04-AA", email: "marcus@wnode.one", name: "Marcus Thorne", status: "active"},
		{id: "100005-0426-05-AA", email: "yara@wnode.one", name: "Yara Hassan", status: "active"},
		{id: "100006-0426-06-AA", email: "f06@wnode.one", name: "Founder 06", status: "dormant"},
		{id: "100007-0426-07-AA", email: "f07@wnode.one", name: "Founder 07", status: "dormant"},
		{id: "100008-0426-08-AA", email: "f08@wnode.one", name: "Founder 08", status: "dormant"},
		{id: "100009-0426-09-AA", email: "f09@wnode.one", name: "Founder 09", status: "dormant"},
		{id: "100010-0426-10-AA", email: "f10@wnode.one", name: "Founder 10", status: "dormant"},
	}

	for i, f := range founders {
		founderIndex := i + 1
		accountStore.SetFounder(founderIndex, f.id)
		n := &account.Nodlr{
			ID:                     f.id,
			Email:                  f.email,
			Status:                 f.status,
			IsFounder:              true,
			FounderIndex:           founderIndex,
			Role:                   account.RoleStandard, // Standard by default, Stephen promoted below
			PayoutFrequency:        account.PayoutDaily,
			PayoutStatus:           account.PayoutStatusActive,
			IntegrityScore:         1000,
			FounderStripeAccountID: nil, // null
			NodlrStripeAccountID:   nil, // null
			CreatedAt:              time.Now(),
		}
		if f.id == account.AuthoritativeOwnerID {
			n.Role = account.RoleOwner
			// n.StripeConnectID = "" // Dynamic creation enabled
		}
		accountStore.AddNodlr(n)
	}

	ownerID := account.AuthoritativeOwnerID

	// Create a small test tree under Stephen
	for i := 1; i <= 3; i++ {
		l1, _ := accountStore.CreateNodlr(fmt.Sprintf("l1_%d@example.com", i), ownerID)
		for j := 1; j <= 2; j++ {
			accountStore.CreateNodlr(fmt.Sprintf("l1_%d_l2_%d@example.com", i, j), l1.ID)
		}
	}

	log.Info("account store online with seeded data", zap.String("ownerID", ownerID))

	// ── Money Service ──────────────────────────────────────────────────────────
	moneySvc := money.NewService(accountStore, stripeSvc, log, startTime)
	moneyHandler := money.NewHandler(moneySvc, log)

	// ── Acquisition Service ────────────────────────────────────────────────────
	acqSvc := acquisition.NewService(accountStore, log)
	acqHandler := acquisition.NewHandler(acqSvc, log)

	// ── Institutional Service ──────────────────────────────────────────────────
	instSvc := institutional.NewService(accountStore, forensicsStore, log)
	instHandler := institutional.NewHandler(instSvc, log)

	// ── API Server ────────────────────────────────────────────────────────────
	srv := api.New(dispatcher, store, pricingStore, accountStore, govStore, stripeSvc, moneyHandler, acqHandler, instHandler, p2pHost, log, startTime)

	// ── Settlement Scheduler ──────────────────────────────────────────────────
	scheduler := account.NewScheduler(accountStore, stripeSvc, log)
	go scheduler.Run(ctx)

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
