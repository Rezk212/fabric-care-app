-- Offers shown in the home-screen slider. Everyone can read live offers; only the dashboard
-- (Supabase Table Editor / service role) can add or change them, so there are no write policies.

create table public.offers (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('washer', 'dryer', 'detergent', 'softener')),
  title_ar text not null,
  title_en text not null,
  subtitle_ar text,
  subtitle_en text,
  badge_ar text,
  badge_en text,
  advertiser text,
  link_url text check (link_url is null or link_url ~ '^https://'),
  starts_at timestamptz,
  ends_at timestamptz,
  sort int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.offers enable row level security;
create policy "read live offers" on public.offers for select
  using (active and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at > now()));
