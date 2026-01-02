import React, { useState } from 'react'
import { useBank } from '../context/BankContext'
import BalanceCard from './BalanceCard'
import TransactionList from './TransactionList'
import TransactionModal from './TransactionModal'
import './Dashboard.css'

const Dashboard = () => {
  const { user, logout, loading, error } = useBank()
  const [activeModal, setActiveModal] = useState(null)

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="bank-logo-small">BS</div>
            <h1>Banco Simples</h1>
          </div>
          <div className="user-info">
            <div className="user-details">
              <span className="user-greeting">Bem-vindo,</span>
              <span className="user-name">{user?.name || user?.username}</span>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {error && (
          <div className="error-banner">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}
        
        <BalanceCard />
        
        <div className="actions-section">
          <h2>Operações Bancárias</h2>
          <div className="action-buttons">
            <button
              onClick={() => setActiveModal('deposit')}
              className="action-button deposit-button"
            >
              <span className="action-icon">+</span>
              <div className="action-content">
                <span className="action-title">Depositar</span>
                <span className="action-subtitle">Adicionar fundos</span>
              </div>
            </button>
            <button
              onClick={() => setActiveModal('withdraw')}
              className="action-button withdraw-button"
            >
              <span className="action-icon">−</span>
              <div className="action-content">
                <span className="action-title">Sacar</span>
                <span className="action-subtitle">Retirar fundos</span>
              </div>
            </button>
            <button
              onClick={() => setActiveModal('transfer')}
              className="action-button transfer-button"
            >
              <span className="action-icon">→</span>
              <div className="action-content">
                <span className="action-title">Transferir</span>
                <span className="action-subtitle">Enviar dinheiro</span>
              </div>
            </button>
          </div>
        </div>

        <TransactionList />
      </main>

      {activeModal && (
        <TransactionModal
          type={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  )
}

export default Dashboard

