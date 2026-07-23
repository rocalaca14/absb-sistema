# AUDIT_REPORT — Projeto ABSB

**Associação dos Bugueiros de São Bento**
**Versão do documento:** 1.0
**Data:** 22/07/2026
**Idioma:** Português (Brasil)
**Status:** Aguardando aprovação

---

## 1. Sumário Executivo

Esta auditoria compara o estado atual do projeto com a documentação oficial e com as novas diretrizes recebidas em 22/07/2026 (cores `#00BAB9`/`#FFA600`, grid 8pt, 48x48 touch area, WCAG AA, Safe Area iOS, Dark Mode prep).

**Achado central:** o projeto **não possui código**. Apenas 10 documentos `.md` foram criados. Toda a auditoria recai sobre a **especificação**, não sobre implementação. A implementação sequer foi iniciada.

A documentação existente está **substancialmente correta**, mas apresenta **inconsistências internas, cores desatualizadas, lacunas de documentos referenciados pelo cliente e decisões pendentes** que precisam ser resolvidas antes de qualquer código ser escrito.

### 1.1 Estatísticas

| Item | Quantidade |
|---|---|
| Arquivos de código | 0 |
| Componentes implementados | 0 |
| Telas implementadas | 0 |
| Documentos `.md` criados | 10 |
| Documentos `.md` referenciados pelo cliente e ausentes | 5 |
| Inconsistências de cor encontradas | 5 |
| Violações de grid 8pt na especificação | 8 valores |
| Violações de área de toque | 1 (BottomNav) |
| Documentos com decisão pendente | 3 |

---

## 2. Estado Atual do Repositório

```
C:\Users\rocal\OneDrive\Área de Trabalho\App ABSB\
├── ARQUITETURA.md
├── CONSTANTS.md
├── CORE_ARCHITECTURE.md
├── DATABASE_SPECIFICATION.md
├── DESIGN_RULES.md
├── DESIGN_SYSTEM.md
├── PERMISSIONS.md
├── REVISION_NOTES.md
├── ROADMAP.md
└── UI_SPECIFICATION.md
```

**Não existem:** `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/`, `node_modules/`, código de qualquer tipo.

---

## 3. Auditoria por Categoria

### 3.1 Componentes Fora do Padrão

**Não existem componentes implementados.** Não há `src/components/`, `src/pages/` ou qualquer artefato de UI.

**Quando existirem, os componentes oficiais serão:**

- `Button` (3 variantes: primary, secondary, tertiary)
- `Card` (4 categorias de cor)
- `Input`
- `SectionTitle`
- `Icon`
- `Skeleton`
- `Toast`
- `AppHeader`
- `BottomNav`
- `PageContainer`
- `AppShell`
- `LoginForm`

Esses componentes estão **especificados** em `UI_SPECIFICATION.md` mas **não foram construídos** ainda. O `COMPONENT_LIBRARY.md` referenciado pelo cliente também **não foi criado**.

### 3.2 Telas Fora do Design System

**Não existem telas implementadas.** O `ROADMAP.md` lista as 4 telas da fundação (Início, Mensalidades, Associados, Configurações) mais Login, mas nenhuma foi construída.

**Páginas especificadas mas não implementadas:**

- `LoginPage` (estrutura documentada, sem código)
- `InicioPage` (placeholder)
- `MensalidadesPage` (placeholder)
- `AssociadosPage` (placeholder)
- `ConfiguracoesPage` (placeholder)
- `NotFoundPage` (não documentada)

### 3.3 Cores Fora dos Design Tokens

Foram encontradas **5 inconsistências de cor** entre documentos, apesar da atualização de cores ter sido aplicada em `DESIGN_SYSTEM.md`, `CONSTANTS.md` e `UI_SPECIFICATION.md`:

