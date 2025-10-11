import { apiRequest, ApiResponse } from './api';

// Types
export interface DashboardAnalytics {
  overview: {
    totalHabits: number;
    totalCategories: number;
    totalCompletions: number;
    avgCompletionRate: number;
    consistencyScore: number;
    activeDays: number;
    period: number;
  };
  completionTrend: {
    date: string;
    total: number;
    completed: number;
    percentage: number;
  }[];
  topHabits: {
    _id: string;
    name: string;
    icon: string;
    color: string;
    completions: number;
  }[];
  categoryPerformance: {
    _id: string;
    name: string;
    color: string;
    icon: string;
    completions: number;
  }[];
}

export interface HabitAnalytics {
  dailyStats: {
    date: string;
    totalHabits: number;
    completedHabits: number;
    completionRate: number;
    totalValue: number;
  }[];
  weeklyPatterns: {
    day: string;
    completionRate: number;
  }[];
  habitStreaks: {
    habitId: string;
    name: string;
    icon: string;
    color: string;
    currentStreak: number;
    longestStreak: number;
  }[];
}

export interface CategoryAnalytics {
  categoryTrends: {
    categoryId: string;
    categoryName: string;
    categoryColor: string;
    avgCompletionRate: number;
    dailyStats: {
      date: string;
      totalLogs: number;
      completedLogs: number;
      completionRate: number;
    }[];
  }[];
  categoryDistribution: {
    _id: string;
    name: string;
    color: string;
    icon: string;
    habitCount: number;
    activeHabits: number;
  }[];
}

export interface StreakAnalytics {
  overview: {
    totalHabits: number;
    activeStreaks: number;
    avgStreak: number;
    longestOverallStreak: number;
  };
  streakData: {
    habit: {
      id: string;
      name: string;
      icon: string;
      color: string;
    };
    currentStreak: number;
    longestStreak: number;
    lastCompletedDate?: Date;
  }[];
}

export interface MoodAnalytics {
  moodDistribution: {
    _id: string;
    count: number;
  }[];
  moodTrends: {
    _id: string;
    moods: {
      mood: string;
      count: number;
    }[];
  }[];
  moodCompletion: {
    mood: string;
    totalLogs: number;
    completedLogs: number;
    completionRate: number;
  }[];
}

// Analytics Service
export const analyticsService = {
  // Get dashboard analytics
  getDashboardAnalytics: async (days: number = 30): Promise<ApiResponse<DashboardAnalytics>> => {
    return apiRequest.get<DashboardAnalytics>(`/analytics/dashboard?days=${days}`);
  },

  // Get habit performance analytics
  getHabitAnalytics: async (params?: {
    habitId?: string;
    days?: number;
  }): Promise<ApiResponse<HabitAnalytics>> => {
    const queryParams = new URLSearchParams();
    if (params?.habitId) queryParams.append('habitId', params.habitId);
    if (params?.days) queryParams.append('days', params.days.toString());
    
    const query = queryParams.toString();
    return apiRequest.get<HabitAnalytics>(`/analytics/habits${query ? `?${query}` : ''}`);
  },

  // Get category analytics
  getCategoryAnalytics: async (days: number = 30): Promise<ApiResponse<CategoryAnalytics>> => {
    return apiRequest.get<CategoryAnalytics>(`/analytics/categories?days=${days}`);
  },

  // Get streak analytics
  getStreakAnalytics: async (): Promise<ApiResponse<StreakAnalytics>> => {
    return apiRequest.get<StreakAnalytics>('/analytics/streaks');
  },

  // Get mood analytics
  getMoodAnalytics: async (days: number = 30): Promise<ApiResponse<MoodAnalytics>> => {
    return apiRequest.get<MoodAnalytics>(`/analytics/mood?days=${days}`);
  },
};

export default analyticsService;
