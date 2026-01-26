# Blueprint: Asynchronous Jobs (Postgres-backed)

**Goal**: Implement a reliable, zero-dependency async job queue using the existing Postgres database.

## 1. Objectives
- Offload long-running tasks (e.g., sending emails, generating reports) from the request loop.
- Persist jobs to survive server restarts.
- Provide simple retry logic.

## 2. dependencies
- `pg` (Existing)
- No Redis required.

## 3. Architecture
- **Schema**: `jobs` table (id, type, payload, status, created_at, started_at, completed_at, errors).
- **Producer**: `lib/jobs/enqueue.ts` - Function to insert a row.
- **Consumer**: `scripts/worker.ts` - A long-running process that polls the `jobs` table for `status = 'pending'`.

## 4. Requirements
- **Atomic Locking**: The worker must use `UPDATE ... RETURNING ...` with `SKIP LOCKED` (Postgres specific) to ensure concurrency safety if we run multiple workers.
    - Query: `UPDATE jobs SET status = 'processing', started_at = NOW() WHERE id = (SELECT id FROM jobs WHERE status = 'pending' ORDER BY created_at ASC LIMIT 1 FOR UPDATE SKIP LOCKED) RETURNING *`.
- **Idempotency**: Jobs should be designed to be idempotent if possible.
- **Error Handling**: Failed jobs should move to `failed` status with an error message.

## 5. Implementation Prompt
> "Implement the Async Jobs Blueprint. Create a migration SQL file `db/migrations/001_jobs.sql`. Create `lib/jobs/client.ts` with an `enqueueJob(type, payload)` function. Create a `worker` script `scripts/worker.ts` that loops infinitely (with sleep) polling for pending jobs using `SKIP LOCKED`. Implement a sample job handler 'SEND_WELCOME_EMAIL'."

## 6. Constraints
- Polling interval: 1-5 seconds.
- Keep the worker simple (single file if possible, or `lib/jobs/worker.ts` driven by script).
