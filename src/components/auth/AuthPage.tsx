import { useState } from 'react'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { ForgotPasswordForm } from './ForgotPasswordForm'
import { EmailVerificationForm } from './EmailVerificationForm'
import { Logo } from '../ui/Logo';
import { ApiDebugger } from '../ApiDebugger';
import { BarChart3, Target, Zap, Trophy } from 'lucide-react';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationData, setVerificationData] = useState<{email: string, name: string} | null>(null);
  const showDebugger = window.location.search.includes('debug=api');

  const handleRegistrationSuccess = (data: any) => {
    if (data.requiresVerification) {
      setVerificationData({ email: data.email, name: data.name });
      setShowEmailVerification(true);
    }
  };

  const handleVerificationSuccess = (userData: any) => {
    // User is now logged in, the auth context will handle the redirect
    console.log('Email verified successfully:', userData);
  };

  const handleBackToLogin = () => {
    setShowEmailVerification(false);
    setIsLogin(true);
    setShowForgotPassword(false);
  };

  const handleLoginVerificationRequired = (email: string) => {
    setVerificationData({ email, name: '' });
    setIsLogin(false);
    setShowEmailVerification(true);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-blue-50/50 to-violet-50/30 relative overflow-hidden">
      {/* Premium ambient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-indigo-500/3 to-violet-500/3"></div>
      
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.02) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.02) 0%, transparent 50%)
        `
      }}></div>
      
      {/* Split Screen Layout */}
      <div className="h-screen flex">
        {/* Amazing Enhanced Left Side - Marketing Section */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 overflow-hidden">
          {/* Premium Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-indigo-900/30 to-purple-900/50"></div>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-violet-500/30 to-transparent rounded-full blur-3xl"></div>
            </div>
          </div>
          
          {/* Responsive Content Container */}
          <div className="relative z-10 flex flex-col justify-center px-8 lg:px-12 py-6 text-white w-full h-full overflow-y-auto">
            {/* Compact Logo Section */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-violet-500 rounded-xl blur-md opacity-50"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                    <Logo size="lg" className="rounded-lg" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black bg-gradient-to-r from-white via-blue-100 to-violet-200 bg-clip-text text-transparent tracking-tight">
                    Elevate
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-16 h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gradient-to-br from-blue-400 to-violet-400 rounded-full"></div>
                  </div>
                  <p className="text-blue-200/70 text-xs font-medium mt-1 tracking-wide">HABIT TRANSFORMATION PLATFORM</p>
                </div>
              </div>
            </div>
            
            {/* Compact Value Proposition */}
            <div className="mb-6">
              <div className="relative">
                <h2 className="text-2xl lg:text-3xl font-black mb-4 leading-tight">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-indigo-100 bg-clip-text text-transparent">
                    Transform Your Life,
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-200 via-indigo-200 to-violet-200 bg-clip-text text-transparent">
                    One Habit at a Time
                  </span>
                </h2>
                <div className="w-20 h-0.5 bg-gradient-to-r from-blue-400 to-violet-400 rounded-full mb-4"></div>
              </div>
              <p className="text-base lg:text-lg text-blue-100/90 leading-relaxed max-w-md font-medium">
                Join thousands of users building lasting habits with 
                <span className="text-white font-semibold"> smart analytics</span> and 
                <span className="text-violet-200 font-semibold"> meaningful insights</span>.
              </p>
              
              {/* Compact Badge */}
              <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-white">Trusted by 10,000+ users</span>
              </div>
            </div>
            
            {/* Compact Feature Grid */}
            <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-6">
              <div className="group p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-white/30 hover:bg-white/15 transition-all duration-500">
                <div className="relative mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                </div>
                <h3 className="font-black text-white mb-1 text-sm">Smart Analytics</h3>
                <p className="text-blue-100/80 text-xs leading-relaxed">Beautiful insights to track progress</p>
              </div>
              
              <div className="group p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-white/30 hover:bg-white/15 transition-all duration-500">
                <div className="relative mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                </div>
                <h3 className="font-black text-white mb-1 text-sm">Goal Setting</h3>
                <p className="text-blue-100/80 text-xs leading-relaxed">Achieve objectives consistently</p>
              </div>
              
              <div className="group p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-white/30 hover:bg-white/15 transition-all duration-500">
                <div className="relative mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                </div>
                <h3 className="font-black text-white mb-1 text-sm">Smart Reminders</h3>
                <p className="text-blue-100/80 text-xs leading-relaxed">Adaptive notifications</p>
              </div>
              
              <div className="group p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-white/30 hover:bg-white/15 transition-all duration-500">
                <div className="relative mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                </div>
                <h3 className="font-black text-white mb-1 text-sm">Achievements</h3>
                <p className="text-blue-100/80 text-xs leading-relaxed">Celebrate milestones</p>
              </div>
            </div>
            
            {/* Compact Social Proof */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-xl blur-lg"></div>
              <div className="relative flex items-center justify-between p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/20">
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-black bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">10K+</div>
                  <div className="text-xs text-blue-200/80 uppercase tracking-wide font-semibold">Users</div>
                </div>
                <div className="w-px h-6 bg-white/20"></div>
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-black bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">4.9★</div>
                  <div className="text-xs text-blue-200/80 uppercase tracking-wide font-semibold">Rating</div>
                </div>
                <div className="w-px h-6 bg-white/20"></div>
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-black bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">1M+</div>
                  <div className="text-xs text-blue-200/80 uppercase tracking-wide font-semibold">Habits</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Creative & Elegant Right Side - Sophisticated Authentication Area */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden">
          {/* Elegant geometric patterns */}
          <div className="absolute inset-0">
            {/* Flowing organic shapes */}
            <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.03]">
              <div className="w-full h-full bg-gradient-to-bl from-blue-500 via-violet-500 to-purple-500 rounded-full transform scale-150 blur-3xl"></div>
            </div>
            <div className="absolute bottom-0 left-0 w-80 h-80 opacity-[0.025]">
              <div className="w-full h-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 rounded-full transform scale-125 blur-3xl"></div>
            </div>
            
            {/* Sophisticated line patterns */}
            <div className="absolute inset-0 opacity-[0.015]" style={{
              backgroundImage: `
                linear-gradient(45deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                linear-gradient(-45deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px, 80px 80px, 120px 120px'
            }}></div>
            
            {/* Elegant floating elements */}
            <div className="absolute top-20 right-16 w-2 h-2 bg-gradient-to-br from-blue-400 to-violet-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full opacity-15 animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-60 right-8 w-1 h-1 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
            
            <div className="absolute bottom-32 left-12 w-2 h-2 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full opacity-18 animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-48 left-28 w-1.5 h-1.5 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full opacity-22 animate-pulse" style={{animationDelay: '1.5s'}}></div>
            <div className="absolute bottom-20 left-40 w-1 h-1 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full opacity-20 animate-pulse" style={{animationDelay: '2.5s'}}></div>
            
            {/* Subtle geometric shapes */}
            <div className="absolute top-32 left-8 w-16 h-16 border border-blue-200/20 rounded-full opacity-10 transform rotate-45"></div>
            <div className="absolute top-16 left-24 w-12 h-12 border border-violet-200/15 rounded-full opacity-8 transform -rotate-12"></div>
            <div className="absolute bottom-40 right-20 w-20 h-20 border border-purple-200/12 rounded-full opacity-6 transform rotate-30"></div>
            
            {/* Flowing curves */}
            <div className="absolute top-1/2 left-0 w-32 h-64 opacity-[0.02]">
              <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-transparent rounded-r-full transform -translate-x-16 rotate-12"></div>
            </div>
            <div className="absolute top-1/4 right-0 w-28 h-56 opacity-[0.018]">
              <div className="w-full h-full bg-gradient-to-l from-violet-500 to-transparent rounded-l-full transform translate-x-14 -rotate-6"></div>
            </div>
            
          </div>
          
          <div className="w-full max-w-md relative z-10">
            {/* Modern authentication card */}
            <div className="relative">
              {/* Enhanced shadow */}
              <div className="absolute inset-0 bg-gray-900/8 rounded-3xl blur-2xl transform translate-y-1"></div>
              
              {/* Modern Card Surface */}
              <div className="relative bg-white rounded-3xl border border-gray-200/60 shadow-2xl p-8 backdrop-blur-sm">
                {/* Form content */}
                <div>
                  <div className="transition-all duration-300 ease-in-out">
                    {showEmailVerification && verificationData ? (
                      <div className="animate-in slide-in-from-right-4 fade-in-0 duration-300">
                        <EmailVerificationForm
                          email={verificationData.email}
                          name={verificationData.name}
                          onVerificationSuccess={handleVerificationSuccess}
                          onBackToLogin={handleBackToLogin}
                        />
                      </div>
                    ) : showForgotPassword ? (
                      <div className="animate-in slide-in-from-left-4 fade-in-0 duration-300">
                        <ForgotPasswordForm 
                          onBackToLogin={handleBackToLogin}
                        />
                      </div>
                    ) : isLogin ? (
                      <div key="login-form" className="animate-in slide-in-from-bottom-4 fade-in-0 duration-300">
                        <LoginForm 
                          key="login-form-component"
                          onSwitchToRegister={() => setIsLogin(false)}
                          onForgotPassword={() => setShowForgotPassword(true)}
                          onVerificationRequired={handleLoginVerificationRequired}
                        />
                      </div>
                    ) : (
                      <div className="animate-in slide-in-from-top-4 fade-in-0 duration-300">
                        <RegisterForm 
                          onSwitchToLogin={() => setIsLogin(true)}
                          onRegistrationSuccess={handleRegistrationSuccess}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* API Debugger - Show when ?debug=api is in URL */}
      {showDebugger && (
        <div className="fixed bottom-4 right-4 w-96 max-h-96 overflow-y-auto z-50">
          <ApiDebugger />
        </div>
      )}
    </div>
  );
}
