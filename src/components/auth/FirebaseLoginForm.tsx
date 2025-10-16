import { useState } from 'react'
import { useAuth } from '@/context/FirebaseAuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'

interface LoginFormProps {
  onSwitchToRegister: () => void
  onSwitchToForgotPassword: () => void
}

export function FirebaseLoginForm({ onSwitchToRegister, onSwitchToForgotPassword }: LoginFormProps) {
  const { login, loginLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      console.log('🔐 Form: Starting login attempt')
      await login(formData.email, formData.password)
      console.log('✅ Form: Login successful')
    } catch (error) {
      console.error('❌ Form: Login error caught:', error)
      setError(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setIsSubmitting(false)
      console.log('🔄 Form: Submit completed, isSubmitting set to false')
    }
  }

  // Use local loading state OR global loading state
  const isLoading = isSubmitting || loginLoading

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  return (
    <div className="relative">
      {/* Decorative Elements */}
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-violet-400/20 to-purple-500/20 rounded-full blur-sm"></div>
      <div className="absolute -top-2 -right-6 w-6 h-6 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full blur-sm"></div>
      <div className="absolute -bottom-6 -left-2 w-10 h-10 bg-gradient-to-br from-pink-400/20 to-fuchsia-500/20 rounded-full blur-sm"></div>
      
      <Card className="relative w-full min-h-[600px] border-0 shadow-2xl bg-gradient-to-br from-white/95 via-white/90 to-blue-50/95 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-slate-900/95 backdrop-blur-xl border border-white/60 dark:border-gray-700/60 overflow-hidden">
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-blue-500/5 opacity-50"></div>
        
        <CardHeader className="relative text-center pb-6 lg:pb-4">
          {/* Mobile Header */}
          <div className="lg:hidden">
            <CardTitle className="text-4xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Elevate
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Transform your habits, elevate your life
            </p>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Continue your transformation journey
            </p>
          </div>
          
          {/* Desktop Header */}
          <div className="hidden lg:block">
            <CardTitle className="text-2xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Welcome Back
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Ready to continue building better habits?
            </p>
          </div>
        </CardHeader>
      
      <CardContent className="relative z-10 px-8 py-6">
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Error Message - Fixed height to prevent layout shift */}
          <div className="min-h-[52px]">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
              </div>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-white to-blue-50/30 dark:from-gray-800 dark:to-slate-800/50 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-400 transition-all duration-300 shadow-sm hover:shadow-md relative z-10"
              required
              autoComplete="email"
              tabIndex={0}
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-white to-purple-50/30 dark:from-gray-800 dark:to-slate-800/50 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-400 transition-all duration-300 shadow-sm hover:shadow-md"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors p-1 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('Forgot password clicked')
                onSwitchToForgotPassword()
              }}
              className="text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors underline hover:no-underline font-medium px-2 py-1 rounded hover:bg-violet-50 dark:hover:bg-violet-900/20 cursor-pointer z-10 relative"
            >
              Forgot your password?
            </button>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing In...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </div>
            )}
          </Button>

          {/* Switch to Register */}
          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('Create account clicked')
                  onSwitchToRegister()
                }}
                className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-semibold transition-colors underline hover:no-underline px-2 py-1 rounded hover:bg-violet-50 dark:hover:bg-violet-900/20 cursor-pointer z-10 relative"
              >
                Create Account
              </button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
    </div>
  )
}
