import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type View = 'home' | 'templates' | 'analytics' | 'calendar' | 'profile' | 'help' | 'faq' | 'billing' | 'settings' | 'progress' | 'badges' | 'data';

interface NavigationState {
  currentView: View;
  previousView: View | null;
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  searchTerm: string;
  isTransitioning: boolean;
  navigationHistory: View[];
}

interface NavigationContextType extends NavigationState {
  setCurrentView: (view: View) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  setSearchTerm: (term: string) => void;
  goBack: () => void;
  canGoBack: boolean;
  toggleSidebar: () => void;
  toggleMobileNav: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NavigationState>({
    currentView: 'home',
    previousView: null,
    sidebarCollapsed: false,
    mobileNavOpen: false,
    searchTerm: '',
    isTransitioning: false,
    navigationHistory: ['home']
  });

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setState(prev => ({ ...prev, sidebarCollapsed: true }));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const setCurrentView = (view: View) => {
    if (view === state.currentView) return;

    setState(prev => ({
      ...prev,
      previousView: prev.currentView,
      currentView: view,
      isTransitioning: true,
      navigationHistory: [...prev.navigationHistory.slice(-9), view], // Keep last 10
      mobileNavOpen: false // Close mobile nav when navigating
    }));

    // Reset transition state after animation
    setTimeout(() => {
      setState(prev => ({ ...prev, isTransitioning: false }));
    }, 300);
  };

  const setSidebarCollapsed = (collapsed: boolean) => {
    setState(prev => ({ ...prev, sidebarCollapsed: collapsed }));
  };

  const setMobileNavOpen = (open: boolean) => {
    setState(prev => ({ ...prev, mobileNavOpen: open }));
  };

  const setSearchTerm = (term: string) => {
    setState(prev => ({ ...prev, searchTerm: term }));
  };

  const goBack = () => {
    const history = state.navigationHistory;
    if (history.length > 1) {
      const previousView = history[history.length - 2];
      setState(prev => ({
        ...prev,
        currentView: previousView,
        previousView: prev.currentView,
        navigationHistory: history.slice(0, -1),
        isTransitioning: true
      }));

      setTimeout(() => {
        setState(prev => ({ ...prev, isTransitioning: false }));
      }, 300);
    }
  };

  const toggleSidebar = () => {
    setState(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  };

  const toggleMobileNav = () => {
    setState(prev => ({ ...prev, mobileNavOpen: !prev.mobileNavOpen }));
  };

  const canGoBack = state.navigationHistory.length > 1;

  const contextValue: NavigationContextType = {
    ...state,
    setCurrentView,
    setSidebarCollapsed,
    setMobileNavOpen,
    setSearchTerm,
    goBack,
    canGoBack,
    toggleSidebar,
    toggleMobileNav
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
