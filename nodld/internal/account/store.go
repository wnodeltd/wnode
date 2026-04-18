package account

import (
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/obregan/nodl/nodld/internal/forensics"
)

type Store struct {
	mu                 sync.RWMutex
	nodlrs             map[string]*Nodlr
	founders           [10]string // IDs mapping to Founder #1..#10
	organicCount       int        // Total organic signups handled
	pendingCommissions map[string][]CommissionRecord // NodlrID -> Records
	nodes              map[string]*WnodeNode
	pairingCodes       map[string]*PairingCode
	forensics          *forensics.Store
}

func NewStore(forensics *forensics.Store) *Store {
	return &Store{
		nodlrs:             make(map[string]*Nodlr),
		pendingCommissions: make(map[string][]CommissionRecord),
		nodes:              make(map[string]*WnodeNode),
		pairingCodes:       make(map[string]*PairingCode),
		forensics:          forensics,
	}
}

// SetFounder assigns a specific ID to one of the 5 founder slots.
func (s *Store) SetFounder(index int, id string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if index < 1 || index > 10 {
		return
	}
	s.founders[index-1] = id
	if nodlr, ok := s.nodlrs[id]; ok {
		nodlr.IsFounder = true
		nodlr.FounderIndex = index
	}
}

// CreateNodlr creates a new account. If parentID is empty, it uses round-robin.
func (s *Store) CreateNodlr(email, parentID string) (*Nodlr, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	id := uuid.New().String()
	
	// Round-robin for organic signups (Strict Genesis Rotation - Active Founders Only)
	if parentID == "" {
		activeFounders := []string{}
		for _, fID := range s.founders {
			if fID == "" {
				continue
			}
			if f, ok := s.nodlrs[fID]; ok && f.Status == "active" {
				activeFounders = append(activeFounders, fID)
			}
		}

		if len(activeFounders) > 0 {
			slotIndex := s.organicCount % len(activeFounders)
			parentID = activeFounders[slotIndex]
			s.organicCount++
		}
	}

	n := &Nodlr{
		ID:              id,
		Email:           email,
		PayoutFrequency: PayoutDaily,
		PayoutStatus:    PayoutStatusIncomplete,
		IntegrityScore:  600, // Initial trust
		ParentID:        parentID,
		CreatedAt:       time.Now(),
	}

	// If this ID is in founders, mark it
	for i, fID := range s.founders {
		if fID == id {
			n.IsFounder = true
			n.FounderIndex = i + 1
		}
	}

	s.nodlrs[id] = n
	return n, nil
}

// UpdateFounderStatus sets the status (active/dormant) for a founder.
func (s *Store) UpdateFounderStatus(id string, status string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if n, ok := s.nodlrs[id]; ok {
		n.Status = status
	}
}

func (s *Store) AddNodlr(n *Nodlr) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.nodlrs[n.ID] = n
}

func (s *Store) GetNodlr(id string) (*Nodlr, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	n, ok := s.nodlrs[id]
	return n, ok
}

func (s *Store) ListNodlrs() []*Nodlr {
	s.mu.RLock()
	defer s.mu.RUnlock()
	list := make([]*Nodlr, 0, len(s.nodlrs))
	for _, n := range s.nodlrs {
		list = append(list, n)
	}
	return list
}

// ResolveTree returns the Level 1 and Level 2 sponsors for a given node.
func (s *Store) ResolveTree(childID string) (l1ID, l2ID string) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	child, ok := s.nodlrs[childID]
	if !ok || child.ParentID == "" {
		return "", ""
	}

	l1ID = child.ParentID
	l1, ok := s.nodlrs[l1ID]
	if ok && l1.ParentID != "" {
		l2ID = l1.ParentID
	}

	return l1ID, l2ID
}

// TransferAffiliate reassigns a child to a new parent.
// CONSTITUTIONAL LOCK: Only the legal owner of the account may authorize a transfer.
// Administrators cannot move accounts.
func (s *Store) TransferAffiliate(requesterID, childID, newParentID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Enforcement: Check if requester is the child being moved
	if requesterID != childID {
		return fmt.Errorf("constitutional lock: only the account owner may authorize a lineage transfer")
	}

	child, ok := s.nodlrs[childID]
	if !ok {
		return fmt.Errorf("account not found")
	}
	
	if _, ok := s.nodlrs[newParentID]; !ok {
		return fmt.Errorf("new parent not found")
	}

	child.ParentID = newParentID
	return nil
}

// ActivateFounder enables a founder slot. Only Owner.
func (s *Store) ActivateFounder(actorID, actorRole, id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	if n, ok := s.nodlrs[id]; ok && n.IsFounder {
		n.Status = "active"
		if s.forensics != nil {
			s.forensics.LogEvent(actorID, actorRole, forensics.ActionFounderActivated, map[string]string{"targetID": id}, "0.0.0.0")
		}
		return nil
	}
	return fmt.Errorf("account is not a founder")
}

