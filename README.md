# GFF — Gestão Financeira Familiar

Aplicativo de gestão financeira e doméstica familiar.

## Versão atual

**Etapa 2 — Autenticação**

- Tela de login com e-mail e senha
- Sessão persistente via Supabase Auth
- Verificação automática de sessão ao abrir
- Identificação da família e do papel do usuário (owner/member)
- Proteção do painel (só libera após autenticação + vínculo familiar)
- Botão de sair
- Ícone PWA e service worker corrigidos

## Como publicar no GitHub Pages

1. Extraia o conteúdo desta pasta na raiz do repositório `gff-financas` (substituindo os arquivos existentes).
2. Envie para o branch `main`.
3. Aguarde a atualização do GitHub Pages (geralmente 1–2 minutos).
4. Abra: https://gomesoficial01-oss.github.io/gff-financas/

## Teste de login

Use a conta do proprietário já cadastrada:

- E-mail: `gomesoficial01@gmail.com`
- Senha: a senha que você definiu no Supabase Auth

Após o login, o nome da família e o papel devem aparecer na barra lateral.

## Estrutura

- `index.html` — interface + tela de login
- `styles.css` — visual + estilos da tela de login
- `app.js` — navegação
- `supabase.js` — cliente Supabase (chave pública)
- `auth.js` — lógica de autenticação e vínculo familiar
- `manifest.json` / `sw.js` — PWA
- `assets/icon.svg` — ícone

## Próximas etapas

- Convite seguro do segundo usuário
- Contas e movimentações financeiras
- Orçamentos, cartões, estoque, etc.

**Nunca coloque a chave `service_role` ou senhas no frontend.**
