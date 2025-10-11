import React, { useState, useEffect } from 'react'
import { Category } from '@/types'
import { useHabits } from '@/context/HabitContext'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface AddCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editCategory?: Category | null
}

const CATEGORY_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e'
]

const CATEGORY_ICONS = [
  '💪', '🧘', '📚', '💼', '🎯', '🌟', '❤️', '🏃',
  '🍎', '💧', '🧠', '✍️', '🎨', '🎵', '🌱', '🔥',
  '⭐', '🌈', '🎓', '💡', '🏆', '🎪', '🌺', '🦋'
]

export function AddCategoryDialog({ open, onOpenChange, editCategory }: AddCategoryDialogProps) {
  const { addCategory, updateCategory } = useHabits()
  const [name, setName] = useState('')
  const [color, setColor] = useState(CATEGORY_COLORS[0])
  const [icon, setIcon] = useState(CATEGORY_ICONS[0])

  useEffect(() => {
    if (editCategory) {
      setName(editCategory.name)
      setColor(editCategory.color)
      setIcon(editCategory.icon)
    } else {
      setName('')
      setColor(CATEGORY_COLORS[0])
      setIcon(CATEGORY_ICONS[0])
    }
  }, [editCategory, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) return

    if (editCategory) {
      updateCategory(editCategory.id, { name, color, icon })
    } else {
      addCategory({ name, color, icon })
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose onClose={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle>
            {editCategory ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Routine, Work Goals"
              className="mt-1"
              autoFocus
            />
          </div>

          <div>
            <Label>Icon</Label>
            <div className="grid grid-cols-8 gap-2 mt-2">
              {CATEGORY_ICONS.map((emoji) => (
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
              {CATEGORY_COLORS.map((c) => (
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

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editCategory ? 'Save Changes' : 'Add Category'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
