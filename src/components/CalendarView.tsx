import { useMemo, useState } from 'react'
import { useHabits } from '@/context/HabitContext'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import { ChevronLeft, ChevronRight, Calendar, Flame, Target, Trophy, Zap, Star, Sun, Cloud, CloudRain } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns'

export function CalendarView() {
  const { habits, logs, categories, getHabitsByCategory } = useHabits()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedHabit, setSelectedHabit] = useState<string | 'all'>('all')
  const [viewMode, setViewMode] = useState<'heatmap' | 'streaks' | 'mood'>('heatmap')

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getCompletionForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const dayLogs = logs.filter(log => log.date === dateStr && log.completed)
    
    if (selectedHabit === 'all') {
      return dayLogs.length
    } else {
      return dayLogs.filter(log => log.habitId === selectedHabit).length
    }
  }

  const maxCompletions = useMemo(() => {
    return Math.max(...daysInMonth.map(day => getCompletionForDate(day)), 1)
  }, [daysInMonth, logs, selectedHabit])

  const getHeatColor = (count: number) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800'
    const intensity = Math.min(count / maxCompletions, 1)
    if (intensity <= 0.25) return 'bg-gradient-to-br from-emerald-200 to-green-300 dark:from-emerald-900 dark:to-green-800'
    if (intensity <= 0.5) return 'bg-gradient-to-br from-green-400 to-emerald-500 dark:from-green-700 dark:to-emerald-600'
    if (intensity <= 0.75) return 'bg-gradient-to-br from-green-600 to-emerald-700 dark:from-green-500 dark:to-emerald-400'
    return 'bg-gradient-to-br from-green-700 to-emerald-800 dark:from-green-400 dark:to-emerald-300'
  }

  const getMoodColor = (count: number) => {
    if (count === 0) return 'bg-gradient-to-br from-gray-200 to-slate-300 dark:from-gray-700 dark:to-slate-600'
    if (count <= 2) return 'bg-gradient-to-br from-red-300 to-orange-400 dark:from-red-600 dark:to-orange-500'
    if (count <= 4) return 'bg-gradient-to-br from-yellow-300 to-amber-400 dark:from-yellow-600 dark:to-amber-500'
    if (count <= 6) return 'bg-gradient-to-br from-blue-300 to-cyan-400 dark:from-blue-600 dark:to-cyan-500'
    return 'bg-gradient-to-br from-purple-400 to-pink-500 dark:from-purple-600 dark:to-pink-400'
  }

  const getStreakInfo = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const dayLogs = logs.filter(log => log.date === dateStr && log.completed)
    const hasCompletion = dayLogs.length > 0
    
    // Simple streak calculation for visualization
    let streakLength = 0
    if (hasCompletion) {
      const currentDate = new Date(date)
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(currentDate)
        checkDate.setDate(checkDate.getDate() - i)
        const checkDateStr = format(checkDate, 'yyyy-MM-dd')
        const hasLog = logs.some(log => log.date === checkDateStr && log.completed)
        if (hasLog) {
          streakLength++
        } else {
          break
        }
      }
    }
    return { hasCompletion, streakLength }
  }

  const getDayIcon = (count: number, date: Date) => {
    const { streakLength } = getStreakInfo(date)
    if (count === 0) return null
    if (streakLength >= 7) return <Flame className="w-3 h-3 text-orange-500" />
    if (streakLength >= 3) return <Zap className="w-3 h-3 text-yellow-500" />
    if (count >= maxCompletions) return <Star className="w-3 h-3 text-yellow-400" />
    if (count >= maxCompletions * 0.75) return <Trophy className="w-3 h-3 text-amber-500" />
    return <Target className="w-3 h-3 text-blue-500" />
  }

  const getMoodIcon = (count: number) => {
    if (count === 0) return <Cloud className="w-4 h-4 text-gray-400" />
    if (count <= 2) return <CloudRain className="w-4 h-4 text-red-400" />
    if (count <= 4) return <Sun className="w-4 h-4 text-yellow-400" />
    if (count <= 6) return <Sun className="w-4 h-4 text-blue-400" />
    return <Star className="w-4 h-4 text-purple-400" />
  }

  const monthlyStats = useMemo(() => {
    const monthLogs = logs.filter(log => {
      const logDate = new Date(log.date)
      return logDate >= monthStart && logDate <= monthEnd && log.completed
    })

    const totalCompleted = selectedHabit === 'all' 
      ? monthLogs.length 
      : monthLogs.filter(log => log.habitId === selectedHabit).length

    const activeDays = new Set(monthLogs.map(log => log.date)).size
    const completionRate = habits.length > 0 
      ? Math.round((totalCompleted / (habits.length * daysInMonth.length)) * 100)
      : 0

    return { totalCompleted, activeDays, completionRate }
  }, [logs, monthStart, monthEnd, selectedHabit, habits, daysInMonth])

  // Get first day of month to calculate offset
  const firstDayOfMonth = monthStart.getDay()

  return (
    <div className="space-y-3 md:space-y-6 h-full overflow-hidden">
      {/* Compact Header - Mobile Optimized */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 p-3 md:p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-4">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="p-1.5 md:p-3 bg-white/20 rounded-lg md:rounded-2xl backdrop-blur-sm">
                <Calendar className="w-4 h-4 md:w-8 md:h-8" />
              </div>
              <div>
                <h2 className="text-lg md:text-4xl font-bold bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                  Habit Calendar
                </h2>
                <p className="text-orange-100 mt-0.5 text-xs md:text-lg hidden sm:block">Track your journey through time ✨</p>
              </div>
            </div>
            
            {/* Compact Month Navigation */}
            <div className="flex items-center gap-1 md:gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="text-white hover:bg-white/20 border-white/30 p-1.5 md:p-3"
              >
                <ChevronLeft className="w-3 h-3 md:w-5 md:h-5" />
              </Button>
              <div className="text-sm md:text-2xl font-bold min-w-[100px] md:min-w-[200px] text-center bg-white/10 rounded-lg px-2 md:px-6 py-1 md:py-2 backdrop-blur-sm">
                {format(currentMonth, 'MMM yyyy')}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="text-white hover:bg-white/20 border-white/30 p-1.5 md:p-3"
              >
                <ChevronRight className="w-3 h-3 md:w-5 md:h-5" />
              </Button>
            </div>
          </div>

          {/* View Mode Toggles - Mobile Responsive */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-4">
            <span className="text-cyan-100 font-medium text-sm md:text-base">View Mode:</span>
            <div className="flex bg-white/10 rounded-xl p-1 backdrop-blur-sm">
              <Button
                variant={viewMode === 'heatmap' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('heatmap')}
                className={cn(
                  "text-white border-0 text-xs md:text-sm",
                  viewMode === 'heatmap' 
                    ? 'bg-white/20 shadow-lg' 
                    : 'hover:bg-white/10'
                )}
              >
                <Target className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Heatmap
              </Button>
              <Button
                variant={viewMode === 'streaks' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('streaks')}
                className={cn(
                  "text-white border-0 text-xs md:text-sm",
                  viewMode === 'streaks' 
                    ? 'bg-white/20 shadow-lg' 
                    : 'hover:bg-white/10'
                )}
              >
                <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Streaks
              </Button>
              <Button
                variant={viewMode === 'mood' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('mood')}
                className={cn(
                  "text-white border-0 text-xs md:text-sm",
                  viewMode === 'mood' 
                    ? 'bg-white/20 shadow-lg' 
                    : 'hover:bg-white/10'
                )}
              >
                <Sun className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Mood
              </Button>
            </div>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full animate-bounce"></div>
      </div>

      {/* Compact Stats - Mobile Optimized */}
      <div className="grid grid-cols-3 gap-2 md:gap-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-2 md:pt-6 relative z-10">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1 md:mb-3">
                <div className="p-1 md:p-3 bg-blue-500/20 rounded-full">
                  <Target className="w-3 h-3 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400 font-medium">Completed</p>
              <p className="text-lg md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-1 md:mt-2">
                {monthlyStats.totalCompleted}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-2 md:pt-6 relative z-10">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1 md:mb-3">
                <div className="p-1 md:p-3 bg-emerald-500/20 rounded-full">
                  <Zap className="w-3 h-3 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <p className="text-xs md:text-sm text-emerald-600 dark:text-emerald-400 font-medium">Active Days</p>
              <p className="text-lg md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mt-1 md:mt-2">
                {monthlyStats.activeDays}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-2 md:pt-6 relative z-10">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1 md:mb-3">
                <div className="p-1 md:p-3 bg-purple-500/20 rounded-full">
                  <Trophy className="w-3 h-3 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-xs md:text-sm text-purple-600 dark:text-purple-400 font-medium">Rate</p>
              <p className="text-lg md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-1 md:mt-2">
                {monthlyStats.completionRate}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="hidden md:block">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Filter by Habit</CardTitle>
            <select
              value={selectedHabit}
              onChange={(e) => setSelectedHabit(e.target.value)}
              className="px-2 py-1 border rounded-md text-xs"
            >
              <option value="all">All Habits</option>
              {categories.map(category => (
                <optgroup key={category.id} label={`${category.icon} ${category.name}`}>
                  {getHabitsByCategory(category.id).map(habit => (
                    <option key={habit.id} value={habit.id}>
                      {habit.icon} {habit.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Day labels */}
            <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-muted-foreground">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              
              {/* Days of the month */}
              {daysInMonth.map((day) => {
                const completions = getCompletionForDate(day)
                const dayIsToday = isSameDay(day, new Date())
                const { streakLength } = getStreakInfo(day)
                
                const getViewColor = () => {
                  switch (viewMode) {
                    case 'mood':
                      return getMoodColor(completions)
                    case 'streaks':
                      return streakLength > 0 
                        ? `bg-gradient-to-br from-orange-${Math.min(streakLength * 100, 500)} to-red-${Math.min(streakLength * 100, 500)}`
                        : 'bg-gray-100 dark:bg-gray-800'
                    default:
                      return getHeatColor(completions)
                  }
                }

                const getViewIcon = () => {
                  switch (viewMode) {
                    case 'mood':
                      return getMoodIcon(completions)
                    case 'streaks':
                      return streakLength >= 3 ? <Flame className="w-3 h-3 text-orange-500" /> : null
                    default:
                      return getDayIcon(completions, day)
                  }
                }
                
                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      'aspect-square rounded-xl flex flex-col items-center justify-center p-2 transition-all duration-300 cursor-pointer relative overflow-hidden group',
                      getViewColor(),
                      dayIsToday && 'ring-3 ring-yellow-400 ring-offset-2 shadow-lg',
                      'hover:scale-110 hover:shadow-xl hover:z-10',
                      completions > 0 && 'animate-pulse'
                    )}
                    title={`${format(day, 'MMM d')}: ${completions} habit${completions !== 1 ? 's' : ''} completed${streakLength > 0 ? ` • ${streakLength} day streak` : ''}`}
                  >
                    {/* Background glow effect */}
                    {completions > 0 && (
                      <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                    
                    {/* Day number */}
                    <div className={cn(
                      "text-sm font-bold relative z-10",
                      completions > 0 ? "text-white" : "text-gray-600 dark:text-gray-300"
                    )}>
                      {format(day, 'd')}
                    </div>
                    
                    {/* Icon or completion count */}
                    <div className="flex items-center justify-center mt-1 relative z-10">
                      {viewMode === 'heatmap' && completions > 0 && (
                        <div className="text-xs font-bold text-white bg-black/20 rounded-full px-1.5 py-0.5">
                          {completions}
                        </div>
                      )}
                      {viewMode === 'streaks' && streakLength > 0 && (
                        <div className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-200" />
                          <span className="text-xs font-bold text-white">{streakLength}</span>
                        </div>
                      )}
                      {viewMode === 'mood' && getViewIcon()}
                    </div>

                    {/* Special effects for achievements */}
                    {completions >= maxCompletions && (
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-xl animate-pulse"></div>
                    )}
                    {streakLength >= 7 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-bounce">
                        <Star className="w-2 h-2 text-white m-0.5" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Enhanced Legend */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground">Legend:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Less</span>
                    <div className="flex gap-1">
                      {viewMode === 'heatmap' && (
                        <>
                          <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800 border" />
                          <div className="w-4 h-4 rounded bg-gradient-to-br from-emerald-200 to-green-300" />
                          <div className="w-4 h-4 rounded bg-gradient-to-br from-green-400 to-emerald-500" />
                          <div className="w-4 h-4 rounded bg-gradient-to-br from-green-600 to-emerald-700" />
                          <div className="w-4 h-4 rounded bg-gradient-to-br from-green-700 to-emerald-800" />
                        </>
                      )}
                      {viewMode === 'mood' && (
                        <>
                          <div className="w-4 h-4 rounded bg-gradient-to-br from-gray-200 to-slate-300 border" />
                          <div className="w-4 h-4 rounded bg-gradient-to-br from-red-300 to-orange-400" />
                          <div className="w-4 h-4 rounded bg-gradient-to-br from-yellow-300 to-amber-400" />
                          <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-300 to-cyan-400" />
                          <div className="w-4 h-4 rounded bg-gradient-to-br from-purple-400 to-pink-500" />
                        </>
                      )}
                      {viewMode === 'streaks' && (
                        <>
                          <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800 border" />
                          <div className="w-4 h-4 rounded bg-gradient-to-br from-orange-200 to-red-300" />
                          <div className="w-4 h-4 rounded bg-gradient-to-br from-orange-400 to-red-500" />
                          <div className="w-4 h-4 rounded bg-gradient-to-br from-orange-600 to-red-700" />
                          <div className="w-4 h-4 rounded bg-gradient-to-br from-orange-800 to-red-900" />
                        </>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">More</span>
                  </div>
                </div>

                {/* Legend Icons */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-500" />
                    <span>7+ day streak</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span>Perfect day</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <span>Today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile-Only Compact Calendar */}
      <Card className="md:hidden">
        <CardContent className="p-3">
          <div className="space-y-2">
            {/* Compact Day labels */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
              <div>S</div>
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div>S</div>
            </div>

            {/* Compact Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              
              {/* Days of the month - Mobile optimized */}
              {daysInMonth.map((day) => {
                const completions = getCompletionForDate(day)
                const dayIsToday = isSameDay(day, new Date())
                const { streakLength } = getStreakInfo(day)
                
                const getViewColor = () => {
                  switch (viewMode) {
                    case 'mood':
                      return getMoodColor(completions)
                    case 'streaks':
                      return streakLength > 0 
                        ? `bg-gradient-to-br from-orange-${Math.min(streakLength * 100, 500)} to-red-${Math.min(streakLength * 100, 500)}`
                        : 'bg-gray-100 dark:bg-gray-800'
                    default:
                      return getHeatColor(completions)
                  }
                }

                const getViewIcon = () => {
                  switch (viewMode) {
                    case 'mood':
                      return getMoodIcon(completions)
                    case 'streaks':
                      return streakLength >= 3 ? <Flame className="w-2 h-2 text-orange-500" /> : null
                    default:
                      return getDayIcon(completions, day)
                  }
                }
                
                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      'aspect-square rounded-lg flex flex-col items-center justify-center p-1 transition-all duration-300 cursor-pointer relative overflow-hidden group',
                      getViewColor(),
                      dayIsToday && 'ring-2 ring-yellow-400 ring-offset-1 shadow-md',
                      'hover:scale-105 hover:shadow-lg hover:z-10',
                      completions > 0 && 'animate-pulse'
                    )}
                    title={`${format(day, 'MMM d')}: ${completions} habit${completions !== 1 ? 's' : ''} completed${streakLength > 0 ? ` • ${streakLength} day streak` : ''}`}
                  >
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-0.5">
                      {format(day, 'd')}
                    </span>
                    {getViewIcon()}
                    
                    {/* Completion indicator */}
                    {completions > 0 && (
                      <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
