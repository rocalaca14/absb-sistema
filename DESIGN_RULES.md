# DESIGN_RULES — Projeto ABSB

**Associação dos Bugueiros de São Bento**
**Versão do documento:** 1.0
**Idioma:** Português (Brasil)
**Status:** Vigente — leitura obrigatória antes de qualquer implementação

---

## 1. Propósito

Este é o **documento mais importante do projeto**. Define todas as regras obrigatórias de design e arquitetura. Qualquer implementação que viole estas regras é considerada defeito, mesmo que funcional.

Em caso de conflito entre este documento e qualquer outro, este documento prevalece. Em caso de ambiguidade, o protocolo da seção 6 deve ser acionado.

---

## 2. Regras Invioláveis de Design

### 2.1 Tipografia

1. **Nunca** utilizar fonte que não seja `Inter`.
2. **Nunca** utilizar tamanhos de fonte fora dos tokens `--font-size-*`.
3. **Nunca** utilizar pesos fora de `400`, `500`, `600`, `700`.
4. **Nunca** utilizar itálico.
5. **Nunca** alterar `line-height` fora dos tokens `--line-height-*`.

### 2.2 Cores

1. **Nunca** utilizar valor hexadecimal em componente.
2. **Nunca** utilizar `rgb()`, `rgba()`, `hsl()`, `hsla()` em componente (exceto onde o token já documenta o uso de `rgba`).
3. **Nunca** criar nova cor sem documentá-la primeiro em `DESIGN_SYSTEM.md`.
4. **Nunca** usar cor de categoria fora dos 4 valores permitidos (`blue`, `green`, `red`, `yellow`).
5. **Nunca** misturar tons da mesma família sem autorização.

### 2.3 Espaçamentos

1. **Nunca** utilizar valor de espaçamento fora dos tokens `--space-*`.
2. **Nunca** utilizar `margin` ou `padding` "mágicos" (valores sem token).
3. **Nunca** utilizar margem negativa.
4. **Nunca** utilizar `gap` fora dos tokens documentados.

### 2.4 Bordas e Raios

1. **Nunca** utilizar `border-radius` fora dos tokens `--radius-*`.
2. **Nunca** criar raio intermediário (ex: 12px, 15px).
3. **Nunca** utilizar `border-width` fora de `1px` (hairline) ou `5px` (linha de categoria).

### 2.5 Sombras

1. **Nunca** utilizar sombra fora dos tokens `--shadow-*`.
2. **Nunca** compor sombras manualmente.
3. **Nunca** criar sombra forte (offset > 8px ou blur > 24px).

### 2.6 Layout e Grid

1. **Nunca** posicionar elementos manualmente fora de Grid.
2. **Nunca** usar `position: absolute` sem justificativa documentada.
3. **Nunca** usar `float`.
4. **Nunca** usar `transform: translate` para substituir layout.
5. **Nunca** permitir overflow horizontal.
6. **Nunca** permitir corte de conteúdo.
7. **Nunca** permitir quebra de layout.

### 2.7 Componentes

1. **Nunca** criar componente sem antes verificar se já existe equivalente em `components/ui/`.
2. **Nunca** criar variante de componente sem autorização.
3. **Nunca** substituir componente por alternativa similar.
4. **Nunca** duplicar componente existente.
5. **Nunca** criar componente "temporário" para substituir um oficial.
6. **Sempre** usar o wrapper `Icon` para qualquer ícone.

### 2.8 Ícones

1. **Nunca** usar emoji.
2. **Nunca** usar imagem no papel de ícone.
3. **Nunca** usar ícone de fora do `lucide-react`.
4. **Nunca** usar tamanho de ícone diferente de 24px.
5. **Nunca** usar stroke diferente de 2.

### 2.9 Animações

1. **Nunca** animar largura, altura, posição (`top`, `left`, `right`, `bottom`), `margin`, `padding`.
2. **Nunca** usar duração fora dos tokens `--duration-*`.
3. **Nunca** usar easing fora dos tokens `--easing-*`.
4. **Nunca** criar animação sem propósito funcional.

### 2.10 Conteúdo

1. **Nunca** criar dados fictícios em qualquer lugar do sistema.
2. **Nunca** inserir texto em inglês na interface.
3. **Nunca** alterar acentuação de nomes importados.
4. **Nunca** alterar capitalização de nomes importados.
5. **Nunca** alterar ordem de registros importados.
6. **Nunca** eliminar registros importados.

### 2.11 Texto

1. **Nunca** inserir string de UI fora de `utils/textos.ts` (com exceções documentadas em `CORE_ARCHITECTURE.md`).
2. **Nunca** usar placeholder técnico (ex: "lorem ipsum") em produção.
3. **Nunca** deixar string sem acentuação correta.

---

## 3. Regras Invioláveis de Arquitetura

### 3.1 Código

1. **Nunca** acessar `supabase` diretamente de componente ou página.
2. **Sempre** passar por `services/`.
3. **Nunca** duplicar lógica de negócio.
4. **Nunca** criar arquivo desnecessário.
5. **Nunca** criar componente "genérico demais" sem propósito claro.
6. **Nunca** usar `any` em TypeScript.
7. **Nunca** usar `@ts-ignore` sem justificativa.
8. **Nunca** deixar `console.log` em produção.
9. **Nunca** commitar `.env` real.
10. **Nunca** commitar chave de API, senha ou token.

