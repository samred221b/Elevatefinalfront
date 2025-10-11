import { Quote } from '@/types'

export const MOTIVATIONAL_QUOTES: Quote[] = [
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "Your habits will determine your future.", author: "Jack Canfield" },
  { text: "First forget inspiration. Habit is more dependable.", author: "Octavia Butler" },
  { text: "The chains of habit are too weak to be felt until they are too strong to be broken.", author: "Samuel Johnson" },
  { text: "Good habits are worth being fanatical about.", author: "John Irving" },
  { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "The difference between who you are and who you want to be is what you do.", author: "Unknown" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "You'll never change your life until you change something you do daily.", author: "Mike Murdock" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
]

export function getRandomQuote(): Quote {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]
}
