import { useState, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onForgotPassword?: () => void;
  onVerificationRequired?: (email: string) => void;
}

export function LoginForm({ onSwitchToRegister, onForgotPassword, onVerificationRequired }: LoginFormProps) {
  const { authenticateUser, isAuthLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});
  const [loginError, setLoginError] = useState<string>(() => {
    // Initialize from localStorage to survive re-renders
    try {
      return localStorage.getItem('loginError') || '';
    } catch {
      return '';
    }
  });
  const mountedRef = useRef(true);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Protected error setter with persistence
  const setProtectedLoginError = useCallback((error: string) => {
    if (!mountedRef.current) return;
    
    // Clear any existing timeout
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    
    setLoginError(error);
    
    // Save to localStorage for persistence across re-renders
    try {
      localStorage.setItem('loginError', error);
    } catch (e) {
      console.error('Failed to save login error to localStorage:', e);
    }
    
    // Reinforce the error to prevent clearing
    setTimeout(() => {
      setLoginError(error);
      try {
        localStorage.setItem('loginError', error);
      } catch (e) {}
    }, 100);
    
    // Protect from clearing for a reasonable time
    if (error) {
      errorTimeoutRef.current = setTimeout(() => {
        // Protection expired
      }, 5000);
    }
  }, []);

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      console.log('🔐 Starting login attempt for:', email);
      console.log('🔐 Password length:', password.length);
      setProtectedLoginError(''); // Only clear our isolated error
      
      const success = await authenticateUser(email, password);
      console.log('🔍 Login result:', success);
      
      if (success) {
        // Success will be handled by the auth context and parent component
        console.log('✅ Login successful, redirecting...');
        setProtectedLoginError(''); // Clear error on success
      } else {
        // If login fails, set isolated error
        console.log('❌ Login failed - setting protected error message');
        setProtectedLoginError('Login failed. Please check your email and password.');
      }
    } catch (error: any) {
      console.log('❌ Login exception caught:', error);
      console.log('❌ Error details:', {
        message: error.message,
        requiresVerification: error.requiresVerification,
        email: error.email
      });
      
      if (error.requiresVerification) {
        // Handle email verification requirement
        console.log('🔐 Account requires email verification');
        const verificationError = 'Please verify your email before logging in. Check your inbox for a verification code.';
        setProtectedLoginError(verificationError);
        console.log('🔐 Verification error set:', verificationError);
        // Add delay before calling verification handler
        setTimeout(() => {
          onVerificationRequired?.(error.email || email);
        }, 100);
      } else {
        // Set isolated error for other exceptions
        const errorMsg = error.message || 'Login failed. Please try again.';
        console.log('🔐 Setting protected general error:', errorMsg);
        setProtectedLoginError(errorMsg);
      }
    }
  };

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    if (field === 'email') {
      setEmail(value);
      if (validationErrors.email) {
        setValidationErrors(prev => ({ ...prev, email: undefined }));
      }
    } else {
      setPassword(value);
      if (validationErrors.password) {
        setValidationErrors(prev => ({ ...prev, password: undefined }));
      }
    }
    
    // Don't clear login errors when typing - let them persist until next login attempt
    // Only validation errors are cleared, not login errors
  };

  return (
    <div className="w-full">
      {/* Modern Welcoming Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
          Ready to continue building amazing habits? Let's get you signed in.
        </p>
      </div>

      {/* Modern Error Message */}
      {loginError && (
        <div className="mb-8 p-5 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-2xl animate-in slide-in-from-top-4 fade-in-0 duration-500 shadow-lg shadow-red-500/10">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-sm"></div>
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">{loginError}</p>
          </div>
          
          {/* Email verification helper */}
          {loginError.includes('verify') && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 mb-2">
                <strong>Need to verify your email?</strong>
              </p>
              <Button
                onClick={() => {
                  console.log('🔐 Triggering email verification for:', email);
                  onVerificationRequired?.(email);
                }}
                variant="outline"
                size="sm"
                className="text-xs bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
              >
                Verify Email Now
              </Button>
            </div>
          )}
          
        </div>
      )}

      {/* Modern Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Modern Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-gray-800 tracking-wide">
            Email Address
          </Label>
          <div className="relative group">
            <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
              email ? 'text-blue-500 scale-110' : 'text-gray-400 group-focus-within:text-blue-500 group-focus-within:scale-110'
            }`} />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="you@example.com"
              className={`
                pl-14 pr-5 py-5 bg-white border-2 border-gray-200 rounded-2xl text-base
                text-gray-900 placeholder-gray-400
                focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                hover:border-gray-300 hover:shadow-sm
                transition-all duration-300 transform focus:scale-[1.02]
                shadow-sm backdrop-blur-sm
                ${validationErrors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400/10' : ''}
              `}
              disabled={isAuthLoading}
            />
          </div>
          {validationErrors.email && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-2 animate-in slide-in-from-left-2 fade-in-0 duration-300">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {validationErrors.email}
            </p>
          )}
        </div>

        {/* Modern Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-semibold text-gray-800 tracking-wide">
            Password
          </Label>
          <div className="relative group">
            <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
              password ? 'text-blue-500 scale-110' : 'text-gray-400 group-focus-within:text-blue-500 group-focus-within:scale-110'
            }`} />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="••••••••"
              className={`
                pl-14 pr-16 py-5 bg-white border-2 border-gray-200 rounded-2xl text-base
                text-gray-900 placeholder-gray-400
                focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                hover:border-gray-300 hover:shadow-sm
                transition-all duration-300 transform focus:scale-[1.02]
                shadow-sm backdrop-blur-sm
                ${validationErrors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-400/10' : ''}
              `}
              disabled={isAuthLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-all duration-200 hover:scale-110"
              disabled={isAuthLoading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {validationErrors.password && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-2 animate-in slide-in-from-left-2 fade-in-0 duration-300">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {validationErrors.password}
            </p>
          )}
        </div>

        {/* Modern Forgot Password Link */}
        {onForgotPassword && (
          <div className="text-right">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 hover:underline hover:scale-105 inline-flex items-center gap-1"
              onClick={onForgotPassword}
              disabled={isAuthLoading}
            >
              Forgot Password?
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Modern Sign In Button */}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 hover:from-blue-700 hover:via-violet-700 hover:to-purple-700 text-white font-bold py-6 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 text-lg tracking-wide"
          disabled={isAuthLoading}
        >
          {isAuthLoading ? (
            <div className="flex items-center justify-center gap-4">
              {/* Advanced Habit Tracking Loading Animation */}
              <div className="relative">
                {/* Outer ring - represents habit completion */}
                <div className="w-8 h-8 border-2 border-white/20 rounded-full"></div>
                {/* Animated progress ring */}
                <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
                {/* Inner habit dots */}
                <div className="absolute inset-2 flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                </div>
                {/* Habit streak indicators */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-300"></div>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-semibold">Building your habits...</span>
                <div className="flex gap-1 mt-1">
                  <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>Sign In</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          )}
        </Button>
      </form>

      {/* Modern Footer Text */}
      <div className="mt-10 text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">New to Elevate?</span>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={onSwitchToRegister}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-all duration-200 hover:scale-105 bg-blue-50 hover:bg-blue-100 px-6 py-3 rounded-xl"
            disabled={isAuthLoading}
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
