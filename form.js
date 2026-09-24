/* ============================================================
   Gauss Energia — form.js
   Lógica do Formulário de Venda
   Integração: n8n via Webhook
   ============================================================ */
'use strict';

/* ══════════════════════════════════════════════════════════════
   ██  N8N — CONFIGURAÇÃO DO WEBHOOK
   ══════════════════════════════════════════════════════════════

   PASSO A PASSO:
   1. No n8n, crie um novo Workflow
   2. Adicione o node "Webhook"
   3. Configure:
        · HTTP Method → POST
        · Path        → gauss-venda  (ou qualquer nome)
        · Response    → "Respond to Webhook" node (recomendado)
                        ou "Immediately" para resposta rápida
        · Authentication → opcional (Header Auth recomendado)
   4. Copie as URLs geradas e cole abaixo:

   PRODUÇÃO  → ative o workflow antes de usar
   TESTE     → clique em "Test step" / "Listen for test event" no n8n
               e defina N8N_USE_TEST_URL = true

   Formato das URLs:
     https://SEU_USUARIO.app.n8n.cloud/webhook/SEU-WEBHOOK-ID
     https://SEU_USUARIO.app.n8n.cloud/webhook-test/SEU-WEBHOOK-ID

   Se você usa n8n self-hosted:
     https://n8n.seudominio.com.br/webhook/SEU-WEBHOOK-ID

   ⚠️  Não comite tokens de autenticação no repositório.
       Configure autenticação diretamente no node Webhook do n8n.
   ══════════════════════════════════════════════════════════════ */

const N8N_WEBHOOK_PROD = 'https://n8n.gaussenergia.com.br/webhook/forms-venda';
const N8N_WEBHOOK_TEST = 'https://n8n.gaussenergia.com.br/webhook-test/forms-venda';
/* true  → usa URL de teste (n8n deve estar em "Listen for test event")
   false → usa URL de produção (workflow deve estar ATIVO no n8n)       */
const N8N_USE_TEST_URL = true;

/* Cabeçalho de autenticação opcional — configure em Header Auth no n8n.
   Se não usar autenticação, deixe N8N_AUTH_TOKEN como string vazia ''. */
const N8N_AUTH_TOKEN = '';

/* ══════════════════════════════════════════════════════════════
   Não edite abaixo desta linha, salvo necessidade específica.
   ══════════════════════════════════════════════════════════════ */

const N8N_ENDPOINT = N8N_USE_TEST_URL ? N8N_WEBHOOK_TEST : N8N_WEBHOOK_PROD;

