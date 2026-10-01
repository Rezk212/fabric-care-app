-- Programme names read from the machine's panel, so later analyses can say
-- "choose 'Delicates' on your machine" without another panel photo.
alter table public.machines add column if not exists programs text[] not null default '{}';
