package stripe

import (
	"database/sql"
	"testing"
	"os"

	_ "github.com/lib/pq"
	internalAccount "github.com/obregan/nodl/nodld/internal/account"
)

func TestMaterializePayment_Allocations(t *testing.T) {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		t.Skip("Skipping postgres test locally; no DSN provided")
	}

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		t.Fatalf("Failed to open postgres connection: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		t.Fatalf("Failed to ping postgres database: %v", err)
	}

	store := internalAccount.NewStore(nil)
	ledger := NewPostgresLedger(db, store)

	// Ensure schema exists
	_ = ledger.InitSchema()

	// Use $10.00 as base test
	baseAmount := int64(1000)

	// In test, since store is mostly empty, we expect some rounding 
	// unless we seed a mock founder tree.

	err = ledger.MaterializePayment("pi_test_12345", "test_nodlr_id_x", baseAmount)
	if err != nil {
		t.Fatalf("Failed to materialize payment: %v", err)
	}

	// Verify exact sum total is equal to baseAmount by pulling from DB
	var total int64
	err = db.QueryRow("SELECT SUM(amount_cents) FROM ledger_entries WHERE payment_intent_id = 'pi_test_12345'").Scan(&total)
	if err != nil {
		t.Fatalf("Failed to sum amounts: %v", err)
	}

	if total != baseAmount {
		t.Fatalf("Allocation mismatch! Expected %d, got %d. Math rounding row failed.", baseAmount, total)
	}

	// Test idempotency
	err = ledger.MaterializePayment("pi_test_12345", "test_nodlr_id_x", baseAmount)
	if err != nil {
		t.Fatalf("Idempotency failed, returned error on second materialization: %v", err)
	}

	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM ledger_entries WHERE payment_intent_id = 'pi_test_12345' AND allocation_type = 'NODLR'").Scan(&count)
	if err != nil || count > 1 {
		t.Fatalf("Idempotency logic duplicated entries! Count: %d", count)
	}
}