/* ─── CIDADES ────────────────────────────────────────────────── */
const CIDADES = [
  'Abaíra','Abaré','Acajutiba','Adustina','Água Fria','Aiquara',
  'Alagoinhas','Alcobaça','Almadina','Amargosa','Amélia Rodrigues',
  'América Dourada','Anagé','Andaraí','Andorinha','Angical','Anguera',
  'Antas','Antônio Cardoso','Antônio Gonçalves','Aporá','Apuarema',
  'Araçás','Aracatu','Araci','Aramari','Arataca','Aratuípe',
  'Aurelino Leal','Baianópolis','Baixa Grande','Banzaê','Barra',
  'Barra da Estiva','Barra do Choça','Barra do Mendes','Barra do Rocha',
  'Barreiras','Barro Alto','Barro Preto','Barrocas','Belmonte',
  'Belo Campo','Biritinga','Boa Nova','Boa Vista do Tupim',
  'Bom Jesus da Lapa','Bom Jesus da Serra','Boninal','Bonito','Boquira',
  'Botuporã','Brejões','Brejolândia','Brotas de Macaúbas','Brumado',
  'Buerarema','Buritirama','Caatiba','Cabaceiras do Paraguaçu','Cachoeira',
  'Caculé','Caém','Caetanos','Caetité','Cafarnaum','Cairu',
  'Caldeirão Grande','Camacan','Camaçari','Camamu',
  'Campo Alegre de Lourdes','Campo Formoso','Canápolis','Canarana',
  'Canavieiras','Candeal','Candeias','Candiba','Cândido Sales',
  'Cansanção','Canudos','Capela do Alto Alegre','Capim Grosso',
  'Caraíbas','Caravelas','Cardeal da Silva','Carinhanha','Casa Nova',
  'Castro Alves','Catolândia','Catu','Caturama','Central','Chorrochó',
  'Cícero Dantas','Cipó','Coaraci','Cocos','Conceição da Feira',
  'Conceição do Almeida','Conceição do Coité','Conceição do Jacuípe',
  'Conde','Condeúba','Contendas do Sincorá','Coração de Maria',
  'Cordeiros','Coribe','Coronel João Sá','Correntina','Cotegipe',
  'Cravolândia','Crisópolis','Cristópolis','Cruz das Almas','Curaçá',
  'Dário Meira',"Dias d'Ávila",'Dom Basílio','Dom Macedo Costa',
  'Elísio Medrado','Encruzilhada','Entre Rios','Érico Cardoso',
  'Esplanada','Euclides da Cunha','Eunápolis','Fátima','Feira da Mata',
  'Feira de Santana','Filadélfia','Firmino Alves','Floresta Azul',
  'Formosa do Rio Preto','Gandu','Gavião','Gentio do Ouro','Glória',
  'Gongogi','Governador Mangabeira','Guajeru','Guanambi','Guaratinga',
  'Heliópolis','Iaçu','Ibiassucê','Ibicaraí','Ibicoara','Ibicuí',
  'Ibipeba','Ibipitanga','Ibiquera','Ibirapitanga','Ibirapuã',
  'Ibirataia','Ibitiara','Ibititá','Ibotirama','Ichu','Igaporã',
  'Igrapiúna','Iguaí','Ilhéus','Inhambupe','Ipecaetá','Ipiaú',
  'Ipirá','Ipupiara','Irajuba','Iramaia','Iraquara','Irará','Irecê',
  'Itabela','Itaberaba','Itabuna','Itacaré','Itaeté','Itagi',
  'Itagibá','Itagimirim','Itaguaçu da Bahia','Itaju do Colônia',
  'Itajuípe','Itamaraju','Itamari','Itambé','Itanagra','Itanhém',
  'Itaparica','Itapé','Itapebi','Itapetinga','Itapicuru','Itapitanga',
  'Itaquara','Itarantim','Itatim','Itiruçu','Itiúba','Itororó',
  'Ituaçu','Ituberá','Iuiú','Jaborandi','Jacaraci','Jacobina',
  'Jaguaquara','Jaguarari','Jaguaripe','Jandaíra','Jequié',
  'Jeremoabo','Jiquiriçá','Jitaúna','João Dourado','Juazeiro',
  'Jucuruçu','Jussara','Jussari','Jussiape','Lafaiete Coutinho',
  'Lagoa Real','Laje','Lajedão','Lajedinho','Lajedo do Tabocal',
  'Lamarão','Lapão','Lauro de Freitas','Lençóis','Licínio de Almeida',
  'Livramento de Nossa Senhora','Luís Eduardo Magalhães','Macajuba',
  'Macarani','Macaúbas','Macururé','Madre de Deus','Maetinga',
  'Maiquinique','Mairi','Malhada','Malhada de Pedras','Manoel Vitorino',
  'Mansidão','Maracás','Maragogipe','Maraú','Marcionílio Souza',
  'Mascote','Mata de São João','Matina','Medeiros Neto','Miguel Calmon',
  'Milagres','Mirangaba','Mirante','Monte Santo','Morpará',
  'Morro do Chapéu','Mortugaba','Mucugê','Mucuri','Mulungu do Morro',
  'Mundo Novo','Muniz Ferreira','Muquém do São Francisco','Muritiba',
  'Mutuípe','Nazaré','Nilo Peçanha','Nordestina','Nova Canaã',
  'Nova Fátima','Nova Ibiá','Nova Itarana','Nova Redenção','Nova Soure',
  'Nova Viçosa','Novo Horizonte','Novo Triunfo','Olindina',
  'Oliveira dos Brejinhos','Ouriçangas','Ourolândia',
  'Palmas de Monte Alto','Palmeiras','Paramirim','Paratinga',
  'Paripiranga','Pau Brasil','Paulo Afonso','Pé de Serra','Pedrão',
  'Pedro Alexandre','Piatã','Pilão Arcado','Pindaí','Pindobaçu',
  'Pintadas','Piraí do Norte','Piripá','Piritiba','Planaltino',
  'Planalto','Poções','Pojuca','Ponto Novo','Porto Seguro',
  'Potiraguá','Prado','Presidente Dutra','Presidente Jânio Quadros',
  'Presidente Tancredo Neves','Queimadas','Quijingue','Quixabeira',
  'Rafael Jambeiro','Remanso','Retirolândia','Riachão das Neves',
  'Riachão do Jacuípe','Riacho de Santana','Ribeira do Amparo',
  'Ribeira do Pombal','Ribeirão do Largo','Rio de Contas',
  'Rio do Antônio','Rio do Pires','Rio Real','Rodelas','Ruy Barbosa',
  'Salinas da Margarida','Salvador','Santa Bárbara','Santa Brígida',
  'Santa Cruz Cabrália','Santa Cruz da Vitória','Santa Inês',
  'Santa Luzia','Santa Maria da Vitória','Santa Rita de Cássia',
  'Santa Terezinha','Santaluz','Santana','Santanópolis','Santo Amaro',
  'Santo Antônio de Jesus','Santo Estêvão','São Desidério',
  'São Domingos','São Felipe','São Félix','São Félix do Coribe',
  'São Francisco do Conde','São Gabriel','São Gonçalo dos Campos',
  'São José da Vitória','São José do Jacuípe','São Miguel das Matas',
  'São Sebastião do Passé','Sapeaçu','Sátiro Dias','Saubara','Saúde',
  'Seabra','Sebastião Laranjeiras','Senhor do Bonfim','Sento Sé',
  'Serra do Ramalho','Serra Dourada','Serra Preta','Serrinha',
  'Serrolândia','Simões Filho','Sítio do Mato','Sítio do Quinto',
  'Sobradinho','Souto Soares','Tabocas do Brejo Velho','Tanhaçu',
  'Tanque Novo','Tanquinho','Taperoá','Tapiramutá',
  'Teixeira de Freitas','Teodoro Sampaio','Teofilândia','Teolândia',
  'Terra Nova','Tremedal','Tucano','Uauá','Ubaíra','Ubaitaba',
  'Ubatã','Uibaí','Umburanas','Una','Urandi','Uruçuca','Utinga',
  'Valença','Valente','Várzea da Roça','Várzea do Poço','Várzea Nova',
  'Varzedo','Vera Cruz','Vereda','Vitória da Conquista','Wagner',
  'Wanderley','Wenceslau Guimarães','Xique-Xique',
  'Petrolina','Araripina','Ipojuca',
];

