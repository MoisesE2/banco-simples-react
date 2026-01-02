import React from 'react'
import { useBank } from '../context/BankContext'
import './TransactionList.css'

const TransactionList = () => {
  const { transactions } = useBank()

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getTransactionType = (type) => {
    switch (type) {
      case 'deposit':
        return { label: 'Depósito', icon: '+' }
      case 'withdraw':
        return { label: 'Saque', icon: '−' }
      case 'transfer':
        return { label: 'Transferência', icon: '→' }
      default:
        return { label: 'Transação', icon: '•' }
    }
  }

  const getTransactionColor = (type) => {
    switch (type) {
      case 'deposit':
        return '#059669'
      case 'withdraw':
        return '#dc2626'
      case 'transfer':
        return '#2563eb'
      default:
        return '#6b7280'
    }
  }

  const getTransactionBgColor = (type) => {
    switch (type) {
      case 'deposit':
        return '#d1fae5'
      case 'withdraw':
        return '#fee2e2'
      case 'transfer':
        return '#dbeafe'
      default:
        return '#f3f4f6'
    }
  }

  return (
    <div className="transaction-list-container">
      <div className="transaction-header">
        <h2>Extrato de Transações</h2>
        <span className="transaction-count">{transactions.length} transação(ões)</span>
      </div>
      {transactions.length === 0 ? (
        <div className="empty-transactions">
          <p>Nenhuma transação realizada ainda.</p>
        </div>
      ) : (
        <div className="transaction-list">
          {transactions.map((transaction) => {
            const typeInfo = getTransactionType(transaction.type)
            return (
              <div key={transaction.id} className="transaction-item">
                <div 
                  className="transaction-icon"
                  style={{ 
                    background: getTransactionBgColor(transaction.type),
                    color: getTransactionColor(transaction.type)
                  }}
                >
                  {typeInfo.icon}
                </div>
                <div className="transaction-details">
                  <div className="transaction-main">
                    <div className="transaction-description">
                      {transaction.description}
                    </div>
                    <div 
                      className="transaction-type-badge"
                      style={{ 
                        background: getTransactionBgColor(transaction.type),
                        color: getTransactionColor(transaction.type)
                      }}
                    >
                      {typeInfo.label}
                    </div>
                  </div>
                  <div className="transaction-date">
                    {formatDate(transaction.date)}
                  </div>
                </div>
                <div
                  className="transaction-amount"
                  style={{ color: getTransactionColor(transaction.type) }}
                >
                  {transaction.type === 'deposit' ? '+' : '-'}
                  {formatCurrency(Math.abs(transaction.amount))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TransactionList

