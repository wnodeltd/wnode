package stripe

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
	_ "github.com/lib/pq"
	internalAccount "github.com/obregan/nodl/nodld/internal/account"
)

type AllocationType string

const (
	AllocPlatform     AllocationType = "PLATFORM"
	AllocFounderChain AllocationType = "FOUNDER_CHAIN"
	AllocL1Affiliate  AllocationType = "L1_AFFILIATE"
	AllocL2Affiliate  AllocationType = "L2_AFFILIATE"
	AllocNodlr        AllocationType = "NODLR"
	AllocRounding     AllocationType = "ROUNDING"
)

type LedgerStatus string

const (
	StatusPending LedgerStatus = "PENDING"
	StatusPaid    LedgerStatus = "PAID"
	StatusFailed  LedgerStatus = "FAILED"
)

type LedgerEntry struct {
	ID              string
	PaymentIntentID string
	SourceID        string
	RecipientID     string
	AmountCents     int64
	AllocationType  AllocationType
	Status          LedgerStatus
	TransferID      *string
	CreatedAt       time.Time
}

type PostgresLedger struct {
	db           *sql.DB
	accountStore *internalAccount.Store
}

func NewPostgresLedger(db *sql.DB, accountStore *internalAccount.Store) *PostgresLedger {
	return &PostgresLedger{
		db:           db,
		accountStore: accountStore,
	}
}

func (l *PostgresLedger) InitSchema() error {
	query := `
	CREATE TABLE IF NOT EXISTS ledger_entries (
		id UUID PRIMARY KEY,
		payment_intent_id VARCHAR(255) NOT NULL,
		source_id VARCHAR(255) NOT NULL,
		recipient_id VARCHAR(255) NOT NULL,
		amount_cents BIGINT NOT NULL,
		allocation_type VARCHAR(50) NOT NULL,
		status VARCHAR(50) NOT NULL,
		transfer_id VARCHAR(255),
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);
	CREATE INDEX IF NOT EXISTS idx_ledger_status ON ledger_entries(status);
	CREATE INDEX IF NOT EXISTS idx_ledger_pi ON ledger_entries(payment_intent_id);
	`
	_, err := l.db.Exec(query)
	return err
}

func (l *PostgresLedger) MaterializePayment(piID string, sourceNodlrID string, totalCents int64) error {
	tx, err := l.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Idempotency check
	var count int
	err = tx.QueryRow("SELECT COUNT(*) FROM ledger_entries WHERE payment_intent_id = $1", piID).Scan(&count)
	if err != nil {
		return err
	}
	if count > 0 {
		return nil // Already materialized
	}

	// Calculate splits atomically
	platformCents := int64(float64(totalCents) * 0.06)
	founderCents := int64(float64(totalCents) * 0.04)
	l1Cents := int64(float64(totalCents) * 0.03)
	l2Cents := int64(float64(totalCents) * 0.07)
	nodlrCents := int64(float64(totalCents) * 0.80)

	totalAllocated := platformCents + founderCents + l1Cents + l2Cents + nodlrCents
	rounding := totalCents - totalAllocated

	l1ID, l2ID := l.accountStore.ResolveTree(sourceNodlrID)

	entries := []LedgerEntry{
		{ID: uuid.New().String(), PaymentIntentID: piID, SourceID: sourceNodlrID, RecipientID: "platform", AmountCents: platformCents, AllocationType: AllocPlatform, Status: StatusPending},
		{ID: uuid.New().String(), PaymentIntentID: piID, SourceID: sourceNodlrID, RecipientID: sourceNodlrID, AmountCents: nodlrCents, AllocationType: AllocNodlr, Status: StatusPending},
	}

	if l1ID != "" {
		entries = append(entries, LedgerEntry{ID: uuid.New().String(), PaymentIntentID: piID, SourceID: sourceNodlrID, RecipientID: l1ID, AmountCents: l1Cents, AllocationType: AllocL1Affiliate, Status: StatusPending})
	} else {
		rounding += l1Cents
	}

	if l2ID != "" {
		entries = append(entries, LedgerEntry{ID: uuid.New().String(), PaymentIntentID: piID, SourceID: sourceNodlrID, RecipientID: l2ID, AmountCents: l2Cents, AllocationType: AllocL2Affiliate, Status: StatusPending})
	} else {
		rounding += l2Cents
	}

	// Founder Chain (4% split iteratively)
	// Iterate through the parent chain from sourceNodlrID up to Genesis Founder, splitting the 4%.
	var founderAncestors []string
	curr := sourceNodlrID

	for i := 0; i < 50; i++ { // Guard against infinite loops
		n, ok := l.accountStore.GetNodlr(curr)
		if !ok || n.ParentID == "" {
			if n != nil && n.IsFounder {
				founderAncestors = append(founderAncestors, n.ID)
			}
			break
		}
		if n.IsFounder {
			founderAncestors = append(founderAncestors, n.ID)
			break
		}
		curr = n.ParentID
	}

	if len(founderAncestors) > 0 {
		splitAmt := founderCents / int64(len(founderAncestors))
		for _, fID := range founderAncestors {
			entries = append(entries, LedgerEntry{ID: uuid.New().String(), PaymentIntentID: piID, SourceID: sourceNodlrID, RecipientID: fID, AmountCents: splitAmt, AllocationType: AllocFounderChain, Status: StatusPending})
			founderCents -= splitAmt
		}
		rounding += founderCents // leftover fraction from the division
	} else {
		rounding += founderCents
	}

	if rounding > 0 {
		entries = append(entries, LedgerEntry{ID: uuid.New().String(), PaymentIntentID: piID, SourceID: sourceNodlrID, RecipientID: "platform", AmountCents: rounding, AllocationType: AllocRounding, Status: StatusPending})
	}

	stmt, err := tx.Prepare("INSERT INTO ledger_entries (id, payment_intent_id, source_id, recipient_id, amount_cents, allocation_type, status) VALUES ($1, $2, $3, $4, $5, $6, $7)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, e := range entries {
		if _, err := stmt.Exec(e.ID, e.PaymentIntentID, e.SourceID, e.RecipientID, e.AmountCents, string(e.AllocationType), string(e.Status)); err != nil {
			return err
		}
	}

	return tx.Commit()
}
