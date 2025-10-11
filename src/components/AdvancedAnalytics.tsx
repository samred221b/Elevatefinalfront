import { useMemo, useState } from 'react'
import { useHabits } from '@/context/HabitContext'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Award, Target, Calendar, Flame, Brain, Zap, Star, Crown, Rocket, Activity, Eye } from 'lucide-react'
import { format, subDays, eachDayOfInterval } from 'date-fns'
import { Button } from './ui/button'

export function AdvancedAnalytics() {
  const { habits, logs, categories, getHabitsByCategory, streaks } = useHabits()
  const [selectedView, setSelectedView] = useState<'overview' | 'trends' | 'insights'>('overview')

  // Last 30 days trend
  const last30DaysTrend = useMemo(() => {
    const today = new Date()
    const days = eachDayOfInterval({ start: subDays(today, 29), end: today })
    
    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd')
      const completed = logs.filter(log => log.date === dateStr && log.completed).length
      
      return {
        date: format(day, 'MMM d'),
        completed,
        total: habits.length,
        percentage: habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0,
      }
    })
  }, [logs, habits])

  // Category performance
  const categoryPerformance = useMemo(() => {
    return categories.map(category => {
      const categoryHabits = getHabitsByCategory(category.id)
      const totalPossible = categoryHabits.length * 30 // Last 30 days
      const completed = logs.filter(log => {
        const logDate = new Date(log.date)
        const thirtyDaysAgo = subDays(new Date(), 30)
        return log.completed && 
               logDate >= thirtyDaysAgo && 
               categoryHabits.some(h => h.id === log.habitId)
      }).length

      return {
        category: category.name,
        completion: totalPossible > 0 ? Math.round((completed / totalPossible) * 100) : 0,
        color: category.color,
      }
    }).filter(item => item.completion > 0)
  }, [categories, logs, getHabitsByCategory])

  // Best performing habits
  const topHabits = useMemo(() => {
    return habits.map(habit => {
      const habitLogs = logs.filter(log => log.habitId === habit.id && log.completed)
      const streak = streaks.get(habit.id)
      
      return {
        habit,
        completions: habitLogs.length,
        streak: streak?.currentStreak || 0,
      }
    })
    .sort((a, b) => b.completions - a.completions)
    .slice(0, 5)
  }, [habits, logs, streaks])

  // Consistency score (percentage of days with at least one habit completed)
  const consistencyScore = useMemo(() => {
    const last30Days = eachDayOfInterval({ 
      start: subDays(new Date(), 29), 
      end: new Date() 
    })
    
    const daysWithActivity = last30Days.filter(day => {
      const dateStr = format(day, 'yyyy-MM-dd')
      return logs.some(log => log.date === dateStr && log.completed)
    }).length

    return Math.round((daysWithActivity / 30) * 100)
  }, [logs])

  // Average completion rate
  const avgCompletionRate = useMemo(() => {
    if (last30DaysTrend.length === 0) return 0
    const sum = last30DaysTrend.reduce((acc, day) => acc + day.percentage, 0)
    return Math.round(sum / last30DaysTrend.length)
  }, [last30DaysTrend])

  // Trend direction
  const trendDirection = useMemo(() => {
    if (last30DaysTrend.length < 2) return 'neutral'
    const recent = last30DaysTrend.slice(-7).reduce((acc, d) => acc + d.percentage, 0) / 7
    const previous = last30DaysTrend.slice(-14, -7).reduce((acc, d) => acc + d.percentage, 0) / 7
    
    if (recent > previous + 5) return 'up'
    if (recent < previous - 5) return 'down'
    return 'neutral'
  }, [last30DaysTrend])

  // Weekly patterns analysis - Future feature
  /*
  const weeklyPatterns = useMemo(() => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayStats = Array(7).fill(0).map(() => ({ total: 0, completed: 0 }))
    
    last30DaysTrend.forEach((day, index) => {
      const dayOfWeek = getDay(subDays(new Date(), 29 - index))
      dayStats[dayOfWeek].total += day.total
      dayStats[dayOfWeek].completed += day.completed
    })
    
    return dayNames.map((name, index) => ({
      day: name.slice(0, 3),
      percentage: dayStats[index].total > 0 ? Math.round((dayStats[index].completed / dayStats[index].total) * 100) : 0,
      completions: dayStats[index].completed
    }))
  }, [last30DaysTrend])
  */

  // Habit difficulty analysis - Future feature
  /*
  const difficultyAnalysis = useMemo(() => {
    const analysis = { easy: 0, medium: 0, hard: 0 }
    habits.forEach(habit => {
      const completions = logs.filter(log => log.habitId === habit.id && log.completed).length
      if (completions > 0) {
        analysis[habit.difficulty as keyof typeof analysis] += completions
      }
    })
    return [
      { name: 'Easy', value: analysis.easy, color: '#10b981' },
      { name: 'Medium', value: analysis.medium, color: '#f59e0b' },
      { name: 'Hard', value: analysis.hard, color: '#ef4444' }
    ].filter(item => item.value > 0)
  }, [habits, logs])
  */

  // Performance insights
  const getPerformanceInsight = () => {
    if (avgCompletionRate >= 90) return { 
      message: "Outstanding performance! You're a habit master! 🏆", 
      color: "text-purple-600", 
      icon: Crown,
      level: "Master"
    }
    if (avgCompletionRate >= 75) return { 
      message: "Excellent consistency! Keep up the great work! 🚀", 
      color: "text-green-600", 
      icon: Rocket,
      level: "Expert"
    }
    if (avgCompletionRate >= 60) return { 
      message: "Good progress! You're building strong habits! ⭐", 
      color: "text-blue-600", 
      icon: Star,
      level: "Advanced"
    }
    if (avgCompletionRate >= 40) return { 
      message: "Making progress! Stay consistent! 💪", 
      color: "text-yellow-600", 
      icon: Zap,
      level: "Developing"
    }
    return { 
      message: "Every journey starts with a single step! 🎯", 
      color: "text-gray-600", 
      icon: Target,
      level: "Beginner"
    }
  }

  const insight = getPerformanceInsight()

  return (
    <div className="space-y-8">
      {/* Creative Header - Mobile Responsive */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 md:p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0 mb-4 lg:mb-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-white/20 rounded-xl md:rounded-2xl backdrop-blur-sm">
                <Brain className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                  Advanced Analytics
                </h2>
                <p className="text-emerald-100 mt-1 text-sm md:text-lg">Deep insights into your habit performance 🧠</p>
              </div>
            </div>
            
            {/* View Toggle - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="flex bg-white/10 rounded-xl p-1 backdrop-blur-sm">
                <Button
                  variant={selectedView === 'overview' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedView('overview')}
                  className={selectedView === 'overview' 
                    ? 'bg-white/20 shadow-lg text-white border-0' 
                    : 'hover:bg-white/10 text-white border-0'
                  }
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Overview
                </Button>
                <Button
                  variant={selectedView === 'trends' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedView('trends')}
                  className={selectedView === 'trends' 
                    ? 'bg-white/20 shadow-lg text-white border-0' 
                    : 'hover:bg-white/10 text-white border-0'
                  }
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Trends
                </Button>
                <Button
                  variant={selectedView === 'insights' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedView('insights')}
                  className={selectedView === 'insights' 
                    ? 'bg-white/20 shadow-lg text-white border-0' 
                    : 'hover:bg-white/10 text-white border-0'
                  }
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Insights
                </Button>
              </div>
            </div>
          </div>

          {/* Performance Level Badge - Mobile Responsive */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-orange-100 font-medium text-sm md:text-base">Performance Level:</span>
            <div className="flex bg-white/10 rounded-xl p-1 backdrop-blur-sm">
              <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-white/10 rounded-lg">
                <insight.icon className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                <span className="text-sm font-bold text-white">{insight.level}</span>
                <span className="text-xs text-orange-200">({avgCompletionRate}%)</span>
              </div>
            </div>
          </div>

          {/* Mobile View Toggle */}
          <div className="flex lg:hidden mt-4">
            <div className="flex bg-white/10 rounded-xl p-1 backdrop-blur-sm w-full">
              <Button
                variant={selectedView === 'overview' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedView('overview')}
                className={`flex-1 text-xs ${selectedView === 'overview' 
                  ? 'bg-white/20 shadow-lg text-white border-0' 
                  : 'hover:bg-white/10 text-white border-0'
                }`}
              >
                <Eye className="w-3 h-3 mr-1" />
                Overview
              </Button>
              <Button
                variant={selectedView === 'trends' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedView('trends')}
                className={`flex-1 text-xs ${selectedView === 'trends' 
                  ? 'bg-white/20 shadow-lg text-white border-0' 
                  : 'hover:bg-white/10 text-white border-0'
                }`}
              >
                <Activity className="w-3 h-3 mr-1" />
                Trends
              </Button>
              <Button
                variant={selectedView === 'insights' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedView('insights')}
                className={`flex-1 text-xs ${selectedView === 'insights' 
                  ? 'bg-white/20 shadow-lg text-white border-0' 
                  : 'hover:bg-white/10 text-white border-0'
                }`}
              >
                <Brain className="w-3 h-3 mr-1" />
                Insights
              </Button>
            </div>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full animate-bounce"></div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Consistency Score */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300">
          <CardContent className="pt-6 relative z-10">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-blue-500/20 rounded-full">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Consistency</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-2">
                {consistencyScore}%
              </p>
              <p className="text-xs text-blue-500 mt-1">Active days (30d)</p>
            </div>
          </CardContent>
          <div className="absolute top-2 right-2 w-20 h-20 bg-blue-500/10 rounded-full animate-pulse"></div>
        </Card>

        {/* Average Completion */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-300">
          <CardContent className="pt-6 relative z-10">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-green-500/20 rounded-full">
                  <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Avg. Completion</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-2">
                {avgCompletionRate}%
              </p>
              <p className="text-xs text-green-500 mt-1">Last 30 days</p>
            </div>
          </CardContent>
          <div className="absolute top-2 right-2 w-20 h-20 bg-green-500/10 rounded-full animate-bounce"></div>
        </Card>

        {/* Trend Direction */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800 hover:shadow-xl transition-all duration-300">
          <CardContent className="pt-6 relative z-10">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-orange-500/20 rounded-full">
                  {trendDirection === 'up' && <TrendingUp className="w-6 h-6 text-green-600" />}
                  {trendDirection === 'down' && <TrendingDown className="w-6 h-6 text-red-600" />}
                  {trendDirection === 'neutral' && <Activity className="w-6 h-6 text-orange-600" />}
                </div>
              </div>
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Trend</p>
              <p className="text-2xl font-bold mt-2" style={{ 
                color: trendDirection === 'up' ? '#16a34a' : trendDirection === 'down' ? '#dc2626' : '#ea580c' 
              }}>
                {trendDirection === 'up' ? 'Rising' : trendDirection === 'down' ? 'Falling' : 'Stable'}
              </p>
              <p className="text-xs text-orange-500 mt-1">vs. last week</p>
            </div>
          </CardContent>
          <div className="absolute top-2 right-2 w-20 h-20 bg-orange-500/10 rounded-full animate-pulse"></div>
        </Card>

        {/* Total Habits */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all duration-300">
          <CardContent className="pt-6 relative z-10">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-purple-500/20 rounded-full">
                  <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Total Habits</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-2">
                {habits.length}
              </p>
              <p className="text-xs text-purple-500 mt-1">Active tracking</p>
            </div>
          </CardContent>
          <div className="absolute top-2 right-2 w-20 h-20 bg-purple-500/10 rounded-full animate-pulse"></div>
        </Card>
      </div>

      {/* 30-Day Trend */}
      <Card>
        <CardHeader>
          <CardTitle>30-Day Completion Trend</CardTitle>
          <CardDescription>Your daily habit completion over the last month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={last30DaysTrend}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="percentage" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorCompleted)" 
                name="Completion %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        {categoryPerformance.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Category Success Rate</CardTitle>
              <CardDescription>How well you're doing in each category (last 30 days)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryPerformance.map((item) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.category}</span>
                        <span 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                      <span className="text-sm font-bold" style={{ color: item.color }}>
                        {item.completion}%
                      </span>
                    </div>
                    <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${item.completion}%`,
                          backgroundColor: item.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Summary Stats */}
              <div className="mt-6 pt-6 border-t grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {Math.round(categoryPerformance.reduce((acc, cat) => acc + cat.completion, 0) / categoryPerformance.length)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Average Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-500">
                    {categoryPerformance.filter(cat => cat.completion >= 70).length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Strong Categories</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Performing Habits */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Habits</CardTitle>
            <CardDescription>Your most completed habits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topHabits.map((item, index) => (
                <div key={item.habit.id} className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                    {index + 1}
                  </div>
                  <span className="text-2xl">{item.habit.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium">{item.habit.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-muted-foreground">
                        {item.completions} completions
                      </span>
                      {item.streak > 0 && (
                        <span className="text-sm flex items-center gap-1 text-orange-500">
                          <Flame className="w-3 h-3" />
                          {item.streak} day streak
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {topHabits.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Start completing habits to see your top performers!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
