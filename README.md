# 🏦 Banco Simples - Interface React

Uma aplicação bancária simples e moderna desenvolvida em React, com funcionalidades completas de gerenciamento de conta.

## ✨ Funcionalidades

- 🔐 **Sistema de Login**: Autenticação simples para acesso à conta
- 💳 **Dashboard**: Visualização do saldo disponível
- 💰 **Depósitos**: Realizar depósitos na conta
- 💸 **Saques**: Realizar saques (com validação de saldo)
- 🔄 **Transferências**: Transferir valores para outros usuários
- 📊 **Extrato**: Histórico completo de todas as transações
- 💾 **Persistência**: Dados salvos no localStorage do navegador

## 🚀 Como Executar

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- API backend rodando (veja configuração abaixo)

### Configuração de Variáveis de Ambiente

1. **Crie o arquivo `.env` na raiz do projeto**:
```bash
# Copie o template
cp .env.example .env
```

2. **Configure as variáveis** (opcional, valores padrão já estão configurados):
```env
REACT_APP_API_URL=http://localhost:8081
REACT_APP_API_BASE_PATH=/api
REACT_APP_ENV=development
```

Para mais detalhes, consulte o arquivo `ENV_SETUP.md`.

### Instalação

1. Instale as dependências:
```bash
npm install
```

2. **Certifique-se de que a API backend está rodando** em `http://localhost:8081`

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse a aplicação no navegador:
```
http://localhost:5173
```

> **Importante**: Reinicie o servidor após alterar variáveis de ambiente!

## 📦 Estrutura do Projeto

```
banco-simples-react/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Login.jsx       # Tela de login
│   │   ├── Dashboard.jsx   # Dashboard principal
│   │   ├── BalanceCard.jsx # Card de saldo
│   │   ├── TransactionList.jsx # Lista de transações
│   │   ├── TransactionModal.jsx # Modal de operações
│   │   └── ConfigTest.jsx  # Componente de teste de configuração
│   ├── config/
│   │   └── api.js          # Configuração centralizada da API
│   ├── context/
│   │   └── BankContext.jsx # Context API para gerenciamento de estado
│   ├── services/
│   │   └── api.js          # Serviços da API
│   ├── App.jsx             # Componente principal
│   ├── main.jsx            # Ponto de entrada
│   └── index.css           # Estilos globais
├── .env.example            # Template de variáveis de ambiente
├── .gitignore              # Arquivos ignorados pelo Git
├── index.html
├── package.json
├── vite.config.js
├── README.md               # Este arquivo
├── API_INTEGRATION.md      # Documentação da integração com API
└── ENV_SETUP.md            # Guia de configuração de variáveis de ambiente
```

## 🎨 Tecnologias Utilizadas

- **React 18**: Biblioteca JavaScript para construção de interfaces
- **Vite**: Build tool e servidor de desenvolvimento
- **Context API**: Gerenciamento de estado global
- **CSS3**: Estilização moderna com gradientes e animações
- **LocalStorage**: Persistência de dados no navegador

## 💡 Como Usar

1. **Login**: Use qualquer usuário e senha para fazer login (sistema de demonstração)
2. **Visualizar Saldo**: O saldo atual é exibido no topo do dashboard
3. **Realizar Operações**: 
   - Clique em "Depositar" para adicionar dinheiro
   - Clique em "Sacar" para retirar dinheiro
   - Clique em "Transferir" para enviar dinheiro
4. **Ver Extrato**: Todas as transações aparecem na lista de extrato abaixo

## 🎯 Características

- ✅ Interface moderna e responsiva
- ✅ Animações suaves
- ✅ Validação de formulários
- ✅ Feedback visual para operações
- ✅ Design mobile-first
- ✅ Integração completa com API backend
- ✅ Configuração via variáveis de ambiente
- ✅ Histórico de transações local

## 📝 Notas

- A aplicação está integrada com uma API backend real
- Configure as variáveis de ambiente para diferentes ambientes (desenvolvimento/produção)
- Consulte `API_INTEGRATION.md` para detalhes sobre a integração
- Consulte `ENV_SETUP.md` para configuração de variáveis de ambiente

## 🔧 Configuração Avançada

### Variáveis de Ambiente

A aplicação suporta configuração via variáveis de ambiente:

- `REACT_APP_API_URL`: URL base da API (padrão: `http://localhost:8081`)
- `REACT_APP_API_BASE_PATH`: Caminho base da API (padrão: `/api`)
- `REACT_APP_ENV`: Ambiente atual (padrão: `development`)

### Componente de Teste de Configuração

Para verificar as configurações, você pode importar o componente `ConfigTest`:

```jsx
import ConfigTest from './components/ConfigTest';

// Use no seu componente
<ConfigTest />
```

## 📄 Licença

Este projeto é livre para uso educacional e de demonstração.

