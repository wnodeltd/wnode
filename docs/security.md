# Security Model

## Overview
The wnode network is designed with a security model that prioritizes privacy, safety, and minimal data exposure. The architecture eliminates entire classes of risk by ensuring that job payloads are never stored, never retained, and never written to disk. The steward operated backend acts only as a router, while nodes execute compute entirely in RAM. This document explains the security principles, mechanisms, and guarantees that protect the network and its participants.

The security model is built on four core foundations:

- Zero storage of job data,
- RAM only compute execution,
- Encrypted communication across all channels,
- Immutable identity through Mesh Client IDs.

## Zero Storage Principle
The network is designed so that no component stores job payloads, user data, or compute results. This applies to:

- The backend,
- The nodes,
- The portals,
- The API layer.

All job data is processed as a stream and held only in RAM for the duration of execution. No disk writes occur at any stage.

This eliminates:

- Data retention risk,
- GDPR and privacy liabilities,
- Forensic recoverability,
- Long term exposure of sensitive information.

Zero storage is the foundation of the network’s security posture.

## RAM Only Execution
Nodes execute all jobs entirely in RAM. The backend never holds the full payload in memory. Instead, it handles small streaming buffers that are immediately discarded.

The RAM only model ensures:

- No persistent data,
- No disk level compromise,
- No long term exposure,
- No accidental retention.

Once a job completes, all memory buffers on both the backend and the node are wiped.

## Streaming Based Data Flow
The network uses a streaming pipeline for all job payloads. The backend acts as a router, not a storage system.

The streaming flow works as follows:

1. A job is submitted as an HTTP stream,
2. The backend reads a small chunk into RAM,
3. The chunk is encrypted using ephemeral XOR keys,
4. The encrypted chunk is forwarded to the selected node,
5. The backend discards the chunk,
6. The node receives the stream directly into RAM,
7. The node decrypts and executes the job,
8. Results are streamed back using the same pattern.

At no point is the full payload held by the backend. Only the executing node ever holds the complete job in RAM.

## Ephemeral Encryption
All job payloads are encrypted using ephemeral XOR based keys during transit between backend and node. These keys:

- Are generated per job,
- Are never stored,
- Are discarded immediately after use,
- Cannot be reused or recovered.

This ensures that even if a stream were intercepted, the payload would be unreadable.

## Encrypted Communication
All communication between:

- Backend and nodes,
- Backend and portals,
- Nodes and backend,
- Users and backend,

is encrypted using TLS.

This prevents:

- Man in the middle attacks,
- Packet inspection,
- Payload tampering,
- Unauthorized access.

Encryption is mandatory across the entire network.

## Immutable Identity
Every node and account is identified by a Mesh Client ID. This ID is:

- Immutable,
- Globally unique,
- Sequentially generated,
- Human readable.

The Mesh Client ID is used for:

- Authentication,
- Node registration,
- Revenue attribution,
- Affiliate tree relationships.

Identity cannot be forged or reassigned.

## Attack Surface Minimization
The architecture minimizes attack surface by design:

- No storage means no data to steal,
- RAM only execution eliminates disk level compromise,
- Streaming eliminates large memory buffers,
- Ephemeral encryption eliminates key retention,
- Immutable IDs eliminate identity spoofing,
- Stateless backend job handling reduces exposure,
- Portals store no sensitive data.

The system is intentionally simple to reduce complexity based vulnerabilities.

## Backend Isolation
The backend is isolated from job payloads. It does not:

- Store payloads,
- Retain payloads,
- Execute payloads,
- Inspect payloads.

It only routes encrypted chunks to nodes. This separation ensures that the steward cannot access user data and does not inherit data liability.

## Node Isolation
Nodes execute jobs in isolated RAM environments. They do not:

- Store job data,
- Write to disk,
- Retain results,
- Access other nodes.

Each job is sandboxed within the node’s memory space. Once execution completes, all buffers are wiped.

## Portal Safety
The portals:

- cmd.wnode.one
- mesh.wnode.one
- nodlr.wnode.one
- wnode.one

do not store sensitive data. They rely entirely on the backend API for:

- Authentication,
- Account data,
- Node status,
- Revenue information.

Portals are presentation layers, not data stores.

## Steward Limitations
The steward:

- Cannot access job payloads,
- Cannot decrypt job data,
- Cannot inspect compute,
- Cannot store user data,
- Cannot override node isolation.

The steward operates the network, but does not have access to the data flowing through it.

## Summary of Guarantees
The security model guarantees:

- Zero storage of job data,
- RAM only execution,
- Streaming based data flow,
- Ephemeral encryption,
- Encrypted communication,
- Immutable identity,
- Minimal attack surface,
- Steward isolation,
- Node isolation,
- Portal safety.

The result is a secure, privacy preserving, community owned compute network with no central data exposure.
