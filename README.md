# Gauss Energia — Formulário de Venda

Formulário interno para registro de vendas. Dados processados via **n8n**.
Construído com HTML/CSS/JS puros, sem dependências externas.

---

## Estrutura de arquivos

```
gauss-sales-form/
├── index.html            ← Formulário principal
├── colors_and_type.css   ← Design System tokens
├── form.css              ← Estilos do formulário
├── form.js               ← Lógica, validação e integração n8n
├── logo.svg              ← Logo Gauss Energia
├── fonts/
│   ├── Sora-Thin.ttf
│   ├── Sora-ExtraLight.ttf
│   ├── Sora-Light.ttf
│   ├── Sora-SemiBold.ttf
│   ├── Sora-Bold.ttf
│   └── Sora-ExtraBold.ttf
├── vercel.json
└── README.md
```

---

## 1 — Configurar o webhook no n8n

### 1.1 — Criar o workflow

1. Acesse seu n8n e crie um **novo Workflow**
2. Adicione o node **Webhook** como trigger
3. Configure o node:

| Campo            | Valor recomendado           |
|------------------|-----------------------------|
| HTTP Method      | `POST`                      |
| Path             | `gauss-venda`               |
| Response Mode    | `Respond to Webhook` node   |
| Authentication   | `None` ou `Header Auth`     |

4. Ative o workflow (botão **Activate** no canto superior direito)
5. Copie as duas URLs geradas:

```
Teste:     https://SEU.app.n8n.cloud/webhook-test/SEU-ID
Produção:  https://SEU.app.n8n.cloud/webhook/SEU-ID
```

### 1.2 — Colar as URLs no formulário

Abra `form.js` e atualize as constantes no topo:

```js
// URL de produção (workflow ATIVO no n8n)
const N8N_WEBHOOK_PROD = 'https://SEU.app.n8n.cloud/webhook/SEU-ID';

// URL de teste (clique em "Listen for test event" no n8n)
const N8N_WEBHOOK_TEST = 'https://SEU.app.n8n.cloud/webhook-test/SEU-ID';

// false = produção  |  true = teste
const N8N_USE_TEST_URL = false;
```

### 1.3 — Autenticação (opcional, recomendado)

No node Webhook do n8n, ative **Header Auth**:
- **Name:** `Authorization`
- **Value:** `Bearer SEU_TOKEN_SECRETO`

Em seguida, no `form.js`:
```js
const N8N_AUTH_TOKEN = 'SEU_TOKEN_SECRETO';
```

> ⚠️ **Nunca** comite tokens no repositório público.
> Considere usar variáveis de ambiente via Vercel para projetos privados.

### 1.4 — Habilitar CORS no n8n

Se o formulário e o n8n estiverem em domínios diferentes
(o que é quase sempre o caso com Vercel), habilite CORS:

**n8n Cloud / Self-hosted:**
No node Webhook → aba **Settings** → ative
`Allow Cross-Origin Resource Sharing (CORS)` e defina:

```
Allowed Origins: https://seu-projeto.vercel.app
```

Ou para liberar qualquer origem durante testes: `*`

---

## 2 — Estrutura do JSON enviado ao n8n

O formulário envia um `POST` com `Content-Type: application/json`:

```json
{
  "_meta": {
    "timestamp":   "2025-01-15T14:30:00.000Z",
    "timestampBR": "15/01/2025, 11:30:00",
    "source":      "gauss-sales-form-v1",
    "environment": "production",
    "formVersion": "1.0.0"
  },
  "venda": {
    "statusVenda":   "fechado",
    "responsavel":   "Ana Lima",
    "nomeCliente":   "João Silva",
    "codigoProjeto": "GAU-2025-042",
    "cidade":        "Salvador",
    "potenciaKwp":   12.5
  },
  "pagamento": {
    "statusPagamento": "confirmado",
    "valorServico":    "1.500,00",
    "formaPagamento":  "1x_pix",
    "dataPagamento":   "2025-01-15"
  },
  "contrato": {
    "statusContrato": "assinado",
    "dataContrato":   "2025-01-10"
  },
  "servico": {
    "servicoContratado": "garantia_estendida"
  },
  "acoesSelecionadas": [
    "forms_visita_comercial",
    "trello_garantia"
  ],
  "formsVisitaComercial": {
    "cpfCnpj":            "000.000.000-00",
    "telefone":           "(71) 99999-9999",
    "email":              "joao@email.com",
    "descricaoPagamento": "Pix recebido em 14/01"
  },
  "trelloGarantia": {
    "etiquetas": ["abrir_solicitacao", "pacote_virtual"]
  }
}
```

> Os blocos condicionais (`formsVisitaComercial`, `formsSolicitacaoServico`,
> `trelloGarantia`, `trelloLimpezas`) **só aparecem no JSON** quando as
> ações correspondentes estiverem selecionadas.

---

## 3 — Sugestão de workflow n8n

```
[Webhook]
    │
    ├─ IF acoesSelecionadas inclui "forms_visita_comercial"
    │       └─ [HTTP Request] → Forms Visita Comercial
    │
    ├─ IF acoesSelecionadas inclui "forms_solicitacao_servico"
    │       └─ [HTTP Request] → Forms Solicitação de Serviço
    │
    ├─ IF acoesSelecionadas inclui "trello_garantia"
    │       └─ [Trello] → Criar Card no Board Garantia
    │
    ├─ IF acoesSelecionadas inclui "trello_limpezas"
    │       └─ [Trello] → Criar Card no Board Limpezas
    │
    └─ [Respond to Webhook] → { "success": true }
```

---

## 4 — Publicar no GitHub

```bash
git init
git add .
git commit -m "feat: formulário de venda Gauss Energia + integração n8n"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/gauss-sales-form.git
git push -u origin main
```

---

## 5 — Publicar no Vercel

**Via interface (recomendado):**
1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe o repositório do GitHub
3. Clique em **Deploy** — nenhuma configuração adicional necessária

**Via CLI:**
```bash
npm i -g vercel
vercel login
vercel --prod
```

Após o deploy, atualize o **Allowed Origins** do CORS no n8n
com a URL gerada pelo Vercel (ex: `https://gauss-sales-form.vercel.app`).

---

## 6 — Modo de desenvolvimento (sem n8n configurado)

Se `N8N_WEBHOOK_PROD` ainda contiver `SEU_USUARIO` ou `SEU-WEBHOOK-ID`,
o formulário entra em **modo dev**: os dados são exibidos no
console do navegador (F12 → Console) em vez de serem enviados.

Um aviso em vermelho aparece no console ao carregar a página:

```
⚠️  Webhook n8n não configurado.
    Abra form.js e atualize N8N_WEBHOOK_PROD com a URL real do seu workflow.
```
