# RAM Execution

## Overview
RAM‑only execution is a core architectural guarantee of the wnode network.  
It ensures that all job data, ephemeral keys, and intermediate results exist **only in volatile memory** and are destroyed automatically when execution ends.

RAM execution protects:

- Confidentiality,
- Forensic resistance,
- Node neutrality,
- Stateless retries,
- Safe node death.

This document defines the RAM execution model without repeating zero‑storage, scheduling, pricing, or governance details covered elsewhere.

---

# RAM Execution Principles

RAM execution is built on six immutable principles:

1. **All job data exists only in RAM.**
2. **All ephemeral keys exist only in RAM.**
3. **All intermediate results exist only in RAM.**
4. **All buffers are wiped immediately after use.**
5. **No swap or paging is allowed.**
6. **Execution is isolated per job.**

These principles are enforced by architecture, not policy.

---

# What RAM Execution Means

RAM execution means:

- Payloads are decrypted only in RAM,
- Ephemeral keys are generated and stored only in RAM,
- Intermediate results never touch disk,
- Temporary buffers never touch disk,
- Execution state is lost instantly on power loss or crash.

RAM execution ensures:

- No persistence,
- No recoverable traces,
- No long‑term exposure.

---

# Execution Flow

RAM execution follows a strict sequence:

1. **Receive encrypted chunks (RAM only)**
2. **Generate ephemeral keys (RAM only)**
3. **Decrypt chunks in RAM**
4. **Execute workload in RAM**
5. **Encrypt results in RAM**
6. **Send encrypted results**
7. **Zero all buffers**
8. **Destroy ephemeral keys**
9. **Return to idle state**

No step involves disk writes.

---

# Ephemeral Keys

Ephemeral keys:

- Are generated per job,
- Exist only in RAM,
- Are never written to disk,
- Are destroyed immediately after use,
- Cannot be recovered after node death.

Ephemeral keys ensure:

- Forward secrecy,
- Backward secrecy,
- Stateless retries,
- Confidentiality under compromise.

---

# Intermediate Results

Intermediate results:

- Exist only in RAM,
- Are never cached,
- Are never serialized,
- Are wiped immediately after use.

Nodes cannot:

- Store intermediate results,
- Reuse intermediate results,
- Leak intermediate results.

Intermediate results are as volatile as the job itself.

---

# Buffer Wiping

All buffers must be:

- Zeroed,
- Overwritten,
- Released back to the OS.

Buffer wiping ensures:

- No residual data,
- No forensic recovery,
- No memory scraping.

The steward verifies buffer wiping through compliance signals and behavioral analysis.

---

# No Swap or Paging

Nodes must:

- Disable swap,
- Disable paging,
- Prevent memory‑mapped files,
- Prevent disk‑backed buffers.

Swap usage is a **zero‑tolerance violation**.

If swap is detected:

- The node is suspended,
- The nodlr is notified,
- The violation is logged.

Swap breaks confidentiality and is constitutionally forbidden.

---

# Execution Isolation

Each job runs in an isolated RAM environment:

- No shared memory,
- No cross‑job buffers,
- No persistent state,
- No inter‑process leakage.

Isolation prevents:

- Cross‑job contamination,
- Memory snooping,
- Side‑channel leakage.

Isolation is enforced by the node runtime.

---

# RAM Execution and Retries

When a job retries:

- A new ephemeral key is generated,
- A new RAM environment is created,
- No previous state is reused,
- No buffers persist,
- No memory is shared.

Retries are stateless and safe.

---

# RAM Execution and Node Death

If a node dies:

- All RAM is lost,
- All ephemeral keys are lost,
- All job data is lost,
- All intermediate results are lost.

Node death is a confidentiality guarantee, not a failure mode.

---

# Steward Enforcement

The steward enforces RAM execution through:

- Compliance reports,
- Hardware fingerprint checks,
- Update enforcement,
- Randomized audits,
- Attestation verification (A+),
- Behavioral anomaly detection.

If RAM execution is violated:

- The node is suspended,
- The nodlr is notified,
- The violation is logged,
- The node must remediate before reactivation.

---

# RAM Execution and Confidentiality

RAM execution ensures:

- No plaintext persists,
- No encrypted data persists,
- No keys persist,
- No forensic recovery is possible,
- No long‑term exposure exists.

Even a compromised node cannot leak past jobs.

Confidentiality is preserved by architecture.

---

# Summary

RAM execution ensures:

- Volatile‑only job data,
- Volatile‑only keys,
- Volatile‑only intermediate results,
- Zero persistence,
- Safe node death,
- Stateless retries,
- Strong compliance,
- Confidentiality preservation.

RAM execution is a constitutional guarantee.
