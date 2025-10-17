import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ArrowLeft, CheckCircle, Mail, Sparkles, Clock } from 'lucide-react'

interface EmailVerificationScreenProps {
  email: string
  onBackToLogin: () => void
}

export function EmailVerificationScreen({ email, onBackToLogin }: EmailVerificationScreenProps) {
  return (
    <div className="w-full max-w-md mx-auto relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -m-8">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-500/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-400/20 to-cyan-500/30 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-purple-400/15 to-pink-500/25 rounded-full blur-md animate-ping"></div>
      </div>

      <Card className="relative border-0 shadow-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-white/20 dark:border-gray-700/30 overflow-hidden">
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 rounded-lg blur-sm"></div>
        <div className="absolute inset-[1px] bg-white/95 dark:bg-gray-900/95 rounded-lg"></div>
        
        <div className="relative z-10">
          <CardHeader className="text-center pb-6 pt-8">
            {/* Enhanced Icon with Animation */}
            <div className="mx-auto relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
              Check Your Email
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
              We've sent verification instructions to
            </p>
            <div className="mt-2 p-3 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg border border-violet-200 dark:border-violet-700/30">
              <p className="text-violet-700 dark:text-violet-300 font-semibold text-lg">
                {email}
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="pb-8">
            <div className="space-y-6">
              {/* Enhanced Steps Section */}
              <div className="relative p-5 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/30 overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <p className="font-semibold text-blue-800 dark:text-blue-200">
                      Next Steps
                    </p>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span>Check your email inbox</span>
                    </li>
                    <li className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <span>Click the verification link</span>
                    </li>
                    <li className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      <span>Return here to sign in</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Enhanced Info Section */}
              <div className="relative p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200/50 dark:border-amber-700/30">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Didn't receive it? Check your spam folder or wait a few minutes.
                  </span>
                </div>
              </div>

              {/* Enhanced Button */}
              <Button
                onClick={onBackToLogin}
                className="w-full py-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 dark:from-gray-700 dark:to-gray-800 dark:hover:from-gray-600 dark:hover:to-gray-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}
