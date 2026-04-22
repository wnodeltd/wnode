# Node Performance and Health

## Overview
Node performance and health determine how effectively a node participates in the wnode network. Nodes that are stable, reliable, and responsive receive more jobs and earn more revenue. This document explains how node performance is measured, how health is tracked, and how operators can maintain high quality nodes.

The performance model is built on four principles:

- Reliability,
- Responsiveness,
- Capacity,
- Uptime.

## Performance Metrics
The network evaluates nodes using several key metrics:

### Uptime
Measures how consistently the node stays online.

- High uptime → more jobs
- Low uptime → fewer jobs

### Latency
Measures how quickly the node responds to backend requests.

- Lower latency → higher priority
- Excessive latency → reduced routing

### RAM Availability
Nodes must have enough RAM to execute jobs entirely in memory.

- More available RAM → larger jobs
- Insufficient RAM → job rejection

### CPU Capacity
Determines how quickly a node can process compute workloads.

- Higher CPU → faster job completion
- Slow CPU → fewer assignments

### Reliability Score
A composite score based on:

- Successful job completions
- Failure rate
- Heartbeat consistency
- Update compliance

Nodes with higher reliability receive more jobs.

## Heartbeats and Health Checks
Nodes send periodic heartbeats to the backend. Each heartbeat includes:

- Current load,
- Available RAM,
- CPU usage,
- Network latency,
- Health indicators.

If heartbeats stop:

- The node is marked offline,
- It is removed from the job pool,
- No jobs are routed to it.

Heartbeats contain no job data.

## Job Completion Rate
Nodes are evaluated based on how often they successfully complete jobs.

### Successful Completion
A job is considered successful when:

- The node receives the full payload,
- Executes it in RAM,
- Streams results back,
- Discards all data.

### Failed Completion
A job fails if:

- The node crashes,
- The machine loses power,
- The network disconnects,
- The node runs out of RAM.

Failed jobs reduce the node’s reliability score.

## Update Compliance
Nodes must stay reasonably up to date.

- Critical security updates are mandatory
- Performance updates are recommended
- Nodes far behind may be excluded from routing

Updates never contain job data.

## How Performance Affects Revenue
Revenue is tied to:

- Jobs completed,
- Compute provided,
- Reliability,
- Uptime.

High performance nodes:

- Receive more jobs,
- Earn more revenue,
- Are prioritized in routing.

Low performance nodes:

- Receive fewer jobs,
- Earn less revenue,
- May be temporarily deprioritized.

## Optimizing Node Performance
Operators can improve performance by:

- Using wired internet instead of WiFi,
- Ensuring stable power,
- Keeping machines cool,
- Avoiding background CPU heavy tasks,
- Maintaining sufficient free RAM,
- Applying updates promptly.

These optimizations directly increase revenue.

## Handling Node Failures
If a node fails:

- The job is marked incomplete,
- The requester may resubmit,
- The backend routes the job to another node,
- The failed node retains no data.

Operators should:

- Restart the client,
- Check hardware health,
- Ensure stable connectivity.

Failures do not compromise security.

## Performance Transparency
Operators can view:

- Node uptime,
- Job history,
- Earnings,
- Reliability score,
- Performance metrics,
- Update status.

This information appears in the Mesh and Nodlr portals.

## Summary
Node performance and health determine how effectively a node participates in the Mesh. High performance nodes receive more jobs and earn more revenue. The performance model ensures:

- Reliability,
- Fairness,
- Predictability,
- Security,
- Accurate resource utilization.

Operators who maintain healthy nodes maximize their earnings and strengthen the network.
