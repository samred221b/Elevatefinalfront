import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { ElevateApp } from './ElevateApp'
import SuperEnhancedApp from './SuperEnhancedApp'
import EnhancedApp from './EnhancedApp'
import './index.css'

// Simple test component
function SimpleTest() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ color: 'green' }}>✅ React is Loading!</h1>
      <p>If you see this, React is working correctly.</p>
      <p>Current URL: {window.location.href}</p>
    </div>
  )
}

// Check which version to load
const isTest = window.location.search.includes('debug=true')
const useEnhanced = window.location.search.includes('enhanced=true')
const useNoAuth = window.location.search.includes('noauth=true')

// Use ElevateApp with authentication by default
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isTest ? <SimpleTest /> : 
     useEnhanced ? <EnhancedApp /> : 
     useNoAuth ? <SuperEnhancedApp /> :
     <ToastProvider>
       <AuthProvider>
         <ElevateApp />
       </AuthProvider>
     </ToastProvider>}
  </React.StrictMode>,
)
