import { useState, useEffect } from 'react'
import { FirebaseLoginForm } from './FirebaseLoginForm'
import { FirebaseRegisterForm } from './FirebaseRegisterForm'
import { FirebaseForgotPasswordForm } from './FirebaseForgotPasswordForm'
import { EmailVerificationScreen } from './EmailVerificationScreen'

type AuthView = 'login' | 'register' | 'forgot-password' | 'verify-email'

export function FirebaseAuthPage() {
  const [currentView, setCurrentView] = useState<AuthView>('login')
  const [verificationEmail, setVerificationEmail] = useState('')
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isLeftAnimating, setIsLeftAnimating] = useState(false)
  const [isRightAnimating, setIsRightAnimating] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Trigger entrance animation on mount (both sides)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeftAnimating(true)
      setIsRightAnimating(true)
      setIsInitialLoad(false)
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  // Smooth transition when view changes (only right side)
  useEffect(() => {
    if (isTransitioning && !isInitialLoad) {
      // Only animate right side during view transitions
      setIsRightAnimating(false)
      const timer = setTimeout(() => {
        setIsRightAnimating(true)
        setIsTransitioning(false)
      }, 600) // Increased from 300ms to 600ms for smoother transition
      return () => clearTimeout(timer)
    }
  }, [currentView, isTransitioning, isInitialLoad])

  // Custom view change handler with smooth transition
  const handleViewChange = (newView: AuthView) => {
    setIsTransitioning(true)
    setCurrentView(newView)
  }

  const renderAuthForm = () => {
    switch (currentView) {
      case 'login':
        return (
          <FirebaseLoginForm
            onSwitchToRegister={() => handleViewChange('register')}
            onSwitchToForgotPassword={() => handleViewChange('forgot-password')}
          />
        )
      case 'register':
        return (
          <FirebaseRegisterForm
            onSwitchToLogin={() => handleViewChange('login')}
            onVerificationSent={(email) => {
              setVerificationEmail(email)
              handleViewChange('verify-email')
            }}
          />
        )
      case 'forgot-password':
        return (
          <FirebaseForgotPasswordForm
            onBackToLogin={() => handleViewChange('login')}
          />
        )
      case 'verify-email':
        return (
          <EmailVerificationScreen
            email={verificationEmail}
            onBackToLogin={() => handleViewChange('login')}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Left Side - Elegant Modern Showcase */}
      <div className={`hidden lg:flex lg:w-3/5 relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 transition-all duration-1000 ease-out ${
        isLeftAnimating ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
      }`}>
        {/* Subtle Static Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/30 to-violet-600/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        
        {/* Static Elegant Overlays */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-purple-500/15 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-violet-500/8 to-fuchsia-500/8 rounded-full blur-2xl" />
        </div>

        {/* Content Container - Full Width Usage */}
        <div className="relative z-10 flex flex-col justify-center px-8 py-8 text-white h-full max-w-none">
          {/* Hero Section - Clean Layout */}
          <div className={`mb-10 transition-all duration-800 delay-200 ease-out ${
            isLeftAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            {/* Elegant Title */}
            <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Elevate
            </h1>
            <p className="text-xl text-white/80 font-light">
              Transform your habits, elevate your life
            </p>
          </div>

          {/* Features Section - Moderately Taller Cards */}
          <div className={`grid grid-cols-2 gap-4 mb-8 transition-all duration-900 delay-400 ease-out ${
            isLeftAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {/* Smart Analytics - Advanced */}
            <div className="relative overflow-hidden p-5 bg-gradient-to-br from-white/10 via-white/8 to-white/5 backdrop-blur-md rounded-xl border border-white/20 hover:border-blue-400/30 hover:bg-white/15 transition-all duration-500 group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400/40 to-cyan-500/40 rounded-xl flex items-center justify-center border border-white/30 flex-shrink-0 shadow-lg">
                    <span className="text-xl">📊</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold">Smart Analytics</h3>
                      <div className="px-2 py-0.5 bg-blue-500/20 rounded-full border border-blue-400/30">
                        <span className="text-xs font-medium text-blue-200">AI-Powered</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-white/70 text-sm leading-relaxed mb-2">Get deep insights into your habit patterns with AI-powered analytics that help you understand what works.</p>
                  <p className="text-white/60 text-xs mb-2">Track progress with detailed charts and receive personalized recommendations.</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1 text-xs text-white/60">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      <span>Trend Analysis</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/60">
                      <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                      <span>Predictive Insights</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personalized Goals - Advanced */}
            <div className="relative overflow-hidden p-5 bg-gradient-to-br from-white/10 via-white/8 to-white/5 backdrop-blur-md rounded-xl border border-white/20 hover:border-purple-400/30 hover:bg-white/15 transition-all duration-500 group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400/40 to-pink-500/40 rounded-xl flex items-center justify-center border border-white/30 flex-shrink-0 shadow-lg">
                    <span className="text-xl">🎯</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold">Personalized Goals</h3>
                      <div className="px-2 py-0.5 bg-purple-500/20 rounded-full border border-purple-400/30">
                        <span className="text-xs font-medium text-purple-200">Adaptive</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-white/70 text-sm leading-relaxed mb-2">Create custom habit plans that adapt to your unique lifestyle and personal objectives.</p>
                  <p className="text-white/60 text-xs mb-2">Intelligent system adjusts difficulty levels and timing to keep you motivated.</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1 text-xs text-white/60">
                      <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                      <span>Smart Scheduling</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/60">
                      <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
                      <span>Difficulty Scaling</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement System - Advanced */}
            <div className="relative overflow-hidden p-5 bg-gradient-to-br from-white/10 via-white/8 to-white/5 backdrop-blur-md rounded-xl border border-white/20 hover:border-violet-400/30 hover:bg-white/15 transition-all duration-500 group">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-400/40 to-fuchsia-500/40 rounded-xl flex items-center justify-center border border-white/30 flex-shrink-0 shadow-lg">
                    <span className="text-xl">🏆</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold">Achievement System</h3>
                      <div className="px-2 py-0.5 bg-violet-500/20 rounded-full border border-violet-400/30">
                        <span className="text-xs font-medium text-violet-200">Gamified</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-white/70 text-sm leading-relaxed mb-2">Stay motivated with comprehensive gamification featuring rewards and celebrations.</p>
                  <p className="text-white/60 text-xs mb-2">Unlock badges, climb levels, and compete while building lasting habits.</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1 text-xs text-white/60">
                      <div className="w-1 h-1 bg-violet-400 rounded-full"></div>
                      <span>Streak Rewards</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/60">
                      <div className="w-1 h-1 bg-fuchsia-400 rounded-full"></div>
                      <span>Level System</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cross-Platform Sync - Advanced */}
            <div className="relative overflow-hidden p-5 bg-gradient-to-br from-white/10 via-white/8 to-white/5 backdrop-blur-md rounded-xl border border-white/20 hover:border-emerald-400/30 hover:bg-white/15 transition-all duration-500 group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400/40 to-teal-500/40 rounded-xl flex items-center justify-center border border-white/30 flex-shrink-0 shadow-lg">
                    <span className="text-xl">📱</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold">Cross-Platform Sync</h3>
                      <div className="px-2 py-0.5 bg-emerald-500/20 rounded-full border border-emerald-400/30">
                        <span className="text-xs font-medium text-emerald-200">Real-time</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-white/70 text-sm leading-relaxed mb-2">Access habits seamlessly across all devices with real-time synchronization and offline support.</p>
                  <p className="text-white/60 text-xs mb-2">Progress stays up-to-date on phone, tablet, or computer, even offline.</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1 text-xs text-white/60">
                      <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                      <span>Cloud Backup</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/60">
                      <div className="w-1 h-1 bg-teal-400 rounded-full"></div>
                      <span>Offline Mode</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section - Tight Fit */}
          <div className={`flex justify-center gap-6 mb-6 transition-all duration-700 delay-600 ease-out ${
            isLeftAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}>
            <div className="text-center px-3 py-2">
              <div className="text-xl font-black bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">50K+</div>
              <div className="text-white/80 text-xs font-medium">Active Users</div>
              <div className="text-white/60 text-xs">Growing daily</div>
            </div>
            <div className="text-center px-3 py-2">
              <div className="text-xl font-black bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">2M+</div>
              <div className="text-white/80 text-xs font-medium">Habits Completed</div>
              <div className="text-white/60 text-xs">Life changing</div>
            </div>
            <div className="text-center px-3 py-2">
              <div className="text-xl font-black bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">98%</div>
              <div className="text-white/80 text-xs font-medium">Success Rate</div>
              <div className="text-white/60 text-xs">Proven results</div>
            </div>
          </div>

          {/* Bottom CTA Section */}
          <div className={`text-center transition-all duration-600 delay-800 ease-out ${
            isLeftAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            <p className="text-white/60 text-sm">
              Join thousands of users who have transformed their lives with Elevate
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Spectacular Creative Background */}
      <div className={`w-full lg:w-2/5 relative overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 transition-all duration-1500 ease-in-out ${
        isRightAnimating ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      }`}>
        {/* Clean Elegant Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Layered Gradient Foundation */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/80 to-purple-100/90 dark:from-gray-900 dark:via-blue-900/80 dark:to-purple-900/90"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-cyan-100/40 via-violet-100/30 to-pink-100/50 dark:from-cyan-900/40 dark:via-violet-900/30 dark:to-pink-900/50"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100/35 via-blue-100/45 to-indigo-100/40 dark:from-emerald-900/35 dark:via-blue-900/45 dark:to-indigo-900/40"></div>
          
          {/* Advanced Mesh Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent dark:via-white/[0.015]"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-blue-500/[0.04] to-transparent dark:via-blue-400/[0.025]"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-purple-500/[0.03] to-transparent dark:via-purple-400/[0.02]"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-pink-500/[0.025] to-transparent dark:via-pink-400/[0.015]"></div>
          
          {/* Subtle Noise Texture */}
          <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        {/* Content Container */}
        <div className="relative z-10 flex items-center justify-center min-h-full">
          <div className="w-full max-w-4xl px-8 lg:px-16">
            {/* Auth Form - Elegant Modern Container */}
            <div className={`flex items-center justify-center min-h-full transition-all duration-1200 delay-400 ease-in-out ${
              isRightAnimating ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
            }`}>
              <div className="relative w-full max-w-md">
                {/* Elegant Background Effects */}
                <div className="absolute inset-0 -m-4">
                  {/* Primary Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-blue-50/30 to-purple-50/25 dark:from-white/5 dark:via-blue-900/20 dark:to-purple-900/15 rounded-3xl blur-xl"></div>
                  
                  {/* Secondary Glow */}
                  <div className="absolute inset-0 bg-gradient-to-tl from-cyan-50/25 via-violet-50/20 to-pink-50/30 dark:from-cyan-900/15 dark:via-violet-900/10 dark:to-pink-900/20 rounded-3xl blur-lg"></div>
                  
                  {/* Accent Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100/15 via-purple-100/25 to-indigo-100/20 dark:from-blue-800/10 dark:via-purple-800/15 dark:to-indigo-800/12 rounded-2xl blur-md"></div>
                </div>

                {/* Elegant Glass Container */}
                <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-2xl border border-white/30 dark:border-gray-700/30 shadow-2xl overflow-hidden" style={{
                  boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}>
                  {/* Subtle Inner Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-blue-50/5 dark:from-white/5 dark:via-transparent dark:to-blue-900/10 rounded-2xl"></div>
                  
                  {/* Elegant Border Gradient */}
                  <div className="absolute inset-0 rounded-2xl" style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)',
                    padding: '1px'
                  }}>
                    <div className="w-full h-full bg-white/80 dark:bg-gray-900/80 rounded-2xl"></div>
                  </div>

                  {/* Floating Accent Elements */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-60 animate-pulse"></div>
                  <div className="absolute top-6 right-8 w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-40 animate-ping"></div>
                  <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full opacity-50 animate-bounce"></div>

                  {/* Content Wrapper */}
                  <div className="relative z-10 p-1">
                    {renderAuthForm()}
                  </div>
                </div>

                {/* Elegant Floating Particles */}
                <div className="absolute -top-8 -left-8 w-4 h-4 bg-gradient-to-br from-blue-300/40 to-cyan-300/60 rounded-full blur-sm animate-bounce opacity-70" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
                <div className="absolute -top-4 -right-6 w-3 h-3 bg-gradient-to-br from-purple-300/50 to-pink-300/70 rounded-full blur-sm animate-ping opacity-60" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
                <div className="absolute -bottom-6 -right-8 w-2 h-2 bg-gradient-to-br from-violet-300/60 to-indigo-300/80 rounded-full blur-sm animate-pulse opacity-80" style={{ animationDelay: '2s', animationDuration: '2.5s' }}></div>
                <div className="absolute -bottom-4 -left-6 w-3 h-3 bg-gradient-to-br from-emerald-300/40 to-teal-300/60 rounded-full blur-sm animate-bounce opacity-50" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
              </div>
            </div>
            
            {/* Trust Indicators */}
            <div className={`hidden lg:flex items-center justify-center gap-8 mt-8 text-sm text-gray-500 dark:text-gray-400 transition-all duration-700 delay-700 ease-out ${
              isRightAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Secure Login</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Privacy Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Data Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
