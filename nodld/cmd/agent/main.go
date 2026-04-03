package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/obregan/nodl/nodld/internal/agent"
)

func main() {
	regToken := flag.String("registration-token", "", "One-time registration token from dashboard")
	apiURL := flag.String("api-url", "http://localhost:8080", "Nodld API URL")
	p2pPort := flag.Int("p2p-port", 9005, "P2P port for this node")
	flag.Parse()

	if *regToken == "" {
		// Check if we are already registered
		if !agent.IsRegistered() {
			fmt.Println("Error: --registration-token is required for first-time setup.")
			fmt.Println("Get a token from your Nodlr Dashboard and run:")
			fmt.Printf("  nodlr-agent --registration-token=<YOUR_TOKEN>\n")
			os.Exit(1)
		}
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Handle signals for graceful shutdown
	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)

	worker, err := agent.NewWorker(*apiURL, *p2pPort)
	if err != nil {
		log.Fatalf("Failed to initialize worker: %v", err)
	}

	// First time registration
	if *regToken != "" {
		fmt.Printf("▶ Registering node with token: %s...\n", *regToken)
		if err := worker.Register(ctx, *regToken); err != nil {
			log.Fatalf("Registration failed: %v", err)
		}
		fmt.Println("✔ Registration successful!")
	}

	// Start heartbeat loop
	fmt.Println("▶ Starting Nodlr worker loop...")
	if err := worker.Start(ctx); err != nil {
		log.Fatalf("Worker failure: %v", err)
	}

	<-sigCh
	fmt.Println("Stopping Nodlr worker...")
}
