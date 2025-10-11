import { useAuth } from '@/context/AuthContext'
import { useHabits } from '@/context/HabitContext'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { User, Mail, Calendar, Flame, Target } from 'lucide-react'

export function ProfileView() {
  const { user } = useAuth()
  const { habits, logs, streaks } = useHabits()

  const totalCompletions = logs.filter(log => log.completed).length
  const currentStreak = Math.max(...Object.values(streaks || {}), 0)

  return (
    <div className="space-y-6 w-full">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <User className="w-5 h-5" />
            My Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">{user?.name || 'User'}</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{user?.email || 'No email'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Member since {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Flame className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold">{currentStreak} days</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Target className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Habits</p>
              <p className="text-2xl font-bold">{habits.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <User className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Completions</p>
              <p className="text-2xl font-bold">{totalCompletions}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
