import config from '../config/api';

// Função auxiliar para requisições
const request = async (endpoint, options = {}) => {
  const response = await fetch(`${config.baseUrl}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ mensagem: 'Erro na requisição' }));
    throw new Error(error.mensagem || 'Erro na requisição');
  }

  return response.json();
};

// Serviços da API
export const apiService = {
  // ========== ENDPOINTS GERAIS ==========
  
  // GET / - Página inicial
  home: () => fetch(`${config.apiUrl}/`).then(r => r.text()),
  
  // GET /api/status - Status da aplicação
  status: () => fetch(`${config.baseUrl}/status`).then(r => r.text()),
  
  // GET /api/endpoints - Listar todos os endpoints
  listarEndpoints: () => request('/endpoints'),
  
  // ========== ENDPOINTS DE CONTAS ==========
  
  // GET /api/contas - Listar todas as contas
  listarContas: () => request('/contas'),
  
  // GET /api/contas/{id} - Buscar conta por ID
  buscarContaPorId: (id) => request(`/contas/${id}`),
  
  // POST /api/contas - Criar nova conta
  criarConta: (conta) => request('/contas', {
    method: 'POST',
    body: JSON.stringify(conta),
  }),
  
  // PUT /api/contas/{id} - Atualizar conta
  atualizarConta: (id, conta) => request(`/contas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(conta),
  }),
  
  // DELETE /api/contas/{id} - Deletar conta por ID
  deletarConta: (id) => request(`/contas/${id}`, {
    method: 'DELETE',
  }),
  
  // DELETE /api/contas/cpf/{cpf} - Deletar conta por CPF
  deletarContaPorCpf: (cpf) => request(`/contas/cpf/${cpf}`, {
    method: 'DELETE',
  }),
  
  // DELETE /api/contas - Deletar todas as contas
  deletarTodasContas: () => request('/contas', {
    method: 'DELETE',
  }),
  
  // ========== OPERAÇÕES BANCÁRIAS ==========
  
  // POST /api/contas/{id}/deposito - Fazer depósito
  depositar: (id, valor) => request(`/contas/${id}/deposito`, {
    method: 'POST',
    body: JSON.stringify({ valor }),
  }),
  
  // POST /api/contas/{id}/saque - Fazer saque
  sacar: (id, valor) => request(`/contas/${id}/saque`, {
    method: 'POST',
    body: JSON.stringify({ valor }),
  }),
  
  // POST /api/contas/transferencia - Fazer transferência
  transferir: (contaOrigemId, contaDestinoId, valor) => request('/contas/transferencia', {
    method: 'POST',
    body: JSON.stringify({
      contaOrigemId,
      contaDestinoId,
      valor,
    }),
  }),
};

