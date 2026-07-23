# DEVELOPMENT_RULES — Projeto ABSB

**Associação dos Bugueiros de São Bento**
**Versão do documento:** 1.0
**Idioma:** Português (Brasil)

---

## 1. Propósito

Este documento define as **regras de desenvolvimento de código** do projeto. Complementa `DESIGN_RULES.md` (foco em design) cobrindo padrões de código, git, testes, CI/CD e governança do repositório.

Toda linha de código escrita para o projeto deve respeitar estas regras.

---

## 2. TypeScript

### 2.1 Configuração

`tsconfig.json` deve ter:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### 2.2 Regras de Código

- **Nunca** usar `any`. Usar `unknown` se o tipo é realmente desconhecido.
- **Nunca** usar `@ts-ignore`. Usar `@ts-expect-error` com comentário justificando.
- **Nunca** usar `as any`. Usar type guards ou narrowing.
- **Sempre** tipar props de componente com `interface`.
- **Sempre** tipar retorno de função pública (explícito ou inferido corretamente).
- **Sempre** tipar estado de `useState<T>` explicitamente quando o valor inicial é `null` ou vazio.
- **Sempre** usar `as const` em arrays/objetos que viram enumerações.
- **Sempre** derivar tipos de constantes quando possível.

### 2.3 Naming

| Elemento | Convenção | Exemplo |
|---|---|---|
| Variáveis | `camelCase` | `totalAssociados` |
| Constantes | `UPPER_SNAKE_CASE` (apenas em `constants/`) ou `camelCase` (no resto) | `SPACE_SECTION`, `userRole` |
| Funções | `camelCase` | `calcularTotal()` |
| Componentes | `PascalCase` | `Button` |
| Interfaces | `PascalCase` | `ButtonProps` |
| Types | `PascalCase` | `Role` |
| Enums | `PascalCase` (membros em `UPPER_SNAKE_CASE` em TS, `camelCase` em runtime) | `ButtonVariant.Primary` |
| Arquivos | `PascalCase.tsx` (componentes) ou `camelCase.ts` (utilitários) | `Button.tsx`, `formatCpf.ts` |
| Pastas | `PascalCase/` (componentes) ou `camelCase/` (módulos) | `Button/`, `services/` |

---

## 3. Estrutura de Pastas

Estrutura canônica definida em `CORE_ARCHITECTURE.md` seção 2. Resumo:

```
src/
├── components/
├── contexts/
├── core/
├── design-system/
├── hooks/
├── lib/
├── pages/
├── routes/
├── services/
├── types/
└── utils/
```

**Regras:**

- Componentes em `components/`. Nenhum componente em outro lugar.
- Lógica de negócio em `services/` ou `core/`. Nunca em `components/`.
- Hooks em `hooks/`. Hooks co-localizados só em casos excepcionais.
- Tipos em `types/` ou co-localizados em arquivos específicos.
- Constantes em `constants/`. Constantes mágicas proibidas em outros lugares.

---

## 4. React

### 4.1 Componentes

- **Sempre** componentes funcionais. Classes proibidas.
- **Sempre** função pura + props tipadas. Sem efeitos colaterais no corpo.
- **Sempre** `export function` ou `export const` nomeado. Default export proibido.
- **Nunca** lógica complexa no JSX. Extrair para variável ou subcomponente.
- **Nunca** mais de 300 linhas por arquivo. Decompor.

### 4.2 Hooks

- Hooks customizados em `src/hooks/`.
- Nome sempre começa com `use`.
- Dependências de `useEffect`/`useMemo`/`useCallback` sempre listadas explicitamente.
- ESLint `react-hooks/exhaustive-deps` ativo.

### 4.3 Estado

- Estado local com `useState`.
- Estado compartilhado via `Context` (apenas para auth e toast nesta fase).
- Sem bibliotecas de state management externo nesta fase.

### 4.4 Estilização

- **Sempre** CSS Modules (`Component.module.css`).
- **Nunca** CSS inline (`style={{...}}`).
- **Nunca** styled-components, emotion ou outras libs de CSS-in-JS.
- **Nunca** Tailwind, Bootstrap, Material UI, Chakra ou outras UI libs.
- Variáveis CSS em `design-system/tokens.css`. Nunca em outro lugar.

