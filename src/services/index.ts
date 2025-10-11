// Export all services
export { default as categoryService } from './categoryService';
export { default as habitService } from './habitService';
export { default as logService } from './logService';
export { default as analyticsService } from './analyticsService';
export { default as api, apiRequest } from './api';

// Export types
export type { Category, CreateCategoryData, UpdateCategoryData } from './categoryService';
export type { Habit, CreateHabitData, UpdateHabitData, HabitTemplate } from './habitService';
export type { Log, CreateLogData, UpdateLogData, CompletionStat, StreakInfo } from './logService';
export type { 
  DashboardAnalytics, 
  HabitAnalytics, 
  CategoryAnalytics, 
  StreakAnalytics, 
  MoodAnalytics 
} from './analyticsService';
export type { ApiResponse } from './api';
