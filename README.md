# 💰 ApoioMicro: Calculadora de Precificação Justa

![Badge de Versão](https://img.shields.io/badge/version-1.0.0-blue)
![Status do Workflow](https://img.shields.io/github/actions/workflow/status/guigas2407/entrega_inicial_bootcamp/ci.yml)

## 🎯 Descrição do Problema Real

Muitos pequenos produtores, artesãos e microempreendedores enfrentam dificuldades financeiras ou até falência por não saberem precificar corretamente seus produtos. Frequentemente, o valor da própria mão de obra e a margem de lucro são calculados de forma intuitiva e errônea.

## 👥 Público-Alvo

Microempreendedores, artesãos, autônomos e pequenos produtores locais que precisam de uma ferramenta simples para calcular o preço de venda de seus produtos ou serviços.

## 💡 Proposta da Solução

O **ApoioMicro** é uma aplicação de Interface de Linha de Comando (CLI) simples e acessível. Ela guia o usuário através de perguntas essenciais sobre seus custos e calcula automaticamente o Preço Sugerido de Venda com base no conceito matemático de _Markup_, garantindo a sustentabilidade do negócio.

## ✨ Funcionalidades Principais

- Coleta interativa de dados de custos (materiais e horas trabalhadas).
- Definição de valor de hora técnica e margem de lucro.
- Cálculo automatizado de Custo Total e Lucro Bruto.
- Geração do Preço Sugerido final.
- Validação de dados de entrada (impedindo valores negativos ou irreais).

## 🛠️ Tecnologias Utilizadas

- **Linguagem:** JavaScript (Node.js)
- **Interface CLI:** Inquirer.js
- **Testes Automatizados:** Jest
- **Linting:** ESLint
- **CI/CD:** GitHub Actions

## 🚀 Como Instalar e Executar

**Pré-requisitos:** É necessário ter o [Node.js](https://nodejs.org/) instalado.

### Instruções de Instalação

1. Clone este repositório para a sua máquina:

   ```bash
   git clone [https://github.com/guigas2407/entrega_inicial_bootcamp.git](https://github.com/guigas2407/entrega_inicial_bootcamp.git)
   ```

2. Navegue até a pasta do projeto:

   ```bash
   cd entrega_inicial_bootcamp
   ```

3. Instale as dependências necessárias:
   ```bash
   npm install
   ```

### Executando a Aplicação

Para iniciar a calculadora, execute o comando:

```bash
npm start
```

## 🧪 Testes

Para rodar os testes automatizados:

```bash
npm test
```

## 🔍 Análise Estática (Linting)

Para verificar a qualidade do código:

```bash
npm run lint
```

## 🤝 Contribuindo

Sinta-se à vontade para contribuir! Siga os passos:

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`).
3. Commite suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`).
4. Dê push para a branch (`git push origin feature/NovaFuncionalidade`).
5. Abra um Pull Request.

## 📄 Licença

Este projeto está sob a licença MIT.

## 📞 Suporte

Se encontrar algum problema, por favor, abra uma issue.
