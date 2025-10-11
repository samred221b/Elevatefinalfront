import React from 'react'
import { useHabits } from '@/context/HabitContext'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card'
import { Button } from './ui/button'
import { Download, Upload, FileJson, FileSpreadsheet, Trash2, Database, Shield, Zap } from 'lucide-react'

export function DataExport() {
  const { categories, habits, logs, badges } = useHabits()
  // Future feature: file import functionality
  // const [importFile, setImportFile] = useState<File | null>(null)

  const exportToJSON = () => {
    const data = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      categories,
      habits,
      logs,
      badges,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportToCSV = () => {
    // Export logs as CSV
    const headers = ['Date', 'Habit', 'Category', 'Completed', 'Note', 'Mood']
    const rows = logs.map(log => {
      const habit = habits.find(h => h.id === log.habitId)
      const category = categories.find(c => c.id === habit?.categoryId)
      
      return [
        log.date,
        habit?.name || 'Unknown',
        category?.name || 'Unknown',
        log.completed ? 'Yes' : 'No',
        log.note || '',
        log.mood || '',
      ]
    })

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `habit-tracker-logs-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      if (window.confirm('This will replace all your current data. Are you sure?')) {
        localStorage.setItem('habit-tracker-categories', JSON.stringify(data.categories || []))
        localStorage.setItem('habit-tracker-habits', JSON.stringify(data.habits || []))
        localStorage.setItem('habit-tracker-logs', JSON.stringify(data.logs || []))
        localStorage.setItem('habit-tracker-badges', JSON.stringify(data.badges || []))
        
        window.location.reload()
      }
    } catch (error) {
      alert('Error importing file. Please make sure it\'s a valid backup file.')
      console.error(error)
    }
  }

  const clearAllData = () => {
    if (window.confirm('⚠️ This will delete ALL your data permanently. This cannot be undone. Are you absolutely sure?')) {
      if (window.confirm('Last chance! This will erase everything. Continue?')) {
        localStorage.clear()
        window.location.reload()
      }
    }
  }

  const stats = {
    categories: categories.length,
    habits: habits.length,
    logs: logs.length,
    badges: badges.length,
  }

  return (
    <div className="space-y-8">

      {/* Colorful Data Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <p className="text-4xl font-black mb-2">{stats.categories}</p>
            <p className="text-sm font-semibold opacity-90">Categories</p>
          </div>
          <div className="absolute bottom-2 right-2 opacity-20">
            <Database className="w-12 h-12" />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 p-6 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <p className="text-4xl font-black mb-2">{stats.habits}</p>
            <p className="text-sm font-semibold opacity-90">Habits</p>
          </div>
          <div className="absolute bottom-2 right-2 opacity-20">
            <Zap className="w-12 h-12" />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-6 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <p className="text-4xl font-black mb-2">{stats.logs}</p>
            <p className="text-sm font-semibold opacity-90">Log Entries</p>
          </div>
          <div className="absolute bottom-2 right-2 opacity-20">
            <FileJson className="w-12 h-12" />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 p-6 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <p className="text-4xl font-black mb-2">{stats.badges}</p>
            <p className="text-sm font-semibold opacity-90">Badges Earned</p>
          </div>
          <div className="absolute bottom-2 right-2 opacity-20">
            <Shield className="w-12 h-12" />
          </div>
        </div>
      </div>

      {/* Export Options */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Download className="w-6 h-6 text-blue-600" />
            Export Data
          </CardTitle>
          <CardDescription>Download your habit data for backup or analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative overflow-hidden group flex items-center justify-between p-5 rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 rounded-xl bg-blue-500 text-white shadow-lg group-hover:scale-110 transition-transform">
                <FileJson className="w-8 h-8" />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Export as JSON</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Complete backup with all data</p>
              </div>
            </div>
            <Button onClick={exportToJSON} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg relative z-10">
              <Download className="w-4 h-4" />
              Export JSON
            </Button>
          </div>

          <div className="relative overflow-hidden group flex items-center justify-between p-5 rounded-2xl border-2 border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 rounded-xl bg-green-500 text-white shadow-lg group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-8 h-8" />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Export as CSV</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Habit logs for spreadsheet analysis</p>
              </div>
            </div>
            <Button onClick={exportToCSV} className="gap-2 bg-green-600 hover:bg-green-700 text-white shadow-lg relative z-10">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Import Data */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-orange-50 dark:from-gray-900 dark:to-orange-900/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Upload className="w-6 h-6 text-orange-600" />
            Import Data
          </CardTitle>
          <CardDescription>Restore from a previous backup (replaces current data)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-hidden group flex items-center justify-between p-5 rounded-2xl border-2 border-orange-300 dark:border-orange-700 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 rounded-xl bg-orange-500 text-white shadow-lg group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Import from JSON</p>
                <p className="text-sm text-orange-700 dark:text-orange-400 font-semibold">⚠️ This will replace all current data</p>
              </div>
            </div>
            <div className="relative z-10">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                id="import-file"
              />
              <Button
                onClick={() => document.getElementById('import-file')?.click()}
                className="gap-2 bg-orange-600 hover:bg-orange-700 text-white shadow-lg border-2 border-orange-400"
              >
                <Upload className="w-4 h-4" />
                Choose File
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/50 dark:to-rose-950/50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
            <Trash2 className="w-6 h-6" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-red-700 dark:text-red-300">Irreversible actions - proceed with extreme caution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-hidden group flex items-center justify-between p-5 rounded-2xl border-2 border-red-400 dark:border-red-700 bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/40 dark:to-rose-900/40 hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 rounded-xl bg-red-600 text-white shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all">
                <Trash2 className="w-8 h-8" />
              </div>
              <div>
                <p className="font-black text-gray-900 dark:text-white">Clear All Data</p>
                <p className="text-sm text-red-700 dark:text-red-300 font-bold">⚠️ Permanently delete everything - cannot be undone!</p>
              </div>
            </div>
            <Button
              onClick={clearAllData}
              className="gap-2 bg-red-600 hover:bg-red-700 text-white shadow-xl border-2 border-red-400 relative z-10"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
