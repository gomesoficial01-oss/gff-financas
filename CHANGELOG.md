# Changelog

## 0.2.0 — Etapa 2: Autenticação

- Implementada tela de login moderna (e-mail + senha).
- Integrado Supabase Auth (JavaScript v2) com chave pública.
- Verificação automática de sessão ao abrir o aplicativo.
- Consulta a `family_members` e `families` respeitando RLS.
- Identificação do papel do usuário (owner / member).
- Proteção do dashboard: só libera após autenticação e vínculo familiar válido.
- Botão de sair e limpeza de sessão.
- Mensagens de erro em português.
- Estado de carregamento durante o login.
- Corrigido ícone ausente (`assets/icon.svg`).
- Atualizado service worker e manifest (cache v2).
- Atualizado aviso do dashboard para indicar autenticação ativa.

## 0.1.0 — Etapa 1: fundação visual

- Criada identidade visual inicial GFF.
- Criado dashboard demonstrativo.
- Criada navegação para os dez módulos planejados.
- Criado layout responsivo para celular e desktop.
- Adicionado manifest PWA, ícone e service worker para cache do shell.
- Documentada arquitetura técnica e modelo de dados planejado.
- Documentados testes manuais e limites da etapa.
- Não implementados login, backend, persistência ou sincronização.
