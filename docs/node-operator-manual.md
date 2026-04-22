# Node Lifecycle

## Overview
Nodes are the core compute units of the wnode network. Each node is an independent machine operated by a community participant. Nodes connect to the steward operated backend, receive jobs, execute them entirely in RAM, and return results without storing any data. This document explains the complete lifecycle of a node from creation to retirement.

The node lifecycle is built on four principles:

- Immutable identity,
- RAM only execution,
- Stateless operation,
- Permissionless participation.

## Node Creation
A node begins when a user installs and runs the wnode client. During startup, the node:

1. Generates a local key pair,
2. Loads its Mesh Client ID from the user’s account,
3. Establishes a secure connection to the backend,
4. Advertises its available compute capacity.

Nodes do not require approval. Any user can create and run a node.

## Registration
When a node connects to the backend for the first time, it registers using:

- Its Mesh Client ID,
- Its public key,
- Its hardware profile,
- Its available RAM and CPU,
- Its network latency.

The backend stores only operational metadata. No sensitive data is stored.

Registration allows the backend to:

- Authenticate the node,
- Route jobs to it,
- Track uptime and performance,
- Attribute revenue correctly.

## Authentication
Nodes authenticate using:

- TLS encrypted connections,
- Their Mesh Client ID,
- Their public key.

Authentication ensures:

- Only valid nodes receive jobs,
- Nodes cannot impersonate each other,
- Revenue attribution is accurate.

Identity is immutable and cannot be reassigned.

## Heartbeats
Nodes send periodic heartbeats to the backend. A heartbeat includes:

- Node status,
- Available capacity,
- Current workload,
- Health indicators.

If a node stops sending heartbeats, it is marked offline and removed from the job pool.

Heartbeats do not contain job data.

## Job Assignment
When a job is available, the backend selects a node based on:

- Availability,
- Capacity,
- Fairness rules,
- Latency,
- Historical reliability.

The backend sends a job header to the node. The header contains:

- Job ID,
- Resource requirements,
- Expected runtime,
- Stream initiation details.

The node accepts or rejects the job based on its current load.

## Job Streaming
Once a node accepts a job, the backend begins streaming the encrypted payload.

The node:

1. Receives encrypted chunks directly into RAM,
2. Decrypts each chunk using ephemeral XOR keys,
3. Assembles the job payload in RAM,
4. Begins execution immediately.

The node never writes job data to disk.

## Execution
Nodes execute jobs entirely in RAM. During execution:

- No data is stored,
- No intermediate state is written to disk,
- No results are retained after completion.

Execution is isolated within the node’s memory space.

If the job is too large to fit in RAM, the node rejects it.

## Result Streaming
After execution, the node:

1. Produces results in RAM,
2. Encrypts each result chunk,
3. Streams the encrypted chunks to the backend,
4. Discards each chunk after sending.

The backend forwards results to the requester using the same streaming pattern.

## Revenue Attribution
When a job completes, the backend:

- Records the node’s contribution,
- Calculates earnings based on compute provided,
- Attributes revenue to the node’s Mesh Client ID,
- Updates the operator’s dashboard.

Revenue is tied to identity, not hardware.

## Node Updates
Nodes periodically receive:

- Client updates,
- Security patches,
- Performance improvements.

Updates are optional but recommended. Nodes that fall behind may be excluded from job routing for safety.

Updates never include job data.

## Node Failure
If a node fails during execution:

- The job is marked incomplete,
- The requester may resubmit the sub job,
- The backend routes it to a new node,
- No partial data is retained by the failed node.

Failure does not compromise security or privacy.

## Node Retirement
A node can be retired at any time by:

- Shutting down the client,
- Uninstalling the software,
- Removing the machine from service.

When a node retires:

- It stops sending heartbeats,
- It is removed from the job pool,
- It retains no data,
- Its Mesh Client ID remains valid for future nodes.

Identity belongs to the user, not the hardware.

## Summary
The node lifecycle guarantees:

- Immutable identity,
- Secure registration,
- Encrypted communication,
- RAM only execution,
- Zero storage,
- Stateless operation,
- Permissionless participation,
- Safe retirement.

Nodes are the foundation of the decentralized compute Mesh. Their lifecycle is designed to be simple, secure, and aligned with the network’s zero storage and privacy guarantees.
