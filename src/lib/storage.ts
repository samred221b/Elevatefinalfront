import { Category, Habit, HabitLog, UserBadge, AppSettings } from '@/types'

// Use stable global keys to ensure data persists across refresh and sessions
const getStorageKeys = () => ({
  CATEGORIES: 'habit-tracker-categories',
  HABITS: 'habit-tracker-habits',
  LOGS: 'habit-tracker-logs',
  BADGES: 'habit-tracker-badges',
  SETTINGS: 'habit-tracker-settings',
})

export const storage = {
  // Categories
  getCategories(): Category[] {
    const keys = getStorageKeys()
    // Migration: load any previously saved per-user keys into global key
    let data = localStorage.getItem(keys.CATEGORIES)
    if (!data) {
      // Look for any keys that start with habit-tracker-*-categories
      const possible = Object.keys(localStorage).find(k => /habit-tracker-.*categories/.test(k))
      if (possible) {
        const legacy = localStorage.getItem(possible)!
        localStorage.setItem(keys.CATEGORIES, legacy)
        data = legacy
      }
    }
    return data ? JSON.parse(data) : []
  },
  
  saveCategories(categories: Category[]): void {
    const keys = getStorageKeys()
    localStorage.setItem(keys.CATEGORIES, JSON.stringify(categories))
  },
  
  // Habits
  getHabits(): Habit[] {
    const keys = getStorageKeys()
    let data = localStorage.getItem(keys.HABITS)
    if (!data) {
      const possible = Object.keys(localStorage).find(k => /habit-tracker-.*habits/.test(k))
      if (possible) {
        const legacy = localStorage.getItem(possible)!
        localStorage.setItem(keys.HABITS, legacy)
        data = legacy
      }
    }
    return data ? JSON.parse(data) : []
  },
  
  saveHabits(habits: Habit[]): void {
    const keys = getStorageKeys()
    localStorage.setItem(keys.HABITS, JSON.stringify(habits))
  },
  
  // Logs
  getLogs(): HabitLog[] {
    const keys = getStorageKeys()
    let data = localStorage.getItem(keys.LOGS)
    if (!data) {
      const possible = Object.keys(localStorage).find(k => /habit-tracker-.*logs/.test(k))
      if (possible) {
        const legacy = localStorage.getItem(possible)!
        localStorage.setItem(keys.LOGS, legacy)
        data = legacy
      }
    }
    return data ? JSON.parse(data) : []
  },
  
  saveLogs(logs: HabitLog[]): void {
    const keys = getStorageKeys()
    localStorage.setItem(keys.LOGS, JSON.stringify(logs))
  },
  
  // Badges
  getBadges(): UserBadge[] {
    const keys = getStorageKeys()
    let data = localStorage.getItem(keys.BADGES)
    if (!data) {
      const possible = Object.keys(localStorage).find(k => /habit-tracker-.*badges/.test(k))
      if (possible) {
        const legacy = localStorage.getItem(possible)!
        localStorage.setItem(keys.BADGES, legacy)
        data = legacy
      }
    }
    return data ? JSON.parse(data) : []
  },
  
  saveBadges(badges: UserBadge[]): void {
    const keys = getStorageKeys()
    localStorage.setItem(keys.BADGES, JSON.stringify(badges))
  },
  
  // Settings
  getSettings(): AppSettings {
    const keys = getStorageKeys()
    let data = localStorage.getItem(keys.SETTINGS)
    if (!data) {
      const possible = Object.keys(localStorage).find(k => /habit-tracker-.*settings/.test(k))
      if (possible) {
        const legacy = localStorage.getItem(possible)!
        localStorage.setItem(keys.SETTINGS, legacy)
        data = legacy
      }
    }
    return data ? JSON.parse(data) : {
      theme: 'system',
      accentColor: '#3b82f6',
      fontSize: 'medium',
      notificationSound: true,
      weekStartsOn: 0,
      defaultView: 'grid',
    }
  },
  
  saveSettings(settings: AppSettings): void {
    const keys = getStorageKeys()
    localStorage.setItem(keys.SETTINGS, JSON.stringify(settings))
  },
}
