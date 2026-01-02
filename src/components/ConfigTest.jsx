import React from 'react'
import config from '../config/api'
import './ConfigTest.css'

const ConfigTest = () => {
  return (
    <div className="config-test">
      <h3>Configurações da API</h3>
      <div className="config-info">
        <div className="config-item">
          <span className="config-label">URL:</span>
          <span className="config-value">{config.apiUrl}</span>
        </div>
        <div className="config-item">
          <span className="config-label">Base Path:</span>
          <span className="config-value">{config.apiBasePath}</span>
        </div>
        <div className="config-item">
          <span className="config-label">Base URL Completa:</span>
          <span className="config-value">{config.baseUrl}</span>
        </div>
        <div className="config-item">
          <span className="config-label">Ambiente:</span>
          <span className={`config-value ${config.env}`}>
            {config.env}
            {config.isDevelopment && ' (Desenvolvimento)'}
            {config.isProduction && ' (Produção)'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ConfigTest

