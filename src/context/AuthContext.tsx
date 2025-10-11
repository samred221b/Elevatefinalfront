import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isLoggingOut: boolean;
  authenticateUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (name: string, email: string, password: string) => Promise<boolean>;
  logoutUser: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false); // Start as false to prevent blinking
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple initialization - just check localStorage once
  useEffect(() => {
    try {
      const storedUser = authService.getStoredUser();
      const storedToken = authService.getStoredToken();
      
      if (storedUser && storedToken) {
        // Only set user if not already set to prevent unnecessary re-renders
        setUser(prevUser => {
          if (prevUser?.email === storedUser.email) {
            return prevUser; // No change needed
          }
          console.log('✅ User restored from localStorage:', storedUser.email);
          return storedUser;
        });
      }
    } catch (error) {
      console.warn('⚠️ Failed to restore user session:', error);
      authService.logout();
    }
  }, []);

  const authenticateUser = async (email: string, password: string): Promise<boolean> => {
    setIsAuthLoading(true);
    setError(null);

    try {
      const response = await authService.login({ email, password });
      
      if (response.success && response.data) {
        setUser(response.data.user);
        console.log('✅ Login successful:', response.data.user.email);
        return true;
      } else {
        setError(response.message || 'Login failed');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      console.error('❌ Login error:', error);
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const registerUser = async (name: string, email: string, password: string): Promise<boolean> => {
    setError(null);

    try {
      const response = await authService.register({ name, email, password });
      
      if (response.success && response.data) {
        setUser(response.data.user);
        console.log('✅ Registration successful, user logged in:', response.data.user.email);
        return true;
      } else {
        const errorMsg = response.message || 'Registration failed';
        setError(errorMsg);
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
      return false;
    }
  };

  const logoutUser = () => {
    setIsLoggingOut(true);
    try {
      // Add a small delay for the logout animation
      setTimeout(() => {
        authService.logout();
        setUser(null);
        setError(null);
        setIsLoggingOut(false);
        console.log('✅ Logout successful');
      }, 1500); // 1.5 second delay for smooth transition
    } catch (error) {
      console.error('❌ Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAuthLoading,
    isLoggingOut,
    authenticateUser,
    registerUser,
    logoutUser,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