/* ─── MAPA DE CONDICIONAIS ───────────────────────────────────── */
const COND_MAP = {
  forms_visita_comercial:    'cond_fvc',
  forms_solicitacao_servico: 'cond_fss',
  trello_garantia:           'cond_tg',
  trello_limpezas:           'cond_tl',
};

/* ─── HELPERS DE LEITURA DE TEXTO VISÍVEL ───────────────────────
   Usam o texto que o usuário vê, não o value interno do HTML.
─────────────────────────────────────────────────────────────── */

/** Retorna o texto visível da opção selecionada num <select> */
function selText(id) {
  const el = document.getElementById(id);
  if (!el || el.selectedIndex < 0) return '';
  return el.options[el.selectedIndex].text.trim();
}

/** Retorna o texto visível do radio selecionado num grupo */
function radioText(name) {
  const checked = form.querySelector(`[name="${name}"]:checked`);
  if (!checked) return '';
  // Pega o <span> dentro do .seg__item (controle segmentado)
  return checked.closest('.seg__item')
    ?.querySelector('span')
    ?.textContent.trim() ?? checked.value;
}

/** Retorna array com os textos visíveis dos checkboxes marcados */
function chkdText(name) {
  return [...form.querySelectorAll(`[name="${name}"]:checked`)].map(el => {
    // Action cards (.ac) → título do card
    const acTitle = el.closest('.ac')
      ?.querySelector('.ac__title')
      ?.textContent.trim();
    if (acTitle) return acTitle;

    // Tags (.tag) → texto do span
    const tagText = el.closest('.tag')
      ?.querySelector('span')
      ?.textContent.trim();
    if (tagText) return tagText;

    // Fallback: usa o value mesmo
    return el.value;
  });
}

/* ─── DOM REFS ───────────────────────────────────────────────── */
let form, submitBtn, resetBtn, successModal, toastEl;

