import React, { createContext, useContext, useState, useEffect } from 'react'
import { apiService } from '../services/api'

const BankContext = createContext()

export const useBank = () => {
  const context = useContext(BankContext)
  if (!context) {
    throw new Error('useBank deve ser usado dentro de BankProvider')
  }
  return context
}

export const BankProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Carregar dados salvos do localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('bankUser')
    const savedTransactions = localStorage.getItem('bankTransactions')

    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      // Carregar dados da conta ao restaurar sessão
      loadAccountData(userData.id)
    }
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }
  }, [])

  // Salvar transações no localStorage
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('bankTransactions', JSON.stringify(transactions))
    }
  }, [transactions])

  // Carregar dados da conta
  const loadAccountData = async (accountId) => {
    try {
      setLoading(true)
      setError(null)
      const conta = await apiService.buscarContaPorId(accountId)
      setBalance(conta.saldo || 0)
    } catch (err) {
      setError(err.message)
      console.error('Erro ao carregar dados da conta:', err)
    } finally {
      setLoading(false)
    }
  }

  // Login: busca conta por ID ou CPF
  const login = async (identifier) => {
    try {
      setLoading(true)
      setError(null)

      // Tentar buscar por ID primeiro (se for número)
      const accountId = parseInt(identifier)
      let conta

      if (!isNaN(accountId)) {
        // Buscar por ID
        conta = await apiService.buscarContaPorId(accountId)
      } else {
        // Buscar por CPF ou listar todas e encontrar por nome/CPF
        const contas = await apiService.listarContas()
        conta = contas.find(
          c => c.cpf === identifier || 
               c.nome.toLowerCase().includes(identifier.toLowerCase())
        )
        
        if (!conta) {
          throw new Error('Conta não encontrada. Use o ID da conta ou CPF.')
        }
      }

      const userData = {
        id: conta.id,
        name: conta.nome,
        cpf: conta.cpf,
        accountNumber: conta.id.toString().padStart(8, '0')
      }

      setUser(userData)
      setBalance(conta.saldo || 0)
      localStorage.setItem('bankUser', JSON.stringify(userData))

      // Carregar histórico de transações se existir
      const savedTransactions = localStorage.getItem(`transactions_${conta.id}`)
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions))
      }

      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setBalance(0)
    setTransactions([])
    localStorage.removeItem('bankUser')
    localStorage.removeItem('bankTransactions')
  }

  // Adicionar transação ao histórico local
  const addTransaction = (type, amount, description) => {
    const newTransaction = {
      id: Date.now(),
      type,
      amount: parseFloat(amount),
      description,
      date: new Date().toISOString()
    }
    setTransactions(prev => [newTransaction, ...prev])
    
    // Salvar por conta
    if (user) {
      const accountTransactions = [...transactions, newTransaction]
      localStorage.setItem(`transactions_${user.id}`, JSON.stringify(accountTransactions))
    }
  }

  // Depósito
  const deposit = async (amount, description = 'Depósito') => {
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    if (amount <= 0) {
      throw new Error('Valor deve ser maior que zero')
    }

    try {
      setLoading(true)
      setError(null)
      
      const contaAtualizada = await apiService.depositar(user.id, amount)
      setBalance(contaAtualizada.saldo)
      addTransaction('deposit', amount, description)
      
      return true
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Saque
  const withdraw = async (amount, description = 'Saque') => {
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    if (amount <= 0) {
      throw new Error('Valor deve ser maior que zero')
    }

    if (amount > balance) {
      throw new Error('Saldo insuficiente')
    }

    try {
      setLoading(true)
      setError(null)
      
      const contaAtualizada = await apiService.sacar(user.id, amount)
      setBalance(contaAtualizada.saldo)
      addTransaction('withdraw', amount, description)
      
      return true
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Transferência
  const transfer = async (amount, recipientId, description = 'Transferência') => {
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    if (amount <= 0) {
      throw new Error('Valor deve ser maior que zero')
    }

    if (amount > balance) {
      throw new Error('Saldo insuficiente')
    }

    const recipientAccountId = parseInt(recipientId)
    if (isNaN(recipientAccountId)) {
      throw new Error('ID do destinatário inválido')
    }

    try {
      setLoading(true)
      setError(null)
      
      // Buscar nome do destinatário
      let recipientName = `Conta ${recipientAccountId}`
      try {
        const recipientAccount = await apiService.buscarContaPorId(recipientAccountId)
        recipientName = recipientAccount.nome
      } catch (err) {
        // Continua mesmo se não encontrar o nome
      }

      await apiService.transferir(user.id, recipientAccountId, amount)
      
      // Atualizar saldo da conta atual
      const contaAtualizada = await apiService.buscarContaPorId(user.id)
      setBalance(contaAtualizada.saldo)
      
      addTransaction('transfer', amount, `${description} para ${recipientName}`)
      
      return true
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <BankContext.Provider
      value={{
        user,
        balance,
        transactions,
        loading,
        error,
        login,
        logout,
        deposit,
        withdraw,
        transfer,
        loadAccountData
      }}
    >
      {children}
    </BankContext.Provider>
  )
}