// DeactivateFounder is explicitly BANNED by the constitution.
func (s *Store) DeactivateFounder(id string) error {
	return fmt.Errorf("constitutional lock: founders cannot be deactivated")
}

// FreezeAccount locks payouts for 120 days.
func (s *Store) FreezeAccount(actorID, actorRole, id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	if n, ok := s.nodlrs[id]; ok {
		n.IsFrozen = true
		now := time.Now()
		n.FrozenAt = &now
		if s.forensics != nil {
			s.forensics.LogEvent(actorID, actorRole, forensics.ActionAccountFrozen, map[string]string{"targetID": id}, "0.0.0.0")
		}
		return nil
	}
	return fmt.Errorf("account not found")
}

func (s *Store) UnfreezeAccount(actorID, actorRole, id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	if n, ok := s.nodlrs[id]; ok {
		n.IsFrozen = false
		n.FrozenAt = nil
		if s.forensics != nil {
			s.forensics.LogEvent(actorID, actorRole, forensics.ActionAccountUnfrozen, map[string]string{"targetID": id}, "0.0.0.0")
		}
		return nil
	}
	return fmt.Errorf("account not found")
}

// GetGenesisFounder returns the ID of the Genesis Founder (1-5) who ultimately
// owns the lineage of this node.
func (s *Store) GetGenesisFounder(id string) string {
	s.mu.RLock()
	defer s.mu.RUnlock()

	curr := id
	for {
		n, ok := s.nodlrs[curr]
		if !ok || n.ParentID == "" {
			// If we hit the top and it's a founder, return it
			if n != nil && n.IsFounder {
				return n.ID
			}
			return ""
		}
		
		// If current is a founder, we've found it
		if n.IsFounder {
			return n.ID
		}
		
		curr = n.ParentID
	}
}

func (s *Store) AddCommissions(records []CommissionRecord) {
	s.mu.Lock()
	defer s.mu.Unlock()
	for _, r := range records {
		s.pendingCommissions[r.RecipientID] = append(s.pendingCommissions[r.RecipientID], r)
	}
}

func (s *Store) ClearPending(nodlrID string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.pendingCommissions, nodlrID)
}

func (s *Store) GetPendingTotal(nodlrID string) int64 {
	s.mu.RLock()
	defer s.mu.RUnlock()
	var total int64
	for _, r := range s.pendingCommissions[nodlrID] {
		total += r.AmountCents
	}
	return total
}

const AuthoritativeOwnerID = "100001-0426-01-AA"
const WnodeBusinessStripeID = "acct_1TBQaCDWCb8zLVhT"

// UpdateBusinessProfile updates Stephen's specific Stripe account IDs.
func (s *Store) UpdateBusinessProfile(founderStripeID, nodlrStripeID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	owner, ok := s.nodlrs[AuthoritativeOwnerID]
	if !ok {
		return fmt.Errorf("owner account not found")
	}

	owner.FounderStripeAccountID = &founderStripeID
	owner.NodlrStripeAccountID = &nodlrStripeID
	return nil
}

// AssignUserRole sets the RBAC role for an account.
// CONSTITUTIONAL LOCK: Exactly one active Owner account.
func (s *Store) AssignUserRole(actorID, actorRole, id string, role UserRole) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	n, ok := s.nodlrs[id]
	if !ok {
		return fmt.Errorf("account not found")
	}

	if role == RoleOwner {
		// Check if another owner exists
		for _, other := range s.nodlrs {
			if other.Role == RoleOwner && other.ID != id {
				return fmt.Errorf("constitutional lock: exactly one Sovereign Owner allowed")
			}
		}
	}

	oldRole := n.Role
	n.Role = role

	if s.forensics != nil {
		s.forensics.LogEvent(actorID, actorRole, forensics.ActionManagementRoleChanged, map[string]string{
			"targetID": id,
			"oldRole":  string(oldRole),
			"newRole":  string(role),
		}, "0.0.0.0")
	}

	return nil
}

// CalculateSplits performs the authoritative commission distribution.
// CONSTITUTIONAL LOCK:// Deprecated: CalculateSplit was replaced by unified CalculateSplitsForAmount

func (s *Store) CalculateSplits(totalCents int64, earnerID string) []CommissionRecord {
	return s.CalculateSplitsForAmount(totalCents, earnerID)
}

// --- Node & Pairing Logic ---

const PairingCodeExpiry = 10 * time.Minute

// CreatePairingCode generates a new WN-XXXX-YYYY code for a user.
func (s *Store) CreatePairingCode(userId string) (*PairingCode, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Simple random grouping
	part1 := uuid.New().String()[0:4]
	part2 := uuid.New().String()[0:4]
	code := fmt.Sprintf("WN-%s-%s", part1, part2)

	pc := &PairingCode{
		Code:      code,
		UserID:    userId,
		ExpiresAt: time.Now().Add(PairingCodeExpiry),
		CreatedAt: time.Now(),
	}

	s.pairingCodes[code] = pc
	return pc, nil
}

