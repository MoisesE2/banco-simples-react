import React from 'react'
import { BankProvider, useBank } from './context/BankContext'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import './App.css'

const AppContent = () => {
  const { user } = useBank()

  return user ? <Dashboard /> : <Login />
}

const App = () => {
  return (
    <BankProvider>
      <AppContent />
    </BankProvider>
  )
}

export default App

