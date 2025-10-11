import { apiRequest, ApiResponse } from './api';

// Types
export interface Habit {
  _id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  category: {
    _id: string;
    name: string;
    color: string;
    icon: string;
  };
  user: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  difficulty: 'easy' | 'medium' | 'hard';
  target: {
    type: 'boolean' | 'number' | 'duration';
    value: number;
    unit: string;
  };
  reminder: {
    enabled: boolean;
    time?: string;
    days?: string[];
  };
  streak: {
    current: number;
    longest: number;
    lastCompletedDate?: Date;
  };
  stats: {
    totalCompletions: number;
    completionRate: number;
    averageValue: number;
    bestStreak: number;
  };
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHabitData {
  name: string;
  description?: string;
  icon?: string;
  color: string;
  category: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  difficulty?: 'easy' | 'medium' | 'hard';
  target?: {
    type: 'boolean' | 'number' | 'duration';
    value: number;
    unit: string;
  };
  reminder?: {
    enabled: boolean;
    time?: string;
    days?: string[];
  };
  order?: number;
}

export interface UpdateHabitData {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  category?: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  difficulty?: 'easy' | 'medium' | 'hard';
  target?: Partial<Habit['target']>;
  reminder?: Partial<Habit['reminder']>;
  isActive?: boolean;
  order?: number;
}

export interface ReorderHabitData {
  id: string;
  order: number;
}

export interface HabitTemplate {
  name: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  target?: {
    type: 'boolean' | 'number' | 'duration';
    value: number;
    unit: string;
  };
}

export interface HabitTemplates {
  [key: string]: HabitTemplate[];
}

// Habit Service
export const habitService = {
  // Get all habits
  getHabits: async (params?: {
    category?: string;
    active?: boolean;
    frequency?: string;
  }): Promise<ApiResponse<Habit[]>> => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());
    if (params?.frequency) queryParams.append('frequency', params.frequency);
    
    const query = queryParams.toString();
    return apiRequest.get<Habit[]>(`/habits${query ? `?${query}` : ''}`);
  },

  // Get single habit
  getHabit: async (id: string): Promise<ApiResponse<{
    habit: Habit;
    recentLogs: any[];
  }>> => {
    return apiRequest.get(`/habits/${id}`);
  },

  // Create habit
  createHabit: async (data: CreateHabitData): Promise<ApiResponse<Habit>> => {
    return apiRequest.post<Habit>('/habits', data);
  },

  // Update habit
  updateHabit: async (id: string, data: UpdateHabitData): Promise<ApiResponse<Habit>> => {
    return apiRequest.put<Habit>(`/habits/${id}`, data);
  },

  // Delete habit
  deleteHabit: async (id: string): Promise<ApiResponse> => {
    return apiRequest.delete(`/habits/${id}`);
  },

  // Get habit templates
  getTemplates: async (): Promise<ApiResponse<HabitTemplates>> => {
    return apiRequest.get<HabitTemplates>('/habits/templates/list');
  },

  // Create habits from template
  createFromTemplate: async (templateId: string, categoryId: string): Promise<ApiResponse<Habit[]>> => {
    return apiRequest.post<Habit[]>(`/habits/templates/${templateId}`, { categoryId });
  },

  // Reorder habits
  reorderHabits: async (habits: ReorderHabitData[]): Promise<ApiResponse<Habit[]>> => {
    return apiRequest.put<Habit[]>('/habits/reorder', { habits });
  },

  // Get habit statistics
  getHabitStats: async (id: string): Promise<ApiResponse<{
    habit: {
      id: string;
      name: string;
      icon: string;
      color: string;
      category: any;
      stats: Habit['stats'];
      streak: Habit['streak'];
    };
    streakInfo: any;
    completionStats: any[];
  }>> => {
    return apiRequest.get(`/habits/${id}/stats`);
  },
};

export default habitService;
