# PRODUCTION_CHECKLIST.md — Checklist de Produção ABSB

**Projeto:** Associação dos Bugueiros de São Bento (ABSB)  
**Objetivo:** Garantir que o sistema está pronto para operar em produção de forma segura, estável e escalável.  
**Última atualização:** 23/07/2026

---

## 1. Infraestrutura

- [ ] Domínio/GitHub Pages configurado e acessível
- [ ] SSL/HTTPS ativo (GitHub Pages fornece automaticamente)
- [ ] Repositório GitHub privado ou público conforme política da associação
- [ ] GitHub Actions habilitado e funcionando
- [ ] Branch `main` protegida (requer PR para merge)
- [ ] Branch `gh-pages` criada automaticamente pelo deploy
- [ ] Ambiente de staging/preview configurado (recomendado)
- [ ] Supabase projeto provisionado em região adequada
- [ ] Limites do plano Supabase revisados (tamanho, requisições, usuários)

---

## 2. Banco de Dados

- [ ] Migrations `0001_init_schema.sql` aplicadas
- [ ] Migrations `0002_rls_policies.sql` aplicadas
- [ ] Migrations `0003_seed_roles.sql` aplicadas
- [ ] Todas as tabelas criadas: `profiles`, `associados`, `mensalidades`, `pagamentos`, `importacoes`, `audit_log`, `configuracoes`
- [ ] Enums criados: `user_role`, `forma_pagamento_tipo`, `audit_operacao`
- [ ] Índices criados conforme migration
- [ ] Constraints criadas (UF, ano do veículo, referência, valores)
- [ ] Triggers de `updated_at` funcionando
- [ ] Trigger de cálculo de `valor_final` funcionando
- [ ] Trigger de auditoria funcionando
- [ ] Trigger de sync `role` ↔ `app_metadata` funcionando
- [ ] Primeiro administrador criado e testado
- [ ] Backup automático do Supabase configurado (pontos de recuperação)

---

## 3. Segurança

- [ ] Row Level Security (RLS) habilitado em todas as tabelas
- [ ] Policies criadas para cada papel (admin, tesoureiro, diretor, visualizador)
- [ ] Nenhuma operação anônima permitida
- [ ] Senhas fortes exigidas no Supabase Auth
- [ ] Confirmação de email habilitada (recomendado)
- [ ] Troca segura de email habilitada
- [ ] Política de senhas revisada
- [ ] Credenciais Supabase armazenadas apenas em `.env` e GitHub Secrets
- [ ] `.env` não versionado (verificado no `.gitignore`)
- [ ] Service Key (`SUPABASE_SERVICE_ROLE_KEY`) nunca exposta no frontend
- [ ] Dados sensíveis sanitizados nos logs
- [ ] HTTPS obrigatório
- [ ] CSP (Content Security Policy) revisado (opcional)
- [ ] Auditoria de ações sensíveis em `audit_log`

---

## 4. PWA (Progressive Web App)

- [ ] `manifest.webmanifest` gerado corretamente
- [ ] Ícones 192x192, 512x512 e maskable presentes
- [ ] `theme_color` e `background_color` configurados
- [ ] Service Worker registrado em produção
- [ ] Workbox configurado com estratégias adequadas
- [ ] Cache de assets estáticos funcionando
- [ ] Cache de API configurado (NetworkFirst)
- [ ] Rotas de auth como NetworkOnly
- [ ] App instalável em Android
- [ ] App instalável em iOS (Adicionar à Tela de Início)
- [ ] Funcionamento offline testado
- [ ] Atualização automática do SW testada
- [ ] Navegação fallback para `index.html` configurada

---

## 5. Deploy

- [ ] Workflow `deploy.yml` revisado e aprovado
- [ ] Workflow `ci.yml` revisado e aprovado
- [ ] Deploy automático em push para `main` testado
- [ ] Quality gate (lint, typecheck, build) passando
- [ ] Testes automatizados passando no CI
- [ ] Variáveis de ambiente injetadas no build do GitHub Actions
- [ ] Caminhos relativos dos assets verificados no `dist/index.html`
- [ ] Apenas um link para `manifest.webmanifest` no `dist/index.html`
- [ ] `base` do Vite compatível com GitHub Pages
- [ ] HashRouter configurado para SPA em subdiretório
- [ ] Rollback manual documentado

---

## 6. Performance

- [ ] Build otimizado (`npm run build` sem erros)
- [ ] Code splitting ativo (lazy loading de páginas)
- [ ] Fontes otimizadas (subsets latin e latin-ext)
- [ ] Assets com hash no nome para cache busting
- [ ] Tamanho do bundle principal revisado
- [ ] Lighthouse Performance ≥ 70 (recomendado ≥ 90)
- [ ] Lighthouse Accessibility ≥ 90
- [ ] Lighthouse Best Practices ≥ 90
- [ ] Lighthouse SEO ≥ 90
- [ ] PWA validado no Lighthouse

---

## 7. Backup

- [ ] Backup automático do banco Supabase ativo
- [ ] Política de retenção de backups definida
- [ ] Procedimento de restore documentado
- [ ] Exportação periódica de dados sensíveis (associados, pagamentos)
- [ ] Cópia local dos relatórios exportados

---

## 8. Monitoramento

- [ ] Logs de erro revisados (`logger` configurado)
- [ ] Eventuais erros de produção visíveis no console
- [ ] Taxa de erros aceitável (< 1%)
- [ ] Tempo de resposta das APIs aceitável (< 2s)
- [ ] Uptime do GitHub Pages monitorado
- [ ] Uptime do Supabase monitorado
- [ ] Alertas configurados (opcional: Sentry, LogRocket)

---

## 9. Release

- [ ] Versão definida no `package.json`
- [ ] `VITE_APP_VERSION` preenchido
- [ ] Tag Git criada para a versão (ex: `v0.1.0`)
- [ ] Release notes publicados
- [ ] Mudanças documentadas no `REVISION_NOTES.md`
- [ ] Treinamento dos usuários finais realizado
- [ ] Documentação de suporte disponível
- [ ] Canal de comunicação para bugs/incidentes definido

---

## 10. Validação Final de Aceitação

- [ ] Login real funciona
- [ ] Logout funciona
- [ ] Sessão persistente funciona
- [ ] Conta desativada é bloqueada
- [ ] CRUD Associados completo validado
- [ ] CRUD Mensalidades completo validado
- [ ] Registro de Pagamento validado
- [ ] Gestão de Usuários validada (admin)
- [ ] Configurações da associação validadas
- [ ] Relatório de Associados + CSV validado
- [ ] Permissões por papel validadas
- [ ] Dark Mode validado
- [ ] PWA instalado e offline testado
- [ ] Testes automatizados passando

---

## Legenda

- ✅ — Concluído
- ⚠️ — Pendente / com ressalvas
- ❌ — Bloqueado
- ⬜ — Não iniciado

---

**Próxima revisão:** após a implantação real e obtenção das credenciais Supabase.
