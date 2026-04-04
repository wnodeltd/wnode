package stripe

import (
	"database/sql"
	"testing"
	"os"

	_ "github.com/lib/pq"
	internalAccount "github.com/obregan/nodl/nodld/internal/account"
)

func TestPostgresLedger_InitSchema(t *testing.T) {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://postgres:postgres@127.0.0.1:5432/nodld?sslmode=disable"
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

	err = ledger.InitSchema()
	if err != nil {
		t.Fatalf("InitSchema failed: %v", err)
	}
}