| # | Local | Problema | Correção |
|---|---|---|---|
| C1 | `UI_SPECIFICATION.md:191` | `var(--color-text-on-primary)` documentado como `#FFFFFF` na seção 6.2 do Botão. O valor real do token é `#1A1D22`. | Atualizar referência para `#1A1D22`. |
| C2 | `UI_SPECIFICATION.md:560` | Mesmo problema na seção 12.2 (Toast). | Atualizar referência para `#1A1D22`. |
| C3 | `DESIGN_SYSTEM.md:128` | `--color-category-blue` definido como `#1E5BA8` (azul antigo, antigo primary). Após a troca de identidade, deve seguir a paleta oficial. | Definir valor coerente com a nova paleta. |
| C4 | `DESIGN_SYSTEM.md:131` | `--color-category-yellow` definido como `#E0A800` (amarelo genérico). A nova identidade tem `#FFA600` como secundária laranja. | Reconfirmar valor com cliente. |
| C5 | `DESIGN_SYSTEM.md:266` e `CONSTANTS.md:123` | `SHADOW_FOCUS` ainda referencia `rgba(30, 91, 168, 0.25)` — cor azul antiga (`#1E5BA8`). | Atualizar para `rgba(0, 186, 185, 0.25)` (teal `#00BAB9`). |

**Detalhamento:**

**C1 e C2** — Documentação contraditória. O token diz uma coisa (`#1A1D22`) e o `UI_SPECIFICATION.md` diz outra (`#FFFFFF`). Componentes implementados com base na especificação de UI resultariam em texto branco sobre teal, falhando WCAG AA.

**C3 e C4** — As 4 cores de categoria (azul, verde, vermelho, amarelo) **não foram confirmadas pelo cliente**. A especificação original usava tons de UI genéricos. A nova identidade mudou primária e secundária, mas o cliente não declarou quais devem ser as 4 cores de categoria.

**C5** — A sombra de foco (essencial para acessibilidade por teclado) usa a cor primária antiga, mas com a nova identidade deveria seguir o teal `#00BAB9`. Quebra a regra "todo valor visual deve utilizar Design Tokens" e o próprio padrão de foco (que deve seguir a cor primária).

### 3.4 Espaçamentos que Quebram o Grid 8pt

A nova diretriz "Todo layout deve seguir Grid Base 8pt" conflita com valores já especificados. A `REVISION_NOTES.md` já listou esses conflitos, mas a especificação **continua usando os valores originais** até decisão.

**Valores fora de múltiplos de 8 (presentes na especificação):**

| Valor | Onde | Multiplo de 8 mais próximo |
|---|---|---|
| `2` | `--space-1` | 0 (mínimo) |
| `6` | `--space-3`, `--space-title-subtitle` | 8 |
| `10` | `--space-5`, `--space-icon-text` | 8 ou 16 |
| `14` | `--space-7`, `--font-size-caption`, `--radius-md` | 16 |
| `18` | `--space-9`, `--radius-xl`, padding card, `--font-size-card-title` | 16 |
| `20` | `--space-10`, `--space-screen-x`, `--space-screen-top`, `--space-screen-bottom` | 24 |
| `34` | `--font-size-value` | 32 |
| `52` | altura de botão, altura de input | 48 ou 56 |
| `78` | altura do BottomNav | 80 |
| `110` | altura mínima do card | 112 |
| `120` | altura da logo no header | 120 ✓ |
| `220` | altura do header | 216 ou 224 |
| `8` | `--space-4` | 8 ✓ |
| `16` | `--space-8`, `--font-size-text`, `--radius-lg` | 16 ✓ |
| `24` | `--space-11`, `--font-size-section` | 24 ✓ |
| `32` | `--space-12`, `--font-size-title` | 32 ✓ |
| `48` | `--space-14` | 48 ✓ |

**Status:** conflito conhecido, opções de resolução em `REVISION_NOTES.md:3.1`. Aguardando decisão.

### 3.5 Problemas de Responsividade

