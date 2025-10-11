import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, just show success message
      // In a real app, you would call your password reset API here
      console.log('Password reset requested for:', email);
      setIsEmailSent(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          We've sent a password reset link to <strong>{email}</strong>. 
          Please check your email and follow the instructions to reset your password.
        </p>

        {/* Back to Login Button */}
        <Button
          onClick={onBackToLogin}
          variant="outline"
          className="w-full py-3 rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sign In
        </Button>

        {/* Resend Link */}
        <div className="mt-4">
          <button
            onClick={() => {
              setIsEmailSent(false);
              setEmail('');
            }}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
          >
            Didn't receive the email? Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
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
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
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
              <span>Sending Reset Link...</span>
            </div>
          ) : (
            'Send Reset Link'
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
