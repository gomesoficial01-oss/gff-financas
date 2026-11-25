# Changelog

## 0.2.1 — Alterar senha logado

- Adicionada tela/modal para alterar senha estando autenticado.
- Botão "Alterar senha" na barra lateral e no perfil.
- Validação de senha (mínimo 6 caracteres + confirmação).
- Mensagens de sucesso e erro em português.

## 0.2.0 — Etapa 2: Autenticação

- Implementada tela de login moderna (e-mail + senha).
- Integrado Supabase Auth (JavaScript v2) com chave pública.
- Verificação automática de sessão ao abrir o aplicativo.
- Consulta a `family_members` e `families` respeitando RLS.
- Identificação do papel do usuário (owner / member).
- Proteção do dashboard: só libera após autenticação e vínculo familiar válido.
- Botão de sair e limpeza de sessão.
- Fluxo de recuperação de senha (Esqueci a senha + tela Definir nova senha).
- Corrigido ícone ausente (`assets/icon.svg`).
- Atualizado service worker e manifest (cache v2).

## 0.1.0 — Etapa 1: fundação visual

- Criada identidade visual inicial GFF.
- Criado dashboard demonstrativo.
- Criada navegação para os dez módulos planejados.
- Criado layout responsivo para celular e desktop.
- Adicionado manifest PWA e service worker.
