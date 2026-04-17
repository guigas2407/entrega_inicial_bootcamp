async function buscarEnderecoPorCep(cep) {
    // Remove qualquer caractere que não seja número
    const cepLimpo = cep.replace(/\D/g, ''); 

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const dados = await response.json();
        
        if (dados.erro) {
            throw new Error("CEP não encontrado.");
        }
        
        return dados; // Vai retornar um objeto com logradouro, bairro, localidade, uf...
    } catch (erro) {
        console.error("Erro na busca do endereço:", erro.message);
        throw erro;
    }
}

module.exports = { buscarEnderecoPorCep };