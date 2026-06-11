# 💰 ApoioMicro: Calculadora de Precificação Justa

![Badge de Versão](https://img.shields.io/badge/version-1.1.0-blue)
![Status do Workflow](https://img.shields.io/github/actions/workflow/status/guigas2407/entrega_inicial_bootcamp/ci.yml)

🚀 **Acesse a aplicação online:** [COLE SEU LINK DO GITHUB PAGES AQUI]

## 🎯 Descrição do Problema Real

Muitos pequenos produtores, artesãos e microempreendedores enfrentam dificuldades financeiras ou até falência por não saberem precificar corretamente seus produtos. Frequentemente, o valor da própria mão de obra, a margem de lucro e os custos logísticos são calculados de forma intuitiva e errônea.

## 👥 Público-Alvo

Microempreendedores, artesãos, autônomos e pequenos produtores locais que precisam de uma ferramenta simples para calcular o preço de venda de seus produtos ou serviços, além de estimar custos de envio.

## 💡 Proposta da Solução

O **ApoioMicro** evoluiu para uma aplicação Web moderna, intuitiva e responsiva. Ela guia o usuário na inserção de seus custos e calcula automaticamente o Preço Sugerido de Venda com base no conceito matemático de _Markup_. Além disso, a ferramenta agora conta com integração inteligente de CEP e cálculo de frete, garantindo uma visão completa para a sustentabilidade do negócio.

## ✨ Funcionalidades Principais

- 💰 **Cálculo Automatizado:** Coleta de dados de custos (materiais e horas) e definição de margem de lucro para gerar o Preço Sugerido final e o Lucro Bruto.
- 📍 **Busca Inteligente (Integração API):** Consulta automática de endereço (Rua, Bairro, Cidade, Estado) a partir do CEP do cliente usando a API pública ViaCEP.
- 🚚 **Estimativa de Frete:** Cálculo automático de estimativa de frete baseado na região de destino (considerando envios originados em Brasília - DF).
- 🛡️ **Validação de Dados:** Prevenção de entradas inválidas (impedindo valores negativos ou irreais) garantindo a precisão matemática.
- 📱 **Interface Responsiva:** Layout em duas colunas (dashboard) adaptável para visualização em computadores ou celulares.

## 🛠️ Tecnologias Utilizadas

- **Frontend / Interface:** HTML5, CSS3 (Flexbox) e JavaScript Vanilla.
- **Integração Externa:** Fetch API (consumo do ViaCEP).
- **Testes Automatizados:** Jest (Testes Unitários e de Integração com _Mocks_).
- **Linting:** ESLint.
- **CI/CD & DevOps:** GitHub Actions e GitHub Pages.

## 🚀 Como Acessar e Executar

A forma mais fácil de utilizar o ApoioMicro é acessando a nossa [versão online pelo GitHub Pages]([COLE SEU LINK DO GITHUB PAGES AQUI]).

**Para desenvolvedores (Executando localmente e rodando testes):**
É necessário ter o [Node.js](https://nodejs.org/) instalado.

1. Clone este repositório para a sua máquina:

   ```bash
   git clone https://github.com/guigas2407/entrega_inicial_bootcamp.git
   ```

2. Navegue até a pasta do projeto:

   ```bash
   cd entrega_inicial_bootcamp
   ```

3. Instale as dependências necessárias (Jest, ESLint, etc):

   ```bash
   npm install
   ```

4. Para abrir a aplicação localmente, basta dar um duplo clique no arquivo `index.html` na raiz do projeto.

## 🧪 Testes

O projeto conta com testes unitários (matemática da precificação) e testes de integração (simulação da API). Para rodá-los:

```bash
npm test
```

## 🔍 Análise Estática (Linting)

Para verificar a qualidade da escrita do código:

```bash
npm run lint
```

## 🤝 Contribuindo

Sinta-se à vontade para contribuir! Siga os passos:

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`).
3. Commite suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`).
4. Dê push para a branch (`git push origin feature/NovaFuncionalidade`).
5. Abra um Pull Request.

## 📄 Licença

Este projeto está sob a licença MIT.

## 📞 Suporte

Se encontrar algum problema, por favor, abra uma issue no repositório.
