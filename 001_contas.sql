-- ATENÇÃO: a tabela accounts já existia no projeto com estas colunas:
-- id, family_id, name, account_type (cash|checking|savings|digital|investment|other),
-- initial_balance_cents (centavos), active, created_at, updated_at, created_by.
-- O app usa essa estrutura. Políticas RLS atuais: 'membros leem/criam/editam contas' e 'owner exclui contas'.
alter table public.accounts add column if not exists created_by uuid references auth.users(id);
