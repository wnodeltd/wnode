# Wnode Protocol Constitution

## Sales Source Amendment
Wnode is a decentralized compute mesh where node operators (Nodlrs) act as the sales force. The 'Sales Source' logic ensures that if a Nodlr brings a client to the mesh, they are rewarded perpetually, even if their own hardware isn't used for that specific job.

### 6-Tier Revenue Distribution Model
All revenue entering the mesh is split atomically:
*   70% - Compute Provider (Nodlr)
*   10% - Sales Source (Perpetual Growth Agent)
*   3% - Level 1 Sponsor
*   7% - Level 2 Sponsor
*   3% - Founder
*   7% - Wnode Protocol (Platform & Infrastructure)

## Ambassador Intelligence Suite
The protocol provides a forensic engine for node operators to audit their Sales Source lineage.

### API Endpoint: `/api/v1/account/opportunity`
Returns a `GetOpportunityAudit` payload containing:
*   **Total Potential Yield**: `EarnedSalesCents` + `MissedComputeCents`.
*   **Capture Efficiency**: Percentage of invitee spend captured by the operator's own nodes.
*   **Expansion Insight**: Diagnostic analysis of missed monthly revenue.

### Categorization Heuristics
Missed Compute Share (70%) is categorized as follows:
*   **HARDWARE_GAP**: Request tier (e.g., GPU, TEE) does not match any online node owned by the Sales Source.
*   **CAPACITY_LIMIT**: Matching hardware exists, but current task load is at 100%.
*   **DOWNTIME**: Matching hardware exists, but node status is `Unhealthy` or `Offline` during the scheduling window.

## Priority Routing & Scheduling
The scheduler prioritizes nodes owned by the Sales Source of the submitting client.
1.  Identify `SalesSourceID` for the client.
2.  Filter active nodes owned by `SalesSourceID` for compatibility and health.
3.  Assign directly if match found (bypass auction).
4.  Fallback to general Mesh if no match within 50ms.
