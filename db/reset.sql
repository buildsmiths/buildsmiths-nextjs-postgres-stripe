-- Truncate core tables for local development/testing
truncate table public.webhook_events restart identity cascade;
truncate table public.audit_events restart identity cascade;
truncate table public.subscriptions restart identity cascade;
truncate table public.users restart identity cascade;
