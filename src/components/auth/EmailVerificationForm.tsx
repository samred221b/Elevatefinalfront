import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Mail, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

interface EmailVerificationFormProps {
  email: string
  name: string
  onVerificationSuccess: (userData: any) => void
  onBackToLogin: () => void
}

export function EmailVerificationForm({ 
  email, 
  name: _name, 
  onVerificationSuccess, 
  onBackToLogin 
}: EmailVerificationFormProps) {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutes in seconds
  const [isVerified, setIsVerified] = useState(false)
  const { showSuccess, showError } = useToast()

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (code.length !== 6) {
      showError('Please enter a 6-digit verification code')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIsVerified(true)
        showSuccess('Email verified successfully! Welcome to Elevate!')
        onVerificationSuccess(data.data)
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          onBackToLogin()
        }, 2000)
      } else {
        showError(data.message || 'Verification failed')
      }
    } catch (error) {
      console.error('Verification error:', error)
      showError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        showSuccess('Verification code sent! Please check your email.')
        setTimeLeft(900) // Reset timer
        setCode('') // Clear current code
      } else {
        showError(data.message || 'Failed to resend code')
      }
    } catch (error) {
      console.error('Resend error:', error)
      showError('Network error. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setCode(value)
  }

  // Success state after verification
  if (isVerified) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Email Verified!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Welcome to Elevate! Your account is now fully activated.
          </p>

          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              Redirecting you to the login page...
            </p>
          </div>

          <Button
            onClick={onBackToLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            Continue to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Verify Your Email
        </h2>
        
        <p className="text-gray-600 text-sm mb-1">
          We've sent a 6-digit code to
        </p>
        <p className="font-medium text-blue-600">{email}</p>
      </div>

      {/* Verification Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <Input
              id="code"
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="Enter 6-digit code"
              className="text-center text-xl font-mono tracking-widest h-12 rounded-lg"
              maxLength={6}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
            disabled={isLoading || code.length !== 6}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Verify Email
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Timer */}
      <div className="text-center mb-4">
        {timeLeft > 0 ? (
          <p className="text-sm text-gray-600">
            Code expires in <span className="font-mono font-medium text-red-600">
              {formatTime(timeLeft)}
            </span>
          </p>
        ) : (
          <p className="text-sm text-red-600 font-medium">
            Verification code has expired
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleResendCode}
          disabled={isResending}
          className="w-full"
        >
          {isResending ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Mail className="w-4 h-4 mr-2" />
              Resend Code
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={onBackToLogin}
          className="w-full text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>
      </div>

      {/* Help */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-600 mb-2 font-medium">Need help?</p>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>• Check your spam folder</li>
          <li>• Code is valid for 15 minutes</li>
          <li>• Contact support if needed</li>
        </ul>
      </div>
    </div>
  )
}
