-- =====================================================================
-- Aspire Academy Mizo — initial schema (Phase 2)
--
-- Tables for public website forms:
--   1. newsletter_subscribers — email list
--   2. lead_submissions       — contact-form enquiries
--
-- All writes go through the Supabase service-role key from our Next.js
-- server actions. RLS is enabled with NO public policies — public
-- (anon / authenticated) clients can never read or write these tables.
-- =====================================================================

-- Required for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- newsletter_subscribers
-- ---------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  source      text default 'homepage-newsletter',
  ip          text,
  user_agent  text,
  status      text not null default 'subscribed'
                check (status in ('subscribed', 'unsubscribed', 'bounced')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create unique index if not exists newsletter_subscribers_email_unique_idx
  on public.newsletter_subscribers (lower(email));

create index if not exists newsletter_subscribers_created_at_idx
  on public.newsletter_subscribers (created_at desc);

alter table public.newsletter_subscribers enable row level security;
-- No policies = no access for anon / authenticated. Service role bypasses RLS.

-- ---------------------------------------------------------------------
-- lead_submissions
-- ---------------------------------------------------------------------
create table if not exists public.lead_submissions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text not null,
  email       text not null,
  course      text
                check (course in ('foundation', 'combined', 'crash', 'counselling', 'other')),
  message     text,
  ip          text,
  user_agent  text,
  status      text not null default 'new'
                check (status in ('new', 'contacted', 'enrolled', 'lost', 'spam')),
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists lead_submissions_status_idx
  on public.lead_submissions (status, created_at desc);

create index if not exists lead_submissions_email_idx
  on public.lead_submissions (lower(email));

alter table public.lead_submissions enable row level security;

-- ---------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_newsletter_updated_at on public.newsletter_subscribers;
create trigger trg_newsletter_updated_at
  before update on public.newsletter_subscribers
  for each row execute function public.set_updated_at();

drop trigger if exists trg_lead_updated_at on public.lead_submissions;
create trigger trg_lead_updated_at
  before update on public.lead_submissions
  for each row execute function public.set_updated_at();