/* ─── INIT ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  form         = document.getElementById('salesForm');
  submitBtn    = document.getElementById('btnSubmit');
  resetBtn     = document.getElementById('btnReset');
  successModal = document.getElementById('successModal');
  toastEl      = document.getElementById('toast');

  populateCities();
  bindConditionals();
  bindMasks();
  bindLiveValidation();
  bindSubmit();
  bindReset();
  bindModal();

  /* Aviso no console se o webhook ainda não foi configurado */
  if (
    N8N_WEBHOOK_PROD.includes('SEU_USUARIO') ||
    N8N_WEBHOOK_PROD.includes('SEU-WEBHOOK-ID')
  ) {
    console.warn(
      '%c[Gauss Form] ⚠️  Webhook n8n não configurado.\n' +
      'Abra form.js e atualize N8N_WEBHOOK_PROD com a URL real do seu workflow.',
      'color: #D9534F; font-weight: bold;'
    );
  }
});

/* ─── CIDADES ────────────────────────────────────────────────── */
function populateCities() {
  const sel  = document.getElementById('cidade');
  const frag = document.createDocumentFragment();
  CIDADES.forEach(city => {
    const opt = document.createElement('option');
    opt.value       = city;
    opt.textContent = city;
    frag.appendChild(opt);
  });
  sel.appendChild(frag);
}

/* ─── CONDICIONAIS ───────────────────────────────────────────── */
function bindConditionals() {
  form.querySelectorAll('input[name="acoes"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const id = COND_MAP[cb.value];
      if (!id) return;
      const section = document.getElementById(id);
      if (!section) return;
      section.hidden = !cb.checked;
      section.setAttribute('aria-hidden', String(!cb.checked));
      if (cb.checked) {
        section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });
}

/* ─── MÁSCARAS ───────────────────────────────────────────────── */
function bindMasks() {
  /* CPF / CNPJ */
  const cpfCnpj = document.getElementById('cpfCnpj');
  if (cpfCnpj) {
    cpfCnpj.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 14);
      if (v.length <= 11) {
        v = v.replace(/(\d{3})(\d)/,       '$1.$2');
        v = v.replace(/(\d{3})(\d)/,       '$1.$2');
        v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      } else {
        v = v.replace(/^(\d{2})(\d)/,               '$1.$2');
        v = v.replace(/^(\d{2})\.(\d{3})(\d)/,      '$1.$2.$3');
        v = v.replace(/\.(\d{3})(\d)/,              '.$1/$2');
        v = v.replace(/(\d{4})(\d)/,                '$1-$2');
      }
      e.target.value = v;
    });
  }

  /* Telefone */
  const tel = document.getElementById('telefone');
  if (tel) {
    tel.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      if      (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      else if (v.length > 6)  v = v.replace(/^(\d{2})(\d{4})(\d+)$/,   '($1) $2-$3');
      else if (v.length > 2)  v = v.replace(/^(\d{2})(\d+)$/,           '($1) $2');
      e.target.value = v;
    });
  }

  /* Valor (moeda BRL) */
  const valor = document.getElementById('valorServico');
  if (valor) {
    valor.addEventListener('input', e => {
      const digits = e.target.value.replace(/\D/g, '');
      if (!digits) { e.target.value = ''; return; }
      const num = parseInt(digits, 10) / 100;
      e.target.value = num.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    });
  }
}

/* ─── VALIDAÇÃO EM TEMPO REAL ────────────────────────────────── */
function bindLiveValidation() {
  form.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.closest('.fld')?.classList.contains('fld--has-error')) {
        validateField(field);
      }
    });
  });
}

/* ─── VALIDATE SINGLE FIELD ──────────────────────────────────── */
function validateField(field) {
  const fld = field.closest('.fld');
  if (!fld) return true;

  let msg = '';
  const label = fld.querySelector('.fld__lbl')?.textContent
    .replace('*', '').replace('obrigatório', '').trim() || 'Este campo';

  if (!field.value.trim()) {
    msg = `${label} é obrigatório.`;
  } else if (field.type === 'email' && !isValidEmail(field.value)) {
    msg = 'Informe um e-mail válido.';
  } else if (field.type === 'url' && field.value && !isValidUrl(field.value)) {
    msg = 'Informe uma URL válida (ex: https://…).';
  }

  setFieldError(fld, field, msg);
  return !msg;
}

function setFieldError(fld, field, msg) {
  const errEl = fld.querySelector('.fld__err');
  if (errEl) errEl.textContent = msg;
  fld.classList.toggle('fld--has-error', !!msg);
  field.classList.toggle('is-error', !!msg);
  const affix = field.closest('.inp-affix');
  if (affix) affix.classList.toggle('is-error', !!msg);
}

