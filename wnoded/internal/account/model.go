package account

import (
	"time"
)

// PayoutFrequency defines how often a nodlr receives funds.
type PayoutFrequency string

const (
	PayoutDaily  PayoutFrequency = "daily"
	PayoutWeekly PayoutFrequency = "weekly"
)

// PayoutStatus defines if a nodlr is ready to receive funds.
type PayoutStatus string

const (
	PayoutStatusPending    PayoutStatus = "pending"
	PayoutStatusIncomplete PayoutStatus = "incomplete"
	PayoutStatusActive     PayoutStatus = "active"
)

// Nodlr represents a participant in the Nodl network.
type Nodlr struct {
	ID                    string          `json:"id"`
	Email                 string          `json:"email"`
	StripeConnectID       string          `json:"stripeConnectId"`
	PayoutStatus          PayoutStatus    `json:"payoutStatus"`
	IntegrityScore        int             `json:"integrityScore"`        // 0-1000
	AccruedFounderBalance int64           `json:"accruedFounderBalance"` // Cents
	IsFounder             bool            `json:"isFounder"`
	FounderIndex          int             `json:"founderIndex,omitempty"` // 1-5
	PayoutFrequency       PayoutFrequency `json:"payoutFrequency"`
	ParentID              string          `json:"parentId,omitempty"`     // Direct sponsor
	CreatedAt             time.Time       `json:"createdAt"`
}

// AffiliateRelation represents a link in the tree.
// While ParentID is in Nodlr, this helps with indexing children.
type AffiliateRelation struct {
	ParentID  string    `json:"parentId"`
	ChildID   string    `json:"childId"`
	Level     int       `json:"level"` // 1 or 2
	CreatedAt time.Time `json:"createdAt"`
}

// CommissionRole defines who receives a cut.
type CommissionRole string

const (
	RolePlatform CommissionRole = "platform"
	RoleFounder  CommissionRole = "founder"
	RoleLevel1   CommissionRole = "level1"
	RoleLevel2   CommissionRole = "level2"
	RoleOrigin   CommissionRole = "origin"
)

// CommissionRecord tracks a single payout slice.
type CommissionRecord struct {
	ID            string         `json:"id"`
	TransactionID string         `json:"transactionId"`
	RecipientID   string         `json:"recipientId"`
	Role          CommissionRole `json:"role"`
	AmountCents   int64          `json:"amountCents"`
	Status        string         `json:"status"` // pending, paid
	CreatedAt     time.Time      `json:"createdAt"`
}

// Payout tracks a batch of commissions sent to a nodlr.
type Payout struct {
	ID              string          `json:"id"`
	NodlrID         string          `json:"nodlrId"`
	StripePayoutID  string          `json:"stripePayoutId"`
	AmountCents     int64           `json:"amountCents"`
	Frequency       PayoutFrequency `json:"frequency"`
	Status          string          `json:"status"`
	PeriodStart     time.Time       `json:"periodStart"`
	PeriodEnd       time.Time       `json:"periodEnd"`
	CreatedAt       time.Time       `json:"createdAt"`
}
