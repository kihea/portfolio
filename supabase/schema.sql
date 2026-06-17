-- ============================================================================
-- Divine Ipseity — initial schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- Safe to re-run (idempotent).
-- ============================================================================

-- ── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── profiles ────────────────────────────────────────────────────────────────
-- One row per auth.users row, keyed by the same uuid. Stores display info
-- and is the foreign-key target for comments. Membership status is computed
-- from `subscriptions` (see has_active_membership() below) — never store it
-- on the profile, so it can't drift out of sync with Stripe.
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at   timestamptz not null default now()
);

-- Auto-create a profile row when a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── subscriptions ───────────────────────────────────────────────────────────
-- One row per Stripe subscription. Server-only writes (Stripe webhook uses
-- the service role key); clients can read their own row.
create table if not exists public.subscriptions (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid not null references public.profiles(id) on delete cascade,
  stripe_customer_id      text not null,
  stripe_subscription_id  text not null unique,
  status                  text not null check (
    status in ('trialing','active','past_due','canceled','unpaid','incomplete','incomplete_expired','paused')
  ),
  current_period_end      timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);

-- ── tips ────────────────────────────────────────────────────────────────────
-- Single one-time payments (no subscription required). user_id is nullable
-- so anonymous tips work. Server-only writes via the Stripe webhook.
create table if not exists public.tips (
  id                       uuid primary key default uuid_generate_v4(),
  user_id                  uuid references public.profiles(id) on delete set null,
  stripe_payment_intent_id text not null unique,
  amount_cents             integer not null check (amount_cents > 0),
  currency                 text not null default 'usd',
  created_at               timestamptz not null default now()
);

-- ── comments ────────────────────────────────────────────────────────────────
-- Flat (non-threaded) for v1. Member-gated via RLS — only Faction members
-- can insert. Anyone can read. Authors can edit/delete their own.
create table if not exists public.comments (
  id          uuid primary key default uuid_generate_v4(),
  essay_slug  text not null,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  body        text not null check (length(body) between 1 and 4000),
  is_edited   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists comments_essay_slug_idx
  on public.comments(essay_slug, created_at desc);

-- Bump updated_at + flip is_edited on UPDATE.
create or replace function public.touch_comment()
returns trigger
language plpgsql
as $$
begin
  if new.body is distinct from old.body then
    new.is_edited := true;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists comments_touch on public.comments;
create trigger comments_touch
  before update on public.comments
  for each row execute function public.touch_comment();

-- ── membership helper ───────────────────────────────────────────────────────
-- True if the calling user has an active or trialing subscription right now.
-- Used by RLS to gate comment inserts.
create or replace function public.has_active_membership(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.subscriptions s
    where s.user_id = uid
      and s.status in ('active','trialing')
      and (s.current_period_end is null or s.current_period_end > now())
  );
$$;

-- ── Row Level Security ──────────────────────────────────────────────────────
alter table public.profiles      enable row level security;
alter table public.subscriptions enable row level security;
alter table public.tips          enable row level security;
alter table public.comments      enable row level security;

-- profiles: anyone can read display_name; users can update their own row.
drop policy if exists "profiles read all"         on public.profiles;
drop policy if exists "profiles update own"       on public.profiles;
create policy "profiles read all"
  on public.profiles for select using (true);
create policy "profiles update own"
  on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- subscriptions: a user can read their own; writes are service-role only.
drop policy if exists "subscriptions read own" on public.subscriptions;
create policy "subscriptions read own"
  on public.subscriptions for select using (auth.uid() = user_id);

-- tips: a user can read their own; writes are service-role only.
drop policy if exists "tips read own" on public.tips;
create policy "tips read own"
  on public.tips for select using (auth.uid() = user_id);

-- comments:
--   read: everyone
--   insert: only active members, only as themselves
--   update / delete: only the author
drop policy if exists "comments read all"     on public.comments;
drop policy if exists "comments insert member" on public.comments;
drop policy if exists "comments update own"    on public.comments;
drop policy if exists "comments delete own"    on public.comments;

create policy "comments read all"
  on public.comments for select using (true);

create policy "comments insert member"
  on public.comments for insert
  with check (
    auth.uid() = user_id
    and public.has_active_membership(auth.uid())
  );

create policy "comments update own"
  on public.comments for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "comments delete own"
  on public.comments for delete
  using (auth.uid() = user_id);

-- ── course_completions ────────────────────────────────────────────────────────
-- Tracks which modules a user has marked complete.
CREATE TABLE IF NOT EXISTS public.course_completions (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_slug  text        NOT NULL,
  module_slug  text        NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT course_completions_unique UNIQUE (user_id, course_slug, module_slug)
);

CREATE INDEX IF NOT EXISTS course_completions_user_course_idx
  ON public.course_completions (user_id, course_slug);

ALTER TABLE public.course_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users manage own completions" ON public.course_completions;
CREATE POLICY "users manage own completions"
  ON public.course_completions FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── course_access_grants ──────────────────────────────────────────────────────
-- Permanent access grants to member-tier courses.
-- Written by the Stripe webhook (service-role) when a subscription becomes active.
-- Former members retain grants after subscription ends — they keep the courses
-- that existed during their paid period.
CREATE TABLE IF NOT EXISTS public.course_access_grants (
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_slug text NOT NULL,
  granted_at  timestamptz NOT NULL DEFAULT now(),
  granted_via uuid        REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  PRIMARY KEY (user_id, course_slug)
);

CREATE INDEX IF NOT EXISTS course_access_grants_user_idx
  ON public.course_access_grants (user_id);

ALTER TABLE public.course_access_grants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users read own grants" ON public.course_access_grants;
CREATE POLICY "users read own grants"
  ON public.course_access_grants FOR SELECT
  USING (auth.uid() = user_id);
-- INSERT / UPDATE are service-role only (Stripe webhook). No INSERT policy for authenticated.
