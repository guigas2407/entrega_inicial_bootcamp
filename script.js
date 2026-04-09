// --- 1. LÓGICA DO VIACEP ---
document.getElementById('btn-buscar-cep').addEventListener('click', async () => {
    const cep = document.getElementById('cep').value;
    const divResultado = document.getElementById('resultado-endereco');
    
    if (!cep) return alert("Por favor, digite um CEP.");

    divResultado.classList.remove('hidden');
    divResultado.innerHTML = "⏳ Buscando endereço...";

    try {
        const cepLimpo = cep.replace(/\D/g, '');
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const dados = await response.json();

        if (dados.erro) throw new Error("CEP não encontrado.");

        divResultado.innerHTML = `<strong>Endereço de entrega:</strong><br>
                                  ${dados.logradouro}, Bairro ${dados.bairro}<br>
                                  ${dados.localidade} - ${dados.uf}`;
    } catch (erro) {
        divResultado.innerHTML = `❌ Erro: ${erro.message}`;
    }
});


// --- 2. LÓGICA DA CALCULADORA ---
document.getElementById('btn-calcular').addEventListener('click', () => {
    // Pega os valores digitados na tela
    const materiais = parseFloat(document.getElementById('materiais').value) || 0;
    const horas = parseFloat(document.getElementById('horas').value) || 0;
    const valorHora = parseFloat(document.getElementById('valor-hora').value) || 0;
    const margem = parseFloat(document.getElementById('margem').value) || 0;

    const msgErro = document.getElementById('mensagem-erro');
    const painelResultado = document.getElementById('resultado-calculo');

    try {
        // Validação igual a do seu teste!
        if (materiais < 0 || horas < 0 || valorHora < 0 || margem < 0) {
            throw new Error("Os valores não podem ser negativos.");
        }
        if (margem >= 100) {
            throw new Error("A margem de lucro não pode ser 100% ou maior nesta fórmula.");
        }

        // Os cálculos originais da sua calculadora
        const custoTotal = materiais + (horas * valorHora);
        const precoSugerido = custoTotal / (1 - (margem / 100));
        const lucroBruto = precoSugerido - custoTotal;

        // Mostra na tela formatado como Dinheiro (BRL)
        document.getElementById('res-custo').innerText = custoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        document.getElementById('res-lucro').innerText = lucroBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        document.getElementById('res-preco').innerText = precoSugerido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Esconde a mensagem de erro e mostra os resultados
        msgErro.classList.add('hidden');
        painelResultado.classList.remove('hidden');

    } catch (erro) {
        // Se der erro, esconde os resultados e mostra o alerta vermelho
        painelResultado.classList.add('hidden');
        msgErro.innerText = erro.message;
        msgErro.classList.remove('hidden');
    }
});