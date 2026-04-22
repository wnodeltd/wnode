package account

import (
	"time"
	"github.com/google/uuid"
)

// Constitutional Revenue Model (Hardcoded & Immutable)
const (
	PctOperator        = 0.80 // The service provider's share
	PctLevel1          = 0.02 // Direct sponsor
	PctLevel2          = 0.08 // Indirect sponsor
	PctPlatform        = 0.07 // Wnode infrastructure
	PctFounderOverride = 0.03 // Genesis lineage benefit
)

// Compliance Constants
const (
	FreezeMinimumPayoutDays = 120 // Constitutional hold period before mandatory release
)

// CalculateSplitsForAmount computes the authoritative payout distribution for any cent amount.
// This is the Sovereign Source of Truth for the network's economics.
func (s *Store) CalculateSplitsForAmount(totalCents int64, earnerID string) []CommissionRecord {
	s.mu.RLock()
	defer s.mu.RUnlock()

	records := []CommissionRecord{}
	txnID := uuid.New().String()
	now := time.Now()

	// 1. Resolve Tree & Platform Baseline
	l1ID, l2ID := s.ResolveTree(earnerID)

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

	// A. Founder Override (3%) -> Resolved via Genesis Founder Tree Root
	genesisFounderID := s.GetGenesisFounder(earnerID)
	if genesisFounderID != "" {
		if founder, ok := s.nodlrs[genesisFounderID]; ok && founder.FounderStripeAccountID != nil {
			add(CommRoleFounder, *founder.FounderStripeAccountID, PctFounderOverride)
		}
	}

	// B. Operator Share (80%) -> Provider's primary account
	earner, ok := s.nodlrs[earnerID]
	if ok {
		recipientID := earner.StripeConnectID
		// Owner override check (Stephen's specific Nodlr ID)
		if earnerID == AuthoritativeOwnerID {
			owner, _ := s.nodlrs[AuthoritativeOwnerID]
			if owner != nil && owner.NodlrStripeAccountID != nil {
				recipientID = *owner.NodlrStripeAccountID
			}
		}
		
		if recipientID != "" {
			add(CommRolePlatform, recipientID, PctOperator) // Using CommRolePlatform as alias for Operator earner
		}
	}

	// C. Wnode Infrastructure (7%)
	add(CommRoleWnode, WnodeBusinessStripeID, PctPlatform)

	// D. Level 1 Sponsor (2%)
	if l1ID != "" {
		if l1, ok := s.nodlrs[l1ID]; ok && l1.StripeConnectID != "" {
			add(CommRoleLevel1, l1.StripeConnectID, PctLevel1)
		}
	}

	// E. Level 2 Sponsor (8%)
	if l2ID != "" {
		if l2, ok := s.nodlrs[l2ID]; ok && l2.StripeConnectID != "" {
			add(CommRoleLevel2, l2.StripeConnectID, PctLevel2)
		}
	}

	return records
}
