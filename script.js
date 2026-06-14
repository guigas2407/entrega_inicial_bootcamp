// =======================================================
// --- CONFIGURAÇÃO DO FIREBASE ---
// =======================================================

const firebaseConfig = {
    apiKey: "AIzaSyCiApZxn4gav9ZAAC4f7a-EpAUxa0pzar4",
    authDomain: "apoiomicro.firebaseapp.com",
    projectId: "apoiomicro",
    storageBucket: "apoiomicro.firebasestorage.app",
    messagingSenderId: "968097490171",
    appId: "1:968097490171:web:086d0bd341f9d1549abc5e"
};

// Inicializa o Firebase e o Firestore
let db = null;

const configValida = Object.values(firebaseConfig).every(v => !v.startsWith("COLE_AQUI"));

if (configValida) {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("🔥 Firebase inicializado com sucesso!");
    atualizarStatusBadge(true); 
} else {
    atualizarStatusBadge(false);
}

/**
 * Atualiza o badge de status do Supabase no header.
 */
function atualizarStatusBadge(online) {
    const badge = document.getElementById('supabase-status');
    if (!badge) return;

    const textEl = badge.querySelector('.status-text');

    if (online) {
        badge.classList.remove('status-offline');
        badge.classList.add('status-online');
        if (textEl) textEl.textContent = 'Banco de dados conectado';
    } else {
        badge.classList.remove('status-online');
        badge.classList.add('status-offline');
        if (textEl) textEl.textContent = 'Sem banco de dados';
    }
}

// Variáveis para armazenar temporariamente o endereço buscado
let ultimoCep = '';
let ultimoEndereco = '';

// ══════════════════════════════════════════════════════
//  1. LÓGICA DO VIACEP
// ══════════════════════════════════════════════════════

// Máscara automática no campo CEP
const inputCep = document.getElementById('cep');
if (inputCep) {
    inputCep.addEventListener('input', () => {
        let valor = inputCep.value.replace(/\D/g, '').slice(0, 8);
        if (valor.length > 5) {
            valor = valor.slice(0, 5) + '-' + valor.slice(5);
        }
        inputCep.value = valor;
    });

    // Busca ao pressionar Enter no campo CEP
    inputCep.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('btn-buscar-cep').click();
        }
    });
}

document.getElementById('btn-buscar-cep').addEventListener('click', async () => {
    const cep = document.getElementById('cep').value;
    const divResultado = document.getElementById('resultado-endereco');
    const btnBuscar = document.getElementById('btn-buscar-cep');

    if (!cep) {
        divResultado.classList.remove('hidden');
        divResultado.className = 'alert-danger';
        divResultado.innerHTML = '⚠️ Por favor, digite um CEP.';
        return;
    }

    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
        divResultado.classList.remove('hidden');
        divResultado.className = 'alert-danger';
        divResultado.innerHTML = '⚠️ CEP inválido. Digite 8 dígitos.';
        return;
    }

    // Estado de carregamento
    btnBuscar.disabled = true;
    btnBuscar.innerHTML = '<span style="animation:float 1s infinite">⏳</span> <span class="btn-text">Buscando…</span>';
    divResultado.classList.remove('hidden');
    divResultado.className = 'alert-info';
    divResultado.innerHTML = '⏳ Buscando endereço...';

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

        if (!response.ok) throw new Error('Falha na conexão com ViaCEP.');

        const dados = await response.json();

        if (dados.erro) throw new Error('CEP não encontrado.');

        ultimoCep = cepLimpo;
        ultimoEndereco = `${dados.logradouro}, ${dados.bairro}, ${dados.localidade} - ${dados.uf}`;

        divResultado.className = 'alert-info';
        divResultado.innerHTML = `
            <strong>📍 Endereço encontrado:</strong><br>
            ${dados.logradouro ? dados.logradouro + ', ' : ''}Bairro ${dados.bairro}<br>
            ${dados.localidade} - ${dados.uf} &nbsp;·&nbsp; CEP: ${dados.cep}
        `;
    } catch (erro) {
        ultimoCep = '';
        ultimoEndereco = '';
        divResultado.className = 'alert-danger';
        divResultado.innerHTML = `❌ ${erro.message}`;
    } finally {
        btnBuscar.disabled = false;
        btnBuscar.innerHTML = '<span>🔍</span> <span class="btn-text">Buscar</span>';
    }
});

