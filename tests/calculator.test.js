// Arquivo: tests/calculator.test.js

const { calcularPrecoVenda } = require('../src/calculator');

describe('Testes da Calculadora ApoioMicro', () => {
    
    // Teste 1: Caminho Feliz (Uso correto)
    test('Deve calcular corretamente os valores para entradas válidas', () => {
        // Materiais: R$ 50 | Horas: 2h | Valor/Hora: R$ 20 | Margem: 20%
        const resultado = calcularPrecoVenda(50, 2, 20, 20); 
        
        expect(resultado.custoTotal).toBe(90);       // 50 + (2 * 20) = 90
        expect(resultado.precoSugerido).toBe(112.50); // 90 / (1 - 0.20) = 112.50
        expect(resultado.lucroBruto).toBe(22.50);    // 112.50 - 90 = 22.50
    });

    // Teste 2: Entrada Inválida (Comportamento indevido)
    test('Deve lançar erro se algum valor for negativo', () => {
        expect(() => {
            calcularPrecoVenda(-10, 2, 20, 20);
        }).toThrow("Os valores não podem ser negativos.");
    });

    // Teste 3: Caso Limite (Variação importante)
    test('Deve calcular corretamente com margem de lucro zero', () => {
        // Se a margem é 0%, o preço sugerido deve ser exatamente igual ao custo total
        const resultado = calcularPrecoVenda(50, 2, 20, 0);
        
        expect(resultado.custoTotal).toBe(90);
        expect(resultado.precoSugerido).toBe(90);
        expect(resultado.lucroBruto).toBe(0);
    });
});