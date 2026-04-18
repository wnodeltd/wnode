package main

import (
	"fmt"
	"github.com/obregan/nodl/nodld/internal/account"
)

func main() {
	store := account.NewStore()

	// Seed 2 active founders, 1 dormant
	f1 := "FOUNDER-1-ACTIVE"
	f2 := "FOUNDER-2-ACTIVE"
	f3 := "FOUNDER-3-DORMANT"

	store.AddNodlr(&account.Nodlr{ID: f1, Status: "active", IsFounder: true})
	store.AddNodlr(&account.Nodlr{ID: f2, Status: "active", IsFounder: true})
	store.AddNodlr(&account.Nodlr{ID: f3, Status: "dormant", IsFounder: true})

	store.SetFounder(1, f1)
	store.SetFounder(2, f2)
	store.SetFounder(3, f3)

	fmt.Println("Simulation: 10 organic signups")
	for i := 1; i <= 10; i++ {
		acc, _ := store.CreateNodlr(fmt.Sprintf("user%d@test.com", i), "")
		fmt.Printf("User %d assigned to: %s\n", i, acc.ParentID)
	}
}