/* ─── VALIDAÇÃO COMPLETA ─────────────────────────────────────── */
function validateAll() {
  let allOk    = true;
  let firstErr = null;

  /* Radio: Status da Venda */
  const radios  = [...form.querySelectorAll('[name="statusVenda"]')];
  const radioOk = radios.some(r => r.checked);
  const radioFld = radios[0]?.closest('.fld');
  if (radioFld) {
    const errEl = radioFld.querySelector('.fld__err');
    if (!radioOk) {
      if (errEl) errEl.textContent = 'Status da Venda é obrigatório.';
      radioFld.classList.add('fld--has-error');
      allOk    = false;
      firstErr = firstErr || radioFld;
    } else {
      if (errEl) errEl.textContent = '';
      radioFld.classList.remove('fld--has-error');
    }
  }

  /* Demais campos required */
  form.querySelectorAll('[required]:not([type="radio"])').forEach(field => {
    const ok = validateField(field);
    if (!ok) {
      allOk    = false;
      firstErr = firstErr || field.closest('.fld') || field;
    }
  });

  if (!allOk && firstErr) {
    firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  return allOk;
}

/* ─── SUBMIT → N8N ───────────────────────────────────────────── */
function bindSubmit() {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateAll()) return;

    /* Bloqueia botão durante envio */
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Enviando…';

    try {
      const payload = collectData();

      /* Verifica se o webhook foi configurado */
      if (
        N8N_ENDPOINT.includes('SEU_USUARIO') ||
        N8N_ENDPOINT.includes('SEU-WEBHOOK-ID')
      ) {
        /* ── MODO DEV: sem webhook configurado ── */
        console.group('📋 Gauss Energia · Payload que seria enviado ao n8n');
        console.log('%cEndpoint (não configurado):', 'color:#D9534F;font-weight:bold;', N8N_ENDPOINT);
        console.log('%cPayload:', 'color:#39B54A;font-weight:bold;');
        console.log(JSON.stringify(payload, null, 2));
        console.groupEnd();
        await new Promise(r => setTimeout(r, 800));
        openModal();
        return;
      }

      /* ── ENVIO REAL PARA O N8N ── */
      const headers = {
        'Content-Type': 'application/json',
        'Accept':       'application/json',
      };

      /* Adiciona token de autenticação se configurado */
      if (N8N_AUTH_TOKEN) {
        headers['Authorization'] = `Bearer ${N8N_AUTH_TOKEN}`;
      }

      const res = await fetch(N8N_ENDPOINT, {
        method:  'POST',
        headers,
        body:    JSON.stringify(payload),
      });

      /* n8n retorna 200 para sucesso (produção e teste) */
      if (!res.ok) {
        const errBody = await res.text().catch(() => '');
        throw new Error(`n8n retornou ${res.status}: ${errBody || res.statusText}`);
      }

      /* Lê a resposta do n8n (pode ser JSON ou texto simples) */
      const contentType = res.headers.get('content-type') || '';
      let n8nResponse;
      if (contentType.includes('application/json')) {
        n8nResponse = await res.json();
      } else {
        n8nResponse = await res.text();
      }

      console.info('[Gauss Form] ✅ Enviado ao n8n:', n8nResponse);
      openModal();

    } catch (err) {
      console.error('[Gauss Form] ❌ Erro ao enviar para o n8n:', err);

      /* Mensagem de erro amigável */
      const isCors    = err instanceof TypeError && err.message === 'Failed to fetch';
      const friendlyMsg = isCors
        ? 'Não foi possível conectar ao n8n. Verifique as configurações de CORS no node Webhook.'
        : `Erro ao enviar: ${err.message}`;

      showToast(friendlyMsg, true);

    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = 'Registrar Venda';
    }
  });
}

