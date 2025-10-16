import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card'
import { Button } from './ui/button'
import { HelpCircle, Mail, MessageCircle, Book, ExternalLink, Phone, Clock, Users, ChevronRight } from 'lucide-react'
import { useNavigation } from '../context/NavigationContext'

export function HelpView() {
  const { setCurrentView } = useNavigation()

  const handleContactSupport = () => {
    window.open('mailto:samred221b@gmail.com?subject=Support Request - Elevate Habit Tracker', '_blank')
  }

  const handleOpenFAQ = () => {
    setCurrentView('faq')
  }

  const handleOpenDocs = () => {
    window.open('https://elevatehabits.com/docs', '_blank')
  }

  const handleLiveChat = () => {
    // This would integrate with your chat system
    alert('Live chat feature coming soon! Please use email support for now.')
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-blue-500/10 rounded-2xl">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Help & Support
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              We're here to help you succeed with your habits
            </p>
          </div>
        </div>
      </div>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* FAQ Card */}
        <Card className="border-blue-500/50 hover:shadow-lg transition-all duration-200 cursor-pointer group" onClick={handleOpenFAQ}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
              <Book className="w-5 h-5" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>Find answers to common questions about using Elevate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">• How to create effective habits</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">• Managing habit streaks</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">• Understanding analytics</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">• Account management</p>
            </div>
            <Button variant="outline" className="w-full mt-4 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
              <ChevronRight className="w-4 h-4 mr-2" />
              View FAQ
            </Button>
          </CardContent>
        </Card>

        {/* Contact Support Card */}
        <Card className="border-green-500/50 hover:shadow-lg transition-all duration-200 cursor-pointer group" onClick={handleContactSupport}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300">
              <Mail className="w-5 h-5" />
              Email Support
            </CardTitle>
            <CardDescription>Get personalized help from our support team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Response within 24 hours</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span>Dedicated support team</span>
              </div>
            </div>
            <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
          </CardContent>
        </Card>

        {/* Live Chat Card */}
        <Card className="border-purple-500/50 hover:shadow-lg transition-all duration-200 cursor-pointer group" onClick={handleLiveChat}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300">
              <MessageCircle className="w-5 h-5" />
              Live Chat
            </CardTitle>
            <CardDescription>Chat with our support team in real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Available 9 AM - 6 PM EST</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <MessageCircle className="w-4 h-4" />
                <span>Instant responses</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4 border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20">
              <MessageCircle className="w-4 h-4 mr-2" />
              Start Chat
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Documentation & Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="w-5 h-5 text-indigo-600" />
            Documentation & Resources
          </CardTitle>
          <CardDescription>Comprehensive guides and tutorials to help you get the most out of Elevate</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto p-4 justify-start" onClick={handleOpenDocs}>
              <div className="flex items-start gap-3">
                <Book className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div className="text-left">
                  <div className="font-semibold">User Guide</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Complete guide to using Elevate</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto" />
            </Button>

            <Button variant="outline" className="h-auto p-4 justify-start" onClick={() => window.open('https://elevatehabits.com/tutorials', '_blank')}>
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="text-left">
                  <div className="font-semibold">Video Tutorials</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Step-by-step video guides</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto" />
            </Button>

            <Button variant="outline" className="h-auto p-4 justify-start" onClick={() => window.open('https://elevatehabits.com/tips', '_blank')}>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                <div className="text-left">
                  <div className="font-semibold">Habit Building Tips</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Expert advice for success</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto" />
            </Button>

            <Button variant="outline" className="h-auto p-4 justify-start" onClick={() => window.open('https://elevatehabits.com/community', '_blank')}>
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="text-left">
                  <div className="font-semibold">Community Forum</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Connect with other users</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-gray-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Phone className="w-5 h-5" />
            Contact Information
          </CardTitle>
          <CardDescription>Other ways to reach our support team</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Email Support</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">samred221b@gmail.com</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Response within 24 hours</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Business Hours</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monday - Friday: 9 AM - 6 PM EST</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Weekend support via email only</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Need immediate help?</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Check our FAQ section first for instant answers to common questions. For urgent issues, 
                  use the email support option above with "URGENT" in the subject line.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