| # | Problema | Local | Severidade |
|---|---|---|---|
| R1 | Itens do BottomNav medem ~19.5px verticalmente (78/4), abaixo do mínimo de 48px para área de toque | `UI_SPECIFICATION.md:97-148` | Alta |
| R2 | Nenhum documento define comportamento de cards em telas maiores (sm, md, lg). Apenas largura base de 390px está documentada | `UI_SPECIFICATION.md:15-15.2` | Média |
| R3 | `AppHeader` com altura fixa de 220px em todas as larguras, sem variante para desktop | `UI_SPECIFICATION.md:60-90` | Média |
| R4 | Comportamento de scroll horizontal em larguras extremas (até 1920px) depende apenas de `overflow-x: hidden`, sem max-width rígido no container | `UI_SPECIFICATION.md:450-470` | Baixa |
| R5 | Safe Area iOS documentada em `DESIGN_SYSTEM.md:18` mas ainda não refletida na `UI_SPECIFICATION.md` (especificação de cada componente) | `UI_SPECIFICATION.md` | Média |
| R6 | Em landscape (iPhone deitado), altura do header de 220px ocupa mais de 30% da tela | `UI_SPECIFICATION.md:62` | Baixa (a definir) |
| R7 | Largura de tela 320px (menor que a base 390px) não tem adaptação específica para o header e o card de 110px de altura mínima | `DESIGN_SYSTEM.md:439-450` | Média |

### 3.6 Problemas de Acessibilidade

| # | Problema | Local | Severidade |
|---|---|---|---|
| A1 | `Sombra de foco` (SHADOW_FOCUS) usa cor azul antiga (ver C5) | `DESIGN_SYSTEM.md:266`, `CONSTANTS.md:123` | Alta |
| A2 | Botão primário em `UI_SPECIFICATION.md:191` documenta texto branco sobre `--color-primary`, falha WCAG AA | `UI_SPECIFICATION.md:191` | Alta |
| A3 | Toast em `UI_SPECIFICATION.md:560` documenta texto branco sobre `--color-primary` na variante `info`, falha WCAG AA | `UI_SPECIFICATION.md:560` | Alta |
| A4 | BottomNav itens abaixo de 48px (ver R1) violam WCAG 2.5.5 | `UI_SPECIFICATION.md:108-148` | Alta |
| A5 | Nenhum componente documenta `aria-*` atributos completos (ex: `aria-current="page"` em `BottomNav` ativo, `aria-label` em `Icon` wrapper) | `UI_SPECIFICATION.md` (geral) | Média |
| A6 | Estados `focus` documentados para `Button`, `Input`, `Card` clicável, mas não para `BottomNav item`, `SectionTitle` (caso tenha link), `Skeleton` | `UI_SPECIFICATION.md` | Média |
| A7 | Contraste entre `--color-text-secondary` (`#5C6470`) e `--color-background` (`#F4F5F7`) precisa de verificação AA | Não verificado | Média |
| A8 | Contraste entre `--color-text-disabled` (`#9AA0A6`) e `--color-card` (`#FFFFFF`) precisa de verificação AA | Não verificado | Média |
| A9 | Sem especificação de `prefers-reduced-motion` para usuários com sensibilidade a movimento | `DESIGN_SYSTEM.md`, `UI_SPECIFICATION.md` | Média |
| A10 | Animações de hover (`translateY(-1px)` em Card) sem fallback para `prefers-reduced-motion` | `UI_SPECIFICATION.md:325` | Média |
| A11 | Sem documento dedicado a acessibilidade. WCAG AA está disperso em `DESIGN_SYSTEM.md` seção 21 | Estrutural | Baixa |

### 3.7 Problemas de Arquitetura

