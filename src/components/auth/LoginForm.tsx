import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onForgotPassword?: () => void;
}

export function LoginForm({ onSwitchToRegister, onForgotPassword }: LoginFormProps) {
  const { authenticateUser, isAuthLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

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
    clearError();
    
    if (!validateForm()) {
      return;
    }

    const success = await authenticateUser(email, password);
    if (success) {
      // Success will be handled by the auth context and parent component
      console.log('Login successful, redirecting...');
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
    
    if (error) {
      clearError();
    }
  };

  return (
    <div className="w-full">
      {/* Welcoming Header */}
      <div className="text-center mb-8 pt-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Welcome Back
        </h2>
        <p className="text-gray-600 text-sm">
          Sign in to continue your journey
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-in slide-in-from-top-2 fade-in-0 duration-300">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-3">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <div className="relative">
            <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
              email ? 'text-blue-500' : 'text-gray-400'
            }`} />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              className={`
                pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl
                text-gray-900 placeholder-gray-500
                focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                hover:bg-white hover:border-gray-300
                transition-all duration-200
                ${validationErrors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}
              `}
              disabled={isAuthLoading}
            />
          </div>
          {validationErrors.email && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-3">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </Label>
          <div className="relative">
            <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
              password ? 'text-blue-500' : 'text-gray-400'
            }`} />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Enter your password"
              className={`
                pl-12 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-2xl
                text-gray-900 placeholder-gray-500
                focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                hover:bg-white hover:border-gray-300
                transition-all duration-200
                ${validationErrors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}
              `}
              disabled={isAuthLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              disabled={isAuthLoading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {validationErrors.password && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.password}
            </p>
          )}
        </div>

        {/* Forgot Password Link */}
        {onForgotPassword && (
          <div className="text-right">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
              onClick={onForgotPassword}
              disabled={isAuthLoading}
            >
              Forgot Password?
            </button>
          </div>
        )}

        {/* Sign In Button */}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold py-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50"
          disabled={isAuthLoading}
        >
          {isAuthLoading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Signing in...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      {/* Footer Text */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 text-sm">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            disabled={isAuthLoading}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
