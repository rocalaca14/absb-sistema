# SHEETS_FORMAT — Projeto ABSB

**Associação dos Bugueiros de São Bento**
**Versão:** 1.0
**Data:** 22/07/2026
**Status:** Vigente — base para o módulo de importação

---

## 1. Propósito

Este documento define o **formato esperado** da planilha Google Sheets de associados, as regras de validação, o tratamento de duplicados, o preview e o relatório de erros da importação.

A planilha real será fornecida posteriormente. Este documento antecipa o contrato técnico que a planilha deve atender (ou ser adaptada via `mapeamento.ts`).

---

## 2. Formato da Planilha

### 2.1 Fonte

- Google Sheets pública, compartilhada com permissão "Qualquer pessoa com o link pode ver".
- Formato de leitura: `/pub?output=csv` ou URL `/edit?usp=sharing` convertida para CSV.
- Apenas a primeira aba (sheet) é lida.
- Apenas valores são lidos (sem fórmulas — Google Sheets entrega valores calculados via CSV).

### 2.2 Estrutura Esperada

A planilha deve conter **uma linha de cabeçalho** e **N linhas de dados**. Cada linha representa um associado.

| Coluna | Nome do cabeçalho | Tipo | Obrigatório | Validação | Normalização |
|---|---|---|---|---|---|
| A | `nome` | string | Sim | Não vazio, máximo 200 caracteres | Trim de espaços |
| B | `cpf` | string | Não | 11 dígitos quando presente | Apenas dígitos (sem máscara) |
| C | `rg` | string | Não | — | Trim |
| D | `telefone` | string | Não | — | Apenas dígitos (sem máscara) |
| E | `email` | string | Não | Formato de e-mail válido | Lowercase + trim |
| F | `endereco` | string | Não | — | Trim |
| G | `numero` | string | Não | — | Trim |
| H | `complemento` | string | Não | — | Trim |
| I | `bairro` | string | Não | — | Trim |
| J | `cidade` | string | Não | — | Trim |
| K | `uf` | string | Não | Uma das 27 UFs do Brasil | Uppercase |
| L | `cep` | string | Não | 8 dígitos quando presente | Apenas dígitos |
| M | `veiculo_marca` | string | Não | — | Trim |
| N | `veiculo_modelo` | string | Não | — | Trim |
| O | `veiculo_ano` | int | Não | 1900 ≤ ano ≤ 2100 | Parse para número |
| P | `veiculo_placa` | string | Não | Formato antigo (AAA-9999) ou Mercosul (AAA9A99) | Uppercase, sem hífen |
| Q | `veiculo_cor` | string | Não | — | Trim |
| R | `categoria` | string | Não | — | Trim |
| S | `data_nascimento` | date | Não | dd/mm/yyyy ou yyyy-mm-dd | Parse para ISO date |
| T | `data_filiacao` | date | Não | dd/mm/yyyy ou yyyy-mm-dd | Parse para ISO date |
| U | `observacoes` | string | Não | Máximo 1000 caracteres | Trim |

> **Observação:** os nomes dos cabeçalhos são o **contrato**. Qualquer desvio requer atualização de `core/sheets/mapeamento.ts`. Nomes em **português** para clareza do operador.

### 2.3 Valores Vazios

- Células vazias são tratadas como `null` no banco (exceto `nome` que é obrigatório).
- Strings vazias após trim são convertidas para `null` em campos opcionais.
- `0` em `veiculo_ano` é tratado como `null`.

### 2.4 Linhas Vazias

- Linhas completamente vazias são ignoradas.
- Linhas com apenas `nome` vazio mas outros campos preenchidos são registradas como erro (`VALIDATION_FAILED`).

---

## 3. Validação dos Dados

### 3.1 Validação por Campo

| Campo | Validação |
|---|---|
| `nome` | Não vazio, máximo 200 caracteres |
| `cpf` | 11 dígitos OU vazio. Se preenchido e já existe em `associados`, dispara regra de duplicata. |
| `email` | Regex `^[^\s@]+@[^\s@]+\.[^\s@]+$` OU vazio |
| `uf` | Deve ser uma das 27 UFs: AC, AL, AP, AM, BA, CE, DF, ES, GO, MA, MT, MS, MG, PA, PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO |
| `veiculo_ano` | Inteiro entre 1900 e 2100 |
| `veiculo_placa` | 7 caracteres alfanuméricos (sem hífen), uppercase |
| `data_nascimento`, `data_filiacao` | Data válida. Aceita `dd/mm/yyyy`, `yyyy-mm-dd`. |

### 3.2 Schema Zod

```ts
const associadoSchema = z.object({
  nome: z.string().trim().min(1, 'Nome obrigatório').max(200),
  cpf: z.string().trim().regex(/^\d{11}$/, 'CPF deve ter 11 dígitos').optional().or(z.literal('')),
  rg: z.string().trim().max(20).optional(),
  telefone: z.string().trim().max(20).optional(),
  email: z.string().trim().email('E-mail inválido').max(200).optional().or(z.literal('')),
  endereco: z.string().trim().max(200).optional(),
  numero: z.string().trim().max(20).optional(),
  complemento: z.string().trim().max(100).optional(),
  bairro: z.string().trim().max(100).optional(),
  cidade: z.string().trim().max(100).optional(),
  uf: z.enum(UFS).optional().or(z.literal('')),
  cep: z.string().trim().regex(/^\d{8}$/, 'CEP deve ter 8 dígitos').optional().or(z.literal('')),
  veiculo_marca: z.string().trim().max(50).optional(),
  veiculo_modelo: z.string().trim().max(50).optional(),
  veiculo_ano: z.coerce.number().int().min(1900).max(2100).optional(),
  veiculo_placa: z.string().trim().regex(/^[A-Z0-9]{7}$/, 'Placa inválida').optional().or(z.literal('')),
  veiculo_cor: z.string().trim().max(30).optional(),
  categoria: z.string().trim().max(50).optional(),
  data_nascimento: z.coerce.date().optional(),
  data_filiacao: z.coerce.date().optional(),
  observacoes: z.string().trim().max(1000).optional(),
});
```

