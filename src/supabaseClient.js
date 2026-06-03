// Arquivo: src/supabaseClient.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase = null;

const isConfigured = supabaseUrl && 
                     supabaseKey && 
                     supabaseUrl !== 'https://sua-url-do-supabase.supabase.co' && 
                     supabaseKey !== 'sua-anon-key-do-supabase';

if (isConfigured) {
    supabase = createClient(supabaseUrl, supabaseKey);
} else {
    console.warn("⚠️ Supabase não configurado ou utilizando credenciais padrão no arquivo .env. As gravações no banco serão ignoradas.");
}

/**
 * Salva um cálculo no banco de dados do Supabase
 * @param {Object} dados Objeto com as informações do cálculo
 */
async function salvarCalculo(dados) {
    if (!supabase) {
        return { error: new Error("Supabase não inicializado.") };
    }
    try {
        const { data, error } = await supabase
            .from('historico_calculos')
            .insert([
                {
                    custo_materiais: dados.custoMateriais,
                    horas_trabalhadas: dados.horasTrabalhadas,
                    valor_hora: dados.valorHora,
                    margem_lucro: dados.margemLucro,
                    custo_total: dados.custoTotal,
                    lucro_bruto: dados.lucroBruto,
                    preco_sugerido: dados.precoSugerido,
                    cep: dados.cep || null,
                    endereco_completo: dados.enderecoCompleto || null
                }
            ]);
        
        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error("❌ Erro ao salvar dados no Supabase:", error.message);
        return { data: null, error };
    }
}

module.exports = { supabase, salvarCalculo, isConfigured };