/* ─── COLETA DE DADOS ────────────────────────────────────────── */
function collectData() {
  const val = id => (document.getElementById(id)?.value ?? '').trim();

  const data = {
    _meta: {
      timestamp:   new Date().toISOString(),
      timestampBR: new Date().toLocaleString('pt-BR', { timeZone: 'America/Bahia' }),
      source:      'gauss-sales-form-v1',
      environment: N8N_USE_TEST_URL ? 'test' : 'production',
      formVersion: '1.0.0',
    },

    venda: {
      statusVenda:   radioText('statusVenda'),       // "Em prospecção" ou "Fechado"
      responsavel:   val('responsavel'),
      nomeCliente:   val('nomeCliente'),
      codigoProjeto: val('codigoProjeto'),
      cidade:        val('cidade'),                  // cidade já é o próprio texto
      potenciaKwp:   parseFloat(val('potencia').replace(',', '.')) || null,
    },

    pagamento: {
      statusPagamento: selText('statusPagamento'),   // "Pagamento Confirmado"
      valorServico:    val('valorServico'),
      formaPagamento:  selText('formaPagamento'),    // "1× no Pix"
      dataPagamento:   val('dataPagamento'),
    },

    contrato: {
      statusContrato: selText('statusContrato'),     // "Assinado"
      dataContrato:   val('dataContrato'),
    },

    servico: {
      servicoContratado: selText('servicoContratado'), // "Garantia Estendida"
    },

    acoesSelecionadas: chkdText('acoes'),            // ["Forms Visita Comercial", ...]
  };

  /* ── Condicional: Forms Visita Comercial ── */
  if (!document.getElementById('cond_fvc').hidden) {
    data.formsVisitaComercial = {
      cpfCnpj:            val('cpfCnpj'),
      telefone:           val('telefone'),
      email:              val('email'),
      descricaoPagamento: val('descricaoPagamento'),
    };
  }

  /* ── Condicional: Forms Solicitação de Serviço ── */
  if (!document.getElementById('cond_fss').hidden) {
    data.formsSolicitacaoServico = {
      prioridade:           selText('prioridade'),          // "Alta"
      regiaoAtendimento:    selText('regiaoAtendimento'),   // "Salvador"
      linkMaps:             val('linkMaps'),
      endereco:             val('endereco'),
      naturezaSolicitacao:  selText('naturezaSolicitacao'), // "Limpeza"
      descricaoSolicitacao: val('descricaoSolicitacao'),
    };
  }

  /* ── Condicional: Trello Garantia ── */
  if (!document.getElementById('cond_tg').hidden) {
    data.trelloGarantia = {
      etiquetas: chkdText('etiq_garantia'), // ["Abrir Solicitação", "Pacote Virtual"]
    };
  }

  /* ── Condicional: Trello Limpezas ── */
  if (!document.getElementById('cond_tl').hidden) {
    data.trelloLimpezas = {
      etiquetas: chkdText('etiq_limpezas'), // ["Limpeza Avulsa", "Pacote 3 Limpezas"]
    };
  }

  return data;
}

/* ─── TOAST ──────────────────────────────────────────────────── */
let _toastTimer;
function showToast(msg = 'Feito!', isError = false) {
  clearTimeout(_toastTimer);
  document.getElementById('toastMsg').textContent = msg;
  toastEl.style.background = isError ? 'var(--signal-warn)' : 'var(--ink-900)';
  toastEl.hidden = false;
  _toastTimer = setTimeout(() => { toastEl.hidden = true; }, isError ? 7000 : 4500);
}

/* ─── MODAL ──────────────────────────────────────────────────── */
function openModal() {
  successModal.hidden = false;
  document.body.style.overflow = 'hidden';
  document.getElementById('btnCloseModal')?.focus();
}
function closeModal() {
  successModal.hidden = true;
  document.body.style.overflow = '';
}

function bindModal() {
  document.getElementById('btnCloseModal')?.addEventListener('click', closeModal);
  document.getElementById('btnNewSale')?.addEventListener('click', () => {
    closeModal();
    resetFormFull();
  });
  successModal?.addEventListener('click', e => {
    if (e.target === successModal) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !successModal.hidden) closeModal();
  });
}

/* ─── RESET ──────────────────────────────────────────────────── */
function bindReset() {
  resetBtn.addEventListener('click', () => {
    if (!confirm('Tem certeza? Todos os dados preenchidos serão perdidos.')) return;
    resetFormFull();
  });
}

function resetFormFull() {
  form.reset();

  Object.values(COND_MAP).forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.hidden = true; el.setAttribute('aria-hidden', 'true'); }
  });

  form.querySelectorAll('.fld--has-error').forEach(el => el.classList.remove('fld--has-error'));
  form.querySelectorAll('.is-error').forEach(el => el.classList.remove('is-error'));
  form.querySelectorAll('.fld__err').forEach(el => { el.textContent = ''; });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ─── HELPERS ────────────────────────────────────────────────── */
function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}
function isValidUrl(v) {
  try { return Boolean(new URL(v)); } catch { return false; }
}