---

## 4. Tratamento de Duplicados

### 4.1 Chave de Upsert

- **Primária:** `cpf` (quando presente e válido).
- **Secundária:** `nome` + `data_nascimento` (quando CPF ausente).

### 4.2 Regra

- Linha com `cpf` que já existe em `associados` → **UPDATE** dos demais campos.
- Linha com `cpf` que **não** existe → **INSERT**.
- Linha sem `cpf` e com `nome + data_nascimento` que já existe → **UPDATE**.
- Linha sem `cpf` e com `nome + data_nascimento` que **não** existe → **INSERT**.
- Linha sem `cpf` E sem `data_nascimento` e com `nome` que já existe → **não é duplicata** (nomes homônimos são permitidos). Inserir nova linha.

### 4.3 Preservação de Dados

Ao atualizar, **campos vazios na planilha** (após trim) **não sobrescrevem** valores existentes no banco. Apenas campos com valor presente na planilha sobrescrevem.

Exceção: campos que representam correção explícita (ex: `telefone` corrigido para um novo número) sobrescrevem normalmente.

### 4.4 Implementação

```ts
// upsert: usa cpf como chave quando presente
const { data, error } = await supabase
  .from('associados')
  .upsert(linhaNormalizada, { onConflict: 'cpf' });
```

---

## 5. Preview Antes da Importação

### 5.1 Comportamento

Antes de executar a importação, o sistema exibe um **preview** das primeiras 10 linhas com:

- Nome do associado
- CPF (mascarado: `***.456.***-00`)
- Status da validação: ✓ válido, ✗ inválido, ⚠ aviso

### 5.2 Estatísticas do Preview

- Total de linhas na planilha (excluindo cabeçalho e vazias)
- Linhas válidas
- Linhas com erro
- Duplicatas detectadas (com base em `cpf` ou `nome + data_nascimento`)

### 5.3 Botões

- **Cancelar** — fecha o preview, nada é gravado.
- **Confirmar importação** — executa o upsert em lote.

---

## 6. Relatório de Erros

### 6.1 Estrutura

Cada erro contém:

```ts
interface ImportError {
  linha: number;          // número da linha (1-indexed, contando dados)
  coluna?: string;        // nome do campo com erro
  valor?: unknown;        // valor que causou o erro
  codigo: ErrorCode;      // código do erro (VALIDATION_FAILED, CONFLICT, etc.)
  mensagem: string;       // mensagem amigável
}
```

### 6.2 Limite

- Até **50 erros** são registrados.
- Se houver mais de 50, a importação é interrompida e o usuário é notificado.

### 6.3 Persistência

Todos os erros são salvos em `importacoes.relatorio_erros` (jsonb) ao final da execução, junto com totais.

### 6.4 Exemplo de Relatório

```json
[
  {
    "linha": 5,
    "coluna": "cpf",
    "valor": "123.456.789-0",
    "codigo": "VALIDATION_FAILED",
    "mensagem": "CPF deve ter 11 dígitos."
  },
  {
    "linha": 12,
    "coluna": "email",
    "valor": "invalido@",
    "codigo": "VALIDATION_FAILED",
    "mensagem": "E-mail inválido."
  },
  {
    "linha": 23,
    "coluna": "uf",
    "valor": "XX",
    "codigo": "VALIDATION_FAILED",
    "mensagem": "UF inválida."
  }
]
```

---

## 7. Resumo da Importação (Toast Final)

Após execução, exibe toast com:

- `N inseridos`
- `M atualizados`
- `K erros` (com link "Ver detalhes" se K > 0)
- Duração da execução

Se houver erros, um botão **"Baixar relatório"** oferece download em JSON.

---

## 8. Auditoria

Toda execução de importação:

- Grava um registro em `importacoes` (auditoria da execução).
- Gera entradas em `audit_log` para cada `associados` inserido/atualizado.
- Captura `executada_por` (auth.uid do usuário que disparou).

---

## 9. Limites

| Limite | Valor | Justificativa |
|---|---|---|
| Linhas por planilha | 5.000 | Performance e limites de API |
| Erros registrados | 50 | Antes de interromper |
| Tamanho do batch (upsert) | 500 | Tamanho do chunk para Supabase |
| Timeout de fetch | 30 segundos | Planilhas grandes em redes lentas |

---

## 10. Pendência

- Planilha real do cliente (substituirá o cabeçalho documentado se diferente).
- Mapeamento final em `core/sheets/mapeamento.ts` (vazio até a planilha chegar).

---

## 11. Próximo Passo

A estrutura de importação será criada em `core/sheets/{client,parser,mapeamento}.ts` com esqueleto funcional. Lógica de upsert, validação e relatório serão implementados em fase futura (após a planilha real chegar).
