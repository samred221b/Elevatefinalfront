import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import { ChevronDown, ChevronUp, Book, Search, ArrowLeft, HelpCircle } from 'lucide-react'
import { useNavigation } from '../context/NavigationContext'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  // Getting Started
  {
    id: '1',
    question: 'How do I create my first habit?',
    answer: 'To create your first habit, start by clicking the "+" button or navigating to the home page. First, create a category (like "Health" or "Productivity"), then add a habit to that category. Be specific with your habit name and set a realistic frequency to start with.',
    category: 'Getting Started'
  },
  {
    id: '2',
    question: 'What makes a good habit?',
    answer: 'A good habit is specific, measurable, achievable, and consistent. Start small - instead of "exercise more," try "do 10 push-ups every morning." Focus on consistency over intensity, and make sure your habit aligns with your larger goals.',
    category: 'Getting Started'
  },
  {
    id: '3',
    question: 'How do I organize my habits effectively?',
    answer: 'Use categories to group related habits together (e.g., "Health," "Work," "Personal Growth"). Start with 2-3 categories and no more than 5 habits total. You can always add more as you build consistency with your initial habits.',
    category: 'Getting Started'
  },

  // Habit Management
  {
    id: '4',
    question: 'How do I track my habit progress?',
    answer: 'Simply click the checkmark next to your habit when you complete it for the day. You can view your progress through streaks, the calendar view, and detailed analytics. The app automatically tracks your completion rate and longest streaks.',
    category: 'Habit Management'
  },
  {
    id: '5',
    question: 'What if I miss a day?',
    answer: 'Missing a day is normal and part of the process! Don\'t let it derail your progress. Focus on getting back on track the next day. The app shows your overall completion rate, so one missed day won\'t ruin your progress. Consistency over perfection is key.',
    category: 'Habit Management'
  },
  {
    id: '6',
    question: 'Can I edit or delete habits?',
    answer: 'Yes! You can edit any habit by clicking the edit button (pencil icon) next to it. You can change the name, description, frequency, or difficulty. To delete a habit, use the delete button (trash icon). Be careful as this action cannot be undone.',
    category: 'Habit Management'
  },
  {
    id: '7',
    question: 'How do habit streaks work?',
    answer: 'A streak is the number of consecutive days you\'ve completed a habit. Your current streak shows how many days in a row you\'ve been consistent. Your best streak shows your longest achievement. Streaks reset when you miss a day, but your best streak is preserved.',
    category: 'Habit Management'
  },

  // Features & Analytics
  {
    id: '8',
    question: 'What do the analytics show me?',
    answer: 'The analytics page provides insights into your habit performance including completion rates, streak patterns, weekly/monthly trends, and category performance. Use these insights to identify which habits are working well and which might need adjustment.',
    category: 'Features & Analytics'
  },
  {
    id: '9',
    question: 'How does the calendar view work?',
    answer: 'The calendar view shows your habit completions over time with color-coded indicators. Green dots represent completed habits, gray dots show missed days, and you can click on any date to see detailed information about that day\'s activities.',
    category: 'Features & Analytics'
  },
  {
    id: '10',
    question: 'What are habit templates?',
    answer: 'Habit templates are pre-designed habits based on proven strategies and popular goals. Instead of creating habits from scratch, you can browse templates for fitness, productivity, mindfulness, and more. Simply select a template and customize it to fit your needs.',
    category: 'Features & Analytics'
  },
  {
    id: '11',
    question: 'How do I earn badges and achievements?',
    answer: 'Badges are automatically earned when you reach certain milestones like completing your first week, reaching a 30-day streak, or completing all habits in a category for a month. Check the Achievements page to see available badges and your progress toward earning them.',
    category: 'Features & Analytics'
  },

  // Account & Data
  {
    id: '12',
    question: 'Is my data secure and private?',
    answer: 'Yes, your data is encrypted and stored securely. We never share your personal habit data with third parties. You can export your data at any time from the Data Management page, and you have full control over your information.',
    category: 'Account & Data'
  },
  {
    id: '13',
    question: 'Can I export my habit data?',
    answer: 'Absolutely! Go to the Data Management page where you can export your habits, completions, and analytics in various formats (JSON, CSV). This is useful for backups or if you want to analyze your data in other tools.',
    category: 'Account & Data'
  },
  {
    id: '14',
    question: 'How do I backup my habits?',
    answer: 'Your habits are automatically backed up to our secure servers. For additional peace of mind, you can create manual backups by exporting your data from the Data Management page. We recommend doing this monthly.',
    category: 'Account & Data'
  },

  // Troubleshooting
  {
    id: '15',
    question: 'Why aren\'t my habits saving?',
    answer: 'If habits aren\'t saving, check your internet connection first. If the problem persists, try refreshing the page. Your data should sync automatically when the connection is restored. Contact support if the issue continues.',
    category: 'Troubleshooting'
  },
  {
    id: '16',
    question: 'The app seems slow or unresponsive',
    answer: 'Try refreshing your browser or clearing your browser cache. If you have many habits (50+), the app might take a moment to load. Consider archiving old habits you\'re no longer tracking to improve performance.',
    category: 'Troubleshooting'
  },
  {
    id: '17',
    question: 'I can\'t see my progress from yesterday',
    answer: 'Progress data should sync automatically. If you\'re missing recent data, try refreshing the page. If you completed habits offline, they should sync when you reconnect to the internet. Check the calendar view to verify your progress.',
    category: 'Troubleshooting'
  },

  // Tips & Best Practices
  {
    id: '18',
    question: 'How many habits should I track at once?',
    answer: 'Start with 3-5 habits maximum. It\'s better to be consistent with a few habits than to overwhelm yourself with many. Once you\'ve maintained these for 2-3 weeks, you can gradually add more. Quality over quantity is key to long-term success.',
    category: 'Tips & Best Practices'
  },
  {
    id: '19',
    question: 'What\'s the best time to check off habits?',
    answer: 'Check off habits as soon as you complete them, or set a consistent time each day (like evening review). Many users find success with a morning planning session and evening review. Find what works for your schedule and stick with it.',
    category: 'Tips & Best Practices'
  },
  {
    id: '20',
    question: 'How do I stay motivated when progress feels slow?',
    answer: 'Focus on the process, not just outcomes. Celebrate small wins and use the analytics to see your progress over time. Remember that habits compound - small daily actions lead to significant long-term results. Consider adjusting habits if they feel too challenging.',
    category: 'Tips & Best Practices'
  }
]

