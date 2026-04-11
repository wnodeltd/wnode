package account

import (
	"sync"
	"time"

	"github.com/google/uuid"
)

type Store struct {
	mu                sync.RWMutex
	nodlrs            map[string]*Nodlr
	founders          [5]string // IDs mapping to Founder #1..#5
	organicCount      int       // For round-robin placement
	pendingCommissions map[string][]CommissionRecord // NodlrID -> Records
}

func NewStore() *Store {
	return &Store{
		nodlrs:             make(map[string]*Nodlr),
		pendingCommissions: make(map[string][]CommissionRecord),
	}
}

// SetFounder assigns a specific ID to one of the 5 founder slots.
func (s *Store) SetFounder(index int, id string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if index < 1 || index > 5 {
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
	
	// Round-robin for organic signups (Strict Genesis Rotation)
	if parentID == "" {
		slotIndex := s.organicCount % 5
		parentID = s.founders[slotIndex]
		s.organicCount++
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

// TransferAffiliate reassigns a child to a new parent. Irreversible.
func (s *Store) TransferAffiliate(childID, newParentID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	child, ok := s.nodlrs[childID]
	if !ok {
		return nil // or error
	}
	
	// Safety: check if newParent exists
	if _, ok := s.nodlrs[newParentID]; !ok {
		return nil
	}

	child.ParentID = newParentID
	return nil
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
