package pricing

import (
	"context"
	"fmt"
	"math"
	"sort"
	"time"

	"go.uber.org/zap"
)

// Operational Cost Matrix for Genesis Guard (Ref: mesh/catalog/page.tsx)
var OperationalCost = map[TierID]float64{
	TierStandard: 0.0010,
	TierBoost:    0.0030,
	TierUltra:    0.0060,
	TierDecc:     0.0090,
	TierGPUPro:   0.0140,
	TierGPUMax:   0.0200,
}

type Engine struct {
	store *Store
	log   *zap.Logger
}

func NewEngine(store *Store, log *zap.Logger) *Engine {
	return &Engine{
		store: store,
		log:   log,
	}
}

func (e *Engine) Run(ctx context.Context) {
	e.log.Info("autonomous pricing engine starting")
	
	// Initial fetch
	e.refreshMarketData()

	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			e.log.Info("pricing engine stopping")
			return
		case <-ticker.C:
			e.refreshMarketData()
		}
	}
}

func (e *Engine) refreshMarketData() {
	e.log.Debug("refreshing market data")
	
	allRates := FetchAllMarketData()
	
	tiers := []TierID{TierStandard, TierBoost, TierUltra, TierDecc, TierGPUPro, TierGPUMax}
	for _, t := range tiers {
		e.updateTier(t, allRates)
	}
}

func (e *Engine) updateTier(id TierID, allRates []MarketRate) {
	sources := e.filterRatesForTier(id, allRates)
	if len(sources) == 0 {
		e.log.Warn("no market sources found for tier", zap.String("tier", string(id)))
		return
	}

	// 1. Normalization (IQR Outlier Removal)
	normalized := removeOutliersIQR(sources)
	
	// 2. Metrics
	median := calculateMedian(normalized)
	mean := calculateMean(normalized)
	vol := calculateVolatility(normalized)

	// 3. Get existing state for smoothing
	state := e.store.GetState()
	existing, _ := state.Tiers[id]
	
	// 4. Smoothing (SMA/EMA)
	smas := e.calculateSMAs(id, median, existing)
	ema := e.calculateEMA(median, existing)

	// 5. Auto-Tuning Rules
	rule := e.getRuleForTier(id, existing)
	effective := e.calculateEffectiveRate(id, median, smas, vol, rule)

	// 6. Alerts
	alerts := e.generateAlerts(id, median, existing)

	// 7. Update Store
	// Robust fallback for static specs (Master Directive)
	cores := 0
	gpu := "Unknown GPU"
	ram := 0
	desc := "Compute resource"
	name := string(id)

	switch id {
	case TierStandard:
		cores, gpu, ram, desc, name = 16, "T4 GPU", 32, "Balanced performance for general-purpose workloads.", "Standard"
	case TierBoost:
		cores, gpu, ram, desc, name = 32, "RTX 4090", 64, "High-performance compute for demanding applications.", "Boost"
	case TierUltra:
		cores, gpu, ram, desc, name = 64, "2x RTX 4090", 128, "Maximum power for intensive processing tasks.", "Ultra"
	case TierDecc:
		cores, gpu, ram, desc, name = 24, "H100", 80, "Secure enclave with Trusted Execution Environment.", "DECC"
	case TierGPUPro:
		cores, gpu, ram, desc, name = 48, "A100", 192, "Professional grade GPU cluster for enterprise AI.", "GPU-Pro"
	case TierGPUMax:
		cores, gpu, ram, desc, name = 96, "8x H100", 512, "Maximum compute density for massive scale.", "GPU-Max"
	}

	// Carry over from existing if valid, otherwise use defaults above
	if existing != nil {
		if existing.CPUCores > 0 { cores = existing.CPUCores }
		if existing.GPUModel != "" { gpu = existing.GPUModel }
		if existing.RAMGB > 0 { ram = existing.RAMGB }
		if existing.Description != "" { desc = existing.Description }
		if existing.Name != "" { name = existing.Name }
	}

	newState := &TierState{
		ID:            id,
		Name:          name,
		CPUCores:      cores,
		GPUModel:      gpu,
		RAMGB:         ram,
		Description:   desc,
		LiveMarket:    median,
		Mean:          mean,
		Volatility:    vol,
		EffectiveRate: effective,
		Rule:          rule,
		SMAs:          smas,
		EMA:           ema,
		Sources:       sources,
		Alerts:        alerts,
		LastUpdate:    time.Now(),
	}
	e.store.UpdateTierState(id, newState)
}

func (e *Engine) filterRatesForTier(id TierID, all []MarketRate) []MarketRate {
	var matches func(r MarketRate) bool
	switch id {
	case TierStandard:
		matches = func(r MarketRate) bool { return r.Price >= 0.01 && r.Price < 0.10 }
	case TierBoost:
		matches = func(r MarketRate) bool { return r.Price >= 0.10 && r.Price < 0.30 }
	case TierUltra:
		matches = func(r MarketRate) bool { return r.Price >= 0.30 && r.Price < 0.80 }
	case TierDecc:
		matches = func(r MarketRate) bool { return r.Price >= 0.80 && r.Price < 2.00 }
	case TierGPUPro:
		matches = func(r MarketRate) bool { return r.Price >= 2.00 && r.Price < 5.00 }
	case TierGPUMax:
		matches = func(r MarketRate) bool { return r.Price >= 5.00 }
	}

	result := []MarketRate{}
	for _, r := range all {
		if matches(r) {
			result = append(result, r)
		}
	}
	return result
}

