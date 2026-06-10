// --- CONFIGURAÇÃO DO SUPABASE (FRONTEND) ---
const SUPABASE_URL = window.SUPABASE_URL || localStorage.getItem('SUPABASE_URL') || "SUA_URL_SUPABASE";
const SUPABASE_KEY = window.SUPABASE_KEY || localStorage.getItem('SUPABASE_KEY') || "SUA_KEY_SUPABASE";

let supabaseClient = null;

if (typeof supabase !== 'undefined' && SUPABASE_URL && SUPABASE_KEY && SUPABASE_URL !== "SUA_URL_SUPABASE" && SUPABASE_KEY !== "SUA_KEY_SUPABASE") {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("⚡ Supabase inicializado com sucesso no frontend!");
} else {
    console.warn("⚠️ Supabase não configurado no frontend. Para salvar os dados, defina SUPABASE_URL e SUPABASE_KEY no script.js ou via localStorage.");
}

// Variáveis para armazenar temporariamente o endereço buscado
let ultimoCep = '';
let ultimoEndereco = '';

// --- 1. LÓGICA DO VIACEP E FRETE ---

// Função que simula o valor do frete com base no Estado (Origem: Brasília - DF)
function estimarFrete(ufDestino) {
    const precosPorRegiao = {
        // Centro-Oeste e DF
        'DF': 15.00, 'GO': 20.00, 'MT': 25.00, 'MS': 25.00,
        // Sudeste
        'SP': 30.00, 'RJ': 30.00, 'MG': 30.00, 'ES': 35.00,
        // Sul
        'PR': 40.00, 'SC': 40.00, 'RS': 45.00,
        // Nordeste
        'BA': 50.00, 'PE': 50.00, 'CE': 50.00, 'RN': 50.00, 'PB': 50.00, 'AL': 50.00, 'SE': 50.00, 'PI': 55.00, 'MA': 55.00,
        // Norte
        'TO': 45.00, 'PA': 60.00, 'AM': 65.00, 'RO': 65.00, 'AC': 70.00, 'RR': 70.00, 'AP': 70.00
    };

    return precosPorRegiao[ufDestino] || 70.00;
}

document.getElementById('btn-buscar-cep').addEventListener('click', async () => {
    const cep = document.getElementById('cep').value;
    const divResultado = document.getElementById('resultado-endereco');

    if (!cep) return alert("Por favor, digite um CEP.");

    divResultado.classList.remove('hidden');
    divResultado.innerHTML = "⏳ Buscando endereço e calculando frete...";

    try {
        const cepLimpo = cep.replace(/\D/g, '');
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const dados = await response.json();

        if (dados.erro) throw new Error("CEP não encontrado.");

        // Salva o CEP e endereço para uso no Supabase
        ultimoCep = cepLimpo;
        ultimoEndereco = `${dados.logradouro}, ${dados.bairro}, ${dados.localidade} - ${dados.uf}`;

        // Chama a função de frete passando o Estado que a API retornou
        const valorFrete = estimarFrete(dados.uf);
        const freteFormatado = valorFrete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        divResultado.innerHTML = `
            <strong>Endereço de entrega:</strong><br>
            ${dados.logradouro}, Bairro ${dados.bairro}<br>
            ${dados.localidade} - ${dados.uf}<br><br>
            <strong style="color: #2980b9;">🚚 Estimativa de Frete (Saindo de BSB):</strong><br>
            ${freteFormatado}
        `;
    } catch (erro) {
        divResultado.innerHTML = `❌ Erro: ${erro.message}`;
    }
});


