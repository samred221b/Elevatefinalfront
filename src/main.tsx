import React from 'react'
import ReactDOM from 'react-dom/client'
import SuperEnhancedApp from './SuperEnhancedApp'
import EnhancedApp from './EnhancedApp'
import FirebaseElevateApp from './FirebaseElevateApp'
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

// Use Firebase authentication by default
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isTest ? <SimpleTest /> : 
     useEnhanced ? <EnhancedApp /> : 
     useNoAuth ? <SuperEnhancedApp /> :
     <FirebaseElevateApp />}
  </React.StrictMode>,
)