### 4.5 Renderização Condicional

- Operador ternário para casos simples: `{cond && <X />}` ou `{cond ? <A /> : <B />}`.
- Early return em componente quando aplicável: `if (!data) return <Skeleton />`.
- Evitar renderização condicional complexa no JSX. Extrair para subcomponente.

---

## 5. Imports

- **Sempre** imports absolutos com `@/` apontando para `src/`. Configurar em `vite.config.ts` e `tsconfig.json`.
- **Sempre** named imports. Default imports proibidos para código do projeto (apenas libs externas).
- **Sempre** na ordem: libs externas, `core/`, `services/`, `hooks/`, `components/`, `types/`, `utils/`, `constants/`.
- **Nunca** imports circulares.

Exemplo:

```ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '@/core/supabase/client';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import type { User } from '@/types/domain.types';
import { ROUTES } from '@/constants';
```

---

## 6. Tratamento de Erros

- Toda chamada async em `services/` retorna `{ data, error }` onde `error` é `AppError`.
- Toda chamada async em componente usa `try/catch` ou exibe toast em caso de erro.
- Mensagens técnicas **nunca** chegam ao usuário. Usar `error.userMessage`.
- Erros 4xx do Supabase (RLS) → `PERMISSION_DENIED` com mensagem amigável.
- Erros 5xx do Supabase → `INTERNAL` com mensagem genérica.

---

## 7. Git

### 7.1 Branches

| Branch | Uso |
|---|---|
| `main` | Produção. Tag em cada release. |
| `develop` | Homologação. Integração de features. |
| `feature/<modulo>-<descricao>` | Feature em desenvolvimento. |
| `hotfix/<descricao>` | Correção urgente em produção. |
| `docs/<descricao>` | Apenas documentação. |
| `release/<versao>` | Preparação de release. |

### 7.2 Commits

- **Conventional Commits em Português:**

```
feat: adiciona componente Button
fix: corrige alinhamento de Card em telas pequenas
docs: atualiza DESIGN_SYSTEM com cores oficiais
refactor: extrai hook useForm
chore: atualiza dependências
test: adiciona testes de Button
```

Tipos permitidos: `feat`, `fix`, `docs`, `refactor`, `chore`, `test`, `build`, `ci`, `perf`, `style`.

### 7.3 Pull Requests

- PRs pequenos e focados.
- Descrição em Português.
- Checklist obrigatório:
  - [ ] Lint passa
  - [ ] Typecheck passa
  - [ ] Testes passam
  - [ ] Documentação atualizada (se aplicável)
  - [ ] Sem código comentado
  - [ ] Sem `console.log`
  - [ ] Sem `any`
  - [ ] Componentes seguem `UI_SPECIFICATION.md`
  - [ ] Tokens consumidos de `tokens.css` (nenhum valor hardcoded)
  - [ ] Acessibilidade verificada
- Code review obrigatório antes de merge.
- Squash merge em `main` e `develop`.

### 7.4 Tags

- `v1.0.0` para versão maior.
- `v1.1.0` para minor.
- `v1.0.1` para patch.

---

## 8. Testes

### 8.1 Estrutura

- Framework: Vitest + React Testing Library.
- Testes unitários co-localizados em `__tests__/` ao lado do arquivo testado.
- Testes de integração em `src/__tests__/integration/`.
- Testes E2E (fase futura) com Playwright.

### 8.2 Cobertura

- Componentes da biblioteca oficial: cobertura mínima de 80%.
- Serviços: cobertura mínima de 90%.
- Utils: cobertura mínima de 95%.

### 8.3 Regras

- **Sempre** testar comportamento, não implementação.
- **Sempre** testar estados (default, hover, focus, disabled, loading, error).
- **Sempre** testar acessibilidade básica (roles, aria).
- **Nunca** testar detalhes de implementação (CSS exato, nomes de classes).

---

## 9. CI/CD

### 9.1 Pipeline (GitHub Actions)

Em cada push ou PR:

1. `npm ci` — instalação limpa.
2. `npm run lint` — ESLint.
3. `npm run typecheck` — TypeScript strict.
4. `npm run test` — Vitest.
5. `npm run build` — Vite build.

