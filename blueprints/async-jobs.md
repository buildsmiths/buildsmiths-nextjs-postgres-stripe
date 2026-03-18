# Spec: Asynchronous Jobs (Postgres-backed)

## Goal
Implement a robust, generic async job queue reliant purely on the existing Postgres database to execute long-running tasks without blocking request loops.

## Architecture Decisions
- Schema: Create a `jobs` backend table with columns for `id`, `type`, `payload`, `status`, `created_at`, `started_at`, `completed_at`, and `errors`.
- Producer: Create `lib/jobs/enqueue.ts` to expose an enqueue method for application logic.
- Consumer: Build a long-running worker process script in `scripts/worker.ts` that safely polls for unresolved tasks.
- Avoid external queue dependencies like Redis or RabbitMQ.

## Constraints & Rules
- Concurrency Safety: The worker must absolutely use Postgres' `UPDATE ... RETURNING ...` accompanied by the `SKIP LOCKED` clause to manage concurrency across potential multiple simultaneous worker processes.
- Do NOT bring in large ORMs or outside queueing packages. Stick to simple queries through `pg`.
- Ensure jobs expose clear idempotency, gracefully handling repeats if a worker faults.
- Jobs generating failures must accurately route into a `failed` status and record their error trace.

## Acceptance Criteria
- [ ] Schema successfully persists abstract jobs using standard JSON payloads.
- [ ] `enqueueJob` successfully stores tasks pending execution.
- [ ] `worker.ts` successfully pulls tasks singly, locking them adequately via `SKIP LOCKED`.
- [ ] Completed jobs successfully transition to finished states, tracking timestamps.
