# Nodl — Decentralized Compute Marketplace

> **Harvest the Idle.** Turn unused CPU/GPU cycles on consumer devices into liquid compute.

> [!IMPORTANT]
> **Migration Notice:** This repository has been rebranded to **Wnode**. Please see [MIGRATION.md](docs/MIGRATION.md) for details on the transition from `Nodlshire/nodl` to `Nodlshire/wnode`.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Nodl Ecosystem                     │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │  Mesh    │  │  Nodlr   │  │ Command  │  │  Web   │  │
│  │ (Buyers) │  │(Providers│  │  (Admin) │  │ (Mktg) │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────────┘  │
│       │              │              │                    │
│       └──────────────┴──────────────┘                   │
│                       │                                  │
│              ┌─────────▼──────────┐                     │
│              │       wnoded        │                     │
│              │  Go Daemon / API   │                     │
│              └─────────┬──────────┘                     │
│                        │                                │
│          ┌─────────────┼─────────────┐                  │
│          │             │             │                  │
│     ┌────▼────┐  ┌─────▼────┐  ┌────▼────┐             │
│     │  libp2p │  │  Wazero  │  │ Stripe  │             │
│     │  Mesh   │  │  WASM    │  │ Connect │             │
│     └─────────┘  └──────────┘  └─────────┘             │
└─────────────────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites
- Go 1.22+
- (Optional) Docker & Docker Compose for containerised dev

### Run Locally

```bash
cd wnoded

# Copy and fill in your credentials
cp .env.example .env

# Install dependencies
go mod tidy

# Run all tests
go test -race -v ./...

# Start the daemon
go run ./cmd/wnoded
```

### With Docker Compose

```bash
# From the repo root
cp wnoded/.env.example wnoded/.env
docker compose up --build
```

Endpoints:

| Route | Method | Description |
|---|---|---|
| `/health` | GET | Liveness probe |
| `/peers` | GET | Connected libp2p peers |
| `/jobs` | GET | All jobs + status |
| `/jobs` | POST | Submit a WASM compute job |
| `/jobs/:id` | GET | Single job status |
| `/ws` | WS | Real-time event stream |
| `/api/v1/stripe/connect/account` | POST | Create Nodlr Express account |
| `/api/v1/stripe/connect/onboard` | POST | Generate Stripe onboarding link |
| `/api/v1/stripe/payment/create` | POST | Create Buyer PaymentIntent |
| `/api/v1/stripe/transfer` | POST | Transfer to Nodlr (post Proof-of-Work) |
| `/api/v1/stripe/webhook` | POST | Stripe webhook receiver |

### Submitting a WASM Job

```bash
curl -X POST http://localhost:8080/jobs \
  -F "wasm=@your_task.wasm" \
  -F 'manifest={"budget":2.50,"targetCycles":100000}'
```

## Project Structure

```
wnode/
├── wnoded/                  # Go backend daemon
│   ├── cmd/wnoded/main.go   # Entry point
│   ├── internal/
│   │   ├── config/         # Env loading
│   │   ├── p2p/            # libp2p host (WebRTC+WebTransport+DHT)
│   │   ├── wasm/           # Wazero sandbox runner
│   │   ├── jobs/           # Job lifecycle + dispatcher
│   │   ├── api/            # Fiber HTTP + WebSocket
│   │   └── stripe/         # Stripe Connect service
│   ├── Dockerfile
│   └── .env.example
├── apps/                   # Next.js dashboards (Phase 2+)
│   ├── wnoder/              # Provider dashboard
│   ├── mesh/               # Buyer marketplace
│   └── command/            # Admin control plane
├── docker-compose.yml
└── README.md
```

## WASM Module ABI

Nodl expects compute modules to export two functions:

```wat
(func (export "alloc") (param i32) (result i32))   ;; alloc(size) -> ptr
(func (export "run") (param i32 i32) (result i32 i32))  ;; run(ptr, len) -> (out_ptr, out_len)
```

Modules without these exports are executed via `_start` (WASI command modules).

## Environment Variables

See [`.env.example`](wnoded/.env.example) for full documentation.

## Technology Stack

| Layer | Technology |
|---|---|
| Backend daemon | Go 1.22 |
| P2P mesh | go-libp2p (WebRTC Direct, WebTransport, Kademlia DHT) |
| WASM runtime | Wazero (pure Go, zero CGO) |
| HTTP/WS server | Fiber v2 |
| Payments | Stripe Connect (Separate Charges & Transfers) |
| Frontends | Next.js (TypeScript) |

## License

MIT — see LICENSE
