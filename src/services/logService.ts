import { apiRequest, ApiResponse } from './api';

// Types
export interface Log {
  _id: string;
  habit: {
    _id: string;
    name: string;
    icon: string;
    color: string;
    category: string;
  };
  user: string;
  date: Date;
  completed: boolean;
  value?: number;
  unit?: string;
  notes?: string;
  mood?: 'very-bad' | 'bad' | 'neutral' | 'good' | 'excellent';
  difficulty?: 'very-easy' | 'easy' | 'medium' | 'hard' | 'very-hard';
  completedAt?: Date;
  streak: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLogData {
  habit: string;
  date: string; // ISO date string
  completed: boolean;
  value?: number;
  unit?: string;
  notes?: string;
  mood?: Log['mood'];
  difficulty?: Log['difficulty'];
}

export interface UpdateLogData {
  completed?: boolean;
  value?: number;
  unit?: string;
  notes?: string;
  mood?: Log['mood'];
  difficulty?: Log['difficulty'];
}

export interface BulkLogData {
  logs: CreateLogData[];
}

export interface CompletionStat {
  date: string;
  total: number;
  completed: number;
  percentage: number;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: Date;
}

// Log Service
export const logService = {
  // Get logs with pagination
  getLogs: async (params?: {
    habit?: string;
    startDate?: string;
    endDate?: string;
    completed?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Log[]>> => {
    const queryParams = new URLSearchParams();
    if (params?.habit) queryParams.append('habit', params.habit);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.completed !== undefined) queryParams.append('completed', params.completed.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString();
    return apiRequest.get<Log[]>(`/logs${query ? `?${query}` : ''}`);
  },

  // Get single log
  getLog: async (id: string): Promise<ApiResponse<Log>> => {
    return apiRequest.get<Log>(`/logs/${id}`);
  },

  // Create or update log
  createOrUpdateLog: async (data: CreateLogData): Promise<ApiResponse<Log>> => {
    return apiRequest.post<Log>('/logs', data);
  },

  // Update log
  updateLog: async (id: string, data: UpdateLogData): Promise<ApiResponse<Log>> => {
    return apiRequest.put<Log>(`/logs/${id}`, data);
  },

  // Delete log
  deleteLog: async (id: string): Promise<ApiResponse> => {
    return apiRequest.delete(`/logs/${id}`);
  },

  // Get logs for date range
  getLogsForDateRange: async (startDate: string, endDate: string, habitId?: string): Promise<ApiResponse<Log[]>> => {
    const query = habitId ? `?habit=${habitId}` : '';
    return apiRequest.get<Log[]>(`/logs/range/${startDate}/${endDate}${query}`);
  },

  // Get completion statistics
  getCompletionStats: async (days: number = 30): Promise<ApiResponse<CompletionStat[]>> => {
    return apiRequest.get<CompletionStat[]>(`/logs/stats/completion?days=${days}`);
  },

  // Get streak information for habit
  getStreakInfo: async (habitId: string): Promise<ApiResponse<StreakInfo>> => {
    return apiRequest.get<StreakInfo>(`/logs/stats/streak/${habitId}`);
  },

  // Bulk create/update logs
  bulkCreateOrUpdateLogs: async (data: BulkLogData): Promise<ApiResponse<{
    action: 'created' | 'updated';
    log: Log;
  }[]>> => {
    return apiRequest.post('/logs/bulk', data);
  },

  // Helper: Create log for today
  logHabitToday: async (habitId: string, completed: boolean, value?: number, notes?: string): Promise<ApiResponse<Log>> => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    return logService.createOrUpdateLog({
      habit: habitId,
      date: today,
      completed,
      value,
      notes,
    });
  },

  // Helper: Get logs for current week
  getWeekLogs: async (habitId?: string): Promise<ApiResponse<Log[]>> => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday

    return logService.getLogsForDateRange(
      startOfWeek.toISOString().split('T')[0],
      endOfWeek.toISOString().split('T')[0],
      habitId
    );
  },

  // Helper: Get logs for current month
  getMonthLogs: async (habitId?: string): Promise<ApiResponse<Log[]>> => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return logService.getLogsForDateRange(
      startOfMonth.toISOString().split('T')[0],
      endOfMonth.toISOString().split('T')[0],
      habitId
    );
  },
};

export default logService;
