import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function getToday(): string {
  return formatDate(new Date())
}

export function getDaysInWeek(date: Date): Date[] {
  const day = date.getDay()
  const diff = date.getDate() - day
  const sunday = new Date(date.setDate(diff))
  
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday)
    d.setDate(sunday.getDate() + i)
    return d
  })
}

export function getWeekDates(startDate: Date): string[] {
  return getDaysInWeek(startDate).map(formatDate)
}

export function isToday(dateString: string): boolean {
  return dateString === getToday()
}

export function parseTime(timeString: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeString.split(':').map(Number)
  return { hours, minutes }
}
