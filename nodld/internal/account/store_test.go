package account

import (
	"fmt"
	"testing"
)

func TestAffiliateRoundRobin(t *testing.T) {
	s := NewStore(nil, "")

	// 1. Seed 2 active, 1 dormant
	f1 := "FOUNDER-1-ACTIVE"
	f2 := "FOUNDER-2-ACTIVE"
	f3 := "FOUNDER-3-DORMANT"

	s.AddNodlr(&Nodlr{ID: f1, Status: "active", IsFounder: true})
	s.AddNodlr(&Nodlr{ID: f2, Status: "active", IsFounder: true})
	s.AddNodlr(&Nodlr{ID: f3, Status: "dormant", IsFounder: true})

	s.SetFounder(1, f1)
	s.SetFounder(2, f2)
	s.SetFounder(3, f3)

	fmt.Println("Simulation: 10 organic signups")
	results := make(map[string]int)
	for i := 1; i <= 10; i++ {
		acc, err := s.CreateNodlr(fmt.Sprintf("user%d@test.com", i), "")
		if err != nil {
			t.Fatalf("Failed to create nodlr: %v", err)
		}
		results[acc.ParentID]++
	}

	if results[f3] > 0 {
		t.Errorf("Dormant founder %s received %d placements!", f3, results[f3])
	}
	if results[f1] != 5 || results[f2] != 5 {
		t.Errorf("Improper distribution: %v", results)
	}
}

func TestCommissionSplits(t *testing.T) {
	s := NewStore(nil, "")

	// 1. Setup owner with specific Stripe IDs
	ownerFounderID := "STRIPE-OWNER-FOUNDER"
	ownerNodlrID := "STRIPE-OWNER-NODLR"
	s.AddNodlr(&Nodlr{ID: AuthoritativeOwnerID, Role: RoleOwner})
	s.UpdateBusinessProfile(ownerFounderID, ownerNodlrID)

	// 2. Setup tree: L1 -> L2 -> EARNER
	l1 := "L1"
	l1Stripe := "STRIPE-L1"
	l2 := "L2"
	l2Stripe := "STRIPE-L2"
	earner := "EARNER"
	earnerStripe := "STRIPE-EARNER"

	s.AddNodlr(&Nodlr{ID: l1, StripeConnectID: l1Stripe, Role: RoleStandard})
	s.AddNodlr(&Nodlr{ID: l2, StripeConnectID: l2Stripe, Role: RoleStandard, ParentID: l1})
	s.AddNodlr(&Nodlr{ID: earner, StripeConnectID: earnerStripe, Role: RoleStandard, ParentID: l2})

	// 3. Calculate splits for $100.00 (10000 cents)
	total := int64(10000)
	records := s.CalculateSplits(total, earner)

	expected := map[CommissionRole]struct {
		StripeID string
		Amount   int64
	}{
		CommRolePlatform: {earnerStripe, 8000},
		CommRoleFounder:  {ownerFounderID, 300},
		CommRoleWnode:    {WnodeBusinessStripeID, 700},
		CommRoleLevel1:   {l2Stripe, 200}, // Direct parent (L2)
		CommRoleLevel2:   {l1Stripe, 800}, // Grandparent (L1)
	}

	for _, r := range records {
		exp, ok := expected[r.Role]
		if !ok {
			continue
		}
		if exp.StripeID != r.RecipientID {
			t.Errorf("Role %s: expected StripeID %s, got %s", r.Role, exp.StripeID, r.RecipientID)
		}
		if exp.Amount != r.AmountCents {
			t.Errorf("Role %s: expected %d, got %d", r.Role, exp.Amount, r.AmountCents)
		}
	}
}

func TestMeshClientIDGenerator(t *testing.T) {
	s := NewStore(nil, "")

	// 1. Basic generation
	id1 := s.GenerateMeshClientID()
	if !MeshClientIDRegex.MatchString(id1) {
		t.Errorf("Generated ID %s failed regex validation", id1)
	}

	id2 := s.GenerateMeshClientID()
	if id1 == id2 {
		t.Errorf("Generates identical IDs: %s", id1)
	}

	// 2. Force near rollover
	s.mu.Lock()
	s.meshSequence = 999998
	s.mu.Unlock()

	id999999 := s.GenerateMeshClientID()
	if !MeshClientIDRegex.MatchString(id999999) {
		t.Errorf("Generated ID %s failed regex validation", id999999)
	}
	
	// Next should roll over bucket
	idRollover := s.GenerateMeshClientID()
	if idRollover[1:2] != "1" { // Expect bucket 1
		t.Errorf("Expected bucket 1 after rollover, got %s", idRollover)
	}
	if idRollover[3:9] != "000001" {
		t.Errorf("Expected sequence 000001 after rollover, got %s", idRollover)
	}

	// 3. Force near month rollover
	s.mu.Lock()
	s.meshBucket = 9
	s.meshSequence = 999999
	oldMMYY := s.meshMonthYear
	s.mu.Unlock()

	idMonthRollover := s.GenerateMeshClientID()
	
	s.mu.Lock()
	newMMYY := s.meshMonthYear
	s.mu.Unlock()

	if newMMYY == oldMMYY {
		t.Errorf("Expected month rollover, got %s -> %s", oldMMYY, newMMYY)
	}
	if idMonthRollover[1:2] != "0" {
		t.Errorf("Expected bucket 0 after month rollover, got %s", idMonthRollover)
	}
}
