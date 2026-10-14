import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ReportsProvider } from './context/ReportsProvider.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ReportsProvider>
        <App />
      </ReportsProvider>
    </AuthProvider>
  </StrictMode>,
)