// --- 2. LÓGICA DA CALCULADORA ---
document.getElementById('btn-calcular').addEventListener('click', async () => {
    const nomeProduto = document.getElementById('nome-produto').value.trim() || 'Sem nome';
    const materiais = parseFloat(document.getElementById('materiais').value) || 0;
    const horas = parseFloat(document.getElementById('horas').value) || 0;
    const valorHora = parseFloat(document.getElementById('valor-hora').value) || 0;
    const margem = parseFloat(document.getElementById('margem').value) || 0;

    const msgErro = document.getElementById('mensagem-erro');
    const painelResultado = document.getElementById('resultado-calculo');

    try {
        if (materiais < 0 || horas < 0 || valorHora < 0 || margem < 0) {
            throw new Error("Os valores não podem ser negativos.");
        }
        if (margem >= 100) {
            throw new Error("A margem de lucro não pode ser 100% ou maior nesta fórmula.");
        }

        const custoTotal = materiais + (horas * valorHora);
        const precoSugerido = custoTotal / (1 - (margem / 100));
        const lucroBruto = precoSugerido - custoTotal;

        // Exibe o nome do produto no resumo
        const resNome = document.getElementById('res-nome-produto');
        resNome.textContent = `📦 ${nomeProduto}`;
        resNome.classList.remove('hidden');

        document.getElementById('res-custo').innerText = custoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        document.getElementById('res-lucro').innerText = lucroBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        document.getElementById('res-preco').innerText = precoSugerido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        msgErro.classList.add('hidden');
        painelResultado.classList.remove('hidden');

        // Gravar no Supabase se configurado
        if (supabaseClient) {
            const { error } = await supabaseClient.from('historico_calculos').insert([
                {
                    nome_produto: nomeProduto,
                    custo_materiais: materiais,
                    horas_trabalhadas: horas,
                    valor_hora: valorHora,
                    margem_lucro: margem,
                    custo_total: custoTotal,
                    lucro_bruto: lucroBruto,
                    preco_sugerido: precoSugerido,
                    cep: ultimoCep || null,
                    endereco_completo: ultimoEndereco || null
                }
            ]);

            if (error) {
                console.error("Erro ao salvar no Supabase:", error.message);
            } else {
                console.log("Cálculo salvo com sucesso no Supabase!");
                carregarHistorico(); // Atualiza o histórico automaticamente
            }
        }

    } catch (erro) {
        painelResultado.classList.add('hidden');
        msgErro.innerText = erro.message;
        msgErro.classList.remove('hidden');
    }
});


// --- 3. HISTÓRICO DE ORÇAMENTOS ---

/**
 * Formata uma data ISO em formato brasileiro legível.
 * Ex: "2024-01-15T10:30:00Z" → "15/01/2024 às 07:30"
 */
function formatarData(dataISO) {
    if (!dataISO) return '-';
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Carrega os orçamentos salvos no Supabase e renderiza na tabela.
 */
async function carregarHistorico() {
    const secaoHistorico = document.getElementById('secao-historico');
    const loading = document.getElementById('historico-loading');
    const vazio = document.getElementById('historico-vazio');
    const erroDiv = document.getElementById('historico-erro');
    const tabela = document.getElementById('tabela-historico');
    const tbody = document.getElementById('historico-tbody');

    // Só exibe a seção se o Supabase estiver configurado
    if (!supabaseClient) {
        return;
    }

    secaoHistorico.classList.remove('hidden');
    loading.classList.remove('hidden');
    vazio.classList.add('hidden');
    erroDiv.classList.add('hidden');
    tabela.classList.add('hidden');

    try {
        const { data, error } = await supabaseClient
            .from('historico_calculos')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        loading.classList.add('hidden');

        if (error) throw error;

        if (!data || data.length === 0) {
            vazio.classList.remove('hidden');
            return;
        }

        // Renderiza as linhas da tabela
        tbody.innerHTML = '';
        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="td-nome">${item.nome_produto || '-'}</td>
                <td>${(item.custo_total || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td class="td-preco">${(item.preco_sugerido || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>${item.margem_lucro || 0}%</td>
                <td class="td-endereco">${item.endereco_completo || '-'}</td>
                <td class="td-data">${formatarData(item.created_at)}</td>
                <td>
                    <button class="btn-deletar" data-id="${item.id}" title="Excluir orçamento">🗑️</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Adiciona evento de deletar em cada botão
        document.querySelectorAll('.btn-deletar').forEach(btn => {
            btn.addEventListener('click', () => deletarOrcamento(btn.dataset.id));
        });

        tabela.classList.remove('hidden');

    } catch (erro) {
        loading.classList.add('hidden');
        erroDiv.textContent = `❌ Erro ao carregar histórico: ${erro.message}`;
        erroDiv.classList.remove('hidden');
    }
}

/**
 * Deleta um orçamento pelo ID no Supabase e recarrega o histórico.
 */
async function deletarOrcamento(id) {
    if (!supabaseClient) return;
    if (!confirm("Deseja realmente excluir este orçamento?")) return;

    const { error } = await supabaseClient
        .from('historico_calculos')
        .delete()
        .eq('id', id);

    if (error) {
        alert(`Erro ao excluir: ${error.message}`);
    } else {
        carregarHistorico();
    }
}

// Botão de atualizar histórico manualmente
document.getElementById('btn-atualizar-historico').addEventListener('click', carregarHistorico);

// Carrega o histórico ao iniciar a página
carregarHistorico();