### 3.2 Dependências

1. **Nunca** adicionar dependência sem justificativa registrada.
2. **Nunca** substituir biblioteca sem autorização.
3. **Nunca** usar `npm` direto sem lockfile válido.
4. **Nunca** misturar gerenciador de pacote (yarn/pnpm/npm).

### 3.3 Banco de Dados

1. **Nunca** criar migration que altere migration já aplicada.
2. **Nunca** popular banco de produção com dados fictícios.
3. **Nunca** usar planilha Google Sheets em produção como fonte de dados.
4. **Nunca** executar SQL destrutivo sem backup.
5. **Sempre** versionar migration em arquivo nomeado e ordenado.

### 3.4 Autenticação

1. **Nunca** armazenar credencial em código.
2. **Nunca** armazenar token em `localStorage` manualmente (deixar Supabase gerenciar).
3. **Nunca** exibir mensagem técnica de erro ao usuário final.
4. **Sempre** normalizar erros via `AppError`.

---

## 4. Regras de Decisão

### 4.1 Quando houver dúvida

1. Consultar a documentação oficial.
2. Se a documentação não responder, **parar a implementação**.
3. Solicitar autorização explícita por escrito.
4. Aguardar resposta antes de prosseguir.

### 4.2 Quando houver conflito entre regras

1. Este documento (`DESIGN_RULES.md`) prevalece sobre qualquer outro.
2. Em segundo nível, `DESIGN_SYSTEM.md` prevalece sobre `UI_SPECIFICATION.md`.
3. Em terceiro nível, a regra mais específica prevalece sobre a mais genérica.

### 4.3 Quando houver necessidade de novo padrão

1. **Não** criar padrão novo diretamente no código.
2. Propor atualização da documentação correspondente.
3. Aguardar aprovação.
4. Atualizar a documentação antes de implementar.

---

## 5. Protocolo de Conflito

Caso, durante a implementação, seja identificado:

- Requisito ambíguo.
- Requisito ausente.
- Requisito contraditório com a documentação.
- Necessidade de novo padrão não documentado.
- Necessidade de exceção a uma regra deste documento.

**Ação obrigatória:**

1. **Parar a implementação** imediatamente no ponto do conflito.
2. **Não** tomar decisão unilateral para "destrancar" o trabalho.
3. Documentar o conflito em mensagem de retorno, incluindo:
   - Local exato (arquivo, linha, contexto).
   - Regra ou requisito conflitante.
   - Possíveis interpretações identificadas.
   - Recomendação (se houver).
4. Aguardar decisão explícita.
5. Atualizar a documentação antes de retomar, se aprovado.

---

## 6. Comportamentos Proibidos

A título de reforço, **jamais** executar:

- "Vou improvisar um valor aproximado."
- "Vou usar um valor parecido com o do design."
- "Vou criar um componente novo porque é mais simples."
- "Vou substituir essa biblioteca por outra mais simples."
- "Vou colocar essa string em inglês só这一次."
- "Vou usar uma cor parecida."
- "Vou ajustar essa margem para caber."
- "Vou usar um emoji para economizar tempo."
- "Vou pular essa regra só nesse caso."

Cada item acima é uma violação grave, independentemente do motivo.

---

## 7. Auditoria

Toda implementação passa por revisão contra este documento antes de merge. Itens de revisão:

- [ ] Nenhum valor fora de tokens.
- [ ] Nenhum componente duplicado.
- [ ] Nenhum acesso direto a `supabase` em UI.
- [ ] Nenhum dado fictício.
- [ ] Nenhum texto em inglês.
- [ ] Nenhum emoji.
- [ ] Nenhum ícone fora de `lucide-react`.
- [ ] Nenhum `console.log` em produção.
- [ ] Nenhum `any` em TypeScript.
- [ ] Nenhuma sombra fora de tokens.
- [ ] Nenhum espaçamento fora de tokens.
- [ ] Nenhum raio fora de tokens.
- [ ] Nenhuma fonte fora de Inter.
- [ ] Nenhuma cor hexadecimal em componente.
- [ ] Nenhuma margem negativa.
- [ ] Nenhum overflow horizontal.
- [ ] Nenhum corte de conteúdo.

---

## 8. REGRAS PARA IMPLEMENTAÇÃO

Esta seção é **permanente** e de **leitura obrigatória** por toda IA, desenvolvedor ou agente que venha a implementar qualquer parte deste projeto, presente ou futura. As regras abaixo são inegociáveis e devem ser aplicadas em **toda e qualquer** tarefa de implementação.

### 8.1 Regras de Comportamento da IA

