// Package jobs defines the core Job data model, status lifecycle,
// and the Dispatcher that fans out job slices to the mesh.
package jobs

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"
)

// JobStatus represents the lifecycle state of a compute job.
type JobStatus string

const (
	StatusPending  JobStatus = "pending"
	StatusActive   JobStatus = "active"
	StatusComplete JobStatus = "complete"
	StatusFailed   JobStatus = "failed"
)

// Assignment records which peer received which slice of a Job.
type Assignment struct {
	PeerID     string
	SliceIndex int
	AssignedAt time.Time
}

// Job is the core unit of compute work on the Nodl mesh.
type Job struct {
	ID           string
	WASMPayload  []byte
	Budget       float64   // USD
	TargetCycles int64
	Status       JobStatus
	Assignments  []Assignment
	ProofCount   int       // number of verified Proof-of-Work receipts received
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

// Store is a thread-safe in-memory job registry.
type Store struct {
	mu   sync.RWMutex
	jobs map[string]*Job
}

// NewStore returns an empty job store.
func NewStore() *Store {
	return &Store{jobs: make(map[string]*Job)}
}

// Add inserts a new Job and returns its ID.
func (s *Store) Add(job *Job) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.jobs[job.ID] = job
}

// Get retrieves a Job by ID. Returns nil if not found.
func (s *Store) Get(id string) *Job {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.jobs[id]
}

// List returns a snapshot of all jobs (copy, safe to iterate).
func (s *Store) List() []*Job {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]*Job, 0, len(s.jobs))
	for _, j := range s.jobs {
		out = append(out, j)
	}
	return out
}

// UpdateStatus transitions a job to the given status.
func (s *Store) UpdateStatus(id string, status JobStatus) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	j, ok := s.jobs[id]
	if !ok {
		return fmt.Errorf("job %q not found", id)
	}
	j.Status = status
	j.UpdatedAt = time.Now()
	return nil
}

// Dispatcher submits jobs to the mesh and collects proof receipts.
// In Phase 1 this is an in-process stub; real peer fan-out is Phase 2.
type Dispatcher struct {
	store *Store
	log   *zap.Logger

	// proofCh receives proof-of-work receipts from the WASM runner or peers
	proofCh chan ProofReceipt
}

// ProofReceipt is a minimal receipt linking a job ID to a verified computation.
type ProofReceipt struct {
	JobID      string
	NodeID     string
	OutputHash string
}

// NewDispatcher creates a Dispatcher backed by the given Store.
func NewDispatcher(store *Store, log *zap.Logger) *Dispatcher {
	return &Dispatcher{
		store:   store,
		log:     log,
		proofCh: make(chan ProofReceipt, 256),
	}
}

// Submit creates a Job entry and marks it active.
// In Phase 1 the job is run locally; Phase 2 fans out to peers via pubsub.
func (d *Dispatcher) Submit(ctx context.Context, wasm []byte, budget float64, targetCycles int64) (*Job, error) {
	job := &Job{
		ID:           uuid.New().String(),
		WASMPayload:  wasm,
		Budget:       budget,
		TargetCycles: targetCycles,
		Status:       StatusPending,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	d.store.Add(job)
	d.log.Info("job submitted", zap.String("jobID", job.ID), zap.Float64("budget", budget))

	// Transition to active immediately (local execution stub)
	if err := d.store.UpdateStatus(job.ID, StatusActive); err != nil {
		return nil, err
	}

	return job, nil
}

// RecordProof accepts a Proof-of-Work receipt and updates job state.
// When sufficient proofs accumulate the job is marked complete.
func (d *Dispatcher) RecordProof(receipt ProofReceipt) error {
	j := d.store.Get(receipt.JobID)
	if j == nil {
		return fmt.Errorf("unknown job %q", receipt.JobID)
	}

	// Thread-safe increment via store lock
	d.store.mu.Lock()
	j.ProofCount++
	updated := j.ProofCount
	d.store.mu.Unlock()

	d.log.Info("proof received",
		zap.String("jobID", receipt.JobID),
		zap.String("nodeID", receipt.NodeID),
		zap.Int("proofCount", updated),
	)

	// Phase 1: mark complete after first proof (single-node)
	if updated >= 1 {
		return d.store.UpdateStatus(receipt.JobID, StatusComplete)
	}
	return nil
}

// ProofChannel returns the channel to push receipts into from external runners.
func (d *Dispatcher) ProofChannel() chan<- ProofReceipt {
	return d.proofCh
}

// Run consumes from the proof channel until ctx is cancelled.
func (d *Dispatcher) Run(ctx context.Context) {
	d.log.Info("dispatcher running")
	for {
		select {
		case <-ctx.Done():
			d.log.Info("dispatcher shutting down")
			return
		case receipt := <-d.proofCh:
			if err := d.RecordProof(receipt); err != nil {
				d.log.Warn("proof record error", zap.Error(err))
			}
		}
	}
}
