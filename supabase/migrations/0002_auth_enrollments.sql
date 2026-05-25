-- =====================================================================
-- Aspire Academy Mizo — Phase 4 (Auth + Enrollments)
--
-- Adds:
--   1. profiles          — extends auth.users (full_name, phone)
--   2. enrollments       — paid course enrollments tied to auth.users
--   3. payment_events    — append-only audit log of Razorpay webhook events
--
-- Auth runs over auth.users (Supabase manages it). A trigger auto-creates a
-- profiles row whenever a new auth user signs up.
--
-- Enrollment writes flow through the Razorpay /verify + /webhook routes
-- using the service-role key. RLS gives authenticated users read access to
-- THEIR OWN rows only — they can never see another student's enrollments.
-- =====================================================================

-- ---------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_self" on public.profiles;
create policy "profiles_select_self"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile row when a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- enrollments
-- ---------------------------------------------------------------------
create table if not exists public.enrollments (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  course_slug           text not null,
  course_name           text not null,
  amount_paise          integer not null check (amount_paise > 0),
  currency              text not null default 'INR',
  status                text not null default 'pending'
                          check (status in ('pending','active','failed','refunded')),
  razorpay_order_id     text not null unique,
  razorpay_payment_id   text,
  razorpay_signature    text,
  receipt               text,
  notes                 jsonb,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  verified_at           timestamptz
);

create index if not exists enrollments_user_id_idx
  on public.enrollments (user_id, created_at desc);

create index if not exists enrollments_course_slug_idx
  on public.enrollments (course_slug);

create index if not exists enrollments_status_idx
  on public.enrollments (status, created_at desc);

create index if not exists enrollments_payment_id_idx
  on public.enrollments (razorpay_payment_id);

alter table public.enrollments enable row level security;

drop policy if exists "enrollments_select_self" on public.enrollments;
create policy "enrollments_select_self"
  on public.enrollments for select
  to authenticated
  using (user_id = auth.uid());

-- INSERT / UPDATE / DELETE only via service-role key (RLS bypass).

drop trigger if exists trg_enrollments_updated_at on public.enrollments;
create trigger trg_enrollments_updated_at
  before update on public.enrollments
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- payment_events (audit log)
-- ---------------------------------------------------------------------
create table if not exists public.payment_events (
  id                    uuid primary key default gen_random_uuid(),
  event_id              text unique,        -- Razorpay event id (for dedup)
  event_type            text not null,      -- e.g. 'payment.captured'
  razorpay_order_id     text,
  razorpay_payment_id   text,
  payload               jsonb not null,
  created_at            timestamptz not null default now()
);

create index if not exists payment_events_order_idx
  on public.payment_events (razorpay_order_id);

create index if not exists payment_events_payment_idx
  on public.payment_events (razorpay_payment_id);

alter table public.payment_events enable row level security;
-- No policies => no public access. Service role only.
