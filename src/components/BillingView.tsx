import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card'
import { Button } from './ui/button'
import { 
  CreditCard, 
  Calendar, 
  Download, 
  CheckCircle, 
  XCircle, 
  Crown, 
  Zap,
  Star,
  Clock,
  Receipt,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react'

export function BillingView() {
  const [currentPlan] = useState('pro') // 'free', 'pro', 'premium'
  const [billingCycle] = useState('monthly') // 'monthly', 'yearly'
  const [nextBillingDate] = useState('2024-11-12')
  const [showPaymentDetails, setShowPaymentDetails] = useState<{[key: number]: boolean}>({})

  const togglePaymentVisibility = (methodId: number) => {
    setShowPaymentDetails(prev => ({
      ...prev,
      [methodId]: !prev[methodId]
    }))
  }
  const [paymentMethods] = useState([
    {
      id: 1,
      type: 'visa',
      last4: '4242',
      expiry: '12/26',
      primary: true
    },
    {
      id: 2,
      type: 'telebirr',
      phone: '0904577804',
      primary: false
    },
    {
      id: 3,
      type: 'cbe',
      accountNumber: '1000404046105',
      primary: false
    }
  ])

  const plans = [
    {
      id: 'pro',
      name: 'Pro',
      price: 4.99,
      priceEth: 720,
      yearlyPrice: 49.99,
      yearlyPriceEth: 7200,
      description: 'Perfect for getting started with habit tracking',
      features: [
        'Up to 10 habits',
        'Basic analytics',
        'Mobile app access',
        'Community support',
        'Daily reminders',
        'Progress tracking',
        'Basic templates'
      ],
      limitations: [
        'Limited habit templates',
        'Basic reminders only',
        'No advanced analytics',
        'No data export'
      ],
      color: 'blue',
      icon: Star,
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 9.99,
      priceEth: 1440,
      yearlyPrice: 99.99,
      yearlyPriceEth: 14400,
      description: 'For serious habit builders who want more features',
      features: [
        'Unlimited habits',
        'Advanced analytics & insights',
        'Custom habit templates',
        'Smart reminders',
        'Goal tracking',
        'Data export',
        'Priority support',
        'Habit streaks tracking',
        'Calendar integration',
        'Progress reports',
        'Multiple categories'
      ],
      limitations: [],
      color: 'green',
      icon: Zap,
      comingSoon: true
    },
    {
      id: 'premium-pro',
      name: 'Premium Pro',
      price: 19.99,
      priceEth: 2880,
      yearlyPrice: 199.99,
      yearlyPriceEth: 28800,
      description: 'Everything you need for complete habit mastery',
      features: [
        'Everything in Premium',
        'AI-powered insights',
        'Habit coaching & recommendations',
        'Team collaboration',
        'Advanced integrations',
        'White-label options',
        'Dedicated support',
        'Custom branding',
        'API access',
        'Advanced reporting',
        'Habit psychology insights',
        'Personal habit consultant',
        'Unlimited data storage'
      ],
      limitations: [],
      color: 'purple',
      icon: Crown,
      comingSoon: true
    }
  ]

  const recentInvoices = [
    {
      id: 'inv_001',
      date: '2024-10-12',
      amount: 720,
      currency: 'ETB',
      status: 'paid',
      plan: 'Pro Monthly'
    },
    {
      id: 'inv_002',
      date: '2024-09-12',
      amount: 720,
      currency: 'ETB',
      status: 'paid',
      plan: 'Pro Monthly'
    },
    {
      id: 'inv_003',
      date: '2024-08-12',
      amount: 720,
      currency: 'ETB',
      status: 'paid',
      plan: 'Pro Monthly'
    }
  ]

  const handleUpgrade = (planId: string) => {
    alert(`Redirecting to upgrade to ${planId} plan...`)
  }


  const handleUpdatePayment = () => {
    alert('Redirecting to payment method update...')
  }

  const handleDownloadInvoice = (invoiceId: string) => {
    alert(`Downloading invoice ${invoiceId}...`)
  }

  const handleCancelSubscription = () => {
    if (confirm('Are you sure you want to cancel your subscription? You will lose access to Pro features at the end of your billing period.')) {
      alert('Subscription cancellation initiated...')
    }
  }

  const currentPlanData = plans.find(plan => plan.id === currentPlan)
  const isYearly = billingCycle === 'yearly'

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-green-500/10 rounded-2xl">
            <CreditCard className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Billing & Subscriptions
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your subscription and billing information
            </p>
          </div>
        </div>
      </div>

      {/* Current Plan Status */}
      <Card className="border-green-500/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              {currentPlanData?.icon && <currentPlanData.icon className="w-5 h-5" />}
              Current Plan: {currentPlanData?.name}
            </div>
            {currentPlan !== 'free' && (
              <span className="px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm font-medium">
                Active
              </span>
            )}
          </CardTitle>
          <CardDescription>{currentPlanData?.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Monthly Cost</p>
                  <p className="text-lg font-bold text-green-600">
                    {currentPlan === 'pro' ? '$4.99/mo or 720 birr/mo' : currentPlan === 'premium' ? '$9.99/mo or 1440 birr/mo' : '$19.99/mo or 2880 birr/mo'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Next Billing</p>
                  <p className="text-sm text-blue-600">
                    {new Date(nextBillingDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Billing Cycle</p>
                  <p className="text-sm text-purple-600 capitalize">{billingCycle}</p>
                </div>
              </div>
            </div>
          </div>

          {currentPlan !== 'free' && (
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleUpdatePayment}>
                <CreditCard className="w-4 h-4 mr-2" />
                Update Payment Method
              </Button>
              <Button variant="outline" onClick={handleCancelSubscription} className="text-red-600 border-red-200 hover:bg-red-50">
                <XCircle className="w-4 h-4 mr-2" />
                Cancel Subscription
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-600" />
            Available Plans
          </CardTitle>
          <CardDescription>Choose the plan that best fits your habit-building needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon
              const isCurrent = plan.id === currentPlan
              const monthlyPrice = isYearly ? plan.yearlyPrice / 12 : plan.price

              return (
                <div
                  key={plan.id}
                  className={`relative p-6 rounded-xl border-2 transition-all duration-200 h-full flex flex-col ${
                    isCurrent
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : plan.popular
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">Most Popular</span>
                    </div>
                  )}
                  
                  <div className="text-center space-y-4 flex flex-col h-full">
                    <div className="flex items-center justify-center">
                      <Icon className={`w-8 h-8 text-${plan.color}-600`} />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{plan.description}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${monthlyPrice.toFixed(2)}/mo
                      </div>
                      <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {plan.priceEth} birr/mo
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        per month {isYearly && '(billed yearly)'}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-left flex-grow">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-500 dark:text-gray-500">{limitation}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4 mt-auto">
                      {isCurrent ? (
                        <Button disabled className="w-full">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Current Plan
                        </Button>
                      ) : plan.comingSoon ? (
                        <Button disabled variant="outline" className="w-full">
                          <Clock className="w-4 h-4 mr-2" />
                          Coming Soon
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleUpgrade(plan.id)} 
                          className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                        >
                          {currentPlan === 'pro' ? 'Upgrade' : 'Switch'} to {plan.name}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      {currentPlan !== 'free' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Payment Methods
            </CardTitle>
            <CardDescription>Your available payment methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className={`flex items-center justify-between p-4 border rounded-lg ${
                  method.primary 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}>
                  <div className="flex items-center gap-3">
                    {method.type === 'visa' && (
                      <>
                        <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">VISA</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            •••• •••• •••• {method.last4}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Expires {method.expiry}
                          </p>
                        </div>
                      </>
                    )}
                    {method.type === 'telebirr' && (
                      <>
                        <div className="w-12 h-8 bg-orange-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">TB</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            Telebirr {showPaymentDetails[method.id] ? method.phone : '•••••••••'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Mobile payment
                          </p>
                        </div>
                        <button
                          onClick={() => togglePaymentVisibility(method.id)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        >
                          {showPaymentDetails[method.id] ? (
                            <EyeOff className="w-4 h-4 text-gray-500" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                      </>
                    )}
                    {method.type === 'cbe' && (
                      <>
                        <div className="w-12 h-8 bg-green-700 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">CBE</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            CBE Bank {showPaymentDetails[method.id] ? method.accountNumber : '•••••••••••••'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Bank account
                          </p>
                        </div>
                        <button
                          onClick={() => togglePaymentVisibility(method.id)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        >
                          {showPaymentDetails[method.id] ? (
                            <EyeOff className="w-4 h-4 text-gray-500" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {method.primary && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 border border-green-200 rounded text-xs font-medium">
                        Primary
                      </span>
                    )}
                    <Button variant="outline" size="sm" onClick={handleUpdatePayment}>
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" onClick={handleUpdatePayment} className="w-full">
                <CreditCard className="w-4 h-4 mr-2" />
                Add New Payment Method
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-gray-600" />
            Billing History
          </CardTitle>
          <CardDescription>Your recent invoices and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Receipt className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{invoice.plan}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(invoice.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">{invoice.amount} {invoice.currency}</p>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-600 capitalize">{invoice.status}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(invoice.id)}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {recentInvoices.length === 0 && (
            <div className="text-center py-8">
              <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No billing history available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Support */}
      <Card className="border-blue-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <AlertCircle className="w-5 h-5" />
            Need Help with Billing?
          </CardTitle>
          <CardDescription>Our support team is here to help with any billing questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto p-4 justify-start" onClick={() => window.open('mailto:samred221b@gmail.com', '_blank')}>
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-left">
                  <div className="font-semibold">Billing Support</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">samred221b@gmail.com</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto" />
            </Button>

            <Button variant="outline" className="h-auto p-4 justify-start" onClick={() => window.open('https://elevatehabits.com/billing-faq', '_blank')}>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="text-left">
                  <div className="font-semibold">Billing FAQ</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Common billing questions</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