| # | Problema | Local | Severidade |
|---|---|---|---|
| AR1 | Cliente referenciou `ARCHITECTURE.md` mas existe apenas `ARQUITETURA.md` | Raiz | Média |
| AR2 | `COMPONENT_LIBRARY.md` referenciado pelo cliente **não existe**. Conteúdo equivalente está disperso em `UI_SPECIFICATION.md` e `DESIGN_SYSTEM.md` | Raiz | Alta |
| AR3 | `DEVELOPMENT_RULES.md` referenciado pelo cliente **não existe**. Existe `DESIGN_RULES.md` (foco em design) mas não há documento dedicado a regras de código (git, testes, CI/CD, padrões TS, etc.) | Raiz | Alta |
| AR4 | `SYSTEM_FLOWS.md` referenciado pelo cliente **não existe**. Fluxos como login, logout, importação, edição de registro, geração de mensalidade não estão documentados | Raiz | Alta |
| AR5 | `PWA_SPECIFICATION.md` referenciado pelo cliente **não existe**. Conteúdo PWA está disperso em `CORE_ARCHITECTURE.md` seções 12 e 13 | Raiz | Alta |
| AR6 | `DESIGN_SYSTEM.md` e `UI_SPECIFICATION.md` se sobrepõem parcialmente: tokens visuais aparecem nos dois | `DESIGN_SYSTEM.md`, `UI_SPECIFICATION.md` | Média |
| AR7 | Dois documentos de arquitetura (`ARQUITETURA.md` overview + `CORE_ARCHITECTURE.md` detalhes). Convenção de nomenclatura do cliente diz `ARCHITECTURE.md` apenas | Raiz | Baixa |
| AR8 | `REVISION_NOTES.md` é um documento de mudança, mas não está na lista de documentos oficiais do `ARQUITETURA.md` | `ARQUITETURA.md:11-21` | Baixa |
| AR9 | `CONSTANTS.md` lista ~25 categorias de constantes, mas o plano de versionar `tokens.css` em sincronia com `constants/*.ts` não está formalizado | `CONSTANTS.md:480-490` | Média |
| AR10 | `CORE_ARCHITECTURE.md:10-20` define 4 migrations, mas a numeração pode conflitar com a sequência real (0001, 0002, 0003) | `DATABASE_SPECIFICATION.md:393-400` | Baixa |
| AR11 | `CORE_ARCHITECTURE.md:450` define `cache` mas não menciona TTL como constante. TTLs estão em `cache.ts` (a criar) | `CORE_ARCHITECTURE.md:259-289` | Baixa |
| AR12 | Sistema de Toast definido em duas referências ligeiramente diferentes (CORE_ARCHITECTURE.md e UI_SPECIFICATION.md) com pequenas diferenças de posicionamento | `CORE_ARCHITECTURA.md:113-130`, `UI_SPECIFICATION.md:545-575` | Baixa |
| AR13 | `Database` types gerados via `supabase gen types typescript` está em `core/supabase/types.ts` e reexportado em `src/types/database.types.ts` — duplicação potencial | `CORE_ARCHITECTURE.md:115-118`, `src/types/` | Baixa |
| AR14 | Documentos `CORE_ARCHITECTURE.md`, `DESIGN_SYSTEM.md` e `UI_SPECIFICATION.md` declaram o AppShell com diferentes granularidades | Comparar seções correspondentes | Baixa |

### 3.8 Melhorias Necessárias Antes de Continuar

#### 3.8.1 Documentos a Criar (cliente referenciou mas não existem)

| Documento | Propósito | Prioridade |
|---|---|---|
| `COMPONENT_LIBRARY.md` | Índice de componentes, API, exemplos de uso, variantes, estados,Props, defaults, eventos | Alta |
| `ARCHITECTURE.md` | Renomear `ARQUITETURA.md` para este nome, ou criar overview canônico | Média |
| `DEVELOPMENT_RULES.md` | Regras de código: TypeScript, ESLint, Prettier, Git, commits, PRs, branches, CI/CD, testes, code review | Alta |
| `SYSTEM_FLOWS.md` | Fluxos de login, logout, sessão expirada, importação, criação/edição de associado, geração de mensalidade, registro de pagamento, fluxo de erro | Alta |
| `PWA_SPECIFICATION.md` | Manifest, service worker, estratégias de cache, instalação, atualização, offline, push | Alta |

#### 3.8.2 Decisões Pendentes (bloqueios)

