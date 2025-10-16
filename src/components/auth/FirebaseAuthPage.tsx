import { useState, useEffect } from 'react'
import { FirebaseLoginForm } from './FirebaseLoginForm'
import { FirebaseRegisterForm } from './FirebaseRegisterForm'
import { FirebaseForgotPasswordForm } from './FirebaseForgotPasswordForm'
import { EmailVerificationScreen } from './EmailVerificationScreen'

type AuthView = 'login' | 'register' | 'forgot-password' | 'verify-email'

export function FirebaseAuthPage() {
  const [currentView, setCurrentView] = useState<AuthView>('login')
  const [verificationEmail, setVerificationEmail] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  // Trigger entrance animation on mount
  useEffect(() => {
    // Small delay to ensure DOM is ready, then trigger animation
    const timer = setTimeout(() => {
      setIsAnimating(true)
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  // Re-trigger animation when view changes
  useEffect(() => {
    setIsAnimating(false)
    const timer = setTimeout(() => {
      setIsAnimating(true)
    }, 50)
    return () => clearTimeout(timer)
  }, [currentView])

  const renderAuthForm = () => {
    switch (currentView) {
      case 'login':
        return (
          <FirebaseLoginForm
            onSwitchToRegister={() => setCurrentView('register')}
            onSwitchToForgotPassword={() => setCurrentView('forgot-password')}
          />
        )
      case 'register':
        return (
          <FirebaseRegisterForm
            onSwitchToLogin={() => setCurrentView('login')}
            onVerificationSent={(email) => {
              setVerificationEmail(email)
              setCurrentView('verify-email')
            }}
          />
        )
      case 'forgot-password':
        return (
          <FirebaseForgotPasswordForm
            onBackToLogin={() => setCurrentView('login')}
          />
        )
      case 'verify-email':
        return (
          <EmailVerificationScreen
            email={verificationEmail}
            onBackToLogin={() => setCurrentView('login')}
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
        isAnimating ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
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
            isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
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
            isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
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
            isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
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
            isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            <p className="text-white/60 text-sm">
              Join thousands of users who have transformed their lives with Elevate
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Ultra Creative Artistic Background */}
      <div className={`w-full lg:w-2/5 relative overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 transition-all duration-1200 ease-out ${
        isAnimating ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      }`}>
        {/* Sophisticated Multi-layered Background Design */}
        <div className="absolute inset-0">
          {/* Primary Artistic Gradients */}
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-100/50 via-transparent to-blue-200/40 dark:from-violet-900/30 dark:to-blue-900/25"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-purple-100/35 via-transparent to-pink-100/45 dark:from-purple-900/20 dark:to-pink-900/25"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-cyan-100/25 via-transparent to-indigo-100/35 dark:from-cyan-900/15 dark:to-indigo-900/20"></div>
          
          {/* Large Artistic Orbs */}
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-gradient-to-bl from-blue-200/15 via-indigo-200/20 to-transparent rounded-full blur-3xl dark:from-blue-800/8 dark:via-indigo-800/12"></div>
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-purple-200/20 via-violet-200/25 to-transparent rounded-full blur-3xl dark:from-purple-800/12 dark:via-violet-800/15"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-r from-pink-200/10 via-rose-200/15 to-transparent rounded-full blur-2xl dark:from-pink-800/6 dark:via-rose-800/10"></div>
          
          {/* Geometric Art Pieces */}
          <div className="absolute top-16 right-24 w-40 h-40 bg-gradient-to-br from-blue-300/8 to-cyan-300/12 rounded-[2rem] rotate-12 blur-sm dark:from-blue-700/5 dark:to-cyan-700/8"></div>
          <div className="absolute bottom-24 right-12 w-32 h-32 bg-gradient-to-tl from-purple-300/12 to-pink-300/8 rounded-[1.5rem] -rotate-12 blur-sm dark:from-purple-700/8 dark:to-pink-700/5"></div>
          <div className="absolute top-1/3 right-6 w-20 h-20 bg-gradient-to-br from-violet-300/15 to-indigo-300/10 rounded-full blur-sm dark:from-violet-700/10 dark:to-indigo-700/6"></div>
          <div className="absolute bottom-1/3 left-8 w-28 h-28 bg-gradient-to-tr from-cyan-300/10 to-blue-300/15 rounded-[1.2rem] rotate-45 blur-sm dark:from-cyan-700/6 dark:to-blue-700/10"></div>
          
          {/* Sophisticated Pattern Overlays */}
          <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.4) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}></div>
          <div className="absolute inset-0 opacity-[0.01] dark:opacity-[0.02]" style={{
            backgroundImage: `linear-gradient(45deg, rgba(139, 92, 246, 0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(139, 92, 246, 0.1) 25%, transparent 25%)`,
            backgroundSize: '60px 60px'
          }}></div>
          
          {/* Artistic Floating Elements */}
          <div className="absolute top-20 left-20 w-8 h-8 bg-gradient-to-br from-blue-400/15 to-cyan-400/10 rounded-full blur-sm dark:from-blue-600/10 dark:to-cyan-600/6"></div>
          <div className="absolute top-32 right-40 w-6 h-6 bg-gradient-to-br from-purple-400/20 to-pink-400/15 rounded-full blur-sm dark:from-purple-600/12 dark:to-pink-600/8"></div>
          <div className="absolute bottom-32 left-16 w-10 h-10 bg-gradient-to-br from-violet-400/12 to-indigo-400/18 rounded-full blur-sm dark:from-violet-600/8 dark:to-indigo-600/12"></div>
          <div className="absolute bottom-16 right-32 w-7 h-7 bg-gradient-to-br from-cyan-400/18 to-blue-400/12 rounded-full blur-sm dark:from-cyan-600/12 dark:to-blue-600/8"></div>
          <div className="absolute top-2/3 left-12 w-5 h-5 bg-gradient-to-br from-rose-400/15 to-pink-400/10 rounded-full blur-sm dark:from-rose-600/10 dark:to-pink-600/6"></div>
          <div className="absolute top-1/4 right-16 w-9 h-9 bg-gradient-to-br from-indigo-400/10 to-purple-400/15 rounded-full blur-sm dark:from-indigo-600/6 dark:to-purple-600/10"></div>
          
          {/* Abstract Artistic Shapes */}
          <div className="absolute top-1/5 left-6 w-24 h-48 bg-gradient-to-b from-indigo-200/6 via-purple-200/10 to-violet-200/8 rounded-full blur-lg transform -rotate-45 dark:from-indigo-800/4 dark:via-purple-800/6 dark:to-violet-800/5"></div>
          <div className="absolute bottom-1/5 right-8 w-20 h-40 bg-gradient-to-t from-blue-200/8 via-cyan-200/12 to-indigo-200/6 rounded-full blur-lg transform rotate-30 dark:from-blue-800/5 dark:via-cyan-800/8 dark:to-indigo-800/4"></div>
          <div className="absolute top-1/2 left-4 w-16 h-32 bg-gradient-to-b from-pink-200/10 via-rose-200/6 to-purple-200/12 rounded-full blur-lg transform rotate-60 dark:from-pink-800/6 dark:via-rose-800/4 dark:to-purple-800/8"></div>
          
          {/* Sophisticated Mesh Gradients */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-violet-100/3 to-transparent dark:via-violet-900/6"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-blue-100/5 to-transparent dark:via-blue-900/4"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-purple-100/4 to-transparent dark:via-purple-900/7"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-indigo-100/6 to-transparent dark:via-indigo-900/5"></div>
          
          {/* Final Artistic Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.01] to-transparent dark:via-black/[0.02]"></div>
        </div>
        
        {/* Content Container */}
        <div className="relative z-10 flex items-center justify-center min-h-full">
          <div className="w-full max-w-4xl px-8 lg:px-16">
            {/* Auth Form - Centered */}
            <div className={`flex items-center justify-center min-h-full transition-all duration-1000 delay-300 ease-out ${
              isAnimating ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
            }`}>
              {renderAuthForm()}
            </div>
            
            {/* Trust Indicators */}
            <div className={`hidden lg:flex items-center justify-center gap-8 mt-8 text-sm text-gray-500 dark:text-gray-400 transition-all duration-700 delay-700 ease-out ${
              isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
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
