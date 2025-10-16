import { AuthProvider, useAuth } from '@/context/FirebaseAuthContext'
import { FirebaseAuthPage } from '@/components/auth/FirebaseAuthPage'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import SuperEnhancedApp from './SuperEnhancedApp'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useState, useEffect } from 'react'
import './styles/transitions.css'

function AppContent() {
  const { currentUser, loading, loginLoading, logoutLoading, loginSuccess } = useAuth()
  
  // Transition states for amazing animations
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionType, setTransitionType] = useState<'login' | 'logout' | null>(null)
  const [showMainApp, setShowMainApp] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false)
  
  // Initialize main app for existing users
  useEffect(() => {
    if (currentUser && !loading && !hasInitialized) {
      setHasInitialized(true)
      if (loginSuccess) {
        // Fresh login - show welcome screen first
        setShowWelcomeScreen(true)
      } else {
        // Existing user - show app immediately
        setShowMainApp(true)
      }
    }
  }, [currentUser, loading, loginSuccess, hasInitialized])

  // Handle welcome screen completion
  const handleWelcomeComplete = () => {
    setShowWelcomeScreen(false)
    setShowMainApp(true)
  }

  // Handle logout transition
  useEffect(() => {
    if (!currentUser && showMainApp && !loading && hasInitialized) {
      setTransitionType('logout')
      setIsTransitioning(true)
      setTimeout(() => {
        setShowMainApp(false)
        setShowWelcomeScreen(false)
        setHasInitialized(false)
        setTimeout(() => {
          setIsTransitioning(false)
          setTransitionType(null)
        }, 800)
      }, 1000)
    }
  }, [currentUser, showMainApp, loading, hasInitialized])

  // Debug logging
  console.log('🔥 Firebase Auth State:', { 
    currentUser: currentUser ? {
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName
    } : null, 
    loading,
    loginLoading,
    logoutLoading,
    loginSuccess,
    isTransitioning,
    transitionType,
    showMainApp
  })

  // Show loading animation during initial auth check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-fuchsia-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
        <div className="text-center">
          {/* Loading Spinner */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl mb-4 shadow-xl animate-pulse">
            <span className="text-2xl font-bold text-white">E</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-4">
            Elevate
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-fuchsia-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-cyan-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Loading your habits...
          </p>
        </div>
      </div>
    )
  }

  // Show success animation after successful login
  if (loginSuccess && currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-gray-900">
        <div className="text-center">
          {/* Success Animation */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl mb-6 shadow-2xl animate-bounce">
            <div className="text-3xl">✅</div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Welcome Back!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Successfully signed in as {currentUser.email}
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-cyan-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm">
            Loading your dashboard...
          </p>
        </div>
      </div>
    )
  }

  // Modern Elegant Transition Animations
  if (isTransitioning) {
    if (transitionType === 'login') {
      return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-indigo-900">
          {/* Modern Background Elements */}
          <div className="absolute inset-0">
            {/* Elegant Floating Orbs */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-500/15 rounded-full blur-xl"></div>
            <div className="absolute top-3/4 right-1/4 w-40 h-40 bg-gradient-to-br from-violet-400/10 to-purple-500/15 rounded-full blur-xl"></div>
            <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-gradient-to-br from-cyan-400/10 to-blue-500/15 rounded-full blur-xl"></div>
            
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.15) 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }}></div>
          </div>
          
          {/* Main Content */}
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="text-center">
              {/* Modern Success Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-8 shadow-2xl animate-scale-in backdrop-blur-sm border border-white/20">
                <div className="text-3xl">✨</div>
              </div>
              
              <h1 className="text-5xl font-black bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent mb-4 animate-slide-up">
                Welcome Back
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 animate-slide-up max-w-md mx-auto" style={{ animationDelay: '0.1s' }}>
                Your habit journey continues
              </p>
              
              {/* Modern Progress Indicator */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
              
              {/* Elegant Loading Text */}
              <p className="text-sm text-slate-500 dark:text-slate-400 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                Loading your dashboard...
              </p>
            </div>
          </div>
        </div>
      )
    }
    
    if (transitionType === 'logout') {
      return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-slate-800 dark:to-red-900/20">
          {/* Modern Farewell Background */}
          <div className="absolute inset-0">
            {/* Elegant Floating Elements */}
            <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-gradient-to-br from-orange-400/10 to-red-500/15 rounded-full blur-xl"></div>
            <div className="absolute bottom-1/3 left-1/4 w-36 h-36 bg-gradient-to-br from-red-400/10 to-pink-500/15 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-gradient-to-br from-amber-400/10 to-orange-500/15 rounded-full blur-xl transform -translate-x-1/2 -translate-y-1/2"></div>
            
            {/* Subtle Pattern */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(251, 146, 60, 0.15) 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }}></div>
          </div>
          
          {/* Main Content */}
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="text-center">
              {/* Modern Farewell Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-8 shadow-2xl animate-scale-out backdrop-blur-sm border border-white/20">
                <div className="text-3xl">👋</div>
              </div>
              
              <h1 className="text-5xl font-black bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent mb-4 animate-slide-down">
                See You Soon
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 animate-slide-down max-w-md mx-auto" style={{ animationDelay: '0.1s' }}>
                Your progress has been saved
              </p>
              
              {/* Modern Progress Indicator */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
              
              {/* Elegant Farewell Text */}
              <p className="text-sm text-slate-500 dark:text-slate-400 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                Signing you out securely...
              </p>
            </div>
          </div>
        </div>
      )
    }
  }

  // Show auth page if user is not logged in
  if (!currentUser) {
    return <FirebaseAuthPage />
  }

  // Show welcome screen for fresh logins
  if (showWelcomeScreen && currentUser) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />
  }

  // Show main app if user is logged in
  if (showMainApp || (currentUser && !loading && !isTransitioning)) {
    return <SuperEnhancedApp />
  }

  // Fallback loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-fuchsia-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl mb-4 shadow-xl animate-pulse">
          <span className="text-2xl font-bold text-white">E</span>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Elevate
        </h1>
      </div>
    </div>
  )

  // Show loading animation during logout (only when logged in)
  if (logoutLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-fuchsia-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
        <div className="text-center">
          {/* Logout Loading Spinner */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl mb-4 shadow-xl animate-pulse">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Signing Out
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Logging you out safely...
          </p>
        </div>
      </div>
    )
  }

  console.log('🏠 Rendering SuperEnhancedApp for authenticated user')
  
  // Temporary simple success page for debugging
  if (window.location.search.includes('debug=simple')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-fuchsia-50 to-cyan-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Firebase Login Success!</h1>
          <p className="text-gray-600 mb-4">User: {currentUser?.email}</p>
          <p className="text-gray-600 mb-4">UID: {currentUser?.uid}</p>
          <button 
            onClick={() => window.location.href = 'http://localhost:5175/'}
            className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          >
            Load Full App
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <ErrorBoundary>
      <SuperEnhancedApp />
    </ErrorBoundary>
  )
}

export default function FirebaseElevateApp() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
