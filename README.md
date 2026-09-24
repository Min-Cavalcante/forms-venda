# Gauss Energia — Formulário de Venda

Formulário interno para registro de vendas. Construído com HTML/CSS/JS puros,
seguindo o Design System Gauss Energia.

---

## Estrutura de arquivos

```
gauss-sales-form/
├── index.html            ← Formulário principal
├── colors_and_type.css   ← Design System tokens
├── form.css              ← Estilos do formulário
├── form.js               ← Lógica e validação
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

## Como publicar

### 1 — Prepare os arquivos

1. Copie seus arquivos de fonte Sora para a pasta `fonts/`
2. Copie o `logo.svg` para a raiz
3. Copie o `colors_and_type.css` para a raiz

### 2 — Publique no GitHub

```bash
git init
git add .
git commit -m "feat: formulário de venda Gauss Energia"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/gauss-sales-form.git
git push -u origin main
```

### 3 — Publique no Vercel

**Via interface (recomendado):**
1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **Add New Project**
3. Importe o repositório criado acima
4. Clique em **Deploy** — nenhuma configuração adicional é necessária

**Via CLI:**
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## Integração com backend / webhook

Abra `form.js` e defina `API_ENDPOINT`:

```js
// Make / Integromat
const API_ENDPOINT = 'https://hook.make.com/SEU_WEBHOOK';

// API própria
const API_ENDPOINT = 'https://api.seudominio.com/vendas';

// Vercel serverless (crie api/submit.js)
const API_ENDPOINT = '/api/submit';
```

Os dados são enviados via `POST` com `Content-Type: application/json`.

---

## Estrutura do JSON enviado

```json
{
  "_meta": { "timestamp": "2025-01-01T12:00:00.000Z", "source": "gauss-sales-form-v1" },
  "venda": {
    "statusVenda": "fechado",
    "responsavel": "Nome",
    "nomeCliente": "Cliente",
    "codigoProjeto": "GAU-2025-001",
    "cidade": "Salvador",
    "potenciaKwp": "12.5"
  },
  "pagamento": {
    "statusPagamento": "confirmado",
    "valorServico": "1.500,00",
    "formaPagamento": "1x_pix",
    "dataPagamento": "2025-01-15"
  },
  "contrato": { "statusContrato": "assinado", "dataContrato": "2025-01-10" },
  "servico": { "servicoContratado": "garantia_estendida" },
  "acoesSelecionadas": ["forms_visita_comercial", "trello_garantia"],
  "formsVisitaComercial": {
    "cpfCnpj": "000.000.000-00",
    "telefone": "(71) 99999-9999",
    "email": "cliente@email.com",
    "descricaoPagamento": "..."
  },
  "trelloGarantia": { "etiquetas": ["abrir_solicitacao", "pacote_virtual"] }
}
```

---

## Notas de desenvolvimento

- **Sem dependências externas** — funciona 100% offline após carregado
- **Modo dev** — com `API_ENDPOINT = null` os dados são logados no console do browser
- `colors_and_type.css` importa as fontes via Google Fonts como fallback;
  os arquivos `.ttf` em `fonts/` têm prioridade quando presentes
