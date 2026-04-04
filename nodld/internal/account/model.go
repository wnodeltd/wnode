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

// UserRole defines the permission level of a user.
type UserRole string

const (
	RoleOwner           UserRole = "owner"
	RoleManager         UserRole = "manager"
	RoleCustomerService UserRole = "customer_service"
	RoleVisitor         UserRole = "visitor"
)

// Nodlr represents a participant in the Nodl network.
// This is the canonical persistent model shared across command and nodlr apps.
type Nodlr struct {
	// Identity
	ID          string   `json:"id"`
	DisplayName string   `json:"displayName"`
	Email       string   `json:"email"`
	Role        UserRole `json:"role"`
	ProtocolID  string   `json:"protocolId"`
	NetID       string   `json:"netId"`

	// Profile
	AvatarURL    string `json:"avatarUrl,omitempty"`
	Bio          string `json:"bio,omitempty"`
	Organization string `json:"organization,omitempty"`

	// Network / Node Info
	NodeCount           int       `json:"nodeCount"`
	ActiveNodes         int       `json:"activeNodes"`
	NodeStatusSummary   string    `json:"nodeStatusSummary"`
	NetworkArchitecture string    `json:"networkArchitecture"`
	ConnectedPeers      int       `json:"connectedPeers"`
	LastSeen            time.Time `json:"lastSeen"`

	// Protocol / Registry
	RegistryEntryID      string   `json:"registryEntryId"`
	RegistryStatus       string   `json:"registryStatus"`
	ProtocolVersion      string   `json:"protocolVersion"`
	ProtocolCapabilities []string `json:"protocolCapabilities"`

	// Financial / Yield
	AccruedFounderBalance int64           `json:"accruedFounderBalance"` // Cents
	PendingPayouts        int64           `json:"pendingPayouts"`       // Cents
	LifetimeEarnings      int64           `json:"lifetimeEarnings"`     // Cents
	CommissionRate        float64         `json:"commissionRate"`       // e.g. 0.02 = 2%
	PayoutStatus          PayoutStatus    `json:"payoutStatus"`
	PayoutFrequency       PayoutFrequency `json:"payoutFrequency"`
	StripeConnectID       string          `json:"stripeConnectId"`

	// Security / Auth
	PasswordHash string    `json:"password_hash"`
	MFAEnabled   bool      `json:"mfaEnabled"`
	LastLogin    time.Time `json:"lastLogin"`
	SessionStatus string   `json:"sessionStatus"`
	Permissions  []string  `json:"permissions"`

	// Telemetry / Health
	IntegrityScore int    `json:"integrityScore"` // 0-1000
	APILatency     int    `json:"apiLatency"`     // ms
	SyncStatus     string `json:"syncStatus"`
	StorageMode    string `json:"storageMode"`
	ErrorCount     int    `json:"errorCount"`

	// Founder / Affiliate
	IsFounder    bool   `json:"isFounder"`
	FounderIndex int    `json:"founderIndex,omitempty"` // 1-5
	ParentID     string `json:"parentId,omitempty"`

	// Metadata
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	Source    string    `json:"source"` // "registry" | "simulation"
}

// Public returns a version of the nodlr with sensitive fields removed.
func (n *Nodlr) Public() map[string]interface{} {
	return map[string]interface{}{
		// Identity
		"id":          n.ID,
		"displayName": n.DisplayName,
		"email":       n.Email,
		"role":        n.Role,
		"protocolId":  n.ProtocolID,
		"netId":       n.NetID,
		// Profile
		"avatarUrl":    n.AvatarURL,
		"bio":          n.Bio,
		"organization": n.Organization,
		// Network
		"nodeCount":           n.NodeCount,
		"activeNodes":         n.ActiveNodes,
		"nodeStatusSummary":   n.NodeStatusSummary,
		"networkArchitecture": n.NetworkArchitecture,
		"connectedPeers":      n.ConnectedPeers,
		"lastSeen":            n.LastSeen,
		// Registry
		"registryEntryId":      n.RegistryEntryID,
		"registryStatus":       n.RegistryStatus,
		"protocolVersion":      n.ProtocolVersion,
		"protocolCapabilities": n.ProtocolCapabilities,
		// Financial
		"accruedFounderBalance": n.AccruedFounderBalance,
		"pendingPayouts":        n.PendingPayouts,
		"lifetimeEarnings":      n.LifetimeEarnings,
		"commissionRate":        n.CommissionRate,
		"payoutStatus":          n.PayoutStatus,
		"payoutFrequency":       n.PayoutFrequency,
		"stripeConnectId":       n.StripeConnectID,
		// Security
		"mfaEnabled":    n.MFAEnabled,
		"lastLogin":     n.LastLogin,
		"sessionStatus": n.SessionStatus,
		"permissions":   n.Permissions,
		// Telemetry
		"integrityScore": n.IntegrityScore,
		"apiLatency":     n.APILatency,
		"syncStatus":     n.SyncStatus,
		"storageMode":    n.StorageMode,
		"errorCount":     n.ErrorCount,
		// Founder
		"isFounder":    n.IsFounder,
		"founderIndex": n.FounderIndex,
		"parentId":     n.ParentID,
		// Metadata
		"createdAt": n.CreatedAt,
		"updatedAt": n.UpdatedAt,
		"source":    n.Source,
	}
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
