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

// UserRole defines the RBAC levels for the platform.
type UserRole string

const (
	RoleOwner           UserRole = "owner"            // Sovereign (Cardinality: 1)
	RoleExecutive       UserRole = "executive"        // Governance Voters (75%)
	RoleShareholder     UserRole = "shareholder"      // Escalation Voters (80%)
	RoleManagement      UserRole = "management"       // Personnel/Operator managers
	RoleCustomerService UserRole = "customer_service" // Support limited access
	RoleVisitor         UserRole = "visitor"          // Read-only transparency
	RoleFounder         UserRole = "founder"          // Economic override (3%)
	RoleOperator        UserRole = "operator"         // Nodlr node provider (80%)
	RoleBuyer           UserRole = "buyer"            // Mesh compute buyer
	RoleStandard        UserRole = "standard"         // Legacy default
)

// Nodlr represents a participant in the Nodl network.
type Nodlr struct {
	ID                    string          `json:"id"`
	Email                 string          `json:"email"`
	StripeConnectID       string          `json:"stripeConnectId"`
	FounderStripeAccountID *string         `json:"founderStripeAccountId"`
	NodlrStripeAccountID   *string         `json:"nodlrStripeAccountId"`
	Role                  UserRole        `json:"role"`
	PayoutStatus          PayoutStatus    `json:"payoutStatus"`
	IntegrityScore        int             `json:"integrityScore"` // 0-1000
	IsFrozen              bool            `json:"isFrozen"`       // Constitutional hold
	FrozenAt              *time.Time      `json:"frozenAt,omitempty"`
	AccruedFounderBalance int64           `json:"accruedFounderBalance"`
	WalletBalance         int64           `json:"walletBalance"`
	IsFounder             bool            `json:"isFounder"`
	FounderIndex          int             `json:"founderIndex,omitempty"`
	PayoutFrequency       PayoutFrequency `json:"payoutFrequency"`
	ParentID              string          `json:"parentId,omitempty"`
	Status                string          `json:"status"` // active or dormant
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
	CommRolePlatform CommissionRole = "platform"
	CommRoleFounder  CommissionRole = "founder"
	CommRoleLevel1   CommissionRole = "level1"
	CommRoleLevel2   CommissionRole = "level2"
	CommRoleOrigin   CommissionRole = "origin"
	CommRoleWnode    CommissionRole = "wnode"
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

// WnodeNode represents a physical or virtual machine connected to the network.
type WnodeNode struct {
	ID          string       `json:"id"`
	UserID      string       `json:"userId"`
	DeviceToken string       `json:"-"` // Long-lived secure secret
	Metadata    NodeMetadata `json:"metadata"`
	Status      string       `json:"status"` // active, offline
	CreatedAt   time.Time    `json:"createdAt"`
	LastSeen    time.Time    `json:"lastSeen"`
}

// NodeMetadata captures hardware or environment specs.
type NodeMetadata struct {
	OS          string `json:"os"`
	Hostname    string `json:"hostname,omitempty"`
	UserAgent   string `json:"userAgent,omitempty"`
	CPU         string `json:"cpu,omitempty"`
	GPU         string `json:"gpu,omitempty"`
	RAM         string `json:"ram,omitempty"`
}

// PairingCode represents a short-lived link between a user and a pending node.
type PairingCode struct {
	Code      string    `json:"code"` // Format: WN-XXXX-YYYY
	UserID    string    `json:"userId"`
	ExpiresAt time.Time `json:"expiresAt"`
	Used      bool      `json:"used"`
	CreatedAt time.Time `json:"createdAt"`
}
