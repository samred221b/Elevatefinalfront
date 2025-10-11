import { useMemo, useState } from 'react'
import { useHabits } from '@/context/HabitContext'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { getWeekDates } from '@/lib/utils'
import { startOfWeek, format, subDays, subWeeks } from 'date-fns'
import { Button } from './ui/button'
import { TrendingUp, TrendingDown, Target, Flame, Trophy, Calendar, Zap, Star, Award, Crown, Rocket, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ProgressInsights() {
  const { habits, logs, categories, getHabitsByCategory, getStreakForHabit } = useHabits()
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week')

  const weekDates = useMemo(() => {
    return getWeekDates(startOfWeek(new Date()))
  }, [])

  // Future feature: monthly view
  /*
  const monthDates = useMemo(() => {
    const start = startOfMonth(new Date())
    const end = endOfMonth(new Date())
    return eachDayOfInterval({ start, end }).map(date => format(date, 'yyyy-MM-dd'))
  }, [])
  */

  // const currentDates = selectedPeriod === 'week' ? weekDates : monthDates

  const weeklyData = useMemo(() => {
    return weekDates.map(date => {
      const completedCount = logs.filter(log => 
        log.date === date && log.completed
      ).length
      
      return {
        date: format(new Date(date), 'EEE'),
        completed: completedCount,
        total: habits.length,
        percentage: habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0
      }
    })
  }, [weekDates, logs, habits])

  const monthlyTrendData = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = format(subDays(new Date(), 29 - i), 'yyyy-MM-dd')
      const completedCount = logs.filter(log => log.date === date && log.completed).length
      return {
        date: format(new Date(date), 'MMM dd'),
        completed: completedCount,
        percentage: habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0
      }
    })
    return last30Days
  }, [logs, habits])

  const categoryData = useMemo(() => {
    return categories.map(category => {
      const categoryHabits = getHabitsByCategory(category.id)
      const completedCount = logs.filter(log => 
        log.completed && categoryHabits.some(h => h.id === log.habitId)
      ).length

      return {
        name: category.name,
        value: completedCount,
        color: category.color,
        habits: categoryHabits.length,
        percentage: categoryHabits.length > 0 ? Math.round((completedCount / (categoryHabits.length * 30)) * 100) : 0
      }
    }).filter(item => item.value > 0)
  }, [categories, logs, getHabitsByCategory])

  // Enhanced Statistics
  const totalCompleted = logs.filter(log => log.completed).length
  const thisWeekCompleted = logs.filter(log => 
    log.completed && weekDates.includes(log.date)
  ).length
  const lastWeekCompleted = logs.filter(log => {
    const lastWeekDates = getWeekDates(startOfWeek(subWeeks(new Date(), 1)))
    return log.completed && lastWeekDates.includes(log.date)
  }).length
  
  const completionRate = habits.length > 0 
    ? Math.round((thisWeekCompleted / (habits.length * 7)) * 100)
    : 0

  const weeklyTrend = thisWeekCompleted - lastWeekCompleted
  const bestStreak = Math.max(...habits.map(habit => getStreakForHabit(habit.id).longestStreak), 0)
  const activeStreaks = habits.filter(habit => getStreakForHabit(habit.id).currentStreak > 0).length

  const getMotivationalMessage = () => {
    if (completionRate >= 90) return { message: "Incredible! You're crushing it! 🔥", color: "text-purple-600", icon: Crown }
    if (completionRate >= 70) return { message: "Amazing progress! Keep it up! 🚀", color: "text-green-600", icon: Rocket }
    if (completionRate >= 50) return { message: "Great work! You're building momentum! ⭐", color: "text-blue-600", icon: Star }
    if (completionRate >= 30) return { message: "Good start! Every step counts! 💪", color: "text-yellow-600", icon: Zap }
    return { message: "Ready to build great habits? Let's go! 🎯", color: "text-gray-600", icon: Target }
  }

  const motivational = getMotivationalMessage()

  return (
    <div className="space-y-8">
      {/* Creative Header - Mobile Responsive */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 to-rose-600 p-4 md:p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0 mb-4 lg:mb-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-white/20 rounded-xl md:rounded-2xl backdrop-blur-sm">
                <BarChart3 className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
                  Progress Insights
                </h2>
                <p className="text-pink-100 mt-1 text-sm md:text-lg">Track your journey and celebrate your wins! 📊</p>
              </div>
            </div>
            
            {/* Period Toggle */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex bg-white/10 rounded-xl p-1 backdrop-blur-sm">
                <Button
                  variant={selectedPeriod === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedPeriod('week')}
                  className={cn(
                    "text-white border-0 text-xs md:text-sm",
                    selectedPeriod === 'week' 
                      ? 'bg-white/20 shadow-lg' 
                      : 'hover:bg-white/10'
                  )}
                >
                  <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Week
                </Button>
                <Button
                  variant={selectedPeriod === 'month' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedPeriod('month')}
                  className={cn(
                    "text-white border-0 text-xs md:text-sm",
                    selectedPeriod === 'month' 
                      ? 'bg-white/20 shadow-lg' 
                      : 'hover:bg-white/10'
                  )}
                >
                  <BarChart3 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Month
                </Button>
              </div>
            </div>
          </div>

          {/* Motivational Message - Mobile Responsive */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-blue-100 font-medium text-sm md:text-base">Status:</span>
            <div className="flex bg-white/10 rounded-xl p-1 backdrop-blur-sm">
              <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-white/10 rounded-lg">
                <motivational.icon className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                <span className="text-xs md:text-sm font-medium text-white">{motivational.message}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-2 right-2 md:top-4 md:right-4 w-16 h-16 md:w-24 md:h-24 bg-white/5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 w-12 h-12 md:w-20 md:h-20 bg-white/5 rounded-full animate-bounce"></div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Completed */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300">
          <CardContent className="pt-6 relative z-10">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-blue-500/20 rounded-full">
                  <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Completed</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-2">
                {totalCompleted}
              </p>
            </div>
          </CardContent>
          <div className="absolute top-2 right-2 w-20 h-20 bg-blue-500/10 rounded-full animate-pulse"></div>
        </Card>

        {/* This Week */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-300">
          <CardContent className="pt-6 relative z-10">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-green-500/20 rounded-full">
                  <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">This Week</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {thisWeekCompleted}
                </p>
                {weeklyTrend !== 0 && (
                  <div className={`flex items-center gap-1 ${weeklyTrend > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {weeklyTrend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="text-sm font-medium">{Math.abs(weeklyTrend)}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <div className="absolute top-2 right-2 w-20 h-20 bg-green-500/10 rounded-full animate-bounce"></div>
        </Card>

        {/* Best Streak */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800 hover:shadow-xl transition-all duration-300">
          <CardContent className="pt-6 relative z-10">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-orange-500/20 rounded-full">
                  <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Best Streak</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mt-2">
                {bestStreak}
              </p>
              <p className="text-xs text-orange-500 mt-1">days</p>
            </div>
          </CardContent>
          <div className="absolute top-2 right-2 w-20 h-20 bg-orange-500/10 rounded-full animate-pulse"></div>
        </Card>

        {/* Completion Rate */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all duration-300">
          <CardContent className="pt-6 relative z-10">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-purple-500/20 rounded-full">
                  <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Completion Rate</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-2">
                {completionRate}%
              </p>
              <p className="text-xs text-purple-500 mt-1">{activeStreaks} active streaks</p>
            </div>
          </CardContent>
          <div className="absolute top-2 right-2 w-20 h-20 bg-purple-500/10 rounded-full animate-pulse"></div>
        </Card>
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-xl">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              {selectedPeriod === 'week' ? 'Weekly Progress' : 'Monthly Trends'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {selectedPeriod === 'week' ? (
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#f8fafc', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="completed" 
                    fill="url(#blueGradient)" 
                    radius={[8, 8, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                  </defs>
                </BarChart>
              ) : (
                <AreaChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#f8fafc', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#8b5cf6" 
                    fill="url(#purpleGradient)"
                    strokeWidth={3}
                  />
                  <defs>
                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Performance */}
        {categoryData.length > 0 && (
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-xl">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
                Category Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryData.map((category) => (
                  <div key={category.name} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {category.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {category.value}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">completed</span>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500 group-hover:shadow-lg"
                        style={{ 
                          backgroundColor: category.color,
                          width: `${Math.min(category.percentage, 100)}%`
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{category.habits} habits</span>
                      <span>{category.percentage}% completion</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
