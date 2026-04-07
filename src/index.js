// Arquivo: src/index.js

const inquirer = require('inquirer');
const { calcularPrecoVenda } = require('./calculator');

async function iniciarSistema() {
    console.log("==========================================");
    console.log("  💰 ApoioMicro: Calculadora de Preço     ");
    console.log("==========================================\n");

    const respostas = await inquirer.prompt([
        { 
            type: 'number', 
            name: 'custoMateriais', 
            message: '1. Qual o custo total dos materiais (R$)?' 
        },
        { 
            type: 'number', 
            name: 'horasTrabalhadas', 
            message: '2. Quantas horas você trabalhou no produto?' 
        },
        { 
            type: 'number', 
            name: 'valorHora', 
            message: '3. Qual o valor da sua hora de trabalho (R$)?' 
        },
        { 
            type: 'number', 
            name: 'margemLucro', 
            message: '4. Qual a margem de lucro desejada (%)?' 
        }
    ]);

    try {
        const resultado = calcularPrecoVenda(
            respostas.custoMateriais,
            respostas.horasTrabalhadas,
            respostas.valorHora,
            respostas.margemLucro
        );

        console.log("\n---------------- RESUMO ----------------");
        console.log(`Custo Total:      R$ ${resultado.custoTotal.toFixed(2)}`);
        console.log(`Lucro Bruto:      R$ ${resultado.lucroBruto.toFixed(2)}`);
        console.log(`PREÇO SUGERIDO:   R$ ${resultado.precoSugerido.toFixed(2)}`);
        console.log("----------------------------------------\n");
    } catch (error) {
        console.error(`\n❌ Erro: ${error.message}\n`);
    }
}

iniciarSistema();