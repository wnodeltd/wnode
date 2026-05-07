package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/obregan/nodl/nodld/internal/account"
	"github.com/obregan/nodl/nodld/internal/jobs"
	"github.com/obregan/nodl/nodld/internal/forensics"
	"go.uber.org/zap"
)

func main() {
	log := zap.NewNop()
	forensicsStore := forensics.NewStore("SECRET", "SALT")
	
	// 1. Setup Store
	accountStore := account.NewStore(forensicsStore, "") // No persistence
	
	// 2. Setup Ancestry
	// Founder (Recipient of Founder 3%)
	founderID := "100001-0426-01-AA" // Stephen
	accountStore.SetFounder(1, founderID)
	
	// L1 Sponsor (Recipient of L1 3%)
	l1, _ := accountStore.CreateNodlr("l1@nodl.one", founderID)
	
	// L2 Sponsor (Recipient of L2 7%)
	l2, _ := accountStore.CreateNodlr("l2@nodl.one", l1.ID)
	
	// Operator (Earner 70%)
	operator, _ := accountStore.CreateNodlr("operator@nodl.one", l2.ID)
	
	// Sales Source (Recipient of Sales Source 10%)
	salesSource, _ := accountStore.CreateNodlr("sales@nodl.one", "")
	
	// 3. Setup Mesh Client
	meshClientID := "M0-000001-0426"
	accountStore.AddMeshClient(&account.MeshClient{
		ID:            meshClientID,
		SalesSourceID: salesSource.ID,
	})
	
	// 4. Setup Dispatcher
	jobStore := jobs.NewStore()
	dispatcher := jobs.NewDispatcher(jobStore, nil, accountStore, forensicsStore, log)
	
	// 5. Submit a Job ($1.00)
	budget := 1.00 
	job, _ := dispatcher.Submit(context.Background(), meshClientID, nil, budget, 1000, "legacy")
	
	// 6. Record Proof
	receipt := jobs.ProofReceipt{
		JobID:  job.ID,
		NodeID: operator.ID,
	}
	err := dispatcher.RecordProof(receipt)
	if err != nil {
		fmt.Printf("Error recording proof: %v\n", err)
		return
	}
	
	// 7. Collect Results
	type BalanceInfo struct {
		Pending int64 `json:"pending"`
		Escrow  int64 `json:"escrow"`
		StripeActive bool `json:"stripeActive"`
	}
	
	type Result struct {
		Records  []account.CommissionRecord `json:"records"`
		Balances map[string]BalanceInfo    `json:"balances"`
		TotalSum int64                     `json:"totalSum"`
	}
	
	res := Result{
		Balances: make(map[string]BalanceInfo),
	}
	
	// Collect all records for this job
	nodlrs := accountStore.ListNodlrs()
	recordedIDs := make(map[string]bool)
	
	for _, n := range nodlrs {
		history := accountStore.GetLedgerHistory(n.ID)
		for _, r := range history {
			if r.TransactionID == job.ID {
				res.Records = append(res.Records, r)
				res.TotalSum += r.AmountCents
				recordedIDs[r.ID] = true
			}
		}
		
		res.Balances[n.ID] = BalanceInfo{
			Pending: n.PendingBalanceCents,
			Escrow:  n.EscrowBalanceCents,
			StripeActive: n.StripeConnectID != "" || n.StripeAccountID != "",
		}
	}
	
	// Check for WnodeBusinessStripeID (Steward) which is NOT a Nodlr
	// We'll manually check the history for the Steward "ID" if we can find it.
	// Actually, CalculateSplitsForAmount uses WnodeBusinessStripeID as RecipientID.
	// So we need to check THAT ID's history.
	
	stewardID := "acct_1TBQaCDWCb8zLVhT"
	stewardHistory := accountStore.GetLedgerHistory(stewardID)
	for _, r := range stewardHistory {
		if r.TransactionID == job.ID && !recordedIDs[r.ID] {
			res.Records = append(res.Records, r)
			res.TotalSum += r.AmountCents
		}
	}
	
	out, _ := json.MarshalIndent(res, "", "  ")
	fmt.Println(string(out))
}
