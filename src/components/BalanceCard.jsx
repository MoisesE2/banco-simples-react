import React from 'react'
import { useBank } from '../context/BankContext'
import './BalanceCard.css'

const BalanceCard = () => {
  const { balance, user } = useBank()

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatAccountNumber = (id) => {
    if (!id) return '0000-0000-00'
    const padded = id.toString().padStart(8, '0')
    return `${padded.slice(0, 4)}-${padded.slice(4, 8)}-${padded.slice(8, 10) || '00'}`
  }

  return (
    <div className="balance-card">
      <div className="balance-header">
        <div className="balance-label">Saldo Disponível</div>
        <div className="account-info">
          <span className="account-label">Conta Corrente</span>
          <span className="account-number">
            {user ? formatAccountNumber(user.id) : '0000-0000-00'}
          </span>
        </div>
      </div>
      <div className="balance-content">
        <div className="balance-amount">{formatCurrency(balance)}</div>
        <div className="balance-status">
          <span className="status-indicator"></span>
          <span>Conta Ativa</span>
        </div>
      </div>
    </div>
  )
}

export default BalanceCard

