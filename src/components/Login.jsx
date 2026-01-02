import React, { useState } from 'react'
import { useBank } from '../context/BankContext'
import CreateAccountModal from './CreateAccountModal'
import './Login.css'

const Login = () => {
  const [identifier, setIdentifier] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { login } = useBank()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!identifier.trim()) {
      setError('Por favor, informe o ID da conta ou CPF')
      setLoading(false)
      return
    }

    try {
      const success = await login(identifier.trim())
      if (!success) {
        setError('Conta não encontrada. Verifique o ID ou CPF informado.')
      }
    } catch (err) {
      setError(err.message || 'Erro ao fazer login. Verifique se a API está rodando.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAccountSuccess = async (contaCriada) => {
    // Fazer login automático após criar a conta
    if (contaCriada && contaCriada.id) {
      try {
        await login(contaCriada.id.toString())
      } catch (err) {
        console.error('Erro ao fazer login automático:', err)
        // Se falhar, apenas fecha o modal e o usuário pode fazer login manualmente
      }
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="bank-logo">
            <div className="logo-icon">BS</div>
          </div>
          <h1>Banco Simples</h1>
          <p>Acesse sua conta bancária</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="identifier">ID da Conta ou CPF</label>
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Ex: 1 ou 123.456.789-00"
              autoComplete="off"
              disabled={loading}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
        <div className="login-divider">
          <span>ou</span>
        </div>
        <button
          type="button"
          className="create-account-button"
          onClick={() => setShowCreateModal(true)}
          disabled={loading}
        >
          <span className="button-icon">+</span>
          Criar Nova Conta
        </button>
        <div className="login-hint">
          <p>Informe o ID da conta (número) ou CPF para acessar</p>
          <p className="hint-small">Certifique-se de que a API está rodando em http://localhost:8081</p>
        </div>
      </div>

      {showCreateModal && (
        <CreateAccountModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateAccountSuccess}
        />
      )}
    </div>
  )
}

export default Login

