import { useState, useEffect } from 'react'
import { useAuth } from '@/context/FirebaseAuthContext'
import { useHabits } from '@/context/HabitContext'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { 
  User, 
  Mail, 
  Calendar, 
  Flame, 
  Target, 
  Lock, 
  Shield,
  Download,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  Settings,
  Bell,
  Palette,
  Trash2,
  Award,
  TrendingUp,
  Clock
} from 'lucide-react'

export function ProfileView() {
  const { currentUser, updateUserProfile } = useAuth()
  const { habits, logs, streaks } = useHabits()
  
  // State for different sections
  const [activeSection, setActiveSection] = useState<'overview' | 'security' | 'preferences' | 'data'>('overview')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || ''
  })
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Update form when user data changes
  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.displayName || '',
        email: currentUser.email || ''
      })
    }
  }, [currentUser])

  const totalCompletions = logs?.filter(log => log.completed).length || 0
  const currentStreak = Math.max(...Object.values(streaks || {}), 0)
  
  // Calculate additional stats
  const completionRate = habits?.length > 0 ? Math.round((totalCompletions / (habits.length * 30)) * 100) : 0
  
  const joinDate = currentUser?.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : new Date().toLocaleDateString()

  // Add error boundary
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Loading currentUser profile...</p>
      </div>
    )
  }

  // Handler functions
  const handleProfileUpdate = async () => {
    setIsLoading(true)
    setMessage({ type: '', text: '' })
    
    try {
      // Update Firebase profile with the full name
      await updateUserProfile(profileForm.name)
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setIsEditingProfile(false)
    } catch (error) {
      console.error('Profile update error:', error)
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }
    
    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' })
      return
    }

    setIsLoading(true)
    setMessage({ type: '', text: '' })
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' })
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setIsChangingPassword(false)
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to change password' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = () => {
    const data = {
      currentUser: currentUser,
      habits: habits,
      logs: logs,
      streaks: streaks,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `elevate-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const renderTabButton = (section: typeof activeSection, icon: any, label: string) => (
    <button
      onClick={() => setActiveSection(section)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        activeSection === section
          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )

  return (
    <div className="space-y-3 md:space-y-6 w-full">
      {/* Profile Header - Similar to other pages */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 to-violet-600 p-4 md:p-8 text-white">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            {/* Profile Avatar */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
              <span className="text-white font-bold text-xl md:text-2xl">
                {currentUser?.displayName?.charAt(0)?.toUpperCase() || currentUser?.email?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {currentUser?.displayName || 'User Profile'}
              </h1>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{currentUser?.email || 'No email'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Member since {joinDate}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4 md:gap-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">{currentStreak}</div>
                <div className="text-xs md:text-sm text-white/70">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">{habits?.length || 0}</div>
                <div className="text-xs md:text-sm text-white/70">Habits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">{completionRate}%</div>
                <div className="text-xs md:text-sm text-white/70">Success</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Navigation Tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {renderTabButton('overview', <Target className="w-4 h-4" />, 'Overview')}
            {renderTabButton('security', <Shield className="w-4 h-4" />, 'Security')}
            {renderTabButton('preferences', <Settings className="w-4 h-4" />, 'Preferences')}
            {renderTabButton('data', <Download className="w-4 h-4" />, 'Data')}
          </div>
        </CardContent>
      </Card>

      {/* Message Display */}
      {message.text && (
        <Card className={message.type === 'success' ? 'border-green-500' : 'border-red-500'}>
          <CardContent className="p-4">
            <p className="text-sm">{message.text}</p>
          </CardContent>
        </Card>
      )}

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="space-y-4 md:space-y-6">
          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20">
                  <Flame className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Streak</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{currentStreak}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">days</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Habits</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{habits?.length || 0}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">habits</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Completions</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalCompletions}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">completed</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{completionRate}%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">success</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="flex items-center gap-2"
                >
                  {isEditingProfile ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  {isEditingProfile ? 'Cancel' : 'Edit'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditingProfile ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Name</label>
                    <Input
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder="Enter your name"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email</label>
                    <Input
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      placeholder="Enter your email"
                      type="email"
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={handleProfileUpdate}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <User className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {currentUser?.displayName || 'Not set'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{currentUser?.email || 'Not set'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{joinDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Last Active</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Today</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Section */}
      {activeSection === 'security' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Change Password
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsChangingPassword(!isChangingPassword)}
                  className="flex items-center gap-2"
                >
                  {isChangingPassword ? <X className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  {isChangingPassword ? 'Cancel' : 'Change Password'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isChangingPassword ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Current Password</label>
                    <div className="relative">
                      <Input
                        type={showPasswords.current ? 'text' : 'password'}
                        placeholder="Enter current password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">New Password</label>
                    <div className="relative">
                      <Input
                        type={showPasswords.new ? 'text' : 'password'}
                        placeholder="Enter new password (min 6 characters)"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Confirm New Password</label>
                    <div className="relative">
                      <Input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handlePasswordChange} 
                    disabled={isLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                    className="w-full flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    {isLoading ? 'Changing Password...' : 'Change Password'}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Keep your account secure by regularly updating your password.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Last password change: Never
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Preferences Section */}
      {activeSection === 'preferences' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Email Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive habit reminders via email</p>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Push Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Browser notifications for habit reminders</p>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Theme</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred theme</p>
                  </div>
                  <Button variant="outline" size="sm">System</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Section */}
      {activeSection === 'data' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Your Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <Download className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Download Your Data</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                        Export all your habits, logs, streaks, and profile information as a JSON file. 
                        This includes your complete habit tracking history.
                      </p>
                      <Button 
                        onClick={handleExportData} 
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        <Download className="w-4 h-4" />
                        Export All Data
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Profile Information</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>{habits?.length || 0} Habits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>{totalCompletions} Completions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4" />
                    <span>Streak Data</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <Trash2 className="w-5 h-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <div className="flex items-start gap-3">
                    <Trash2 className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-900 dark:text-red-100 mb-1">Delete Account</h4>
                      <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <Button 
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