| # | Decisão | Aguarda desde |
|---|---|---|
| D1 | Grid 8pt: aplicar 8pt estrito, manter exceções documentadas, ou rejeitar 8pt? | 22/07/2026 |
| D2 | BottomNav 48x48: aumentar altura, área invisível, ou outro padrão? | 22/07/2026 |
| D3 | Cores de categoria (4 tons) com a nova identidade | Foundation |
| D4 | Primeiro usuário administrador: como será criado? | Foundation |
| D5 | Domínio final do GitHub Pages | Foundation |
| D6 | Planilha Google Sheets para mapear colunas de `associados` | Foundation |
| D7 | Logo oficial para extração de proporções (cores já confirmadas) | Foundation |
| D8 | Credenciais Supabase (URL, anon key) | Foundation |
| D9 | Procedimento de seed de `super_admin` | Foundation |

#### 3.8.3 Correções de Cor Urgentes (sem decisão necessária)

| # | Correção | Tipo |
|---|---|---|
| FX1 | `UI_SPECIFICATION.md:191` — atualizar referência de `--color-text-on-primary` de `#FFFFFF` para `#1A1D22` | Documentação |
| FX2 | `UI_SPECIFICATION.md:560` — mesma correção | Documentação |
| FX3 | `SHADOW_FOCUS` em `DESIGN_SYSTEM.md:266` e `CONSTANTS.md:123` — atualizar de `rgba(30, 91, 168, 0.25)` para `rgba(0, 186, 185, 0.25)` | Documentação |

#### 3.8.4 Verificações de Acessibilidade a Fazer

| # | Verificação | Como |
|---|---|---|
| AX1 | Contraste AA de `--color-text-secondary` sobre `--color-background` e `--color-card` | Calcular luminância |
| AX2 | Contraste AA de `--color-text-disabled` sobre `--color-card` | Calcular luminância |
| AX3 | Contraste AA de `--color-category-blue` e `--color-category-yellow` atualizados | Calcular luminância |
| AX4 | Comportamento de `prefers-reduced-motion` em todas as animações | Definir tokens `motion-safe` e `motion-reduce` |
| AX5 | Foco visível em todos os componentes interativos (BottomNav, Icon, SectionTitle quando clicável) | Adicionar estados na `UI_SPECIFICATION.md` |

#### 3.8.5 Melhorias Estruturais

| # | Melhoria |
|---|---|
| E1 | Consolidar `DESIGN_SYSTEM.md` e `UI_SPECIFICATION.md` para eliminar sobreposição. Manter `DESIGN_SYSTEM.md` focado em tokens e `UI_SPECIFICATION.md` focado em aplicação por componente. |
| E2 | Adicionar `REVISION_NOTES.md` ao índice oficial de documentos em `ARQUITETURA.md:11-21`. |
| E3 | Criar seção "Versionamento de Documentos" em `ARQUITETURA.md` ou em novo `DOCUMENTATION_RULES.md` para governar mudanças na própria documentação. |
| E4 | Padronizar nomenclatura de arquivos `.md` em `kebab-case` ou `UPPER_SNAKE_CASE`. Atual: misto (`ARQUITETURA.md` e `DESIGN_SYSTEM.md`). |
| E5 | Adicionar tabela de "Quem mantém" e "Quando revisar" em cada documento. |
| E6 | Criar `GLOSSARY.md` para padronizar termos (associado, mensalidade, etc.) |
| E7 | Criar `CONTRIBUTING.md` para novos contribuidores. |

---

## 4. Matriz de Conformidade

| Critério | Estado |
|---|---|
| Stack técnica definida | ✓ Conforme |
| Princípios arquiteturais definidos | ✓ Conforme |
| Estrutura de pastas proposta | ✓ Conforme |
| Design System com tokens | ✓ Conforme (com inconsistências a corrigir) |
| UI pixel-perfect de componentes | ✓ Conforme (com inconsistências a corrigir) |
| Regras de design documentadas | ✓ Conforme |
| Constantes centralizadas | ✓ Conforme |
| Banco de dados modelado | ✓ Conforme |
| Permissões definidas | ✓ Conforme |
| Roadmap definido | ✓ Conforme |
| Documentos referenciados pelo cliente existem | ✗ 5 ausentes |
| Cores alinhadas com a nova identidade | ✗ 5 inconsistências |
| Grid 8pt aplicado | ✗ Conflito conhecido, pendente decisão |
| 48x48 touch area aplicado | ✗ BottomNav abaixo |
| WCAG AA aplicado | ✗ 2 textos brancos sobre teal falham |
| Dark Mode preparado | ✓ Estrutura token pronta |
| Safe Area iOS preparada | ✓ Documentada em DESIGN_SYSTEM, falta refletir em UI_SPECIFICATION |
| Sem código de implementação | ✓ Esperado nesta fase |

