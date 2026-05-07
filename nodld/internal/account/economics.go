package account

import (
	"time"
	"github.com/google/uuid"
)

// Constitutional Revenue Model constants are now defined in model.go


const (
	FreezeMinimumPayoutDays = 120 // Constitutional hold period before mandatory release
)

// GetStripeRecipient resolves the authoritative payment destination for a Node or Nodlr.
func (s *Store) GetStripeRecipient(id string) string {
	targetID := id
	if node, ok := s.nodes[id]; ok {
		targetID = node.UserID
	}

	n, ok := s.nodlrs[targetID]
	if !ok {
		return ""
	}
	if n.StripeAccountID != "" {
		return n.StripeAccountID
	}
	return n.StripeConnectID
}

// CalculateSplitsForAmount computes the authoritative payout distribution for any cent amount.
// This is the Sovereign Source of Truth for the network's economics.
func (s *Store) CalculateSplitsForAmount(totalCents int64, earnerID string, meshClientID string) []CommissionRecord {
	s.mu.RLock()
	defer s.mu.RUnlock()

	records := []CommissionRecord{}
	txnID := uuid.New().String()
	now := time.Now()

	// 1. Resolve Tree & Platform Baseline
	l1ID, l2ID := s.resolveTreeNoLock(earnerID)

	// 2. Helper to add record based on constitutional constants
	add := func(role CommissionRole, recipientID string, pct float64) {
		amt := int64(float64(totalCents) * pct)
		if amt <= 0 {
			return
		}
		records = append(records, CommissionRecord{
			ID:            uuid.New().String(),
			TransactionID: txnID,
			RecipientID:   recipientID,
			Role:          role,
			AmountCents:   amt,
			Status:        "pending",
			CreatedAt:     now,
		})
	}

	// A. Founder Override (3%)
	genesisFounderID := s.getGenesisFounderNoLock(earnerID)
	if genesisFounderID != "" {
		add(CommRoleFounder, genesisFounderID, PctFounderOverride)
	}

	// B. Operator Share (70%)
	add(CommRolePlatform, earnerID, PctOperator)

	// C. Wnode Infrastructure (7%)
	add(CommRoleWnode, WnodeBusinessStripeID, PctPlatform)

	// D. Level 1 Sponsor (3%)
	if l1ID != "" {
		add(CommRoleLevel1, l1ID, PctLevel1)
	}

	// E. Level 2 Sponsor (7%)
	if l2ID != "" {
		add(CommRoleLevel2, l2ID, PctLevel2)
	}

	// F. Sales Source (10%)
	if meshClientID != "" {
		if client, ok := s.meshClients[meshClientID]; ok && client.SalesSourceID != "" {
			add(CommRoleSalesSource, client.SalesSourceID, PctSalesSource)
		}
	}

	return records
}
