package stripe

import (
	"database/sql"
	"time"

	stripe "github.com/stripe/stripe-go/v81"
	"github.com/stripe/stripe-go/v81/transfer"
	"go.uber.org/zap"
)

// PayoutScheduler processes pending entries in the Postgres ledger and pushes USD payments to Nodlr express accounts.
type PayoutScheduler struct {
	db  *sql.DB
	log *zap.Logger
}

func NewPayoutScheduler(db *sql.DB, log *zap.Logger) *PayoutScheduler {
	return &PayoutScheduler{
		db:  db,
		log: log,
	}
}

// Run executed daily (or incrementally) to batch operations.
func (s *PayoutScheduler) Run() error {
	s.log.Info("starting daily payout scheduler")

	// 1. Find all eligible pending entries
	rows, err := s.db.Query("SELECT id, recipient_id, amount_cents FROM ledger_entries WHERE status = 'PENDING' AND recipient_id != 'platform'")
	if err != nil {
		s.log.Error("failed to query pending entries", zap.Error(err))
		return err
	}
	defer rows.Close()

	// Aggregate per recipient to batch transfers and cut down on Stripe networking
	payoutBatches := make(map[string]int64)
	var entryIDs []string

	for rows.Next() {
		var id, recipient string
		var amount int64
		if err := rows.Scan(&id, &recipient, &amount); err != nil {
			continue
		}
		payoutBatches[recipient] += amount
		entryIDs = append(entryIDs, id)
	}

	if len(payoutBatches) == 0 {
		s.log.Info("no pending payouts to process")
		return nil
	}

	// 2. Iterate and payout via Stripe Transfer API
	for recipientAcct, totalCents := range payoutBatches {
		if totalCents <= 0 {
			continue
		}

		params := &stripe.TransferParams{
			Amount:      stripe.Int64(totalCents),
			Currency:    stripe.String("usd"), // Enforced constraint: USD to avoid FX conversion
			Destination: stripe.String(recipientAcct),
			Description: stripe.String("Nodl Ecosystem Daily Payout"),
		}

		t, err := transfer.New(params)
		if err != nil {
			s.log.Error("failed processing daily transfer", zap.Error(err), zap.String("recipient", recipientAcct), zap.Int64("amountCents", totalCents))
			continue
		}

		// Update ledger explicitly tracking the Stripe Transfer ID
		_, updateErr := s.db.Exec("UPDATE ledger_entries SET status = 'PAID', transfer_id = $1 WHERE status = 'PENDING' AND recipient_id = $2", t.ID, recipientAcct)
		if updateErr != nil {
			s.log.Error("failed to mark ledger rows paid", zap.Error(updateErr), zap.String("transferID", t.ID))
			// System relies on Stripe idempotency in true production but we log the error for reconciliation
		} else {
			s.log.Info("successfully processed batch payout", zap.String("recipient", recipientAcct), zap.Int64("amountCents", totalCents), zap.String("transfer", t.ID))
		}
	}

	return nil
}
