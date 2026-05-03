package account

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
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
	meshClients        map[string]*MeshClient
	pairingCodes       map[string]*PairingCode
	forensics          *forensics.Store
	statePath          string

	// Mesh Client ID Generation State
	meshBucket         int
	meshSequence       int
	meshMonthYear      string
}

type storeState struct {
	OrganicCount  int    `json:"organic_count"`
	MeshBucket    int    `json:"mesh_bucket"`
	MeshSequence  int    `json:"mesh_sequence"`
	MeshMonthYear string `json:"mesh_month_year"`
}

func NewStore(forensics *forensics.Store, statePath string) *Store {
	s := &Store{
		nodlrs:             make(map[string]*Nodlr),
		pendingCommissions: make(map[string][]CommissionRecord),
		nodes:              make(map[string]*WnodeNode),
		meshClients:        make(map[string]*MeshClient),
		pairingCodes:       make(map[string]*PairingCode),
		forensics:          forensics,
		statePath:          statePath,
	}
	s.loadState()
	s.SeedFoundationIdentities()
	return s
}

func (s *Store) loadState() {
	if s.statePath == "" {
		return
	}
	data, err := os.ReadFile(s.statePath)
	if err != nil {
		return
	}
	var state storeState
	if err := json.Unmarshal(data, &state); err == nil {
		s.organicCount = state.OrganicCount
		s.meshBucket = state.MeshBucket
		s.meshSequence = state.MeshSequence
		s.meshMonthYear = state.MeshMonthYear
	}
}

func (s *Store) saveState() {
	if s.statePath == "" {
		return
	}
	state := storeState{
		OrganicCount:  s.organicCount,
		MeshBucket:    s.meshBucket,
		MeshSequence:  s.meshSequence,
		MeshMonthYear: s.meshMonthYear,
	}
	data, _ := json.MarshalIndent(state, "", "  ")
	_ = os.MkdirAll(filepath.Dir(s.statePath), 0755)
	_ = os.WriteFile(s.statePath, data, 0644)
}

// SeedFoundationIdentities hard-codes the Sovereign Foundation accounts.
func (s *Store) SeedFoundationIdentities() {
	s.mu.Lock()
	defer s.mu.Unlock()

	// 1. Stephen (Universal Owner)
	ownerID := "100001-0426-01-AA"
	if n, ok := s.nodlrs[ownerID]; !ok {
		s.nodlrs[ownerID] = &Nodlr{
			ID:                 ownerID,
			Email:              "stephen@wnode.one",
			Role:               RoleOwner,
			IsSuperAdmin:       true,
			IsProtected:        true,
			OnboardingComplete: true,
			Verified:           true,
			Status:             "active",
			CreatedAt:          time.Now(),
		}
	} else {
		// Enforce foundation status on existing record
		n.IsSuperAdmin = true
		n.IsProtected = true
		n.OnboardingComplete = true
		n.Verified = true
	}

	// 1b. Stephen Alt (Universal Owner)
	altOwnerID := "100001-0426-01-AB"
	if _, ok := s.nodlrs[altOwnerID]; !ok {
		s.nodlrs[altOwnerID] = &Nodlr{
			ID:                 altOwnerID,
			Email:              "stephen@nodl.one",
			Role:               RoleOwner,
			IsSuperAdmin:       true,
			IsProtected:        true,
			OnboardingComplete: true,
			Verified:           true,
			Status:             "active",
			CreatedAt:          time.Now(),
		}
	}

	// 2. Stephen (Founder Nodlr)
	founderID := "100002-0426-02-AA"
	if n, ok := s.nodlrs[founderID]; !ok {
		s.nodlrs[founderID] = &Nodlr{
			ID:                     founderID,
			Email:                  "stephensoos@yahoo.com",
			Role:                   RoleFounderNodlr,
			FounderStripeAccountID: stringPtr("PENDING_FOUNDER_STRIPE_ID"),
			OnboardingComplete:     true,
			Verified:               true,
			IsProtected:            true,
			Status:                 "active",
			CreatedAt:              time.Now(),
		}
	} else {
		// Enforce foundation status on existing record
		n.IsProtected = true
		n.OnboardingComplete = true
		n.Verified = true
	}

	// 3. Eldesskar (Reservation)
	eldesskarID := "100003-0426-03-AA"
	if _, ok := s.nodlrs[eldesskarID]; !ok {
		s.nodlrs[eldesskarID] = &Nodlr{
			ID:        eldesskarID,
			Email:     "eldesskar@wnode.one",
			Role:      RoleVisitor,
			Status:    "active",
			CreatedAt: time.Now(),
		}
	}

	// 4. Beta User (Universal Observer)
	betaUserID := "100005-0426-05-AA"
	if n, ok := s.nodlrs[betaUserID]; !ok {
		s.nodlrs[betaUserID] = &Nodlr{
			ID:                 betaUserID,
			Email:              "user@test.com",
			Password:           "user",
			FirstName:          "Test",
			LastName:           "User",
			Role:               RoleObserver,
			Permissions:        ObserverPermissions,
			Status:             "active",
			OnboardingComplete: true,
			Verified:           true,
			CreatedAt:          time.Now(),
		}
	} else {
		// Ensure properties match institutional spec even if loaded from state
		n.Email = "user@test.com"
		n.Password = "user"
		n.FirstName = "Test"
		n.LastName = "User"
		n.Role = RoleObserver
		n.Permissions = ObserverPermissions
		n.Status = "active"
		n.OnboardingComplete = true
		n.Verified = true
	}
}

