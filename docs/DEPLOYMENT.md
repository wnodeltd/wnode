# Deployment notes
- Build: use multi-stage Dockerfile (build on Debian, runtime on node:20-slim).
- CI: checkout -> npm ci -> npm run build -> docker build -> smoke tests -> push image.
- To deploy locally: docker compose up -d --no-build --force-recreate wnoder
- Rollback: restore docker-compose.override.yml.disabled if present or revert Dockerfile to backup.
