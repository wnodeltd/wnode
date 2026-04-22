# Contributing to wnode

First off, thank you for considering contributing to wnode! It's people like you that make wnode a great decentralized compute mesh.

## Code of Conduct

By participating in this project, you are expected to uphold our commitment to fairness, transparency, and technical excellence.

## How Can I Contribute?

### Reporting Bugs
* Check the existing issues before opening a new one.
* Use a clear and descriptive title.
* Provide a step-by-step reproduction guide.

### Suggesting Enhancements
* Open an issue with the "enhancement" tag.
* Explain why the feature would be useful to the community.

### Pull Requests
1. Fork the repo and create your branch from `main`.
2. Ensure your code follows the existing style (Go: `gofmt`, TS: `prettier`).
3. Update the documentation in `/docs` if your change modifies network behavior.
4. All security-related changes must adhere to the **[Steward Update Policy](docs/steward-update-policy.md)**.
5. Ensure tests pass (`go test ./...` in `nodld`).

## Development Process

### Backend (`nodld`)
The core daemon is written in Go.
- Use `zap` for logging.
- Ensure concurrency safety in the `registry` and `store`.
- Never introduce dependencies that require `CGO` to maintain our pure-Go WASM runtime guarantees.

### Frontend (`apps/`)
Our portals are built with Next.js and TypeScript.
- Use shared components from `apps/shared`.
- Ensure all API calls are proxied through the appropriate route handlers for identity hydration.

## Financial & Economic Changes
Any changes to the commission splits (`economics.go`) or the 120-day compliance hold are considered **Constitutional Updates** and require a high-level governance audit.

---

Thank you for building the future of sovereign compute with us!
