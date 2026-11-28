-- Rode no SQL Editor do Supabase. Não apaga nada existente.
create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  type text not null default 'corrente' check (type in ('corrente','poupanca','carteira','investimento')),
  initial_balance numeric(14,2) not null default 0,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
alter table public.accounts enable row level security;
create policy "membros leem contas" on public.accounts for select
  using (family_id in (select family_id from public.family_members where user_id = auth.uid()));
create policy "membros criam contas" on public.accounts for insert
  with check (created_by = auth.uid() and family_id in (select family_id from public.family_members where user_id = auth.uid()));
create policy "membros editam contas" on public.accounts for update
  using (family_id in (select family_id from public.family_members where user_id = auth.uid()));
create policy "owner exclui contas" on public.accounts for delete
  using (family_id in (select family_id from public.family_members where user_id = auth.uid() and role = 'owner'));
