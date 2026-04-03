package account

import (
	"context"
	"encoding/json"
	"sync"
	"time"
    
	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
)

type Store struct {
	mu                sync.RWMutex
	rdb               *redis.Client
	nodlrs            map[string]*Nodlr // Legacy/Cache for fast lookup
	founders          [5]string
	organicCount      int
	pendingCommissions map[string][]CommissionRecord
}

func (s *Store) Redis() *redis.Client {
    return s.rdb
}

func NewStore(rdb *redis.Client) *Store {
	s := &Store{
		rdb:                rdb,
		nodlrs:             make(map[string]*Nodlr),
		pendingCommissions: make(map[string][]CommissionRecord),
	}
	s.Sync()
	return s
}

// Sync loads all accounts from Redis into the local cache.
func (s *Store) Sync() {
	if s.rdb == nil {
		return
	}
	ctx := context.Background()
	data, err := s.rdb.HGetAll(ctx, "nodl:accounts").Result()
	if err != nil {
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()
	for id, raw := range data {
		var n Nodlr
		if err := json.Unmarshal([]byte(raw), &n); err == nil {
			s.nodlrs[id] = &n
		}
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
		IntegrityScore:  600,
		ParentID:        parentID,
		CreatedAt:       time.Now(),
	}

	for i, fID := range s.founders {
		if fID == id {
			n.IsFounder = true
			n.FounderIndex = i + 1
		}
	}

	s.nodlrs[id] = n
	
	// Persist to Redis
	if s.rdb != nil {
		data, _ := json.Marshal(n)
		s.rdb.HSet(context.Background(), "nodl:accounts", id, data)
	}

	return n, nil
}

func (s *Store) AddNodlr(n *Nodlr) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.nodlrs[n.ID] = n
	
	if s.rdb != nil {
		data, _ := json.Marshal(n)
		s.rdb.HSet(context.Background(), "nodl:accounts", n.ID, data)
	}
}

func (s *Store) GetNodlr(id string) (*Nodlr, bool) {
	s.mu.RLock()
	n, ok := s.nodlrs[id]
	s.mu.RUnlock()
	
	if ok {
		return n, true
	}
	
	// Fallback to Redis
	if s.rdb != nil {
		data, err := s.rdb.HGet(context.Background(), "nodl:accounts", id).Result()
		if err == nil {
			var nodlr Nodlr
			if err := json.Unmarshal([]byte(data), &nodlr); err == nil {
				// Cache it
				s.mu.Lock()
				s.nodlrs[id] = &nodlr
				s.mu.Unlock()
				return &nodlr, true
			}
		}
	}
	
	return nil, false
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

// TransferAffiliate reassigns a child to a new parent. Irreversible.
func (s *Store) TransferAffiliate(childID, newParentID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	child, ok := s.nodlrs[childID]
	if !ok {
		return nil
	}
	
	if _, ok := s.nodlrs[newParentID]; !ok {
		return nil
	}

	child.ParentID = newParentID
	
	if s.rdb != nil {
		data, _ := json.Marshal(child)
		s.rdb.HSet(context.Background(), "nodl:accounts", child.ID, data)
	}
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
		if s.rdb != nil {
			data, _ := json.Marshal(s.pendingCommissions[r.RecipientID])
			s.rdb.HSet(context.Background(), "nodl:commissions", r.RecipientID, data)
		}
	}
}

func (s *Store) ClearPending(nodlrID string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.pendingCommissions, nodlrID)
	if s.rdb != nil {
		s.rdb.HDel(context.Background(), "nodl:commissions", nodlrID)
	}
}

func (s *Store) GetPendingTotal(nodlrID string) int64 {
	s.mu.RLock()
	records, ok := s.pendingCommissions[nodlrID]
	s.mu.RUnlock()
	
	if !ok && s.rdb != nil {
		data, err := s.rdb.HGet(context.Background(), "nodl:commissions", nodlrID).Result()
		if err == nil {
			var recs []CommissionRecord
			if err := json.Unmarshal([]byte(data), &recs); err == nil {
				s.mu.Lock()
				s.pendingCommissions[nodlrID] = recs
				s.mu.Unlock()
				records = recs
			}
		}
	}
    
	var total int64
	for _, r := range records {
		total += r.AmountCents
	}
	return total
}
