import { useState } from 'react'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { ForgotPasswordForm } from './ForgotPasswordForm'
import { Logo } from '../ui/Logo';
import { BarChart3, Target, Zap, Trophy } from 'lucide-react';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Simple, clean background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-violet-500/5"></div>
      
      {/* Split Screen Layout */}
      <div className="h-screen flex">
        {/* Enhanced Left Side - Marketing Section */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          {/* Elegant geometric pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
                linear-gradient(45deg, transparent 40%, rgba(99, 102, 241, 0.1) 50%, transparent 60%)
              `
            }}></div>
          </div>
          
          {/* Content Container */}
          <div className="relative z-10 flex flex-col justify-center px-12 py-8 text-white w-full">
            {/* Enhanced Logo Section */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-4 mb-6">
                <Logo size="xl" className="rounded-xl" />
                <div>
                  <h1 className="text-5xl font-black bg-gradient-to-r from-white via-blue-100 to-violet-100 bg-clip-text text-transparent">
                    Elevate
                  </h1>
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-violet-400 rounded-full mt-2"></div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Value Proposition */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4 leading-tight">
                <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Transform Your Life,
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-200 to-violet-200 bg-clip-text text-transparent">
                  One Habit at a Time
                </span>
              </h2>
              <p className="text-xl text-blue-100/80 leading-relaxed max-w-md">
                Join thousands of users who've built lasting habits with our intelligent tracking system and meaningful insights.
              </p>
            </div>
            
            {/* Enhanced Feature Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="group p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-6 h-6 text-blue-300" />
                </div>
                <h3 className="font-bold text-white mb-1 text-sm">Smart Analytics</h3>
                <p className="text-blue-100/70 text-xs leading-relaxed">Beautiful charts and insights to track your progress</p>
              </div>
              
              <div className="group p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-6 h-6 text-indigo-300" />
                </div>
                <h3 className="font-bold text-white mb-1 text-sm">Goal Setting</h3>
                <p className="text-blue-100/70 text-xs leading-relaxed">Set meaningful objectives and achieve them consistently</p>
              </div>
              
              <div className="group p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500/20 to-violet-600/20 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-violet-300" />
                </div>
                <h3 className="font-bold text-white mb-1 text-sm">Smart Reminders</h3>
                <p className="text-blue-100/70 text-xs leading-relaxed">Intelligent notifications that adapt to your schedule</p>
              </div>
              
              <div className="group p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500/20 to-teal-600/20 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="w-6 h-6 text-teal-300" />
                </div>
                <h3 className="font-bold text-white mb-1 text-sm">Achievements</h3>
                <p className="text-blue-100/70 text-xs leading-relaxed">Celebrate milestones and stay motivated</p>
              </div>
            </div>
            
            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-4 border-t border-white/10">
              <div className="text-center">
                <div className="text-xl font-bold text-white">10K+</div>
                <div className="text-xs text-blue-200/70 uppercase tracking-wide">Users</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">4.9★</div>
                <div className="text-xs text-blue-200/70 uppercase tracking-wide">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">1M+</div>
                <div className="text-xs text-blue-200/70 uppercase tracking-wide">Habits</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Authentication Card */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white">
          <div className="w-full max-w-md">
            {/* Clean authentication card */}
            <div className="relative group">
              {/* Subtle shadow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10 rounded-3xl blur-xl transform scale-105 opacity-40"></div>
              
              {/* Clean white surface */}
              <div className="relative bg-white rounded-3xl border border-gray-100 shadow-xl p-8 lg:p-10">
                {/* Subtle top accent */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"></div>
                
                {/* Form content */}
                <div className="relative">
                  {showForgotPassword ? (
                    <ForgotPasswordForm 
                      onBackToLogin={() => {
                        setShowForgotPassword(false);
                        setIsLogin(true);
                      }} 
                    />
                  ) : isLogin ? (
                    <LoginForm 
                      onSwitchToRegister={() => setIsLogin(false)}
                      onForgotPassword={() => setShowForgotPassword(true)}
                    />
                  ) : (
                    <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
