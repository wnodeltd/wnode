// simulate_nodes.go
// Spins up N ephemeral libp2p hosts to simulate Nodlr nodes 
// for stress testing the mesh network.
package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/libp2p/go-libp2p"
)

func main() {
	count := flag.Int("count", 100, "number of nodes to simulate")
	flag.Parse()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	fmt.Printf("▶ Spawning %d simulated Nodlr nodes...\n", *count)

	for i := 0; i < *count; i++ {
		h, err := libp2p.New(libp2p.ListenAddrs("/ip4/127.0.0.1/tcp/0"))
		if err != nil {
			log.Fatalf("failed to spawn node %d: %v", i, err)
		}
		
		if i % 10 == 0 {
			fmt.Printf("[OK] Node %d online: %s\n", i, h.ID())
		}
	}

	fmt.Println("✔ All nodes online. Mesh stress test active.")
	fmt.Println("Press Ctrl+C to terminate simulation.")

	ch := make(chan os.Signal, 1)
	signal.Notify(ch, syscall.SIGINT, syscall.SIGTERM)
	<-ch
	
	fmt.Println("Stopping simulation...")
}