---

## 5. Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| Iniciar implementação sem resolver conflitos 8pt e 48x48 | Refatoração massiva posterior | Bloquear início até decisão |
| Aplicar tons de categoria errados | Identidade visual quebrada | Solicitar cliente os 4 tons |
| Texto branco sobre teal em produção | Falha de acessibilidade grave | Correção de documentação antes de código |
| Documentos divergentes (cliente referencia nomes diferentes) | Desenvolvedor segue documento errado | Padronizar nomenclatura primeiro |
| Ausência de `SYSTEM_FLOWS.md` e `DEVELOPMENT_RULES.md` | Fluxos de negócio e padrões de código indefinidos | Criar antes de qualquer código |

---

## 6. Recomendações Imediatas (ordem de execução)

1. **Decidir D1 (Grid 8pt)** e **D2 (BottomNav 48x48)** antes de qualquer código.
2. **Criar 5 documentos ausentes**: `COMPONENT_LIBRARY.md`, `DEVELOPMENT_RULES.md`, `SYSTEM_FLOWS.md`, `PWA_SPECIFICATION.md` e renomear/criar `ARCHITECTURE.md`.
3. **Aplicar 3 correções de cor** (FX1, FX2, FX3) sem necessidade de decisão adicional.
4. **Solicitar ao cliente** os 4 tons oficiais de categoria.
5. **Validar 5 verificações de acessibilidade** (AX1-AX5).
6. **Atualizar REVISION_NOTES.md** com o registro da auditoria.
7. **Só então iniciar implementação** de tokens.css e estrutura do projeto.

---

## 7. Anexo — Mapeamento de Documentos Cliente x Existentes

| Cliente referencia | Existe | Status |
|---|---|---|
| `DESIGN_RULES.md` | ✓ | OK |
| `UI_SPECIFICATION.md` | ✓ | Inconsistências a corrigir |
| `COMPONENT_LIBRARY.md` | ✗ | A criar |
| `DATABASE_SPECIFICATION.md` | ✓ | OK |
| `ARCHITECTURE.md` | ✗ (existe `ARQUITETURA.md`) | A normalizar |
| `DEVELOPMENT_RULES.md` | ✗ (existe `DESIGN_RULES.md`) | A criar |
| `PERMISSIONS.md` | ✓ | OK |
| `SYSTEM_FLOWS.md` | ✗ | A criar |
| `PWA_SPECIFICATION.md` | ✗ | A criar |
| `ROADMAP.md` | ✓ | OK |

| Existe mas não referenciado pelo cliente | |
|---|---|
| `CORE_ARCHITECTURE.md` | A manter como detalhe técnico |
| `DESIGN_SYSTEM.md` | A manter como tokens |
| `CONSTANTS.md` | A manter como catálogo de constantes |
| `REVISION_NOTES.md` | A incluir no índice |

---

## 8. Conclusão

A documentação está **sólida em conteúdo e estrutura**, mas precisa de:

1. **5 correções de cor (algumas triviais, outras dependem de decisão)**.
2. **5 documentos novos** (alguns críticos, como `DEVELOPMENT_RULES.md` e `SYSTEM_FLOWS.md`).
3. **2 decisões de design** (grid 8pt e BottomNav 48x48) antes de qualquer código.
4. **Pequenas melhorias de consistência** entre documentos.

Aguardando aprovação deste relatório para:

- Aplicar as correções triviais (FX1, FX2, FX3).
- Criar os 5 documentos ausentes.
- Atualizar `REVISION_NOTES.md` com o registro desta auditoria.

**Nenhuma implementação de código será iniciada** até decisão do cliente sobre D1 e D2 e envio dos itens bloqueadores restantes.