func (e *Engine) getRuleForTier(id TierID, existing *TierState) PricingRule {
	if existing != nil {
		return existing.Rule
	}
	return PricingRule{
		Mode:       "follow_market",
		Multiplier: 1.0,
	}
}

func removeOutliersIQR(rates []MarketRate) []MarketRate {
	if len(rates) < 4 {
		return rates
	}
	
	prices := make([]float64, len(rates))
	for i, r := range rates {
		prices[i] = r.Price
	}
	sort.Float64s(prices)

	q1 := prices[len(prices)/4]
	q3 := prices[len(prices)*3/4]
	iqr := q3 - q1
	
	lower := q1 - 1.5*iqr
	upper := q3 + 1.5*iqr

	result := []MarketRate{}
	for _, r := range rates {
		if r.Price >= lower && r.Price <= upper {
			result = append(result, r)
		}
	}
	return result
}

func calculateMedian(rates []MarketRate) float64 {
	if len(rates) == 0 { return 0 }
	prices := make([]float64, len(rates))
	for i, r := range rates { prices[i] = r.Price }
	sort.Float64s(prices)
	n := len(prices)
	if n%2 == 1 { return prices[n/2] }
	return (prices[n/2-1] + prices[n/2]) / 2
}

func calculateMean(rates []MarketRate) float64 {
	if len(rates) == 0 { return 0 }
	sum := 0.0
	for _, r := range rates { sum += r.Price }
	return sum / float64(len(rates))
}

func calculateVolatility(rates []MarketRate) float64 {
	if len(rates) < 2 { return 0 }
	mean := calculateMean(rates)
	sumSq := 0.0
	for _, r := range rates {
		sumSq += (r.Price - mean) * (r.Price - mean)
	}
	return math.Sqrt(sumSq / float64(len(rates)-1))
}

func (e *Engine) calculateSMAs(id TierID, current float64, existing *TierState) SMAState {
	if existing == nil || len(existing.History) == 0 {
		return SMAState{M5: current, M15: current, H1: current}
	}
	
	// SMA implementation using history
	h := existing.History
	return SMAState{
		M5:  calculateAvg(h, 1, current),  // 1 point (5m)
		M15: calculateAvg(h, 3, current),  // 3 points (15m)
		H1:  calculateAvg(h, 12, current), // 12 points (1h)
	}
}

func calculateAvg(h []HistoryPoint, window int, current float64) float64 {
	sum := current
	count := 1
	for i := len(h) - 1; i >= 0 && count < window; i-- {
		sum += h[i].Price
		count++
	}
	return sum / float64(count)
}

func (e *Engine) calculateEMA(current float64, existing *TierState) float64 {
	if existing == nil { return current }
	alpha := 0.3 // Smoothing factor
	return alpha*current + (1-alpha)*existing.EMA
}

func (e *Engine) calculateEffectiveRate(id TierID, median float64, smas SMAState, vol float64, rule PricingRule) float64 {
	if rule.Mode == "manual" {
		return rule.ManualOverride
	}

	res := median
	if rule.Mode == "auto_tune" {
		switch rule.AutoTuneMode {
		case "undercut":
			res = median * (1 - rule.TargetPercent/100.0)
		case "top_n":
			// Simplified: Top N% maps to a multiplier above median for now
			res = median * (1 + (100-rule.TargetPosition)/200.0)
		case "volatility_adaptive":
			// Increase price if volatility is high to buffer risk
			res = median * (1 + vol*2)
		}
	} else {
		// follow_market
		res = median * rule.Multiplier
		res += res * (rule.PercentOffset / 100.0)
	}

	// Volatility smoothing (dampen spikes > 2 std dev)
	if vol > 0 && math.Abs(res-smas.M15) > 2*vol {
		res = smas.M15 + (res-smas.M15)*0.5 // Dampen by 50%
	}

	// Safety limits
	if rule.Floor > 0 && res < rule.Floor { res = rule.Floor }
	if rule.Ceiling > 0 && res > rule.Ceiling { res = rule.Ceiling }
	
	// Genesis Guard 1.1x Parity Floor (Master Directive)
	if cost, ok := OperationalCost[id]; ok {
		guardFloor := cost * 1.1
		if res < guardFloor {
			res = guardFloor
		}
	}

	return res
}

func (e *Engine) generateAlerts(id TierID, current float64, existing *TierState) []Alert {
	alerts := []Alert{}
	if existing == nil { return alerts }
	
	// Market Spike/Drop (> 20%)
	if existing.LiveMarket > 0 {
		change := (current - existing.LiveMarket) / existing.LiveMarket
		if math.Abs(change) > 0.2 {
			level := AlertWarning
			if math.Abs(change) > 0.5 { level = AlertCritical }
			msg := fmt.Sprintf("Significant market shift: %.1f%%", change*100)
			alerts = append(alerts, Alert{TierID: id, Level: level, Message: msg, Timestamp: time.Now()})
		}
	}
	
	// Carry over recent valid alerts
	for _, a := range existing.Alerts {
		if time.Since(a.Timestamp) < 1*time.Hour {
			alerts = append(alerts, a)
		}
	}
	
	return alerts
}
