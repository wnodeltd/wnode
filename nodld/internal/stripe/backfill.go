package stripe

import (
	"context"
	"database/sql"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	internalAccount "github.com/obregan/nodl/nodld/internal/account"
	"go.uber.org/zap"
)

// BackfillFromRedis migrates legacy Redis commissions into the canonical Postgres flat ledger.
func BackfillFromRedis(ctx context.Context, db *sql.DB, store *internalAccount.Store, log *zap.Logger) error {
	rdb := store.Redis()
	if rdb == nil {
		log.Warn("no redis instance available for backfill")
		return nil
	}

	data, err := rdb.HGetAll(ctx, "nodl:commissions").Result()
	if err != nil {
		return err
	}

	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare("INSERT INTO ledger_entries (id, payment_intent_id, source_id, recipient_id, amount_cents, allocation_type, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	migratedCount := 0

	for nodlrID, rawJSON := range data {
		var records []internalAccount.CommissionRecord
		if err := json.Unmarshal([]byte(rawJSON), &records); err != nil {
			log.Error("failed to unmarshal commission records", zap.Error(err), zap.String("nodlrID", nodlrID))
			continue
		}

		for _, rec := range records {
			_, err := stmt.Exec(
				uuid.New().String(),
				"migrated_from_redis_"+uuid.New().String(),
				rec.JobID, // using job ID as source proxy for legacy data
				nodlrID,
				rec.AmountCents,
				string(AllocNodlr), // Assuming legacy commissions were mostly earner allocations
				string(StatusPending), // Re-queueing as pending to let the scheduler process them
				rec.Timestamp,
			)
			if err != nil {
				log.Error("failed to insert migrated record", zap.Error(err))
				continue
			}
			migratedCount++
		}
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	// Clean out Redis legacy state after atomic migration
	if migratedCount > 0 {
		rdb.Del(ctx, "nodl:commissions")
	}

	log.Info("successful redis legacy backfill", zap.Int("migrated_rows", migratedCount))
	return nil
}
