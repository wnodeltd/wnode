# One Machine One Node Policy

## Overview
The wnode network enforces a strict one machine one node policy. This rule ensures that each physical machine can operate only a single node instance at any given time. The policy protects identity integrity, revenue attribution, security isolation, and the fairness of the decentralized compute Mesh.

This policy does not limit how many nodes a nodlr can operate. A nodlr may run as many nodes as they want, as long as each node runs on its own machine.

The policy is built on three principles:

- One physical machine equals one node,
- One node equals one identity,
- One identity equals one revenue stream.

## What the Policy Means

### Allowed
A nodlr can operate unlimited nodes by using multiple machines:

- 1 laptop → 1 node
- 1 desktop → 1 node
- 1 server → 1 node
- 1 cloud instance → 1 node
- 10 machines → 10 nodes
- 1,000 machines → 1,000 nodes

There is no limit on how many nodes a nodlr can run. The limit applies only to machines, not people.

### Not Allowed
A single machine cannot run:

- Multiple nodes,
- Multiple identities,
- Multiple instances of the wnode client,
- Containerized duplicates,
- Virtualized duplicates on the same hardware.

One machine equals one node.

## Purpose of the Policy

### Identity Integrity
Each node is tied to a single Mesh Client ID. Allowing multiple nodes per machine would break identity mapping and create attribution conflicts.

### Revenue Fairness
Revenue is calculated per node. Running multiple nodes on one machine would artificially inflate earnings and distort the economic model.

### Security Isolation
Nodes execute jobs in RAM. Multiple nodes on one machine would create memory overlap risks and compromise isolation guarantees.

### Hardware Transparency
The Mesh relies on accurate reporting of RAM, CPU, and network capacity. Multiple nodes on one machine would misrepresent available resources.

## Enforcement
The wnode client enforces the one machine one node rule through:

- Hardware fingerprinting,
- Process locking,
- Identity binding,
- Runtime checks.

If a second node instance is launched on the same machine:

- The new instance is rejected,
- The existing instance remains active,
- No compute is routed to the duplicate instance.

## Virtual Machines and Cloud Instances
A virtual machine counts as a machine only if:

- It is a fully isolated cloud instance,
- It has dedicated hardware allocation,
- It behaves as an independent machine.

Even then, each VM can run only one node.

## Summary
The one machine one node policy guarantees:

- Identity integrity,
- Revenue fairness,
- Security isolation,
- Accurate resource reporting,
- Protection against fraud,
- Preservation of the Mesh’s economic model.

A nodlr can run unlimited nodes. Each node must run on its own machine.
