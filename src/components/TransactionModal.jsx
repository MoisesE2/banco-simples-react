import React, { useState } from 'react'
import { useBank } from '../context/BankContext'
import './TransactionModal.css'

const TransactionModal = ({ type, onClose }) => {
  const { balance, deposit, withdraw, transfer, loading } = useBank()
  const [amount, setAmount] = useState('R$ 0,00')
  const [recipient, setRecipient] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [processing, setProcessing] = useState(false)

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

  const getTitle = () => {
    switch (type) {
      case 'deposit':
        return 'Depositar'
      case 'withdraw':
        return 'Sacar'
      case 'transfer':
        return 'Transferir'
      default:
        return 'Operação'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'deposit':
        return '+'
      case 'withdraw':
        return '−'
      case 'transfer':
        return '→'
      default:
        return '•'
    }
  }

  const getIconColor = () => {
    switch (type) {
      case 'deposit':
        return { bg: '#d1fae5', color: '#059669' }
      case 'withdraw':
        return { bg: '#fee2e2', color: '#dc2626' }
      case 'transfer':
        return { bg: '#dbeafe', color: '#2563eb' }
      default:
        return { bg: '#f3f4f6', color: '#6b7280' }
    }
  }

  const handleAmountChange = (e) => {
    const formatted = formatCurrency(e.target.value)
    setAmount(formatted)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setProcessing(true)

    const amountValue = parseCurrency(amount)

    if (!amount || amountValue <= 0) {
      setError('Por favor, insira um valor válido')
      setProcessing(false)
      return
    }

    try {
      let result = false

      switch (type) {
        case 'deposit':
          result = await deposit(amountValue, description || 'Depósito')
          break
        case 'withdraw':
          if (amountValue > balance) {
            setError('Saldo insuficiente')
            setProcessing(false)
            return
          }
          result = await withdraw(amountValue, description || 'Saque')
          break
        case 'transfer':
          if (!recipient) {
            setError('Por favor, informe o ID da conta destinatária')
            setProcessing(false)
            return
          }
          if (amountValue > balance) {
            setError('Saldo insuficiente')
            setProcessing(false)
            return
          }
          result = await transfer(amountValue, recipient, description || 'Transferência')
          break
        default:
          break
      }

      if (result) {
        setSuccess(true)
        setTimeout(() => {
          onClose()
          setAmount('R$ 0,00')
          setRecipient('')
          setDescription('')
          setSuccess(false)
        }, 1500)
      }
    } catch (err) {
      setError(err.message || 'Erro ao processar a operação')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <div 
              className="modal-icon"
              style={getIconColor()}
            >
              {getIcon()}
            </div>
            <h2>{getTitle()}</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {type === 'transfer' && (
            <div className="form-group">
              <label htmlFor="recipient">ID da Conta Destinatária</label>
              <input
                type="number"
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Ex: 2"
                required
                disabled={processing}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="amount">Valor</label>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              placeholder="R$ 0,00"
              required
              disabled={processing}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição (opcional)</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione uma descrição"
              disabled={processing}
            />
          </div>

          {type === 'withdraw' && (
            <div className="balance-info">
              <span>Saldo disponível: </span>
              <strong>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(balance)}
              </strong>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">
              <span className="success-icon">✓</span>
              Operação realizada com sucesso!
            </div>
          )}

          <div className="modal-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="cancel-button"
              disabled={processing}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={processing || loading}
            >
              {processing || loading ? 'Processando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TransactionModal

