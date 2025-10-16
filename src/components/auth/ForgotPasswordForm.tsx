import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ArrowLeft, Mail, CheckCircle, Key, Eye, EyeOff, Shield } from 'lucide-react';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [error, setError] = useState('');
  
  // Code verification state
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('🔐 Requesting password reset for:', email);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();

      // If we reach here without error and backend sent 6 digits, proceed to code entry
      console.log('✅ Password reset code sent, proceeding to verification step');
      setIsEmailSent(true);
    } catch (err: any) {
      console.error('❌ Password reset error:', err);
      setError(err.message || 'Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    setIsLoading(true);

    try {
      console.log('🔐 Verifying code and resetting password');
      console.log('📤 Sending data:', { email, code: verificationCode, newPassword: '***' });
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          code: verificationCode, 
          newPassword 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📡 Password reset response:', data);

      if (data.success || response.status === 200) {
        console.log('✅ Password reset successful - Backend confirmed password updated');
        setIsCodeVerified(true);
      } else {
        console.log('❌ Password reset failed:', data);
        setError(data.message || 'Invalid code or failed to reset password. Please try again.');
      }
    } catch (err: any) {
      console.error('❌ Password reset verification error:', err);
      setError(err.message || 'Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Final success state - password has been reset
  if (isCodeVerified) {
    return (
      <div className="text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        {/* Success Icon with animation */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in-0 duration-700 delay-200">
          <CheckCircle className="w-8 h-8 text-green-600 animate-in zoom-in-0 duration-500 delay-500" />
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 animate-in slide-in-from-bottom-2 fade-in-0 duration-500 delay-300">
          Password Reset Successful
        </h2>
        <p className="text-gray-600 mb-6 leading-relaxed animate-in slide-in-from-bottom-2 fade-in-0 duration-500 delay-400">
          Your password has been successfully reset. You can now sign in with your new password.
        </p>
        
        {/* Additional confirmation */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
          <p className="text-sm text-blue-700">
            <strong>Next step:</strong> Use your email ({email}) and the new password you just created to sign in.
          </p>
        </div>


        {/* Back to Login Button */}
        <Button
          onClick={onBackToLogin}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sign In
        </Button>
      </div>
    );
  }

  // Code verification form - after email is sent
  if (isEmailSent) {
    return (
      <div className="transition-opacity duration-300">
        {/* Back Button */}
        <button
          onClick={() => {
            setIsEmailSent(false);
            setError('');
          }}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Email Entry
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Enter Verification Code</h2>
          <p className="text-gray-600 leading-relaxed">
            We've sent a 6-digit code to <strong>{email}</strong>. 
            Enter the code and your new password below.
          </p>
          
        </div>

        {/* Form */}
        <form onSubmit={handleCodeVerification} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Verification Code Input */}
          <div className="space-y-2">
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              6-Digit Verification Code
            </label>
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                className="pl-12 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors duration-200 text-center text-lg tracking-widest"
                maxLength={6}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* New Password Input */}
          <div className="space-y-2">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="pl-12 pr-12 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors duration-200"
                required
                disabled={isLoading}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="pl-12 pr-12 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors duration-200"
                required
                disabled={isLoading}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold py-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50"
            disabled={isLoading || !verificationCode || verificationCode.length !== 6 || !newPassword || !confirmPassword}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Resetting Password...</span>
              </div>
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>

        {/* Resend Code */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Didn't receive the code?{' '}
            <button
              onClick={() => {
                setIsEmailSent(false);
                setVerificationCode('');
                setNewPassword('');
                setConfirmPassword('');
                setError('');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              disabled={isLoading}
            >
              Send new code
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="transition-opacity duration-300">
      {/* Back Button */}
      <button
        onClick={onBackToLogin}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors duration-200"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Sign In
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Reset Password</h2>
        <p className="text-gray-600 leading-relaxed">
          Enter your email address and we'll send you a 6-digit code to reset your password.
        </p>
        
      </div>

      {/* Form */}
      <form onSubmit={handleEmailSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Email Input */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="pl-12 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors duration-200"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold py-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50"
          disabled={isLoading || !email.trim()}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Sending Reset Code...</span>
            </div>
          ) : (
            'Send Reset Code'
          )}
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 text-sm">
          Remember your password?{' '}
          <button
            onClick={onBackToLogin}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            disabled={isLoading}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