func stringPtr(s string) *string {
	return &s
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

	index := len(s.nodlrs) + 1
	id := fmt.Sprintf("1000%02d-0426-%02d-AA", index, index)
	
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
			s.saveState()
		}
	}

	n := &Nodlr{
		ID:              id,
		Email:           email,
		MeshClientID:    s.GenerateMeshClientID(),
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

// GenerateMeshClientID creates a globally unique, sequential Mesh Client ID.
// Format: M{bucket}-{sequence}-{MMYY}
// It assumes s.mu is already locked by the caller.
func (s *Store) GenerateMeshClientID() string {
	now := time.Now()
	nowMMYY := now.Format("0106")

	if s.meshMonthYear == "" || isLater(nowMMYY, s.meshMonthYear) {
		s.meshBucket = 0
		s.meshSequence = 0
		s.meshMonthYear = nowMMYY
	}

	s.meshSequence++
	if s.meshSequence > 999999 {
		s.meshBucket++
		s.meshSequence = 1
		if s.meshBucket > 9 {
			s.meshBucket = 0
			// Roll over month artificially
			t, _ := time.Parse("0106", s.meshMonthYear)
			s.meshMonthYear = t.AddDate(0, 1, 0).Format("0106")
		}
	}

	s.saveState()

	id := fmt.Sprintf("M%d-%06d-%s", s.meshBucket, s.meshSequence, s.meshMonthYear)
	if !MeshClientIDRegex.MatchString(id) {
		// Log error internally, but the generator format guarantees adherence
		fmt.Printf("Error: Generated MeshClientID %s failed regex validation\n", id)
	}
	return id
}

// isLater returns true if a is a later month/year than b (format MMYY).
func isLater(a, b string) bool {
	if b == "" {
		return true
	}
	ta, _ := time.Parse("0106", a)
	tb, _ := time.Parse("0106", b)
	return ta.After(tb)
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

func (s *Store) GetNodlrByEmail(email string) (*Nodlr, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, n := range s.nodlrs {
		if n.Email == email {
			return n, true
		}
	}
	return nil, false
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

	if n.IsProtected {
		return fmt.Errorf("constitutional lock: protected foundation identities cannot be altered")
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

func (s *Store) CalculateSplits(totalCents int64, earnerID string, meshClientID string) []CommissionRecord {
	return s.CalculateSplitsForAmount(totalCents, earnerID, meshClientID)
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
	nodeId := s.nextNodeID(pc.UserID)

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
	nodeId := s.nextNodeID(userId)

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

// nextNodeID generates the next formatted ID for a user's node.
func (s *Store) nextNodeID(userID string) string {
	count := 0
	for _, n := range s.nodes {
		if n.UserID == userID {
			count++
		}
	}
	return fmt.Sprintf("%s-%06d", userID, count+1)
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

// GetPayoutArchitecture resolves the 6-tier map for a specific node.
// It follows the Participation Protocol: If a participant is not onboarded, their share is skipped.
func (s *Store) GetPayoutArchitecture(nodeID string) (*PayoutArchitecture, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	node, ok := s.nodes[nodeID]
	if !ok {
		return nil, fmt.Errorf("fatal: rogue node %s - payout architecture resolution impossible", nodeID)
	}

	nodlr, ok := s.nodlrs[node.UserID]
	if !ok {
		return nil, fmt.Errorf("fatal: node %s has no associated nodlr record", nodeID)
	}

	arch := &PayoutArchitecture{
		WnodeID:     AuthoritativeOwnerID,
		WnodeStripe: WnodeBusinessStripeID,
	}

	// 1. Level 0: The Nodlr (70%)
	if nodlr.StripeConnectID != "" {
		arch.NodlrID = nodlr.ID
		arch.NodlrStripe = nodlr.StripeConnectID
	}

	// 2. Lineage: L1 (3%) and L2 (7%)
	l1ID, l2ID := s.resolveTreeNoLock(nodlr.ID)
	
	if l1, ok1 := s.nodlrs[l1ID]; ok1 && l1.StripeConnectID != "" {
		arch.L1ID, arch.L1Stripe = l1.ID, l1.StripeConnectID
	}

	if l2, ok2 := s.nodlrs[l2ID]; ok2 && l2.StripeConnectID != "" {
		arch.L2ID, arch.L2Stripe = l2.ID, l2.StripeConnectID
	}

	// 3. Founder: The Tree Head (3%)
	fID := s.getGenesisFounderNoLock(nodlr.ID)
	if f, okf := s.nodlrs[fID]; okf && f.StripeConnectID != "" {
		// Only Active founders participate in accrual
		if f.Status == "active" {
			arch.FounderID, arch.FounderStripe = f.ID, f.StripeConnectID
		}
	}

	// 4. Sales Source (Affiliate - 10%)
	// Note: Sales Source is mapped to the ParentID in this protocol
	if sales, oks := s.nodlrs[nodlr.ParentID]; oks && sales.StripeConnectID != "" {
		arch.SalesSourceID = sales.ID
		arch.SalesSourceStripe = sales.StripeConnectID
	}

	return arch, nil
}

// Internal helpers without locks to avoid re-entry deadlocks

func (s *Store) resolveTreeNoLock(childID string) (l1ID, l2ID string) {
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

func (s *Store) getGenesisFounderNoLock(id string) string {
	curr := id
	for {
		n, ok := s.nodlrs[curr]
		if !ok || n.ParentID == "" {
			if n != nil && n.IsFounder {
				return n.ID
			}
			return ""
		}
		if n.IsFounder {
			return n.ID
		}
		curr = n.ParentID
	}
}

func (s *Store) AddMeshClient(c *MeshClient) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.meshClients[c.ID] = c
}

func (s *Store) GetMeshClient(id string) (*MeshClient, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	c, ok := s.meshClients[id]
	return c, ok
}

// GetOpportunityAudit performs a forensic analysis of missed compute revenue.
// (Monthly Missed Revenue / Hardware Cost) = Payback Period
func (s *Store) GetOpportunityAudit(nodlrID string) *OpportunityAudit {
	s.mu.RLock()
	defer s.mu.RUnlock()

	audit := &OpportunityAudit{
		NodlrID: nodlrID,
		Events:  make([]OpportunityEvent, 0),
	}

	// 1. Iterate through historical records to find Sales Source successes
	salesRecords := s.pendingCommissions[nodlrID]
	processedTx := make(map[string]bool)

	for _, r := range salesRecords {
		if r.Role != CommRoleSalesSource {
			continue
		}
		if processedTx[r.TransactionID] {
			continue
		}
		processedTx[r.TransactionID] = true
		audit.EarnedSalesCents += r.AmountCents

		// 2. Identify the Compute Provider for this transaction
		foundComputeShare := false
		var computeAmt int64
		var computeRecipient string

		for otherID, records := range s.pendingCommissions {
			for _, or := range records {
				if or.TransactionID == r.TransactionID && (or.Role == CommRolePlatform || or.Role == CommRoleOrigin) {
					foundComputeShare = true
					computeAmt = or.AmountCents
					computeRecipient = otherID
					break
				}
			}
			if foundComputeShare {
				break
			}
		}

		// 3. If the compute share went to someone else, it's a missed opportunity
		if foundComputeShare && computeRecipient != nodlrID {
			audit.MissedComputeCents += computeAmt

			// 4. Categorization (Forensic Heuristics)
			category := "HARDWARE_GAP"
			reason := "Job required GPU or TEE compute tier"

			// Mock logic for forensic demonstration
			if r.TransactionID != "" {
				b := r.TransactionID[0]
				if b%3 == 0 {
					category = "DOWNTIME"
					reason = "Node was unhealthy or offline during scheduling"
				} else if b%3 == 1 {
					category = "CAPACITY_LIMIT"
					reason = "Hardware exists, but cluster was at 100% capacity"
				}
			}

			audit.Events = append(audit.Events, OpportunityEvent{
				JobID:       r.TransactionID,
				AmountCents: computeAmt,
				Category:    category,
				Reason:      reason,
				Timestamp:   r.CreatedAt,
			})
		}
	}

	// 5. Expansion Insights & Capture Efficiency
	capturedComputeCents := int64(0)
	// We need to know how much compute they DID capture for these Sales Source jobs
	for _, r := range salesRecords {
		if r.Role == CommRoleSalesSource {
			for _, or := range salesRecords {
				if or.TransactionID == r.TransactionID && (or.Role == CommRolePlatform || or.Role == CommRoleOrigin) {
					capturedComputeCents += or.AmountCents
				}
			}
		}
	}

	capturedTotal := audit.EarnedSalesCents + capturedComputeCents
	potentialTotal := capturedTotal + audit.MissedComputeCents
	
	if potentialTotal > 0 {
		audit.CaptureEfficiencyPercentage = (float64(capturedTotal) / float64(potentialTotal)) * 100
	} else {
		audit.CaptureEfficiencyPercentage = 100
	}

	audit.PotentialMonthlyTotalCents = potentialTotal
	
	missedMonthly := float64(audit.MissedComputeCents) / 100.0
	audit.ExpansionInsight = ExpansionInsight{
		Analysis:      fmt.Sprintf("ANALYSIS: You are missing $%.2f/mo in compute revenue from your invitees. Your current cluster lacks the capacity or tier requirement to capture this yield.", missedMonthly),
		MissedMonthly: missedMonthly,
	}

	return audit
}