const categories = [...new Set(faqData.map(item => item.category))]

export function FAQView() {
  const { setCurrentView } = useNavigation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const expandAll = () => {
    setExpandedItems(new Set(filteredFAQs.map(item => item.id)))
  }

  const collapseAll = () => {
    setExpandedItems(new Set())
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 md:p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0 mb-4 lg:mb-6">
            <div className="flex items-center gap-3 md:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView('help')}
                className="text-white hover:bg-white/20 p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="p-2 md:p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <HelpCircle className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Frequently Asked Questions
                </h1>
                <p className="text-blue-100 mt-1 text-sm md:text-lg">Find answers to common questions about using Elevate 💡</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <span className="text-xl md:text-2xl">❓</span>
              <span className="text-sm md:text-base font-medium text-white">
                {filteredFAQs.length} Questions
              </span>
            </div>
          </div>
          
          {/* Status Message */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-4">
            <span className="text-blue-100 font-medium text-sm md:text-base">Status:</span>
            <div className="flex bg-white/10 rounded-xl p-1 backdrop-blur-sm">
              <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-white/10 rounded-lg">
                <span className="text-xs md:text-sm font-medium text-white">Get instant answers to your questions! 🚀</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full animate-bounce"></div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-w-[200px]"
            >
              <option value="All">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Expand/Collapse Controls */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={expandAll}>
                Expand All
              </Button>
              <Button variant="outline" size="sm" onClick={collapseAll}>
                Collapse All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No questions found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search terms or category filter.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredFAQs.map((item, index) => (
            <Card 
              key={item.id} 
              className="hover:shadow-lg transition-all duration-200 animate-in slide-in-from-bottom-4 fade-in-0"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader 
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                onClick={() => toggleExpanded(item.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <CardTitle className="text-left text-gray-900 dark:text-gray-100 text-lg">
                      {item.question}
                    </CardTitle>
                  </div>
                  <div className="ml-4">
                    {expandedItems.has(item.id) ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {expandedItems.has(item.id) && (
                <CardContent className="pt-0 animate-in slide-in-from-top-2 fade-in-0 duration-200">
                  <div className="pl-4 border-l-4 border-blue-500/30">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Help Footer */}
      <Card className="border-blue-500/50">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Book className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Still need help?
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              If you couldn't find the answer you're looking for, our support team is here to help. 
              We typically respond within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => setCurrentView('help')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Contact Support
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('mailto:samred221b@gmail.com?subject=FAQ Follow-up - Elevate Habit Tracker', '_blank')}
              >
                Send Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
