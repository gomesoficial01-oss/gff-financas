# Histórico
## v3.1
- App ajustado à tabela accounts existente (account_type, initial_balance_cents, active).
## v3 — Reconstrução
- Autenticação completa: login, "Esqueci a senha", "Definir nova senha", "Alterar senha", sair.
- Proteção do painel por vínculo familiar (owner/member).
- Módulo Contas / Saldos com RLS (supabase/001_contas.sql).
- Service worker rede-primeiro, ícone em assets/icon.svg.
