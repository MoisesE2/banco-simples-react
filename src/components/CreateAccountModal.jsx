import React, { useState } from 'react'
import { apiService } from '../services/api'
import './CreateAccountModal.css'
import './TransactionModal.css'

const CreateAccountModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    saldo: 'R$ 0,00'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [createdAccount, setCreatedAccount] = useState(null)

  const formatCPF = (value) => {
    // Remove tudo que não é dígito
    const cpf = value.replace(/\D/g, '')
    
    // Aplica a máscara
    if (cpf.length <= 11) {
      return cpf
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }
    return value
  }

  const formatCurrency = (value) => {
    // Remove tudo exceto números
    const numbers = value.replace(/\D/g, '')
    
    if (numbers === '') {
      return 'R$ 0,00'
    }
    
    // Converte para número e divide por 100 para ter centavos
    const amount = parseFloat(numbers) / 100
    
    // Formata como moeda brasileira
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const parseCurrency = (value) => {
    // Remove formatação e converte para número
    const numbers = value.replace(/\D/g, '')
    if (numbers === '') return 0
    return parseFloat(numbers) / 100
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'cpf') {
      setFormData(prev => ({
        ...prev,
        cpf: formatCPF(value)
      }))
    } else if (name === 'saldo') {
      // Formata como moeda brasileira
      const formatted = formatCurrency(value)
      setFormData(prev => ({
        ...prev,
        saldo: formatted
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const generateJson = () => {
    const jsonData = {
      nome: formData.nome.trim(),
      cpf: formData.cpf.replace(/\D/g, ''), // Remove formatação do CPF
      saldo: parseCurrency(formData.saldo) || 0 // Converte valor formatado para número
    }
    return jsonData
  }

  const validateForm = () => {
    if (!formData.nome.trim()) {
      setError('Nome é obrigatório')
      return false
    }

    const cpfNumbers = formData.cpf.replace(/\D/g, '')
    if (cpfNumbers.length !== 11) {
      setError('CPF deve ter 11 dígitos')
      return false
    }

    const saldo = parseCurrency(formData.saldo)
    if (isNaN(saldo) || saldo < 0) {
      setError('Saldo inicial deve ser um número positivo')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      
      // Gerar JSON
      const jsonData = generateJson()
      
      // Fazer POST na API
      const contaCriada = await apiService.criarConta(jsonData)
      
      setSuccess(true)
      setCreatedAccount(contaCriada)
      
      // Não fechar automaticamente - deixar usuário ver o ID
      // onSuccess será chamado quando o usuário fechar manualmente
      
    } catch (err) {
      setError(err.message || 'Erro ao criar conta. Verifique se a API está rodando.')
      setGeneratedJson(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content create-account-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <div className="modal-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
              +
            </div>
            <h2>Criar Nova Conta</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="nome">Nome Completo *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: João Silva"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cpf">CPF *</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
              maxLength="14"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="saldo">Saldo Inicial</label>
            <input
              type="text"
              id="saldo"
              name="saldo"
              value={formData.saldo}
              onChange={handleChange}
              placeholder="R$ 0,00"
              disabled={loading}
            />
            <small className="form-hint">Deixe em R$ 0,00 para conta sem saldo inicial</small>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && createdAccount && (
            <div className="success-message account-created">
              <span className="success-icon">✓</span>
              <div className="success-content">
                <strong>Conta criada com sucesso!</strong>
                <div className="account-id-box">
                  <span className="account-id-label">Seu ID de acesso:</span>
                  <span className="account-id-value">{createdAccount.id}</span>
                  <button
                    type="button"
                    className="copy-id-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(createdAccount.id.toString())
                      alert('ID copiado para a área de transferência!')
                    }}
                  >
                    Copiar ID
                  </button>
                </div>
                <div className="success-details">
                  <span><strong>Nome:</strong> {createdAccount.nome}</span>
                  <span><strong>CPF:</strong> {createdAccount.cpf}</span>
                  <span><strong>Saldo:</strong> R$ {createdAccount.saldo?.toFixed(2).replace('.', ',') || '0,00'}</span>
                </div>
                <div className="login-hint-box">
                  <p>⚠️ <strong>Importante:</strong> Anote este ID! Você precisará dele para fazer login.</p>
                  <p>Use o ID <strong>{createdAccount.id}</strong> na tela de login.</p>
                </div>
              </div>
            </div>
          )}

          <div className="modal-actions">
            {!success ? (
              <>
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="cancel-button"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? 'Criando...' : 'Criar Conta'}
                </button>
              </>
            ) : (
              <button 
                type="button" 
                onClick={() => {
                  if (onSuccess && createdAccount) {
                    onSuccess(createdAccount)
                  }
                  onClose()
                }} 
                className="submit-button"
              >
                Fazer Login Agora
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateAccountModal

