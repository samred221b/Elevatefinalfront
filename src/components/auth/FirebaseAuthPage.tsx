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
      }, 300)
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
      <div className={`w-full lg:w-2/5 relative overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 transition-all duration-1200 ease-out ${
        isRightAnimating ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      }`}>
        {/* Amazing Multi-Dimensional Background */}
        <div className="absolute inset-0">
          {/* Dynamic Gradient Waves */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-500/15 to-pink-400/20 dark:from-blue-600/30 dark:via-purple-700/25 dark:to-pink-600/30"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-cyan-300/25 via-violet-400/20 to-amber-300/15 dark:from-cyan-500/35 dark:via-violet-600/30 dark:to-amber-500/25"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-300/20 via-blue-400/25 to-indigo-500/20 dark:from-emerald-500/30 dark:via-blue-600/35 dark:to-indigo-700/30"></div>
          
          {/* Floating Geometric Crystals */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-cyan-500/40 rounded-2xl rotate-45 shadow-2xl backdrop-blur-sm border border-white/20 dark:border-white/10 animate-pulse"></div>
          <div className="absolute bottom-32 left-16 w-24 h-24 bg-gradient-to-tl from-purple-400/35 to-pink-500/45 rounded-xl -rotate-12 shadow-xl backdrop-blur-sm border border-white/25 dark:border-white/15"></div>
          <div className="absolute top-1/3 left-8 w-20 h-20 bg-gradient-to-r from-violet-400/40 to-indigo-500/50 rounded-full shadow-lg backdrop-blur-sm border border-white/30 dark:border-white/20"></div>
          <div className="absolute bottom-1/4 right-12 w-28 h-28 bg-gradient-to-bl from-emerald-400/30 to-teal-500/40 rounded-3xl rotate-12 shadow-xl backdrop-blur-sm border border-white/20 dark:border-white/10"></div>
          
          {/* Magical Orbs with Glow */}
          <div className="absolute -top-10 -right-10 w-[400px] h-[400px] bg-gradient-to-bl from-blue-500/20 via-purple-500/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] bg-gradient-to-tr from-pink-500/25 via-rose-500/35 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-gradient-to-r from-cyan-500/15 via-blue-500/25 to-transparent rounded-full blur-xl animate-pulse"></div>
          
          {/* Animated Particles */}
          <div className="absolute top-16 left-24 w-3 h-3 bg-blue-400 rounded-full animate-bounce shadow-lg"></div>
          <div className="absolute top-40 right-32 w-2 h-2 bg-purple-400 rounded-full animate-ping shadow-md"></div>
          <div className="absolute bottom-20 left-20 w-4 h-4 bg-cyan-400 rounded-full animate-pulse shadow-lg"></div>
          <div className="absolute bottom-40 right-16 w-2 h-2 bg-pink-400 rounded-full animate-bounce shadow-md"></div>
          <div className="absolute top-1/2 right-8 w-3 h-3 bg-violet-400 rounded-full animate-ping shadow-lg"></div>
          <div className="absolute top-3/4 left-12 w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-md"></div>
          
          {/* Flowing Lines */}
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <svg className="w-full h-full" viewBox="0 0 400 600" fill="none">
              <path d="M0,300 Q200,100 400,300 T800,300" stroke="url(#gradient1)" strokeWidth="2" fill="none" opacity="0.6"/>
              <path d="M0,200 Q200,400 400,200 T800,200" stroke="url(#gradient2)" strokeWidth="1.5" fill="none" opacity="0.5"/>
              <path d="M0,400 Q200,200 400,400 T800,400" stroke="url(#gradient3)" strokeWidth="1" fill="none" opacity="0.4"/>
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8"/>
                  <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#EC4899" stopOpacity="0.4"/>
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.7"/>
                  <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.5"/>
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.3"/>
                </linearGradient>
                <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.6"/>
                  <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          {/* Hexagonal Pattern */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.4'%3E%3Cpath d='M30 30l15-15v30l-15-15zm0 0l-15-15v30l15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
          
          {/* Prismatic Light Effects */}
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-conic from-blue-500/20 via-purple-500/30 via-pink-500/20 via-cyan-500/25 to-blue-500/20 rounded-full blur-2xl animate-spin" style={{ animationDuration: '20s' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-gradient-conic from-emerald-500/15 via-blue-500/25 via-violet-500/20 via-pink-500/15 to-emerald-500/15 rounded-full blur-xl animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
          
          {/* Floating Cards */}
          <div className="absolute top-12 left-12 w-16 h-24 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-lg border border-white/20 dark:border-white/10 shadow-xl rotate-12 hover:rotate-6 transition-transform duration-500"></div>
          <div className="absolute bottom-16 right-20 w-20 h-12 bg-white/15 dark:bg-white/8 backdrop-blur-md rounded-lg border border-white/25 dark:border-white/15 shadow-lg -rotate-6 hover:rotate-0 transition-transform duration-500"></div>
          <div className="absolute top-2/3 left-6 w-12 h-16 bg-white/12 dark:bg-white/6 backdrop-blur-md rounded-lg border border-white/20 dark:border-white/10 shadow-md rotate-45 hover:rotate-30 transition-transform duration-500"></div>
          
          {/* Mesh Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent dark:via-white/[0.01]"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-blue-500/[0.03] to-transparent dark:via-blue-400/[0.02]"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-purple-500/[0.02] to-transparent dark:via-purple-400/[0.01]"></div>
        </div>
        
        {/* Content Container */}
        <div className="relative z-10 flex items-center justify-center min-h-full">
          <div className="w-full max-w-4xl px-8 lg:px-16">
            {/* Auth Form - Centered */}
            <div className={`flex items-center justify-center min-h-full transition-all duration-1000 delay-300 ease-out ${
              isRightAnimating ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
            }`}>
              {renderAuthForm()}
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
