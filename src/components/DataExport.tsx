import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { useHabits } from '@/context/HabitContext'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card'
import { Button } from './ui/button'
import { ConfirmationModal } from './ui/ConfirmationModal'
import { Download, Upload, FileJson, FileSpreadsheet, Trash2, Database, Shield, Zap } from 'lucide-react'

export function DataExport() {
  const { categories, habits, logs, badges, deleteCategory, deleteHabit, refreshData, addCategory, addHabit } = useHabits()
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showImportConfirm, setShowImportConfirm] = useState(false)
  const [importData, setImportData] = useState<any>(null)

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

      // Validate the imported data structure
      if (!data.categories || !data.habits || !Array.isArray(data.categories) || !Array.isArray(data.habits)) {
        alert('Invalid backup file format. Please make sure you\'re importing a valid habit tracker backup.')
        return
      }

      setImportData(data)
      setShowImportConfirm(true)
    } catch (error) {
      alert('Error reading file. Please make sure it\'s a valid JSON backup file.')
      console.error(error)
    }
  }

  const performImport = async () => {
    if (!importData) return

    try {
      // First clear existing data if user wants to replace everything
      await clearAllData()

      // Create a mapping of old category IDs to new ones
      const categoryIdMap = new Map<string, string>()

      // Import categories first
      for (const category of importData.categories) {
        try {
          const newCategoryId = await addCategory({
            name: category.name,
            description: category.description || '',
            color: category.color,
            icon: category.icon || '📝'
          })
          if (newCategoryId) {
            categoryIdMap.set(category.id, newCategoryId)
          }
        } catch (error) {
          console.error('Error importing category:', category.name, error)
        }
      }

      // Import habits with updated category IDs
      for (const habit of importData.habits) {
        try {
          const newCategoryId = categoryIdMap.get(habit.categoryId)
          if (newCategoryId) {
            await addHabit({
              name: habit.name,
              description: habit.description || '',
              icon: habit.icon,
              color: habit.color,
              categoryId: newCategoryId,
              frequency: habit.frequency || 'daily',
              reminderEnabled: habit.reminderEnabled || false,
              reminderTime: habit.reminderTime || ''
            })
          }
        } catch (error) {
          console.error('Error importing habit:', habit.name, error)
        }
      }

      // Refresh data to update UI
      await refreshData()

      alert(`Import completed successfully! Imported ${importData.categories.length} categories and ${importData.habits.length} habits.`)
    } catch (error) {
      console.error('Error during import:', error)
      alert('Error occurred during import. Some data may not have been imported correctly.')
    }
  }

  const clearAllData = async () => {
    try {
      // Delete all habits first (which will also delete their logs)
      for (const habit of habits) {
        await deleteHabit(habit.id)
      }
      
      // Delete all categories
      for (const category of categories) {
        await deleteCategory(category.id)
      }
      
      // Refresh data to update UI
      await refreshData()
      
      console.log('✅ All habit data cleared successfully')
    } catch (error) {
      console.error('❌ Error clearing data:', error)
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
              onClick={() => setShowClearConfirm(true)}
              className="gap-2 bg-red-600 hover:bg-red-700 text-white shadow-xl border-2 border-red-400 relative z-10"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && createPortal(
        <ConfirmationModal
          isOpen={showClearConfirm}
          onClose={() => setShowClearConfirm(false)}
          onConfirm={() => {
            setShowClearConfirm(false)
            clearAllData()
          }}
          title="Clear All Data"
          message={`⚠️ This will permanently delete ALL your habit data including:

• ${categories.length} categories
• ${habits.length} habits  
• ${logs.length} habit logs
• ${badges.length} badges

This action cannot be undone! Are you absolutely sure?`}
          confirmText="Delete Everything"
          cancelText="Cancel"
          type="danger"
          icon={<Trash2 className="w-6 h-6" />}
        />,
        document.body
      )}

      {/* Import Confirmation Modal */}
      {showImportConfirm && importData && createPortal(
        <ConfirmationModal
          isOpen={showImportConfirm}
          onClose={() => {
            setShowImportConfirm(false)
            setImportData(null)
          }}
          onConfirm={() => {
            setShowImportConfirm(false)
            performImport()
          }}
          title="Import Backup Data"
          message={`📥 This will replace ALL your current data with the backup file containing:

• ${importData.categories?.length || 0} categories
• ${importData.habits?.length || 0} habits
• ${importData.logs?.length || 0} habit logs (logs will not be imported)
• Export date: ${importData.exportDate ? new Date(importData.exportDate).toLocaleDateString() : 'Unknown'}

⚠️ Your current data will be permanently deleted and replaced. This cannot be undone!

Continue with import?`}
          confirmText="Import Data"
          cancelText="Cancel"
          type="warning"
          icon={<Upload className="w-6 h-6" />}
        />,
        document.body
      )}
    </div>
  )
}
