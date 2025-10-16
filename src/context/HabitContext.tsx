import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  categoryService, 
  habitService, 
  logService,
  Category as BackendCategory,
  Habit as BackendHabit,
  Log as BackendLog,
  CreateCategoryData,
  CreateHabitData,
  CreateLogData
} from '../services';
import { Category, Habit, HabitLog, UserBadge, AppSettings, StreakData } from '@/types';
import { AVAILABLE_BADGES } from '@/lib/badges';
import { getToday } from '@/lib/utils';
import { useAuth } from './FirebaseAuthContext';

interface HabitContextType {
  categories: Category[]
  habits: Habit[]
  logs: HabitLog[]
  badges: UserBadge[]
  settings: AppSettings
  streaks: Map<string, StreakData>
  isDataLoading: boolean
  
  addCategory: (category: Omit<Category, 'id' | 'order'>) => Promise<string | undefined>
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  reorderCategories: (categories: Category[]) => Promise<void>
  
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'order'>) => Promise<void>
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>
  deleteHabit: (id: string) => Promise<void>
  reorderHabits: (habits: Habit[]) => Promise<void>
  
  toggleHabit: (habitId: string, date?: string) => Promise<void>
  
  updateSettings: (settings: Partial<AppSettings>) => void
  
  getHabitsByCategory: (categoryId: string) => Habit[]
  getLogsForHabit: (habitId: string, startDate?: string, endDate?: string) => HabitLog[]
  getStreakForHabit: (habitId: string) => StreakData
  checkAndAwardBadges: () => void
  
  refreshData: () => Promise<void>
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

// Helper functions to convert between backend and frontend types
const convertBackendCategory = (backendCat: BackendCategory): Category => ({
  id: backendCat._id,
  name: backendCat.name,
  description: backendCat.description || '',
  color: backendCat.color,
  icon: backendCat.icon,
  order: backendCat.order,
});

const convertBackendHabit = (backendHabit: BackendHabit): Habit => ({
  id: backendHabit._id,
  name: backendHabit.name,
  description: backendHabit.description || '',
  icon: backendHabit.icon,
  color: backendHabit.color,
  categoryId: backendHabit.category._id,
  frequency: backendHabit.frequency,
  reminderEnabled: backendHabit.reminder.enabled,
  reminderTime: backendHabit.reminder.time || '',
  createdAt: backendHabit.createdAt.toString(),
  order: backendHabit.order,
});

const convertBackendLog = (backendLog: BackendLog): HabitLog => ({
  id: backendLog._id,
  habitId: backendLog.habit._id,
  date: backendLog.date.toString().split('T')[0], // Convert to YYYY-MM-DD
  completed: backendLog.completed,
  timestamp: backendLog.createdAt.toString(),
  notes: backendLog.notes,
  value: backendLog.value,
});

