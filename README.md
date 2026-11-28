# GFF — Gestão Financeira Familiar
App PWA estático (GitHub Pages) + Supabase. Interface em português brasileiro.

## Publicar
1. Substitua os arquivos na raiz do repositório e envie para `main`.
2. No Supabase (SQL Editor), rode `supabase/001_contas.sql` uma vez.
3. Em Authentication → URL Configuration, inclua `https://gomesoficial01-oss.github.io/gff-financas/` em Redirect URLs (necessário para "Esqueci a senha").
4. Se o app antigo aparecer no celular, feche e reabra uma vez para o novo service worker assumir.

Nunca coloque chave `service_role` ou senhas no frontend.
## Próximas etapas
Receitas/despesas, orçamento, contas a pagar, cartões, compras/estoque, metas, relatórios, offline.
