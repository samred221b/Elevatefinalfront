import { useMemo } from 'react'
import { useHabits } from '@/context/HabitContext'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from './ui/dialog'
import { Habit } from '@/types'
import { Card, CardContent } from './ui/card'
import { Flame, TrendingUp, Target, Award } from 'lucide-react'
import { format, subDays, eachDayOfInterval } from 'date-fns'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface HabitDetailsProps {
  habit: Habit | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HabitDetails({ habit, open, onOpenChange }: HabitDetailsProps) {
  const { logs, getStreakForHabit, categories } = useHabits()

  const category = categories.find(c => c.id === habit?.categoryId)
  const streak = habit ? getStreakForHabit(habit.id) : null

  const stats = useMemo(() => {
    if (!habit) return null

    const habitLogs = logs.filter(log => log.habitId === habit.id && log.completed)
    const totalCompletions = habitLogs.length

    // Last 30 days
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date()
    })

    const last30DaysData = last30Days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd')
      const completed = habitLogs.some(log => log.date === dateStr)
      return {
        date: format(day, 'MMM d'),
        completed: completed ? 1 : 0
      }
    })

    const completionsLast30Days = habitLogs.filter(log => {
      const logDate = new Date(log.date)
      return logDate >= subDays(new Date(), 30)
    }).length

    const completionRate = Math.round((completionsLast30Days / 30) * 100)

    // Best streak
    const bestStreak = streak?.longestStreak || 0

    // Average per week
    const weeksTracking = Math.max(1, Math.ceil(
      (new Date().getTime() - new Date(habit.createdAt).getTime()) / (7 * 24 * 60 * 60 * 1000)
    ))
    const avgPerWeek = Math.round(totalCompletions / weeksTracking * 10) / 10

    return {
      totalCompletions,
      completionRate,
      bestStreak,
      avgPerWeek,
      last30DaysData,
    }
  }, [habit, logs, streak])

  if (!habit || !stats) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogClose onClose={() => onOpenChange(false)} />
        <DialogHeader>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{habit.icon}</span>
            <div>
              <DialogTitle className="text-2xl">{habit.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <span 
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
                >
                  {category?.icon} {category?.name}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-accent">
                  {habit.frequency}
                </span>
                {habit.difficulty && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    habit.difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                    habit.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                    'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {habit.difficulty}
                  </span>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Flame className="w-8 h-8 mx-auto text-orange-500 mb-2" />
                  <p className="text-2xl font-bold">{streak?.currentStreak || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">Current Streak</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Award className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                  <p className="text-2xl font-bold">{stats.bestStreak}</p>
                  <p className="text-xs text-muted-foreground mt-1">Best Streak</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Target className="w-8 h-8 mx-auto text-green-500 mb-2" />
                  <p className="text-2xl font-bold">{stats.completionRate}%</p>
                  <p className="text-xs text-muted-foreground mt-1">30-Day Rate</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                  <p className="text-2xl font-bold">{stats.avgPerWeek}</p>
                  <p className="text-xs text-muted-foreground mt-1">Avg per Week</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 30-Day Chart */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Last 30 Days</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={stats.last30DaysData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 1]} ticks={[0, 1]} />
                  <Tooltip />
                  <Line 
                    type="stepAfter" 
                    dataKey="completed" 
                    stroke={habit.color} 
                    strokeWidth={2}
                    dot={{ fill: habit.color, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Completions:</span>
                  <span className="font-medium">{stats.totalCompletions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">{format(new Date(habit.createdAt), 'MMM d, yyyy')}</span>
                </div>
                {habit.reminderEnabled && habit.reminderTime && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reminder:</span>
                    <span className="font-medium">⏰ {habit.reminderTime}</span>
                  </div>
                )}
                {habit.notes && (
                  <div>
                    <span className="text-muted-foreground">Notes:</span>
                    <p className="mt-1 p-3 rounded-lg bg-accent">{habit.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
