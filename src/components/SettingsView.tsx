import { useHabits } from '@/context/HabitContext'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card'
import { Label } from './ui/label'
import { Select } from './ui/select'
import { Switch } from './ui/switch'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Moon, Sun, Monitor, Bell, Globe, Zap, Shield, Info, Download, RefreshCw } from 'lucide-react'

export function SettingsView() {
  const { settings, updateSettings, categories, habits, logs } = useHabits()

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme })
    applyTheme(theme)
  }

  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
    
    // Save to localStorage for persistence
    localStorage.setItem('theme', theme)
  }

  const resetToDefaults = () => {
    if (window.confirm('Reset all settings to default values?')) {
      updateSettings({
        theme: 'system',
        accentColor: '#3b82f6',
        fontSize: 'medium',
        notificationSound: true,
        weekStartsOn: 0,
        defaultView: 'grid',
      })
      applyTheme('system')
    }
  }

  const storageUsed = () => {
    const data = JSON.stringify({ categories, habits, logs })
    return (new Blob([data]).size / 1024).toFixed(2)
  }

  return (
    <div className="space-y-6 w-full">

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how the app looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="mb-3 block">Theme</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={settings.theme === 'light' ? 'default' : 'outline'}
                onClick={() => handleThemeChange('light')}
                className="flex items-center gap-2"
              >
                <Sun className="w-4 h-4" />
                Light
              </Button>
              <Button
                variant={settings.theme === 'dark' ? 'default' : 'outline'}
                onClick={() => handleThemeChange('dark')}
                className="flex items-center gap-2"
              >
                <Moon className="w-4 h-4" />
                Dark
              </Button>
              <Button
                variant={settings.theme === 'system' ? 'default' : 'outline'}
                onClick={() => handleThemeChange('system')}
                className="flex items-center gap-2"
              >
                <Monitor className="w-4 h-4" />
                System
              </Button>
            </div>
          </div>


          <div>
            <Label htmlFor="font-size">Font Size</Label>
            <Select
              id="font-size"
              value={settings.fontSize}
              onChange={(e) => updateSettings({ fontSize: e.target.value as any })}
              className="mt-2"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Notification Sound</Label>
              <p className="text-sm text-muted-foreground">Play sound with reminders</p>
            </div>
            <Switch
              checked={settings.notificationSound}
              onCheckedChange={(checked) => updateSettings({ notificationSound: checked })}
            />
          </div>

          <div>
            <Label htmlFor="week-start">Week Starts On</Label>
            <Select
              id="week-start"
              value={settings.weekStartsOn.toString()}
              onChange={(e) => updateSettings({ weekStartsOn: parseInt(e.target.value) as 0 | 1 })}
              className="mt-2"
            >
              <option value="0">Sunday</option>
              <option value="1">Monday</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications & Reminders
            </CardTitle>
            <CardDescription>Configure how and when you receive notifications</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive reminders for your habits</p>
            </div>
            <Switch
              checked={settings.notificationSound}
              onCheckedChange={(checked) => updateSettings({ notificationSound: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Sound Alerts</Label>
              <p className="text-sm text-muted-foreground">Play sound with notifications</p>
            </div>
            <Switch
              checked={settings.notificationSound}
              onCheckedChange={(checked) => updateSettings({ notificationSound: checked })}
            />
          </div>

          <div>
            <Label>Default Reminder Time</Label>
            <Input
              type="time"
              defaultValue="09:00"
              className="mt-2"
            />
          </div>

          <div>
            <Label>Notification Frequency</Label>
            <Select className="mt-2" defaultValue="daily">
              <option value="realtime">Real-time (as scheduled)</option>
              <option value="daily">Daily digest</option>
              <option value="weekly">Weekly summary</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Performance & Data
          </CardTitle>
          <CardDescription>Manage app performance and storage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 rounded-lg bg-accent/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{categories.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Categories</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">{habits.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Habits</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-500">{logs.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Log Entries</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-500">{storageUsed()} KB</p>
                <p className="text-xs text-muted-foreground mt-1">Storage Used</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-save</Label>
              <p className="text-sm text-muted-foreground">Automatically save changes</p>
            </div>
            <Switch checked={true} onCheckedChange={() => {}} disabled />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Offline Mode</Label>
              <p className="text-sm text-muted-foreground">Work without internet connection</p>
            </div>
            <Switch checked={true} onCheckedChange={() => {}} disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Language & Region
          </CardTitle>
          <CardDescription>Customize language and regional settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="language">Language</Label>
            <Select id="language" className="mt-2" defaultValue="en">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="date-format">Date Format</Label>
            <Select id="date-format" className="mt-2" defaultValue="mdy">
              <option value="mdy">MM/DD/YYYY (US)</option>
              <option value="dmy">DD/MM/YYYY (UK)</option>
              <option value="ymd">YYYY-MM-DD (ISO)</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="time-format">Time Format</Label>
            <Select id="time-format" className="mt-2" defaultValue="12">
              <option value="12">12-hour (AM/PM)</option>
              <option value="24">24-hour</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Select id="timezone" className="mt-2" defaultValue="auto">
              <option value="auto">Auto-detect</option>
              <option value="utc">UTC</option>
              <option value="est">Eastern Time (ET)</option>
              <option value="pst">Pacific Time (PT)</option>
              <option value="gmt">GMT</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy & Security
          </CardTitle>
          <CardDescription>Control your data and privacy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Analytics</Label>
              <p className="text-sm text-muted-foreground">Help improve the app with usage data</p>
            </div>
            <Switch checked={false} onCheckedChange={() => {}} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Crash Reports</Label>
              <p className="text-sm text-muted-foreground">Send error reports automatically</p>
            </div>
            <Switch checked={false} onCheckedChange={() => {}} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Data Encryption</Label>
              <p className="text-sm text-muted-foreground">Encrypt local storage (coming soon)</p>
            </div>
            <Switch checked={false} onCheckedChange={() => {}} disabled />
          </div>

          <div className="pt-4 border-t">
            <Button variant="outline" className="w-full gap-2">
              <Download className="w-4 h-4" />
              Download My Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            About & Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version:</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated:</span>
              <span className="font-medium">October 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Build:</span>
              <span className="font-medium">Production</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              Built with React, TypeScript, TailwindCSS, and Recharts
            </p>
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full">
                📖 View Documentation
              </Button>
              <Button variant="outline" className="w-full">
                💬 Contact Support
              </Button>
              <Button variant="outline" className="w-full">
                ⭐ Rate This App
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <RefreshCw className="w-5 h-5" />
            Reset & Restore
          </CardTitle>
          <CardDescription>Reset settings or restore defaults</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-orange-500/50 bg-orange-500/10">
            <div>
              <Label>Reset All Settings</Label>
              <p className="text-sm text-muted-foreground">Restore default settings (keeps your data)</p>
            </div>
            <Button
              variant="outline"
              onClick={resetToDefaults}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            💡 Tip: To clear all data including habits and logs, use the Data Management section
          </p>
        </CardContent>
      </Card>


    </div>
  )
}
