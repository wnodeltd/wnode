# Economic Safeguards

## Overview
Economic safeguards are the constitutional and operational mechanisms that protect the integrity of the wnode network's financial flow. They prevent fraud, manipulation, and the exploitation of the community-owned mesh.

These safeguards are enforced by the steward through hardcoded logic in the ledger and compliance subsystems.

---

# 1. The 120-Day Compliance Hold

One of the most critical constitutional safeguards is the **120-Day Compliance Hold**.

- **Mechanism**: Every nodlr account, upon creation or significant modification, is subject to a 120-day "freeze guard."
- **Purpose**: This window allows the steward to verify the long-term integrity of the node operator, ensuring they are not utilizing stolen hardware, virtualized farms (violating 1M1N), or malicious runtimes.
- **Effect**: During this period, earnings accrue to the participant's balance but remain locked for withdrawal. Once the 120-day threshold is passed without compliance violations, the account is "graduated" to active status.

---

# 2. Constitutional Freeze Locks

The steward has the authority to "Freeze" an account if a high-confidence compliance violation is detected.

- **Non-Expropriation**: Freezing an account stops withdrawals and routing, but it does **not** allow the steward to claim the participant's accrued funds.
- **Audit-Ready**: Every freeze event is logged in the forensics ledger with a mandatory rationale.
- **Reversal**: A freeze can only be cleared if the compliance violation is remediated and verified by the steward.

---

# 3. Compliance Enforcement Protocols

The steward utilizes two hidden protocols to verify node integrity without infringing on confidentiality:

### Ghost Protocol (Shadow-Benching)
If a node is suspected of being a VM or part of a coordinated sybil attack:
- The steward continues to "route" jobs to the node.
- These jobs are **No-Op (No Operation)** WASM payloads that return immediately.
- The node operator sees "activity" but earns zero revenue, and the "results" never enter the production mesh.
- This prevents attackers from immediately knowing they have been detected.

### Honeypot (Timing Checks)
- The steward periodically inserts "Honeypot" tasks into the routing stream.
- These tasks have a known hardware execution signature (jitter, RTT, CPU cycle count).
- If the reported execution time varies significantly from the hardware baseline, the node is flagged for virtualization.

---

# 4. 1M1N Enforcement (One Machine One Node)

To prevent industrial-scale centralization and sybil attacks:
- The steward tracks the **Hardware DNA** of every connecting node.
- If multiple nodes report the same Hardware DNA, only the first node remains active; others are automatically flagged.
- This ensures that wnode remains a distributed network of real, physical machines rather than a virtualized cloud-on-cloud.

---

# 5. Economic Neutrality

The steward is constitutionally forbidden from:
- Reassigning accounts between founders.
- Merging founder trees.
- Manually overriding commission splits.
- Accessing user plaintext to influence pricing.

The steward is an operator, not an owner.

---

# Summary
Economic safeguards ensure that wnode is a safe, fair, and sustainable marketplace for compute. By combining long-term compliance holds with real-time hardware verification, the network protects the interests of all honest participants.
