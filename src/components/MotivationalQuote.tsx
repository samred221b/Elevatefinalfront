import { useState, useEffect } from 'react'
import { Card, CardContent } from './ui/card'
import { getRandomQuote } from '@/lib/quotes'
import { Quote as QuoteType } from '@/types'
import { RefreshCw, Quote } from 'lucide-react'
import { Button } from './ui/button'

export function MotivationalQuote() {
  const [quote, setQuote] = useState<QuoteType>(getRandomQuote())

  const refreshQuote = () => {
    setQuote(getRandomQuote())
  }

  useEffect(() => {
    // Change quote daily
    const lastQuoteDate = localStorage.getItem('last-quote-date')
    const today = new Date().toDateString()
    
    if (lastQuoteDate !== today) {
      refreshQuote()
      localStorage.setItem('last-quote-date', today)
    }
  }, [])

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-800">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Quote className="w-8 h-8 text-purple-500 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <p className="text-lg font-medium italic mb-2">"{quote.text}"</p>
            <p className="text-sm text-muted-foreground">— {quote.author}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshQuote}
            className="flex-shrink-0"
            title="Get new quote"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
