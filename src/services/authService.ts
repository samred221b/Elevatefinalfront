import { apiRequest, ApiResponse } from './api';

export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    notifications?: boolean;
    timezone?: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  // Login user
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      console.log('🔐 Attempting login for:', credentials.email);
      console.log('🌐 API URL:', `${import.meta.env.VITE_API_URL}/auth/login`);
      
      const response = await apiRequest.post<AuthResponse>('/auth/login', credentials);
      
      console.log('📡 Login response:', response);
      
      if (response.success && response.data) {
        // Store token and user data
        localStorage.setItem('elevate_token', response.data.token);
        localStorage.setItem('elevate_user', JSON.stringify(response.data.user));
        console.log('💾 Stored user data and token');
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ Login service error:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error config:', error.config);
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  },

  // Register user
  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      console.log('📝 Registering user:', userData.email);
      
      const response = await apiRequest.post<AuthResponse>('/auth/register', userData);
      
      if (response.success && response.data) {
        // Store token and user data
        localStorage.setItem('elevate_token', response.data.token);
        localStorage.setItem('elevate_user', JSON.stringify(response.data.user));
        console.log('✅ Registration successful, data stored');
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ Registration failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  },

  // Get current user
  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    try {
      return await apiRequest.get<{ user: User }>('/auth/me');
    } catch (error: any) {
      console.error('Get current user error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get user data');
    }
  },

  // Refresh token
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    try {
      return await apiRequest.post<{ token: string }>('/auth/refresh');
    } catch (error: any) {
      console.error('Refresh token error:', error);
      throw new Error(error.response?.data?.message || 'Failed to refresh token');
    }
  },

  // Update user profile
  async updateProfile(userData: Partial<Pick<User, 'name' | 'email' | 'preferences'>>): Promise<ApiResponse<{ user: User }>> {
    try {
      return await apiRequest.put<{ user: User }>('/auth/profile', userData);
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{}>> {
    try {
      return await apiRequest.put('/auth/password', {
        currentPassword,
        newPassword
      });
    } catch (error: any) {
      console.error('Change password error:', error);
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  },

  // Logout (clear local storage)
  logout(): void {
    localStorage.removeItem('elevate_token');
    localStorage.removeItem('elevate_user');
  },


  // Get stored user data
  getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem('elevate_user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  },

  // Get stored token
  getStoredToken(): string | null {
    return localStorage.getItem('elevate_token');
  }
};
