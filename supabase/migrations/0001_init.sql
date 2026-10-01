-- Naqa initial schema. Row Level Security is on for every table.
-- Catalog tables (products, stores) are public-read. User tables are owner-only.

create table public.products (
  id text primary key,
  kind text not null check (kind in ('detergent','softener','stain_remover','delicate_wash','wool_wash')),
  name_ar text not null,
  name_en text not null,
  for_fabrics text[] not null default '{}',
  is_sample boolean not null default true
);

create table public.stores (
  id text primary key,
  name_ar text not null,
  name_en text not null,
  country_code text not null,
  city_id text not null,
  lat double precision not null,
  lng double precision not null,
  is_sample boolean not null default true
);

create table public.store_products (
  store_id text not null references public.stores(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  primary key (store_id, product_id)
);

create table public.machines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  brand text,
  model text,
  photo_path text,
  created_at timestamptz not null default now()
);

create table public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  machine_id uuid references public.machines(id) on delete set null,
  fabric text not null,
  confidence real not null check (confidence between 0 and 1),
  care_symbols text[] not null default '{}',
  recommendation jsonb not null,
  created_at timestamptz not null default now()
);

create index analyses_user_created on public.analyses (user_id, created_at desc);
create index stores_city on public.stores (country_code, city_id);

alter table public.products enable row level security;
alter table public.stores enable row level security;
alter table public.store_products enable row level security;
alter table public.machines enable row level security;
alter table public.analyses enable row level security;

create policy "catalog is public" on public.products for select using (true);
create policy "stores are public" on public.stores for select using (true);
create policy "store products are public" on public.store_products for select using (true);

create policy "own machines" on public.machines
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own analyses" on public.analyses
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
