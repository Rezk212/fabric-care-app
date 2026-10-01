-- Daily usage limits (free plan now, paid plan later) and sponsored catalog flags.

alter table public.products add column is_sponsored boolean not null default false;
alter table public.stores add column is_sponsored boolean not null default false;

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'plus')),
  created_at timestamptz not null default now()
);

create table public.usage_daily (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  analyses int not null default 0 check (analyses >= 0),
  primary key (user_id, day)
);

alter table public.profiles enable row level security;
alter table public.usage_daily enable row level security;
create policy "read own profile" on public.profiles for select using (user_id = auth.uid());
create policy "read own usage" on public.usage_daily for select using (user_id = auth.uid());
-- No insert/update policies: only the service-role functions below can write, so users cannot reset
-- their own counter or promote themselves to the paid plan.

-- Quota days follow Oman time.
create function public.quota_day() returns date language sql stable as $$
  select (now() at time zone 'Asia/Muscat')::date
$$;

create function public.peek_usage(uid uuid, free_limit int, plus_limit int)
returns json language plpgsql security definer set search_path = public as $$
declare p text; lim int; used int;
begin
  select plan into p from profiles where user_id = uid;
  p := coalesce(p, 'free');
  lim := case when p = 'plus' then plus_limit else free_limit end;
  select analyses into used from usage_daily where user_id = uid and day = quota_day();
  return json_build_object('used', coalesce(used, 0), 'limit', lim, 'plan', p);
end $$;

-- Atomically takes one analysis from today's allowance. allowed=false when the limit is reached.
create function public.consume_analysis(uid uuid, free_limit int, plus_limit int)
returns json language plpgsql security definer set search_path = public as $$
declare p text; lim int; used int;
begin
  insert into profiles(user_id) values (uid) on conflict do nothing;
  select plan into p from profiles where user_id = uid;
  lim := case when p = 'plus' then plus_limit else free_limit end;
  insert into usage_daily(user_id, day, analyses) values (uid, quota_day(), 0) on conflict do nothing;
  update usage_daily set analyses = analyses + 1
    where user_id = uid and day = quota_day() and analyses < lim
    returning analyses into used;
  if used is null then
    select analyses into used from usage_daily where user_id = uid and day = quota_day();
    return json_build_object('allowed', false, 'used', used, 'limit', lim, 'plan', p);
  end if;
  return json_build_object('allowed', true, 'used', used, 'limit', lim, 'plan', p);
end $$;

-- Gives the analysis back when the AI call failed through no fault of the user.
create function public.refund_analysis(uid uuid)
returns void language sql security definer set search_path = public as $$
  update usage_daily set analyses = greatest(analyses - 1, 0) where user_id = uid and day = quota_day();
$$;

revoke all on function public.peek_usage(uuid, int, int), public.consume_analysis(uuid, int, int), public.refund_analysis(uuid)
  from public, anon, authenticated;
grant execute on function public.peek_usage(uuid, int, int), public.consume_analysis(uuid, int, int), public.refund_analysis(uuid)
  to service_role;
