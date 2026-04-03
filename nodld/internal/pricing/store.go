package pricing

import (
	"context"
	"encoding/json"
	"sync"
	"time"

	"github.com/redis/go-redis/v9"
)

type Store struct {
	mu    sync.RWMutex
	rdb   *redis.Client
	state *GlobalPricingState
}

func NewStore(rdb *redis.Client) *Store {
	s := &Store{
		rdb: rdb,
		state: &GlobalPricingState{
			Tiers: make(map[TierID]*TierState),
		},
	}

	// 1. Initialize with Master Matrix Defaults
	initialTiers := []*TierState{
		{ID: TierStandard, Name: "Standard", RateTHSec: 0.0018, CPUCores: 16, GPUModel: "T4 GPU", RAMGB: 32, Description: "Balanced general purpose compute for established workloads."},
		{ID: TierBoost, Name: "Boost", RateTHSec: 0.0042, CPUCores: 32, GPUModel: "RTX 4090", RAMGB: 64, Description: "High-performance GPU compute for demanding AI/ML tasks."},
		{ID: TierUltra, Name: "Ultra", RateTHSec: 0.0084, CPUCores: 64, GPUModel: "2x RTX 4090", RAMGB: 128, Description: "Extreme multi-GPU performance for massive parallel processing."},
		{ID: TierDecc, Name: "DECC", RateTHSec: 0.0120, CPUCores: 24, GPUModel: "H100", RAMGB: 80, Description: "Secure confidential compute with Hardware TEE protection."},
		{ID: TierGPUPro, Name: "GPU-Pro", RateTHSec: 0.0180, CPUCores: 48, GPUModel: "A100", RAMGB: 192, Description: "Professional grade GPU clusters with high-bandwidth interconnect."},
		{ID: TierGPUMax, Name: "GPU-Max", RateTHSec: 0.0250, CPUCores: 96, GPUModel: "8x H100", RAMGB: 512, Description: "Maximum cluster density for massive enterprise-level scale."},
	}

	for _, t := range initialTiers {
		t.LastUpdate = time.Now()
		s.state.Tiers[t.ID] = t
	}

	// 2. Sync from Redis (Overrides defaults if present)
	s.Sync()

	return s
}

func (s *Store) Sync() {
	if s.rdb == nil {
		return
	}
	ctx := context.Background()
	data, err := s.rdb.HGetAll(ctx, "nodl:pricing:tiers").Result()
	if err != nil {
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()
	for id, raw := range data {
		var t TierState
		if err := json.Unmarshal([]byte(raw), &t); err == nil {
			// Merge persistence: Keep historical data and rules, but specs might update via code
			if existing, ok := s.state.Tiers[TierID(id)]; ok {
				existing.Rule = t.Rule
				existing.RateTHSec = t.RateTHSec
				existing.History = t.History
				existing.LastUpdate = t.LastUpdate
			} else {
				s.state.Tiers[TierID(id)] = &t
			}
		}
	}
}

func (s *Store) GetState() *GlobalPricingState {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.state
}

func (s *Store) UpdateTierState(id TierID, state *TierState) {
	s.mu.Lock()
	
	// Maintain history (max 1000 points)
	if existing, ok := s.state.Tiers[id]; ok {
		state.History = append(existing.History, HistoryPoint{
			Price:      state.LiveMarket,
			Volatility: state.Volatility,
			Timestamp:  time.Now(),
		})
		if len(state.History) > 1000 {
			state.History = state.History[len(state.History)-1000:]
		}
	} else {
		state.History = []HistoryPoint{{
			Price:      state.LiveMarket,
			Volatility: state.Volatility,
			Timestamp:  time.Now(),
		}}
	}

	s.state.Tiers[id] = state
	s.state.LastUpdate = time.Now()
	s.mu.Unlock()

	// Persist to Redis
	if s.rdb != nil {
		data, _ := json.Marshal(state)
		s.rdb.HSet(context.Background(), "nodl:pricing:tiers", string(id), data)
	}
}
