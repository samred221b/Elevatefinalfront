import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Habit } from '@/types'
import { useHabits } from '@/context/HabitContext'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Edit2, Trash2, Flame, Check, Clock } from 'lucide-react'
import { ConfirmationModal } from './ui/ConfirmationModal'
import { cn } from '@/lib/utils'
import { getToday } from '@/lib/utils'

interface HabitCardProps {
  habit: Habit
  onEdit: (habit: Habit) => void
}

export function HabitCard({ habit, onEdit }: HabitCardProps) {
  const { logs, toggleHabit, deleteHabit, getStreakForHabit } = useHabits()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const today = getToday()
  const todayLog = logs.find(log => log.habitId === habit.id && log.date === today)
  const isCompleted = todayLog?.completed || false
  const streak = getStreakForHabit(habit.id)

  const handleToggle = () => {
    toggleHabit(habit.id)
  }

  const handleDelete = () => {
    setShowDeleteConfirm(true)
  }

  return (
    <>
      <Card 
      className={cn(
        'border border-gray-200 dark:border-gray-800 hover:shadow-sm transition-shadow duration-200 relative',
        isCompleted && 'bg-gray-50 dark:bg-gray-800/50'
      )}
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Simple Completion Button */}
          <button
            onClick={handleToggle}
            className={cn(
              'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200',
              isCompleted 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
            )}
          >
            {isCompleted && <Check className="w-4 h-4" />}
          </button>
          
          {/* Habit Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{habit.icon}</span>
              <h3 className={cn(
                'font-medium text-gray-900 dark:text-white',
                isCompleted && 'line-through text-gray-500 dark:text-gray-400'
              )}>
                {habit.name}
              </h3>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="capitalize">{habit.frequency}</span>
              {streak.currentStreak > 0 && (
                <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                  <Flame className="w-3 h-3" />
                  <span>{streak.currentStreak} day streak</span>
                </div>
              )}
              {habit.reminderEnabled && habit.reminderTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{habit.reminderTime}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(habit)}
              className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-7 w-7 p-0 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Simple Progress Indicator */}
      {isCompleted && (
        <div 
          className="h-0.5 w-full"
          style={{ backgroundColor: habit.color }}
        />
      )}
      </Card>

      {/* Modal rendered as portal to document body */}
      {showDeleteConfirm && createPortal(
        <ConfirmationModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={async () => {
            try {
              await deleteHabit(habit.id);
              setShowDeleteConfirm(false);
            } catch (error) {
              console.error('Failed to delete habit:', error);
              // Keep modal open if deletion fails
            }
          }}
          title="Delete Habit"
          message={`Are you sure you want to delete "${habit.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          icon={<Trash2 className="w-6 h-6" />}
        />,
        document.body
      )}
    </>
  )
}