// ══════════════════════════════════════════════════════
//  2. LÓGICA DA CALCULADORA
// ══════════════════════════════════════════════════════

// O botão está dentro de um <form>, então ouvimos o submit do form
const formCalc = document.getElementById('form-calculadora');
if (formCalc) {
    formCalc.addEventListener('submit', (e) => e.preventDefault());
}

document.getElementById('btn-calcular').addEventListener('click', () => {
    const materiais = parseFloat(document.getElementById('materiais').value) || 0;
    const horas     = parseFloat(document.getElementById('horas').value)     || 0;
    const valorHora = parseFloat(document.getElementById('valor-hora').value) || 0;
    const margem    = parseFloat(document.getElementById('margem').value)     || 0;

    const msgErro       = document.getElementById('mensagem-erro');
    const painelResultado = document.getElementById('resultado-calculo');
    const btnCopiar     = document.getElementById('btn-copiar');

    try {
        if (materiais < 0 || horas < 0 || valorHora < 0 || margem < 0) {
            throw new Error('Os valores não podem ser negativos.');
        }
        if (margem >= 100) {
            throw new Error('A margem de lucro não pode ser 100% ou maior nesta fórmula.');
        }

        const custoTotal    = materiais + (horas * valorHora);
        const precoSugerido = custoTotal / (1 - (margem / 100));
        const lucroBruto    = precoSugerido - custoTotal;

        const formatBRL = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        document.getElementById('res-custo').innerText = formatBRL(custoTotal);
        document.getElementById('res-lucro').innerText = formatBRL(lucroBruto);
        document.getElementById('res-preco').innerText = formatBRL(precoSugerido);

        // Armazena o preço para o botão copiar
        if (btnCopiar) {
            btnCopiar.dataset.preco = precoSugerido.toFixed(2);
        }

        msgErro.classList.add('hidden');
        painelResultado.classList.remove('hidden');

        // Scroll suave para o resultado em mobile
        if (window.innerWidth < 640) {
            setTimeout(() => {
                painelResultado.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }

        // Salvar no Firebase (Firestore)
        if (db) {
            db.collection('historico_calculos').add({
                custo_materiais:  materiais,
                horas_trabalhadas: horas,
                valor_hora:       valorHora,
                margem_lucro:     margem,
                custo_total:      custoTotal,
                lucro_bruto:      lucroBruto,
                preco_sugerido:   precoSugerido,
                cep:              ultimoCep || null,
                endereco_completo: ultimoEndereco || null,
                data:             new Date().toISOString() // Salva a data atual
            }).then(() => {
                console.log('✅ Cálculo salvo com sucesso no Firebase!');
            }).catch((error) => {
                console.error('Erro ao salvar no Firebase:', error);
            });
        }

    } catch (erro) {
        painelResultado.classList.add('hidden');
        msgErro.innerText = erro.message;
        msgErro.classList.remove('hidden');
    }
});

// ══════════════════════════════════════════════════════
//  3. BOTÃO COPIAR VALOR
// ══════════════════════════════════════════════════════
const btnCopiar = document.getElementById('btn-copiar');
if (btnCopiar) {
    btnCopiar.addEventListener('click', async () => {
        const precoEl = document.getElementById('res-preco');
        if (!precoEl) return;

        const texto = precoEl.innerText;

        try {
            await navigator.clipboard.writeText(texto);
            btnCopiar.innerHTML = '<span>✅</span> Copiado!';
            btnCopiar.style.color = 'var(--accent-green)';
            btnCopiar.style.borderColor = 'rgba(0,230,118,0.3)';

            setTimeout(() => {
                btnCopiar.innerHTML = '<span>📋</span> Copiar Valor';
                btnCopiar.style.color = '';
                btnCopiar.style.borderColor = '';
            }, 2000);
        } catch {
            // Fallback para browsers sem suporte à Clipboard API
            const ta = document.createElement('textarea');
            ta.value = texto;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            btnCopiar.innerHTML = '<span>✅</span> Copiado!';
            setTimeout(() => {
                btnCopiar.innerHTML = '<span>📋</span> Copiar Valor';
            }, 2000);
        }
    });
}
