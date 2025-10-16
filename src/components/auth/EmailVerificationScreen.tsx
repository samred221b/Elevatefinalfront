import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ArrowLeft, CheckCircle } from 'lucide-react'

interface EmailVerificationScreenProps {
  email: string
  onBackToLogin: () => void
}

export function EmailVerificationScreen({ email, onBackToLogin }: EmailVerificationScreenProps) {
  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          Check Your Email
        </CardTitle>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          We've sent email verification instructions to
        </p>
        <p className="text-violet-600 dark:text-violet-400 font-semibold">
          {email}
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Next steps:</strong>
            </p>
            <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
              <li>• Check your email inbox</li>
              <li>• Click the verify link in the email</li>
              <li>• Sign in with your email and password</li>
            </ul>
          </div>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Didn't receive the email? Check your spam folder.
          </div>

          <Button
            onClick={onBackToLogin}
            variant="outline"
            className="w-full py-3 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