1. **Nunca interpretar requisitos.** Em caso de ambiguidade, parar e perguntar.
2. **Nunca criar dados fictícios.** Em nenhuma hipótese, em nenhum ambiente.
3. **Nunca alterar layouts.** Aprovado é aprovado. Mudança requer nova aprovação.
4. **Nunca alterar medidas.** Espaçamentos, alturas, larguras, raios, sombras são fixos.
5. **Nunca alterar cores.** Tokens são a única fonte. Nenhum hexadecimal fora de `tokens.css`.
6. **Nunca alterar componentes.** Versões, variantes e props são as documentadas.
7. **Nunca alterar arquitetura.** Estrutura de pastas, providers, serviços, hooks são fixos.
8. **Nunca criar atalhos técnicos.** Código limpo, componentização máxima, DRY.
9. **Nunca substituir bibliotecas sem autorização.** Toda troca exige justificativa e aprovação.
10. **Nunca adicionar dependências sem justificativa.** Cada dependência precisa de motivo registrado.
11. **Sempre reutilizar componentes existentes.** Componentes oficiais são a única opção.
12. **Sempre reutilizar tokens.** Cores, espaçamentos, raios, sombras, animações vêm de tokens.
13. **Sempre reutilizar constantes.** Toda constante está em `src/constants/`.
14. **Sempre seguir o Design System.** `DESIGN_SYSTEM.md` é lei.
15. **Sempre seguir a UI Specification.** `UI_SPECIFICATION.md` é lei.
16. **Sempre seguir a Core Architecture.** `CORE_ARCHITECTURE.md` é lei.

### 8.2 Protocolo de Bloqueio

Caso qualquer requisito de implementação esteja **incompleto**, **ambíguo** ou **contraditório**, a IA deve, **sem exceção**:

1. **Interromper a implementação** no exato ponto do conflito.
2. **Não tomar decisão unilateral** para destrancar o trabalho.
3. **Listar explicitamente** o que está faltando ou contradizendo.
4. **Apresentar opções** de interpretação, se possível.
5. **Aguardar decisão** explícita do solicitante antes de prosseguir.

### 8.3 Itens que Bloqueiam Implementação

Os itens abaixo bloqueiam a IA de prosseguir mesmo que a solicitação pareça simples:

- Especificação de cor, espaçamento, raio ou sombra sem token correspondente.
- Requisito de componente não documentado.
- Requisito de variante não documentada.
- Requisito de ícone fora do catálogo.
- Requisito de fonte fora de Inter.
- Requisito de dado que exige informação não fornecida (logo, planilha, credenciais).
- Requisito contraditório com qualquer documento oficial.

### 8.4 Frases Proibidas em Respostas de IA

A IA nunca deve utilizar, em hipótese alguma, as seguintes construções:

- "Aproximadamente X."
- "Em torno de X."
- "Pode ser X."
- "Preferencialmente X."
- "Eu sugiro X (mas pode ser diferente)."
- "Geralmente se usa X."
- "É comum fazer X assim."

Toda resposta deve conter **valores absolutos** ou **solicitação de esclarecimento**.

### 8.5 Itens que a IA Deve Verificar Antes de Codificar

Antes de iniciar qualquer linha de código, a IA deve confirmar mentalmente:

- [ ] O componente a ser criado/usar já existe em `components/ui/`?
- [ ] Os tokens visuais estão definidos em `DESIGN_SYSTEM.md`?
- [ ] As constantes estão em `CONSTANTS.md`?
- [ ] A rota (se aplicável) está em `constants/routes.ts`?
- [ ] A permissão (se aplicável) está em `PERMISSIONS.md`?
- [ ] A modelagem de dados (se aplicável) está em `DATABASE_SPECIFICATION.md`?
- [ ] A string de UI (se aplicável) está em `utils/textos.ts`?
- [ ] O ícone (se aplicável) está no catálogo?
- [ ] A animação (se aplicável) está em `DESIGN_SYSTEM.md`?

Se qualquer item acima não estiver satisfeito, a IA **deve parar** e solicitar registro prévio.

### 8.6 Idioma da Resposta

- Toda comunicação com o solicitante deve ser em **Português (Brasil)**.
- Todo texto visível em código deve ser em **Português (Brasil)**.
- Comentários em código, quando estritamente necessários, devem ser em **Português (Brasil)**.
- Mensagens de commit devem ser em **Português (Brasil)**.
- Documentação deve ser em **Português (Brasil)**.

### 8.7 Escopo da IA

A IA só pode implementar:

- O que está explicitamente aprovado em ata ou nesta documentação.
- O que não viola nenhuma regra deste documento.

A IA **não pode**:

- "Melhorar" o design.
- "Otimizar" tokens sem aprovação.
- "Limpar" código que não foi explicitamente solicitado.
- "Padronizar" segundo critérios próprios.
- "Adicionar" dependências por conta própria.
- "Refatorar" arquitetura sem aprovação.

### 8.8 Vigência desta Seção

Esta seção é **permanente** e não pode ser removida. Mudanças em seu conteúdo exigem:

- Justificativa documentada.
- Aprovação explícita.
- Atualização da versão do documento.

---

## 9. Vigência do Documento

Este documento entra em vigor a partir da aprovação da arquitetura e permanece vigente até substituição formal aprovada.

Mudanças neste documento exigem aprovação explícita e atualização da versão.
