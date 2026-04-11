# Migration Guide: Nodlshire/nodl to Nodlshire/wnode

**Summary:** The core system repository has been formally renamed from `Nodlshire/nodl` to `Nodlshire/wnode`.

## What Changed
- **Top-level directory renames:**
  - `apps/nodlr` has been relocated and renamed to `apps/wnoder`
  - The backend daemon `nodld` has relocated to `wnoded`
- **Metadata Updates:**
  - Standardized references within `package.json`, Go configuration modules, and `docker-compose.yml`.
  - Applied fixes to `apps/wnoder/app/layout.tsx` to handle parsing logic successfully.

## Integrator Requirements
If your downstream system relies on this repository, you must execute the following updates:
1. **Remote Git URLs:** Update local checkouts to fetch exclusively from `git@github.com:Nodlshire/wnode.git`.
2. **Docker Tag References:** Switch container pulls downstream from the old `nodl-*` image paths to newly minted `wnode-*` namespaces.
3. **Package Registry/CI Dependencies:** Revise any hardcoded package pulls referencing the old domain in your workflows.
4. **Webhook Endpoints:** Future integration hooks on the `main` ref must point to the new namespace endpoints.

## Rollback / Emergency Response
An identical mirror exists if immediate rollbacks are enforced.
```bash
git clone --mirror /home/obregan/Documents/nodl/rebrand_temp/ag_rebrand_backup.git && cd ag_rebrand_backup.git && git push --mirror git@github.com:Nodlshire/wnode.git
```

**Maintainer Note:** Please reach out to core ops if CI validation pipelines drop externally following this rebase deployment.
