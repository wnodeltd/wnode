package account

import (
	"context"
	"time"

	"go.uber.org/zap"
)

// StripePayer is an interface for the Stripe service method we need.
type StripePayer interface {
	ProcessCommissionPayouts(jobID string, platformAmt int64, payouts map[string]int64) error
}

type Scheduler struct {
	store    *Store
	stripe   StripePayer
	log      *zap.Logger
}

func NewScheduler(store *Store, stripe StripePayer, log *zap.Logger) *Scheduler {
	return &Scheduler{
		store:  store,
		stripe: stripe,
		log:    log,
	}
}

func (s *Scheduler) Run(ctx context.Context) {
	s.log.Info("affiliate settlement scheduler starting")
	
	// Check every hour for due payouts
	ticker := time.NewTicker(1 * time.Hour)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			s.Settle()
		}
	}
}

func (s *Scheduler) Settle() {
	s.log.Debug("starting settlement cycle")
	
	nodlrs := s.store.ListNodlrs()
	now := time.Now()

	for _, n := range nodlrs {
		if n.StripeConnectID == "" {
			continue
		}

		// Check preference
		due := false
		if n.PayoutFrequency == PayoutDaily {
			due = true // Simplified for MVP: pays out everything pending once an hour
		} else if n.PayoutFrequency == PayoutWeekly && now.Weekday() == time.Monday {
			due = true
		}

		if due {
			pending := s.store.GetPendingTotal(n.ID)
			if pending > 0 {
				s.log.Info("executing payout", zap.String("nodlr", n.ID), zap.Int64("amt", pending))
				
				// In a real system, we'd record a Payout object and batch these.
				// For now, we use the Stripe Service's ProcessCommissionPayouts structure.
				payouts := map[string]int64{
					n.StripeConnectID: pending,
				}
				
				err := s.stripe.ProcessCommissionPayouts("SETTLEMENT_"+now.Format("20060102"), 0, payouts)
				if err == nil {
					s.store.ClearPending(n.ID)
				} else {
					s.log.Error("failed to settle nodlr", zap.String("id", n.ID), zap.Error(err))
				}
			}
		}
	}
}
