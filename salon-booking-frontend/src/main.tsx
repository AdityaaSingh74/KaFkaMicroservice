import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'  // ← This imports the CSS file
import App from './App.tsx'
import { initKeycloak } from './services/keycloakService'

const root = createRoot(document.getElementById('root')!)

root.render(
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '1.5rem',
    flexDirection: 'column',
    gap: '20px'
  }}>
    <div>Initializing...</div>
    <button 
      onClick={() => {
        root.render(<StrictMode><App /></StrictMode>)
      }}
      style={{
        padding: '10px 20px',
        fontSize: '1rem',
        cursor: 'pointer',
        background: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '8px'
      }}
    >
      Skip and Load App
    </button>
  </div>
)

const initTimeout = setTimeout(() => {
  root.render(<StrictMode><App /></StrictMode>)
}, 3000)

initKeycloak(() => {
  clearTimeout(initTimeout)
  root.render(<StrictMode><App /></StrictMode>)
}).catch((error) => {
  clearTimeout(initTimeout)
  console.error('❌ Keycloak failed:', error)
  root.render(<StrictMode><App /></StrictMode>)
})