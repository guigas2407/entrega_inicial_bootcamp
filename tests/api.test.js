const { buscarEnderecoPorCep } = require('../src/api');

// Substituímos a função nativa 'fetch' por um espião do Jest
global.fetch = jest.fn();

describe('Testes de Integração - ViaCEP', () => {
    
    // Limpa as simulações antes de cada teste para evitar confusão
    beforeEach(() => {
        fetch.mockClear();
    });

    test('Deve retornar os dados do endereço para um CEP válido', async () => {
        // 1. PREPARAÇÃO (Simulando a resposta que viria da internet)
        const mockViaCep = {
            cep: "01001-000",
            logradouro: "Praça da Sé",
            bairro: "Sé",
            localidade: "São Paulo",
            uf: "SP",
            erro: false
        };

        // Dizemos ao Jest: "Quando o fetch for chamado, devolva o mockViaCep"
        fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue(mockViaCep)
        });

        // 2. AÇÃO (Rodando a sua função)
        const resultado = await buscarEnderecoPorCep('01001-000');

        // 3. VALIDAÇÃO (O Teste em si)
        // Verifica se a sua função extraiu os dados corretamente
        expect(resultado.logradouro).toBe("Praça da Sé");
        expect(resultado.localidade).toBe("São Paulo");
        
        // Verifica se o seu código bateu na URL certinha, removendo o traço do CEP
        expect(fetch).toHaveBeenCalledWith('https://viacep.com.br/ws/01001000/json/');
    });

    test('Deve lidar com um CEP inexistente', async () => {
        // 1. Silencia o console.error temporariamente para não sujar o terminal do Jest
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        // Simulando a resposta do ViaCEP quando o CEP não existe
        fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue({ erro: true })
        });

        // Verifica se a sua função joga um erro
        await expect(buscarEnderecoPorCep('99999-999')).rejects.toThrow("CEP não encontrado.");

        // 2. Restaura o console.error para ele voltar a funcionar nos outros lugares
        consoleSpy.mockRestore();
    });
});