-- BuildSmiths StarterKit - Initial Database Bootstrap
-- One-shot, idempotent setup for any Postgres (hosted or local).
-- Safe to re-run.

------------------------------------------------------------
-- 0. Extensions
------------------------------------------------------------
create extension if not exists pgcrypto; -- for gen_random_uuid()

------------------------------------------------------------
-- 1. Core Tables (align with lib/db/* and tests)
------------------------------------------------------------
-- Users (email/password auth)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);
create unique index if not exists users_email_lower_idx on public.users (lower(email));

-- Subscriptions (single row per user)
create table if not exists public.subscriptions (
  user_id uuid primary key references public.users(id) on delete cascade,
  tier text not null check (tier in ('free','premium')),
  status text not null check (status in ('active','canceled','none')),
  current_period_end timestamptz,
  cancellation_scheduled_at timestamptz,
  canceled_at timestamptz,
  updated_at timestamptz not null default now()
);
create index if not exists idx_subscriptions_status on public.subscriptions(status);

-- Audit events (append-only)
create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  ts timestamptz not null default now(),
  actor text,
  type text not null,
  payload jsonb,
  check (type <> '')
);
create index if not exists idx_audit_events_ts on public.audit_events(ts desc);
create index if not exists idx_audit_events_actor on public.audit_events(actor);
create index if not exists idx_audit_events_type on public.audit_events(type);

-- End of bootstrap
