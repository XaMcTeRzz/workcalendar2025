import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

// Предотвращаем ошибки в production
const root = document.getElementById('root')
if (root) {
  const reactRoot = ReactDOM.createRoot(root)
  
  // Оборачиваем в ErrorBoundary для отлова ошибок
  reactRoot.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} 