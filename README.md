# GFF — Gestão Financeira Familiar

Fundação inicial de um aplicativo independente de gestão financeira e doméstica familiar.

## Como visualizar
1. Extraia o ZIP.
2. Abra `index.html` para uma prévia local.
3. Para testar o PWA, publique por HTTPS (por exemplo, GitHub Pages).

## Publicação no GitHub Pages
1. Crie um repositório privado ou público conforme sua preferência.
2. Envie o conteúdo desta pasta para a raiz do ramo principal.
3. Em Settings → Pages, habilite publicação a partir do ramo principal e da raiz (`/`).
4. Aguarde a publicação e abra o endereço fornecido pelo GitHub.

Atenção: o frontend desta etapa é estático e contém apenas valores demonstrativos. Não insira dados financeiros reais nesta versão.

## Estrutura
- `index.html` — estrutura da interface.
- `styles.css` — identidade visual e responsividade.
- `app.js` — navegação.
- `manifest.json` — configuração PWA.
- `sw.js` — cache do shell estático.
- `assets/` — ícone.
- `docs/` — arquitetura, modelo de dados e testes.

## Próxima etapa
Etapa 2: preparar projeto Supabase, autenticação individual, criação do espaço familiar, convite do segundo usuário e políticas RLS testadas. Não colocar chaves secretas no frontend.