export function HabitProvider({ children }: { children: ReactNode }) {
  const { currentUser, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [settings, setSettings] = useState<AppSettings>(() => {
    // Initialize theme from localStorage or default to system
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    return {
      theme: savedTheme || 'system',
      accentColor: '#3b82f6',
      fontSize: 'medium',
      notificationSound: true,
      weekStartsOn: 0,
      defaultView: 'grid',
    };
  });
  const [streaks, setStreaks] = useState<Map<string, StreakData>>(new Map());
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isSwitchingUser, setIsSwitchingUser] = useState(false);

  // Apply theme on mount and when settings change
  useEffect(() => {
    const applyTheme = (theme: 'light' | 'dark' | 'system') => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');

      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    };

    applyTheme(settings.theme);
  }, [settings.theme]);

  // Track the current user ID to detect user changes
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && currentUser) {
      const newUserId = currentUser.uid;
      
      // Check if this is a different user
      if (currentUserId && currentUserId !== newUserId) {
        console.log('🔄 HabitContext: Different user detected, clearing previous data');
        
        // Force clear all data immediately
        forceClearAllData();
        setIsSwitchingUser(true);
      }
      
      // Update current user ID
      setCurrentUserId(newUserId);
      
      // Load data for the current user
      console.log('🔄 HabitContext: Loading data for user:', newUserId);
      
      // Add a small delay to ensure Firebase token is ready
      const timer = setTimeout(() => {
        refreshData();
      }, 200);
      
      return () => clearTimeout(timer);
    } else if (!authLoading && !currentUser) {
      // Clear data when user logs out
      console.log('🔄 HabitContext: User logged out, clearing all data');
      forceClearAllData();
      setCurrentUserId(null);
    }
  }, [currentUser, authLoading]);

  useEffect(() => {
    calculateStreaks();
  }, [habits, logs]);

  const forceClearAllData = () => {
    console.log('🧹 HabitContext: Force clearing all data');
    setCategories([]);
    setHabits([]);
    setLogs([]);
    setBadges([]);
    setStreaks(new Map());
    setIsDataLoading(false);
    setIsSwitchingUser(false);
    console.log('✅ HabitContext: All data force cleared');
  };

  const refreshData = async () => {
    if (!currentUser) {
      console.warn('⚠️ HabitContext: Cannot refresh data - no authenticated user');
      return;
    }
    
    console.log('🔄 HabitContext: Starting data refresh for user:', currentUser.uid);
    
    try {
      setIsDataLoading(true);
      console.log('🔄 HabitContext: Loading data from backend...');
      
      // Load categories, habits, and recent logs in parallel
      const [categoriesRes, habitsRes, logsRes] = await Promise.all([
        categoryService.getCategories(),
        habitService.getHabits({ active: true }),
        logService.getLogs({ limit: 1000 }) // Get recent logs
      ]);

      console.log('🔄 HabitContext: Backend responses received:', {
        categories: categoriesRes.success,
        habits: habitsRes.success,
        logs: logsRes.success
      });

      if (categoriesRes.success && categoriesRes.data) {
        console.log('✅ HabitContext: Setting categories:', categoriesRes.data.length, 'for user:', currentUser.uid);
        setCategories(categoriesRes.data.map(convertBackendCategory));
      }

      if (habitsRes.success && habitsRes.data) {
        console.log('✅ HabitContext: Setting habits:', habitsRes.data.length, 'for user:', currentUser.uid);
        setHabits(habitsRes.data.map(convertBackendHabit));
      }

      if (logsRes.success && logsRes.data) {
        console.log('✅ HabitContext: Setting logs:', logsRes.data.length, 'for user:', currentUser.uid);
        setLogs(logsRes.data.map(convertBackendLog));
      }

      console.log('✅ HabitContext: Data refresh completed successfully');

    } catch (error) {
      console.error('❌ HabitContext: Error refreshing data:', error);
    } finally {
      setIsDataLoading(false);
      setIsSwitchingUser(false);
      console.log('🔄 HabitContext: Data loading finished');
    }
  };

  const calculateStreaks = () => {
    const newStreaks = new Map<string, StreakData>();
    
    habits.forEach(habit => {
      const habitLogs = logs
        .filter(log => log.habitId === habit.id && log.completed)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      if (habitLogs.length === 0) {
        newStreaks.set(habit.id, {
          habitId: habit.id,
          currentStreak: 0,
          longestStreak: 0,
        });
        return;
      }

      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      
      // Check if today or yesterday was completed for current streak
      const today = getToday();
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      const hasToday = habitLogs.some(log => log.date === today);
      const hasYesterday = habitLogs.some(log => log.date === yesterday);
      
      if (hasToday || hasYesterday) {
        let checkDate = new Date(hasToday ? today : yesterday);
        
        for (const log of habitLogs) {
          const logDate = new Date(log.date);
          const diffDays = Math.floor((checkDate.getTime() - logDate.getTime()) / 86400000);
          
          if (diffDays === 0) {
            currentStreak++;
            checkDate = new Date(checkDate.getTime() - 86400000);
          } else if (diffDays === 1) {
            currentStreak++;
            checkDate = logDate;
          } else {
            break;
          }
        }
      }

      // Calculate longest streak
      for (let i = 0; i < habitLogs.length; i++) {
        const currentDate = new Date(habitLogs[i].date);
        
        if (i === 0) {
          tempStreak = 1;
        } else {
          const prevDate = new Date(habitLogs[i - 1].date);
          const diffDays = Math.floor((prevDate.getTime() - currentDate.getTime()) / 86400000);
          
          if (diffDays === 1) {
            tempStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);

      newStreaks.set(habit.id, {
        habitId: habit.id,
        currentStreak,
        longestStreak,
        lastCompletedDate: habitLogs[0]?.date,
      });
    });
    
    setStreaks(newStreaks);
  };

  const addCategory = async (category: Omit<Category, 'id' | 'order'>) => {
    try {
      const categoryData: CreateCategoryData = {
        name: category.name,
        description: category.description,
        color: category.color,
        icon: category.icon,
      };

      const response = await categoryService.createCategory(categoryData);
      if (response.success && response.data) {
        const newCategory = convertBackendCategory(response.data);
        setCategories(prev => [...prev, newCategory]);
        return newCategory.id;
      }
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const response = await categoryService.updateCategory(id, {
        name: updates.name,
        description: updates.description,
        color: updates.color,
        icon: updates.icon,
        order: updates.order,
      });

      if (response.success && response.data) {
        const updatedCategory = convertBackendCategory(response.data);
        setCategories(prev => prev.map(cat => 
          cat.id === id ? updatedCategory : cat
        ));
      }
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await categoryService.deleteCategory(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      // Remove habits in this category
      setHabits(prev => prev.filter(habit => habit.categoryId !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  const reorderCategories = async (newCategories: Category[]) => {
    try {
      const reorderData = newCategories.map((cat, index) => ({
        id: cat.id,
        order: index,
      }));

      await categoryService.reorderCategories(reorderData);
      setCategories(newCategories.map((cat, index) => ({ ...cat, order: index })));
    } catch (error) {
      console.error('Error reordering categories:', error);
      throw error;
    }
  };

  const addHabit = async (habit: Omit<Habit, 'id' | 'createdAt' | 'order'>) => {
    try {
      console.log('🎯 HabitContext: addHabit called with:', habit);
      
      const habitData: CreateHabitData = {
        name: habit.name,
        description: habit.description,
        icon: habit.icon,
        color: habit.color,
        category: habit.categoryId,
        frequency: habit.frequency,
        reminder: {
          enabled: habit.reminderEnabled,
          time: habit.reminderTime,
        },
      };

      console.log('📡 HabitContext: Calling habitService.createHabit with:', habitData);
      const response = await habitService.createHabit(habitData);
      console.log('📡 HabitContext: API response:', response);
      
      if (response.success && response.data) {
        const newHabit = convertBackendHabit(response.data);
        setHabits(prev => [...prev, newHabit]);
        console.log('✅ HabitContext: Habit added successfully:', newHabit);
      } else {
        console.error('❌ HabitContext: API response not successful:', response);
      }
    } catch (error) {
      console.error('❌ HabitContext: Error adding habit:', error);
      throw error;
    }
  };

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    try {
      const response = await habitService.updateHabit(id, {
        name: updates.name,
        description: updates.description,
        icon: updates.icon,
        color: updates.color,
        category: updates.categoryId,
        frequency: updates.frequency,
        reminder: updates.reminderEnabled !== undefined || updates.reminderTime !== undefined ? {
          enabled: updates.reminderEnabled,
          time: updates.reminderTime,
        } : undefined,
        order: updates.order,
      });

      if (response.success && response.data) {
        const updatedHabit = convertBackendHabit(response.data);
        setHabits(prev => prev.map(habit => 
          habit.id === id ? updatedHabit : habit
        ));
      }
    } catch (error) {
      console.error('Error updating habit:', error);
      throw error;
    }
  };

  const deleteHabit = async (id: string) => {
    try {
      await habitService.deleteHabit(id);
      setHabits(prev => prev.filter(habit => habit.id !== id));
      setLogs(prev => prev.filter(log => log.habitId !== id));
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw error;
    }
  };

  const reorderHabits = async (newHabits: Habit[]) => {
    try {
      const reorderData = newHabits.map((habit, index) => ({
        id: habit.id,
        order: index,
      }));

      await habitService.reorderHabits(reorderData);
      setHabits(newHabits.map((habit, index) => ({ ...habit, order: index })));
    } catch (error) {
      console.error('Error reordering habits:', error);
      throw error;
    }
  };

  const toggleHabit = async (habitId: string, date: string = getToday()) => {
    try {
      const existingLog = logs.find(log => 
        log.habitId === habitId && log.date === date
      );

      const logData: CreateLogData = {
        habit: habitId,
        date,
        completed: existingLog ? !existingLog.completed : true,
      };

      const response = await logService.createOrUpdateLog(logData);
      if (response.success && response.data) {
        const updatedLog = convertBackendLog(response.data);
        
        if (existingLog) {
          setLogs(prev => prev.map(log => 
            log.id === existingLog.id ? updatedLog : log
          ));
        } else {
          setLogs(prev => [...prev, updatedLog]);
        }
      }

      // Check for new badges after a short delay
      setTimeout(checkAndAwardBadges, 100);
    } catch (error) {
      console.error('Error toggling habit:', error);
      throw error;
    }
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // Save theme to localStorage for persistence
      if (newSettings.theme) {
        localStorage.setItem('theme', newSettings.theme);
      }
      
      return updated;
    });
    // TODO: Sync with backend user preferences
  };

  const getHabitsByCategory = (categoryId: string): Habit[] => {
    return habits
      .filter(habit => habit.categoryId === categoryId)
      .sort((a, b) => a.order - b.order);
  };

  const getLogsForHabit = (
    habitId: string, 
    startDate?: string, 
    endDate?: string
  ): HabitLog[] => {
    let habitLogs = logs.filter(log => log.habitId === habitId);
    
    if (startDate) {
      habitLogs = habitLogs.filter(log => log.date >= startDate);
    }
    if (endDate) {
      habitLogs = habitLogs.filter(log => log.date <= endDate);
    }
    
    return habitLogs.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const getStreakForHabit = (habitId: string): StreakData => {
    return streaks.get(habitId) || {
      habitId,
      currentStreak: 0,
      longestStreak: 0,
    };
  };

  const checkAndAwardBadges = () => {
    // TODO: Implement badge system with backend
    // For now, keep local badge logic
    const newBadges: UserBadge[] = [...badges];
    
    // Check streak badges
    habits.forEach(habit => {
      const streak = getStreakForHabit(habit.id);
      
      // Debug logging for streak badges
      if (streak.currentStreak > 0) {
        console.log(`🔥 Habit "${habit.name}" current streak: ${streak.currentStreak} days`);
      }
      
      AVAILABLE_BADGES.filter(b => b.type === 'streak').forEach(badge => {
        const alreadyEarned = badges.some(
          ub => ub.badgeId === badge.id && ub.habitId === habit.id
        );
        
        if (!alreadyEarned && streak.currentStreak >= badge.requirement) {
          console.log(`🏆 BADGE EARNED! "${badge.name}" for habit "${habit.name}" (${streak.currentStreak}-day streak)`);
          newBadges.push({
            badgeId: badge.id,
            earnedAt: new Date().toISOString(),
            habitId: habit.id,
          });
        }
      });
    });

    // Check category badges
    categories.forEach(category => {
      const categoryHabits = getHabitsByCategory(category.id);
      const completedCount = logs.filter(log => 
        log.completed && categoryHabits.some(h => h.id === log.habitId)
      ).length;

      AVAILABLE_BADGES.filter(b => b.type === 'category').forEach(badge => {
        const alreadyEarned = badges.some(
          ub => ub.badgeId === badge.id && ub.categoryId === category.id
        );
        
        if (!alreadyEarned && completedCount >= badge.requirement) {
          newBadges.push({
            badgeId: badge.id,
            earnedAt: new Date().toISOString(),
            categoryId: category.id,
          });
        }
      });
    });

    // Check total badges
    const totalCompleted = logs.filter(log => log.completed).length;
    
    AVAILABLE_BADGES.filter(b => b.type === 'total').forEach(badge => {
      const alreadyEarned = badges.some(ub => ub.badgeId === badge.id);
      
      if (!alreadyEarned && totalCompleted >= badge.requirement) {
        newBadges.push({
          badgeId: badge.id,
          earnedAt: new Date().toISOString(),
        });
      }
    });

    if (newBadges.length > badges.length) {
      console.log(`🎉 Updating badges! New count: ${newBadges.length} (was ${badges.length})`);
      setBadges(newBadges);
    }
  };

  const value: HabitContextType = {
    categories,
    habits,
    logs,
    badges,
    settings,
    streaks,
    isDataLoading: isDataLoading || isSwitchingUser,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    addHabit,
    updateHabit,
    deleteHabit,
    reorderHabits,
    toggleHabit,
    updateSettings,
    getHabitsByCategory,
    getLogsForHabit,
    getStreakForHabit,
    checkAndAwardBadges,
    refreshData,
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
}
