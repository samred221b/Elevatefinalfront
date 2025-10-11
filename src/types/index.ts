export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  order: number;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  color: string;
  icon: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  specificDays?: number[]; // 0-6 for Sunday-Saturday
  reminderTime?: string; // HH:mm format
  reminderEnabled: boolean;
  createdAt: string;
  order: number;
  goal?: number; // Target number of completions
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  dependsOn?: string[]; // IDs of habits that should be completed first
  notes?: string;
  archived?: boolean;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  timestamp: string;
  note?: string;
  notes?: string;
  mood?: 'great' | 'good' | 'okay' | 'bad';
  duration?: number; // in minutes
  value?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'streak' | 'category' | 'total';
  requirement: number;
  earnedAt?: string;
}

export interface UserBadge {
  badgeId: string;
  earnedAt: string;
  habitId?: string;
  categoryId?: string;
}

export type Theme = 'light' | 'dark' | 'system';

export interface AppSettings {
  theme: Theme;
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  notificationSound: boolean;
  weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
  defaultView: 'grid' | 'list' | 'calendar';
}

export interface StreakData {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: string;
}

export interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  habits: Array<{
    name: string;
    icon: string;
    frequency: 'daily' | 'weekly';
    difficulty?: 'easy' | 'medium' | 'hard';
  }>;
  icon: string;
  color: string;
}

export interface Quote {
  text: string;
  author: string;
}
