// Configuração centralizada da API
// No Vite, use import.meta.env em vez de process.env
// Variáveis devem começar com VITE_ em vez de REACT_APP_
const config = {
  apiUrl: import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:8081',
  apiBasePath: import.meta.env.VITE_API_BASE_PATH || import.meta.env.REACT_APP_API_BASE_PATH || '/api',
  env: import.meta.env.VITE_ENV || import.meta.env.REACT_APP_ENV || import.meta.env.MODE || 'development',
};

// URL completa da API
config.baseUrl = `${config.apiUrl}${config.apiBasePath}`;

// Verificar se está em desenvolvimento
config.isDevelopment = config.env === 'development';
config.isProduction = config.env === 'production';

// Validar variáveis obrigatórias
const requiredEnvVars = ['VITE_API_URL', 'REACT_APP_API_URL'];
requiredEnvVars.forEach(varName => {
  if (!import.meta.env[varName] && config.isProduction) {
    console.warn(`⚠️ Variável de ambiente ${varName} não encontrada!`);
  }
});

export default config;

