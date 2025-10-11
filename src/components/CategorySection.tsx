import { useState } from 'react'
import { Category, Habit } from '@/types'
import { useHabits } from '@/context/HabitContext'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import { HabitCard } from './HabitCard'
import { Plus, Edit2, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { ConfirmationModal } from './ui/ConfirmationModal'

interface CategorySectionProps {
  category: Category
  onEditCategory: (category: Category) => void
  onDeleteCategory: (category: Category) => void
  onAddHabit: (categoryId: string) => void
  onEditHabit: (habit: Habit) => void
}

export function CategorySection({ 
  category, 
  onEditCategory,
  onDeleteCategory,
  onAddHabit, 
  onEditHabit 
}: CategorySectionProps) {
  const { getHabitsByCategory, logs } = useHabits()
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const habits = getHabitsByCategory(category.id)
  const completedToday = habits.filter(habit => {
    const today = new Date().toISOString().split('T')[0]
    const todayLog = logs.find(log => log.habitId === habit.id && log.date === today)
    return todayLog?.completed
  }).length

  const completionRate = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0

  return (
    <>
      <Card className="border border-purple-200/50 dark:border-purple-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group">
        <CardHeader 
          className="pb-3 sm:pb-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            {/* Category Info Row */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="flex items-center gap-1 sm:gap-2">
                <div 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <span className="text-lg sm:text-xl">{category.icon}</span>
                </div>
                <CardTitle className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                  {category.name}
                </CardTitle>
              </div>
            </div>

            {/* Progress indicator - Stacked on mobile, inline on desktop */}
            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-1">
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {completedToday}/{habits.length}
                </div>
                <div className="w-12 sm:w-8 md:w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <span className="text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400">
                  {completionRate}%
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onAddHabit(category.id)
                }}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-slate-600 hover:text-teal-500 dark:text-slate-400 dark:hover:text-teal-400"
                title="Add Habit"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onEditCategory(category)
                }}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Edit Category"
              >
                <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowDeleteConfirm(true)
                  }}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setIsCollapsed(!isCollapsed)
              }}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ml-1 sm:ml-2"
              title={isCollapsed ? "Expand" : "Collapse"}
            >
              {isCollapsed ? (
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
            </Button>
          </div>
        </CardHeader>

        {!isCollapsed && (
          <CardContent className="pt-0">
            {habits.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400">
                <p className="text-sm sm:text-base">No habits in this category yet.</p>
                <p className="text-xs sm:text-sm mt-1">Click the + button to add your first habit!</p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {habits.map((habit) => (
                  <HabitCard 
                    key={habit.id} 
                    habit={habit} 
                    onEdit={onEditHabit}
                  />
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => onDeleteCategory(category)}
        title="Delete Category"
        message={
          habits.length > 0
            ? `Are you sure you want to delete "${category.name}"? This will also delete all ${habits.length} habits in this category. This action cannot be undone.`
            : `Are you sure you want to delete "${category.name}"? This action cannot be undone.`
        }
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        icon={<Trash2 className="w-6 h-6" />}
      />
    </>
  )
}
