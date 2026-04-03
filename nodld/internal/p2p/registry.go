package p2p

import (
	"context"
	"encoding/json"
	"sync"
	"time"

	"github.com/obregan/nodl/nodld/internal/impact"
	"github.com/redis/go-redis/v9"
)

type AccountStatus string

const (
	StatusActive        AccountStatus = "Active"
	StatusFlagged       AccountStatus = "Flagged"
	StatusSuspended     AccountStatus = "Suspended"
	StatusShadowBenched AccountStatus = "ShadowBenched"
)

// HealthScore tracks node stability and performance.
type HealthScore struct {
	Latency   time.Duration `json:"latency"`
	Uptime    time.Duration `json:"uptime"`
	FlapCount int           `json:"flapCount"`
	Score     float64       `json:"score"` // 0.0 to 1.0
}

// SessionInfo holds active session data including health metrics.
type SessionInfo struct {
	ID             string        `json:"sessionId"`
	Health         HealthScore   `json:"health"`
	TotalUptime    time.Duration `json:"totalUptime"`
	IntegrityScore float64       `json:"integrityScore"`
	Status         AccountStatus `json:"status"`
	IsVM           bool          `json:"isVM"`
	IsDuplicate    bool          `json:"isDuplicate"`
	LastSeen       time.Time     `json:"lastSeen"`
}

// Registry tracks active hardware sessions.
type Registry struct {
	mu       sync.RWMutex
	rdb      *redis.Client
	sessions map[string]*SessionInfo // map[Hardware_DNA]SessionInfo
}

// NewRegistry creates a new Hardware Registry.
func NewRegistry(rdb *redis.Client) *Registry {
	return &Registry{
		rdb:      rdb,
		sessions: make(map[string]*SessionInfo),
	}
}

// Register attempts to register a new session. Returns false if the hardware is already active.
func (r *Registry) Register(hwDNA, sessionID string, isVM bool) bool {
	r.mu.Lock()
	defer r.mu.Unlock()

	isDuplicate := false
	if _, exists := r.sessions[hwDNA]; exists {
		isDuplicate = true
	}

	s := &SessionInfo{
		ID:             sessionID,
		LastSeen:       time.Now(),
		Status:         StatusActive,
		IsVM:           isVM,
		IsDuplicate:    isDuplicate,
		IntegrityScore: 1.0,
		Health: HealthScore{
			Score: 1.0,
		},
	}

	if isVM || isDuplicate {
		s.IntegrityScore = 0
		s.Status = StatusFlagged
	}

	r.sessions[hwDNA] = s
	
	if r.rdb != nil {
		data, _ := json.Marshal(s)
		r.rdb.HSet(context.Background(), "nodl:sessions", hwDNA, data)
	}

	return true
}

// Unregister removes a session.
func (r *Registry) Unregister(hwDNA string) {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.sessions, hwDNA)
	if r.rdb != nil {
		r.rdb.HDel(context.Background(), "nodl:sessions", hwDNA)
	}
}

// IsActive returns true if the hardware is currently registered.
func (r *Registry) IsActive(hwDNA string) bool {
	r.mu.RLock()
	defer r.mu.RUnlock()
	_, exists := r.sessions[hwDNA]
	return exists
}

// UpdateHealth updates health metrics for a given hardware DNA.
func (r *Registry) UpdateHealth(hwDNA string, latency time.Duration, isUp bool) {
	r.mu.Lock()
	defer r.mu.Unlock()

	s, exists := r.sessions[hwDNA]
	if !exists {
		return
	}

	if isUp {
		delta := time.Since(s.LastSeen)
		if delta > 0 && delta < 1*time.Minute {
			s.TotalUptime += delta
		}
	}

	s.Health.Latency = latency
	s.LastSeen = time.Now()

	if r.rdb != nil {
		data, _ := json.Marshal(s)
		r.rdb.HSet(context.Background(), "nodl:sessions", hwDNA, data)
	}

	if !isUp {
		s.Health.FlapCount++
		s.Health.Score -= 0.1
	} else {
		s.Health.Score += 0.01
	}

	if s.Health.Score > 1.0 {
		s.Health.Score = 1.0
	} else if s.Health.Score < 0.0 {
		s.Health.Score = 0.0
	}

	s.IntegrityScore = r.calculateIntegrityScore(s)
	if s.IntegrityScore == 0 && s.Status == StatusActive {
		s.Status = StatusFlagged
	}
}

func (r *Registry) calculateIntegrityScore(s *SessionInfo) float64 {
	if s.IsVM || s.IsDuplicate {
		return 0
	}

	uptimeScore := s.TotalUptime.Hours() / 1000.0
	if uptimeScore > 0.4 {
		uptimeScore = 0.4
	}

	healthScore := s.Health.Score * 0.3

	impactMetrics := impact.CalculateSavings(s.TotalUptime)
	greenScore := impactMetrics.CarbonSavedKg / 100.0
	if greenScore > 0.3 {
		greenScore = 0.3
	}

	total := uptimeScore + healthScore + greenScore
	if total > 1.0 {
		total = 1.0
	}
	return total
}

// Release clears a suspension or flag.
func (r *Registry) Release(hwDNA string) {
	r.mu.Lock()
	defer r.mu.Unlock()
	if s, exists := r.sessions[hwDNA]; exists {
		s.Status = StatusActive
		s.IsVM = false
		s.IsDuplicate = false
		s.IntegrityScore = 1.0
		
		if r.rdb != nil {
			data, _ := json.Marshal(s)
			r.rdb.HSet(context.Background(), "nodl:sessions", hwDNA, data)
		}
	}
}

// ResolveFlag handles administrative actions for flagged accounts.
func (r *Registry) ResolveFlag(hwDNA string, action string) {
	r.mu.Lock()
	defer r.mu.Unlock()

	s, exists := r.sessions[hwDNA]
	if !exists {
		return
	}

	switch action {
	case "clear":
		s.Status = StatusActive
		s.IsVM = false
		s.IsDuplicate = false
		s.IntegrityScore = 1.0
	case "shadow-bench":
		s.Status = StatusShadowBenched
		s.IntegrityScore = 0.05
	}
	
	if r.rdb != nil {
		data, _ := json.Marshal(s)
		r.rdb.HSet(context.Background(), "nodl:sessions", hwDNA, data)
	}
}

// GetStatus returns the current status of a hardware DNA.
func (r *Registry) GetStatus(hwDNA string) AccountStatus {
	r.mu.RLock()
	defer r.mu.RUnlock()
	if s, exists := r.sessions[hwDNA]; exists {
		return s.Status
	}
	return ""
}

// List returns a copy of the registry map.
func (r *Registry) List() map[string]*SessionInfo {
	r.mu.RLock()
	defer r.mu.RUnlock()
	res := make(map[string]*SessionInfo, len(r.sessions))
	for k, v := range r.sessions {
		info := *v
		res[k] = &info
	}
	return res
}
