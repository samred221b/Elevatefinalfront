import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onRegistrationSuccess?: (data: any) => void;
}

export function RegisterForm({ onSwitchToLogin, onRegistrationSuccess }: RegisterFormProps) {
  const { registerUser, isAuthLoading, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const errors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    
    if (!name.trim()) {
      errors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
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
    
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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

    const result = await registerUser(name.trim(), email, password);
    if (result && result.requiresVerification) {
      // Call the parent handler to show email verification
      onRegistrationSuccess?.(result);
      console.log('✅ Registration successful, verification required!');
    }
  };

  const handleInputChange = (field: 'name' | 'email' | 'password' | 'confirmPassword', value: string) => {
    switch (field) {
      case 'name':
        setName(value);
        if (validationErrors.name) {
          setValidationErrors(prev => ({ ...prev, name: undefined }));
        }
        break;
      case 'email':
        setEmail(value);
        if (validationErrors.email) {
          setValidationErrors(prev => ({ ...prev, email: undefined }));
        }
        break;
      case 'password':
        setPassword(value);
        if (validationErrors.password) {
          setValidationErrors(prev => ({ ...prev, password: undefined }));
        }
        // Also clear confirm password error if passwords now match
        if (confirmPassword && value === confirmPassword && validationErrors.confirmPassword) {
          setValidationErrors(prev => ({ ...prev, confirmPassword: undefined }));
        }
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        if (validationErrors.confirmPassword) {
          setValidationErrors(prev => ({ ...prev, confirmPassword: undefined }));
        }
        break;
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
          Create Your Account
        </h2>
        <p className="text-gray-600 text-sm">
          Join thousands building better habits
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-400/20 rounded-2xl backdrop-blur-sm">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-3">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Full Name
          </Label>
          <div className="relative">
            <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
              name ? 'text-blue-500' : 'text-gray-400'
            }`} />
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              className={`
                pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl
                text-gray-900 placeholder-gray-500
                focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                hover:bg-white hover:border-gray-300
                transition-all duration-200
                ${validationErrors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}
              `}
              disabled={isAuthLoading}
            />
          </div>
          {validationErrors.name && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.name}
            </p>
          )}
        </div>

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
              placeholder="Create a password"
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

        {/* Confirm Password Field */}
        <div className="space-y-3">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
              confirmPassword ? 'text-blue-500' : 'text-gray-400'
            }`} />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirm your password"
              className={`
                pl-12 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-2xl
                text-gray-900 placeholder-gray-500
                focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                hover:bg-white hover:border-gray-300
                transition-all duration-200
                ${validationErrors.confirmPassword ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}
              `}
              disabled={isAuthLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              disabled={isAuthLoading}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {validationErrors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.confirmPassword}
            </p>
          )}
        </div>

        {/* Sign Up Button */}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold py-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50"
          disabled={isAuthLoading}
        >
          {isAuthLoading ? (
            <div className="flex items-center justify-center gap-4">
              {/* Advanced Habit Journey Starting Animation */}
              <div className="relative">
                {/* Outer journey ring */}
                <div className="w-7 h-7 border-2 border-white/25 rounded-full"></div>
                {/* Animated progress ring */}
                <div className="absolute inset-0 w-7 h-7 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
                {/* Inner goal dot */}
                <div className="absolute inset-2 flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                </div>
                {/* Journey milestone indicators */}
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-200"></div>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-semibold">Starting your journey...</span>
                <div className="flex gap-0.5 mt-1">
                  <div className="w-1 h-1 bg-white/70 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-white/70 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1 h-1 bg-white/70 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          ) : (
            'Sign Up'
          )}
        </Button>
      </form>

      {/* Footer Text */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 text-sm">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            disabled={isAuthLoading}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