Em push em `main`:

6. `npm run deploy` — gh-pages.

### 9.2 Secrets

- `VITE_SUPABASE_URL` em GitHub Secrets.
- `VITE_SUPABASE_ANON_KEY` em GitHub Secrets.
- Nenhum secret em código.

---

## 10. Dependências

### 10.1 Adicionar Dependência

Antes de adicionar qualquer dependência, responder:

1. Por que precisamos desta dependência?
2. Existe alternativa nativa (sem dependência)?
3. Qual o tamanho do bundle adicionado?
4. Qual a licença?
5. Quem mantém?
6. Está sendo mantida ativamente?

Justificativa registrada em ata ou em `REVISION_NOTES.md`.

### 10.2 Versões

- Lockfile (`package-lock.json`) commitado.
- Versões exatas em produção (`^` apenas para libs não-críticas).
- Auditoria de segurança: `npm audit` em CI.

### 10.3 Dependências Proibidas

- `moment` (usar `date-fns`).
- `lodash` (usar funções nativas ou `lodash-es` se realmente necessário).
- Qualquer UI lib (Material UI, Chakra, Bootstrap, Tailwind).
- Qualquer gerador de CSS-in-JS (styled-components, emotion).

---

## 11. Comentários

- **Apenas** quando agregam informação não óbvia.
- **Nunca** explicar o "como" (código deve ser autoexplicativo).
- **Sempre** explicar o "porquê" quando a decisão não é trivial.
- **Nunca** comentários `// TODO` sem ticket associado.
- JSDoc em funções públicas de serviços.

---

## 12. Console e Debug

- `console.log` proibido em produção.
- `console.warn` e `console.error` permitidos para erros reais.
- `debugger` proibido.
- Usar `logger` de `core/logger/logger.ts` para logs de aplicação.

---

## 13. Variáveis de Ambiente

- Acessadas via `import.meta.env.VITE_*`.
- Tipadas em `src/types/env.d.ts`.
- Validadas em runtime no bootstrap (`main.tsx`).

---

## 14. Performance

### 14.1 Imagens

- Usar `loading="lazy"` em imagens abaixo da dobra.
- Servir WebP quando possível.
- Logos em SVG (vetor).

### 14.2 Bundle

- Code splitting por rota (`React.lazy` + `Suspense`).
- Tree shaking habilitado (Vite por padrão).
- Análise de bundle em CI (relatório de tamanho).

### 14.3 Renderização

- `React.memo` em componentes que recebem props estáveis.
- `useMemo`/`useCallback` apenas quando há ganho mensurável.
- Listas com `key` estável e única.

---

## 15. Segurança

- Nenhum secret em código ou commit.
- Validação de entrada com Zod em qualquer dado do usuário.
- Escape de strings (React faz por padrão em JSX).
- Sanitização de URLs externas.
- CSP (Content Security Policy) configurado no `index.html`.
- HTTPS obrigatório (GitHub Pages já força).

---

## 16. Documentação de Código

- Funções públicas de serviços com JSDoc.
- Tipos complexos com comentário explicativo.
- Algoritmos não triviais com comentário do "porquê".
- README em cada pasta complexa (opcional, sob demanda).

---

## 17. Anti-patterns Proibidos

- `var` (usar `const` ou `let`).
- `==` (usar `===`).
- Mutação de props ou estado diretamente.
- `useEffect` para tudo (preferir derivação de estado).
- `useEffect` sem cleanup quando registra listeners/subscriptions.
- `setTimeout`/`setInterval` sem cleanup.
- Strings de UI hardcoded em componentes (usar `utils/textos.ts`).
- Fetch direto em componente (usar `services/`).
- Lógica de negócio em componente.
- Componente com mais de 300 linhas.
- Arquivo com mais de 300 linhas.
- Pasta sem propósito claro.

---

## 18. Governança

- Mudanças em regras deste documento exigem aprovação.
- Mudanças registradas em `REVISION_NOTES.md`.
- Validação em `DOCUMENTATION_VALIDATION_REPORT.md`.

---

## 19. Bloqueios

- Nenhum nesta fase de documentação. Implementação segue este documento.
