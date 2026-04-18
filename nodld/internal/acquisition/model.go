package acquisition

import (
	"time"
)

// ReferralNode represents a single vertex in the acquisition graph.
type ReferralNode struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Level     int       `json:"level"`     // 1 (Direct), 2 (Indirect)
	Revenue   int64     `json:"revenue"`   // Lifetime revenue for this referral in cents
	Status    string    `json:"status"`    // active, pending, offline
	CreatedAt time.Time `json:"createdAt"`
}

// AcquisitionOverview provides a high-level summary of a user's referral performance.
type AcquisitionOverview struct {
	TotalReferrals   int     `json:"totalReferrals"`
	L1Count          int     `json:"l1Count"`
	L2Count          int     `json:"l2Count"`
	TotalRevenue     int64   `json:"totalRevenue"`     // Lifetime earnings from referrals
	ConversionRate   float64 `json:"conversionRate"`   // Active vs Total
	ActivationVolume int64   `json:"activationVolume"` // Revenue in last 30 days
}

// AcquisitionStats provides detailed breakdown of conversion and growth.
type AcquisitionStats struct {
	ActiveReferrals int `json:"activeReferrals"`
	NodesPerDirect  float64 `json:"nodesPerDirect"` // Average L2s per L1
	MonthlyGrowth   float64 `json:"monthlyGrowth"` // Revenue growth %
}

// AcquisitionIntegrity provides audit results for the acquisition subsystem.
type AcquisitionIntegrity struct {
	ReferralDiscrepancies int      `json:"referralDiscrepancies"` // Graph vs Ledger mismatches
	LedgerCoherent        bool     `json:"ledgerCoherent"`
	Notes                []string `json:"notes"`
}
