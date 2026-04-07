// Arquivo: src/calculator.js

function calcularPrecoVenda(custoMateriais, horasTrabalhadas, valorHora, margemLucro) {
    // Validação: Não permite números negativos
    if (custoMateriais < 0 || horasTrabalhadas < 0 || valorHora < 0 || margemLucro < 0) {
        throw new Error("Os valores não podem ser negativos.");
    }
    
    // Calcula o custo da mão de obra e o custo total
    const custoMaoDeObra = horasTrabalhadas * valorHora;
    const custoTotal = custoMateriais + custoMaoDeObra;
    
    // Validação: Margem de lucro não pode ser 100% ou mais neste cálculo de Markup
    if (margemLucro >= 100) {
        throw new Error("A margem de lucro deve ser menor que 100%.");
    }

    // Calcula o preço sugerido usando Markup (Preço = Custo / (1 - Margem))
    const margemDecimal = margemLucro / 100;
    const precoSugerido = custoTotal / (1 - margemDecimal);
    
    // Retorna os valores formatados com 2 casas decimais
    return {
        custoTotal: parseFloat(custoTotal.toFixed(2)),
        precoSugerido: parseFloat(precoSugerido.toFixed(2)),
        lucroBruto: parseFloat((precoSugerido - custoTotal).toFixed(2))
    };
}

module.exports = { calcularPrecoVenda };