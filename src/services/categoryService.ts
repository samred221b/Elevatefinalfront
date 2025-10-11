import { apiRequest, ApiResponse } from './api';

// Types
export interface Category {
  _id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  user: string;
  isDefault: boolean;
  order: number;
  stats: {
    totalHabits: number;
    activeHabits: number;
    completionRate: number;
  };
  habits?: any[]; // Populated when needed
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  color: string;
  icon?: string;
  order?: number;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  order?: number;
}

export interface ReorderCategoryData {
  id: string;
  order: number;
}

// Category Service
export const categoryService = {
  // Get all categories
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    return apiRequest.get<Category[]>('/categories');
  },

  // Get single category
  getCategory: async (id: string): Promise<ApiResponse<Category>> => {
    return apiRequest.get<Category>(`/categories/${id}`);
  },

  // Create category
  createCategory: async (data: CreateCategoryData): Promise<ApiResponse<Category>> => {
    return apiRequest.post<Category>('/categories', data);
  },

  // Update category
  updateCategory: async (id: string, data: UpdateCategoryData): Promise<ApiResponse<Category>> => {
    return apiRequest.put<Category>(`/categories/${id}`, data);
  },

  // Delete category
  deleteCategory: async (id: string): Promise<ApiResponse> => {
    return apiRequest.delete(`/categories/${id}`);
  },

  // Reorder categories
  reorderCategories: async (categories: ReorderCategoryData[]): Promise<ApiResponse<Category[]>> => {
    return apiRequest.put<Category[]>('/categories/reorder', { categories });
  },

  // Get category statistics
  getCategoryStats: async (id: string): Promise<ApiResponse<{
    category: {
      id: string;
      name: string;
      color: string;
      icon: string;
      stats: Category['stats'];
    };
    habits: any[];
  }>> => {
    return apiRequest.get(`/categories/${id}/stats`);
  },
};

export default categoryService;
