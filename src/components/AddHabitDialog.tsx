import React, { useState, useEffect } from 'react'
import { Habit } from '@/types'
import { useHabits } from '@/context/HabitContext'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select } from './ui/select'
import { Switch } from './ui/switch'

interface AddHabitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryId?: string
  editHabit?: Habit | null
}

const HABIT_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e'
]

const HABIT_ICONS = [
  '💧', '🏃', '📖', '✍️', '🧘', '💪', '🍎', '😴',
  '🎯', '📱', '💼', '🎨', '🎵', '🧠', '❤️', '🌟',
  '☕', '🚶', '🧹', '💻', '📝', '🎓', '🌱', '🔥'
]

export function AddHabitDialog({ open, onOpenChange, categoryId, editHabit }: AddHabitDialogProps) {
  const { categories, addHabit, updateHabit } = useHabits()
  const [name, setName] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId || '')
  const [color, setColor] = useState(HABIT_COLORS[0])
  const [icon, setIcon] = useState(HABIT_ICONS[0])
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [reminderEnabled, setReminderEnabled] = useState(false)
  const [reminderTime, setReminderTime] = useState('09:00')

  useEffect(() => {
    if (editHabit) {
      setName(editHabit.name)
      setSelectedCategoryId(editHabit.categoryId)
      setColor(editHabit.color)
      setIcon(editHabit.icon)
      setFrequency(editHabit.frequency)
      setReminderEnabled(editHabit.reminderEnabled)
      setReminderTime(editHabit.reminderTime || '09:00')
    } else {
      setName('')
      setSelectedCategoryId(categoryId || categories[0]?.id || '')
      setColor(HABIT_COLORS[0])
      setIcon(HABIT_ICONS[0])
      setFrequency('daily')
      setReminderEnabled(false)
      setReminderTime('09:00')
    }
  }, [editHabit, categoryId, categories, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || !selectedCategoryId) return

    const habitData = {
      name,
      categoryId: selectedCategoryId,
      color,
      icon,
      frequency,
      reminderEnabled,
      reminderTime: reminderEnabled ? reminderTime : undefined,
    }

    if (editHabit) {
      updateHabit(editHabit.id, habitData)
    } else {
      addHabit(habitData)
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose onClose={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle>
            {editHabit ? 'Edit Habit' : 'Add New Habit'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="habit-name">Habit Name</Label>
            <Input
              id="habit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Drink 8 glasses of water"
              className="mt-1"
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              id="category"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="mt-1"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label>Icon</Label>
            <div className="grid grid-cols-8 gap-2 mt-2">
              {HABIT_ICONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`text-2xl p-2 rounded hover:bg-accent transition-colors ${
                    icon === emoji ? 'bg-accent ring-2 ring-primary' : ''
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Color</Label>
            <div className="grid grid-cols-9 gap-2 mt-2">
              {HABIT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                    color === c ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <Select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly')}
              className="mt-1"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="reminder">Enable Reminder</Label>
              <p className="text-sm text-muted-foreground">Get notified at a specific time</p>
            </div>
            <Switch
              checked={reminderEnabled}
              onCheckedChange={setReminderEnabled}
            />
          </div>

          {reminderEnabled && (
            <div>
              <Label htmlFor="reminder-time">Reminder Time</Label>
              <Input
                id="reminder-time"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="mt-1"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editHabit ? 'Save Changes' : 'Add Habit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
