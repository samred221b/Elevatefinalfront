import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { useHabits } from '../context/HabitContext'
import { useToast } from '../context/ToastContext'
import { Dialog, DialogContent, DialogTitle, DialogClose } from './ui/dialog'
import { HABIT_TEMPLATES } from '../lib/templates'
import { HabitTemplate } from '../types/index'
import { Check, Sparkles, Users, Rocket } from 'lucide-react'

export function HabitTemplates() {
  const { addCategory, categories, refreshData } = useHabits()
  const { showSuccess, showError } = useToast()
  const [selectedTemplate, setSelectedTemplate] = useState<HabitTemplate | null>(null)
  const [showDialog, setShowDialog] = useState(false)

  const handleApplyTemplate = async (template: HabitTemplate) => {
    try {
      console.log('Applying template:', template.name)
      
      // Check if category already exists
      let categoryId = categories.find(c => c.name === template.category)?.id
      console.log('Existing category ID:', categoryId)

      // Create category if it doesn't exist
      if (!categoryId) {
        console.log('Creating new category:', template.category)
        categoryId = await addCategory({
          name: template.category,
          description: '',
          color: template.color,
          icon: template.icon,
        })
        console.log('Created category with ID:', categoryId)
      }

      // Use the backend template API to create all habits at once
      if (categoryId) {
        console.log(`Applying template ${template.id} to category ${categoryId}`)
        
        // Import the habit service
        const { habitService } = await import('../services')
        
        const response = await habitService.createFromTemplate(template.id, categoryId)
        
        if (response.success) {
          console.log('✅ Template applied successfully:', response.data?.length, 'habits created')
          
          // Show beautiful success notification
          const habitCount = response.data?.length || 0
          showSuccess(
            `🎉 Template Applied Successfully!`,
            `Added ${habitCount} habits from "${template.name}" template to your dashboard. Start building those amazing habits!`
          )
        } else {
          throw new Error(response.message || 'Failed to apply template')
        }
        
        // Refresh data to ensure everything is up to date
        await refreshData()
        console.log('Data refreshed')
      } else {
        console.error('No category ID available!')
        throw new Error('Could not create or find category')
      }

      setShowDialog(false)
      setSelectedTemplate(null)
    } catch (error: any) {
      console.error('Error applying template:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      
      let errorMessage = 'Unknown error occurred'
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      showError(
        'Failed to Apply Template',
        errorMessage
      )
    }
  }


  return (
    <div className="space-y-6">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Habit Templates
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              Quick-start with proven habit collections
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg self-start sm:self-auto">
          <Users className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-300">
            Trusted by thousands
          </span>
        </div>
      </div>

      {/* Simplified Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {HABIT_TEMPLATES.map((template) => (
          <Card 
            key={template.id}
            className="relative overflow-hidden group hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            onClick={() => {
              setSelectedTemplate(template)
              setShowDialog(true)
            }}
          >
            {/* Simple Header */}
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div 
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: `${template.color}20` }}
                >
                  <span className="text-2xl">{template.icon}</span>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    {template.name}
                  </CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {template.habits.length} habits included
                  </p>
                </div>
              </div>
            </CardHeader>
            
            {/* Simple Content */}
            <CardContent className="pt-0">
              {/* Quick Preview */}
              <div className="space-y-2 mb-4">
                {template.habits.slice(0, 3).map((habit, habitIndex) => (
                  <div key={habitIndex} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span>{habit.icon}</span>
                    <span className="truncate">{habit.name}</span>
                  </div>
                ))}
                {template.habits.length > 3 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    +{template.habits.length - 3} more habits
                  </div>
                )}
              </div>
              
              {/* Simple Action Button */}
              <Button 
                className="w-full gap-2 font-medium text-white"
                style={{ backgroundColor: template.color }}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedTemplate(template)
                  setShowDialog(true)
                }}
              >
                <Rocket className="w-4 h-4" />
                Add All Habits
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Simple Template Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md dark:bg-gray-900 dark:border-gray-800">
          <DialogClose onClose={() => setShowDialog(false)} />
          {selectedTemplate && (
            <div className="space-y-4">
              {/* Simple Header */}
              <div className="text-center">
                <div className="text-6xl mb-3">{selectedTemplate.icon}</div>
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedTemplate.name}
                </DialogTitle>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {selectedTemplate.habits.length} habits included
                </p>
              </div>

              {/* Simple Habit List */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedTemplate.habits.map((habit, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <span className="text-lg">{habit.icon}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {habit.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Simple Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleApplyTemplate(selectedTemplate)}
                  className="flex-1 gap-2 font-semibold text-white"
                  style={{ backgroundColor: selectedTemplate.color }}
                >
                  <Check className="w-4 h-4" />
                  Add All
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