// ConsumePairingCode validates a code and returns a long-lived device token.
func (s *Store) ConsumePairingCode(code string, metadata NodeMetadata) (string, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	pc, ok := s.pairingCodes[code]
	if !ok {
		return "", fmt.Errorf("invalid pairing code")
	}
	if pc.Used {
		return "", fmt.Errorf("pairing code already used")
	}
	if time.Now().After(pc.ExpiresAt) {
		return "", fmt.Errorf("pairing code expired")
	}

	// Generate device token
	deviceToken := uuid.New().String()
	nodeId := uuid.New().String()

	node := &WnodeNode{
		ID:          nodeId,
		UserID:      pc.UserID,
		DeviceToken: deviceToken,
		Metadata:    metadata,
		Status:      "active",
		CreatedAt:   time.Now(),
		LastSeen:    time.Now(),
	}

	s.nodes[nodeId] = node
	pc.Used = true

	return deviceToken, nil
}

// RegisterNode creates a node directly for a user (browser connect flow).
func (s *Store) RegisterNode(userId string, metadata NodeMetadata) (string, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	deviceToken := uuid.New().String()
	nodeId := uuid.New().String()

	node := &WnodeNode{
		ID:          nodeId,
		UserID:      userId,
		DeviceToken: deviceToken,
		Metadata:    metadata,
		Status:      "active",
		CreatedAt:   time.Now(),
		LastSeen:    time.Now(),
	}

	s.nodes[nodeId] = node
	return deviceToken, nil
}

// GetNodeByToken retrieves a node by its long-lived secret.
func (s *Store) GetNodeByToken(token string) (*WnodeNode, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	for _, n := range s.nodes {
		if n.DeviceToken == token {
			return n, true
		}
	}
	return nil, false
}

// ListNodes returns all nodes belonging to a specific user.
func (s *Store) ListNodes(userId string) []*WnodeNode {
	s.mu.RLock()
	defer s.mu.RUnlock()

	list := []*WnodeNode{}
	for _, n := range s.nodes {
		if n.UserID == userId {
			list = append(list, n)
		}
	}
	return list
}

// ListAllNodes returns all registered nodes in the network.
func (s *Store) ListAllNodes() []*WnodeNode {
	s.mu.RLock()
	defer s.mu.RUnlock()

	list := make([]*WnodeNode, 0, len(s.nodes))
	for _, n := range s.nodes {
		list = append(list, n)
	}
	return list
}

// GetGlobalLedgerStats returns platform-wide aggregated financials from the authoritative commissions ledger.
func (s *Store) GetGlobalLedgerStats() (totalCompute, totalPaid, totalPending int64) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	for _, records := range s.pendingCommissions {
		for _, r := range records {
			if r.Role == CommRolePlatform {
				totalCompute += r.AmountCents
			}
			if r.Status == "paid" {
				totalPaid += r.AmountCents
			} else {
				totalPending += r.AmountCents
			}
		}
	}
	return
}

// GetRecentComputeVolume calculates the total compute volume within the specified duration window.
func (s *Store) GetRecentComputeVolume(window time.Duration) int64 {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var total int64
	cutoff := time.Now().Add(-window)
	for _, records := range s.pendingCommissions {
		for _, r := range records {
			if r.Role == CommRolePlatform && r.CreatedAt.After(cutoff) {
				total += r.AmountCents
			}
		}
	}
	return total
}

// GetOperatorLedgerTotals returns aggregated financials for a single operator.
func (s *Store) GetOperatorLedgerTotals(opID string) (totalCompute, totalPaid, totalPending int64, lastPayout time.Time) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	records := s.pendingCommissions[opID]
	for _, r := range records {
		if r.Role == CommRolePlatform {
			totalCompute += r.AmountCents
		}
		if r.Status == "paid" {
			totalPaid += r.AmountCents
			if r.CreatedAt.After(lastPayout) {
				lastPayout = r.CreatedAt
			}
		} else {
			totalPending += r.AmountCents
		}
	}
	return
}

// AuditLedgerRecomputation performs a raw re-summation for internal audit verification.
func (s *Store) AuditLedgerRecomputation() (rev, pay int64) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	for _, records := range s.pendingCommissions {
		for _, r := range records {
			if r.Role == CommRolePlatform {
				rev += r.AmountCents
			}
			if r.Status == "paid" {
				pay += r.AmountCents
			}
		}
	}
	return
}

// GetLedgerHistory returns the full commission history for a specific operator.
func (s *Store) GetLedgerHistory(opID string) []CommissionRecord {
	s.mu.RLock()
	defer s.mu.RUnlock()
	
	records, ok := s.pendingCommissions[opID]
	if !ok {
		return []CommissionRecord{}
	}
	
	// Return a copy to avoid concurrency issues
	copied := make([]CommissionRecord, len(records))
	copy(copied, records)
	return copied
}
