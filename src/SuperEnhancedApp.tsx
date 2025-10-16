import { useMemo, useState, useEffect } from 'react';
import { HabitProvider, useHabits } from './context/HabitContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { ToastProvider } from './context/ToastContext';
import { SearchFilter } from './components/SearchFilter';
import { FilterState } from './types/filters';
import { CategorySection } from './components/CategorySection';
import { AddCategoryDialog } from './components/AddCategoryDialog';
import { AddHabitDialog } from './components/AddHabitDialog';
import { HabitDetails } from './components/HabitDetails';
import { HabitTemplates } from './components/HabitTemplates';
import { AdvancedAnalytics } from './components/AdvancedAnalytics';
import { CalendarView } from './components/CalendarView';
import { SettingsView } from './components/SettingsView';
import { ProfileView } from './components/ProfileView';
import { HelpView } from './components/HelpView';
import { FAQView } from './components/FAQView';
import { BillingView } from './components/BillingView';
import { ProgressInsights } from './components/ProgressInsights';
import { BadgesView } from './components/BadgesView';
import { DataExport } from './components/DataExport';
import { Home, FileText, Award, Database } from 'lucide-react';

// Enhanced Navigation Components
import { Sidebar } from './components/navigation/Sidebar';
import { EnhancedTopNav } from './components/navigation/EnhancedTopNav';
import { MobileNav } from './components/navigation/MobileNav';
import { FloatingActionMenu } from './components/navigation/FloatingActionMenu';
import { Breadcrumb } from './components/navigation/Breadcrumb';

function AppContent() {
  console.log('📱 AppContent rendering...')
  const {
    categories,
    habits,
    logs,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    addHabit,
    updateHabit,
    deleteHabit,
    reorderHabits,
    toggleHabit,
    getHabitsByCategory,
    refreshData,
    isDataLoading
  } = useHabits();

  const { 
    currentView, 
    setCurrentView, 
    sidebarCollapsed, 
    toggleSidebar,
    mobileNavOpen,
    toggleMobileNav,
    searchTerm,
    isTransitioning
  } = useNavigation();

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    categoryId: 'all',
    difficulty: 'all',
    frequency: 'all',
    showArchived: false,
  });
  
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showHabitDialog, setShowHabitDialog] = useState(false);
  const [editCategory, setEditCategory] = useState<any>(null);
  const [editHabit, setEditHabit] = useState<any>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedHabitForDetails, setSelectedHabitForDetails] = useState<any>(null);

  // Responsive handling
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update filters when search term changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, searchTerm }));
  }, [searchTerm]);

  const filteredCategories = useMemo(() => {
    let list = categories;

    if (filters.categoryId !== 'all') {
      list = list.filter(c => c.id === filters.categoryId);
    }

    if (filters.searchTerm.trim()) {
      const term = filters.searchTerm.toLowerCase();
      list = list.filter(c => {
        // Include category if name matches
        if (c.name.toLowerCase().includes(term)) {
          return true;
        }
        
        // Include category if any of its habits match the search term
        const categoryHabits = getHabitsByCategory(c.id);
        return categoryHabits.some(habit => 
          habit.name.toLowerCase().includes(term) ||
          habit.description?.toLowerCase().includes(term)
        );
      });
    }

    return list.sort((a, b) => a.order - b.order);
  }, [categories, filters, getHabitsByCategory]);

  const handleAddCategory = () => {
    setEditCategory(null);
    setShowCategoryDialog(true);
  };

  const handleAddHabit = () => {
    setEditHabit(null);
    setSelectedCategoryId('');
    setShowHabitDialog(true);
  };


  const renderContent = () => {
    const contentClass = `transition-all duration-300 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`;
    switch (currentView) {
      case 'home':
        return (
          <div className={`rounded-xl md:rounded-2xl border border-purple-300/50 dark:border-purple-800/50 p-4 md:p-6 bg-white/60 dark:bg-gray-900/40 backdrop-blur ${contentClass}`}>
            <div className="space-y-3 md:space-y-6">
              {/* Home Header */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-500 p-4 md:p-8 text-white">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0 mb-4 lg:mb-6">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="p-2 md:p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                        <Home className="w-6 h-6 md:w-8 md:h-8" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                          Your Habits
                        </h2>
                        <p className="text-cyan-100 mt-1 text-sm md:text-lg">Monitor your daily progress and transform your life one habit at a time 🚀</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <span className="text-xl md:text-2xl">🎯</span>
                      <span className="text-sm md:text-base font-medium text-white">
                        {filteredCategories.length} Categories
                      </span>
                    </div>
                  </div>
                  
                  {/* Status Message */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-4">
                    <span className="text-cyan-100 font-medium text-sm md:text-base">Status:</span>
                    <div className="flex bg-white/10 rounded-xl p-1 backdrop-blur-sm">
                      <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-white/10 rounded-lg">
                        <span className="text-xs md:text-sm font-medium text-white">Ready to conquer your habits? Let's dominate today! 💪</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Animated Background Elements */}
                <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full animate-bounce"></div>
              </div>
              {/* Search + Filters - Only show on mobile or when no top search */}
              {(isMobile || !searchTerm) && (
                <div className="lg:hidden">
                  <SearchFilter onFilterChange={setFilters} />
                </div>
              )}

              {/* Categories Content */}
              <div className="space-y-4">
                {isDataLoading ? (
                  <div className="text-center py-10 text-gray-500">
                    <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-lg font-medium">Loading your habits...</p>
                    <p className="text-sm text-gray-400 mt-1">Building something amazing</p>
                  </div>
                ) : filteredCategories.length === 0 ? (
                  <div className="text-center py-16 rounded-2xl border border-dashed border-purple-300 dark:border-purple-800 text-gray-600 dark:text-gray-300 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20">
                    <div className="text-6xl mb-4 animate-bounce">🎯</div>
                    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                      Ready to build great habits?
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      Start your journey to a better you. Create your first category and begin tracking habits that matter.
                    </p>
                    <button
                      onClick={handleAddCategory}
                      className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                    >
                      ✨ Create Your First Category
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCategories.map(category => (
                      <div
                        key={category.id}
                        className="animate-in slide-in-from-bottom-4 fade-in-0 duration-500"
                        style={{ animationDelay: `${filteredCategories.indexOf(category) * 100}ms` }}
                      >
                        <CategorySection
                          category={category}
                          filters={filters}
                          onEditCategory={(cat) => { setEditCategory(cat); setShowCategoryDialog(true); }}
                          onDeleteCategory={async (cat) => {
                            try {
                              await deleteCategory(cat.id);
                              await refreshData();
                            } catch (error) {
                              console.error('Failed to delete category:', error);
                            }
                          }}
                          onAddHabit={(categoryId) => { setSelectedCategoryId(categoryId); setShowHabitDialog(true); }}
                          onEditHabit={(habit) => { setEditHabit(habit); setShowHabitDialog(true); }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'templates':
        return (
          <div className={`rounded-xl md:rounded-2xl border border-purple-300/50 dark:border-purple-800/50 p-4 md:p-6 bg-white/60 dark:bg-gray-900/40 backdrop-blur ${contentClass}`}>
            <div className="space-y-3 md:space-y-6">
              {/* Templates Header */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-600 p-4 md:p-8 text-white">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0 mb-4 lg:mb-6">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="p-2 md:p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                        <FileText className="w-6 h-6 md:w-8 md:h-8" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                          Habit Templates
                        </h2>
                        <p className="text-blue-100 mt-1 text-sm md:text-lg">Discover proven habit templates to accelerate your personal growth 📚</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Message */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-4">
                    <span className="text-blue-100 font-medium text-sm md:text-base">Status:</span>
                    <div className="flex bg-white/10 rounded-xl p-1 backdrop-blur-sm">
                      <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-white/10 rounded-lg">
                        <span className="text-xs md:text-sm font-medium text-white">Browse expertly crafted templates to kickstart your journey! 🌟</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Animated Background Elements */}
                <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full animate-bounce"></div>
              </div>
              <HabitTemplates />
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className={`rounded-xl md:rounded-2xl border border-purple-300/50 dark:border-purple-800/50 p-4 md:p-6 bg-white/60 dark:bg-gray-900/40 backdrop-blur ${contentClass}`}>
            <AdvancedAnalytics />
          </div>
        );

      case 'calendar':
        return (
          <div className={`rounded-xl md:rounded-2xl border border-purple-300/50 dark:border-purple-800/50 p-4 md:p-6 bg-white/60 dark:bg-gray-900/40 backdrop-blur ${contentClass}`}>
            <CalendarView />
          </div>
        );

      case 'profile':
        return (
          <div className={`rounded-xl md:rounded-2xl border border-purple-300/50 dark:border-purple-800/50 p-4 md:p-6 bg-white/60 dark:bg-gray-900/40 backdrop-blur ${contentClass}`}>
            <ProfileView />
          </div>
        );

      case 'help':
        return (
          <div className={`rounded-xl md:rounded-2xl border border-blue-300/50 dark:border-blue-800/50 p-4 md:p-6 bg-white/60 dark:bg-gray-900/40 backdrop-blur ${contentClass}`}>
            <HelpView />
          </div>
        );

      case 'faq':
        return (
          <div className={`rounded-xl md:rounded-2xl border border-blue-300/50 dark:border-blue-800/50 p-4 md:p-6 bg-white/60 dark:bg-gray-900/40 backdrop-blur ${contentClass}`}>
            <FAQView />
          </div>
        );

      case 'billing':
        return (
          <div className={`rounded-xl md:rounded-2xl border border-green-300/50 dark:border-green-800/50 p-4 md:p-6 bg-white/60 dark:bg-gray-900/40 backdrop-blur ${contentClass}`}>
            <BillingView />
          </div>
        );

      case 'settings':
        return (
          <div className={`rounded-xl md:rounded-2xl border border-purple-300/50 dark:border-purple-800/50 p-4 md:p-6 bg-white/60 dark:bg-gray-900/40 backdrop-blur ${contentClass}`}>
            <SettingsView />
          </div>
        );

      case 'progress':
        return (
          <div className={`rounded-xl md:rounded-2xl border border-purple-300/50 dark:border-purple-800/50 p-4 md:p-6 bg-white/60 dark:bg-gray-900/40 backdrop-blur ${contentClass}`}>
            <ProgressInsights />
          </div>
        );

      case 'badges':
        return (
          <div className={`rounded-xl md:rounded-2xl border border-purple-300/50 dark:border-purple-800/50 p-4 md:p-6 bg-white/60 dark:bg-gray-900/40 backdrop-blur ${contentClass}`}>
            <div className="space-y-3 md:space-y-6">
              {/* Badges Header */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-500 to-amber-600 p-4 md:p-8 text-white">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0 mb-4 lg:mb-6">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="p-2 md:p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                        <Award className="w-6 h-6 md:w-8 md:h-8" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
                          Achievements
                        </h2>
                        <p className="text-yellow-100 mt-1 text-sm md:text-lg">Unlock achievements and celebrate every milestone on your journey 🏆</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Message */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-4">
                    <span className="text-yellow-100 font-medium text-sm md:text-base">Status:</span>
                    <div className="flex bg-white/10 rounded-xl p-1 backdrop-blur-sm">
                      <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-white/10 rounded-lg">
                        <span className="text-xs md:text-sm font-medium text-white">Collect badges and showcase your incredible achievements! ⭐</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Animated Background Elements */}
                <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full animate-bounce"></div>
              </div>
              <BadgesView />
            </div>
          </div>
        );

      case 'data':
        return (
          <div className={`rounded-xl md:rounded-2xl border border-purple-300/50 dark:border-purple-800/50 p-4 md:p-6 bg-white/60 dark:bg-gray-900/40 backdrop-blur ${contentClass}`}>
            <div className="space-y-3 md:space-y-6">
              {/* Data Header */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-600 p-4 md:p-8 text-white">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0 mb-4 lg:mb-6">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="p-2 md:p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                        <Database className="w-6 h-6 md:w-8 md:h-8" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                          Data Management
                        </h2>
                        <p className="text-blue-100 mt-1 text-sm md:text-lg">Export, backup, and manage your habit data securely 💾</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Message */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-4">
                    <span className="text-blue-100 font-medium text-sm md:text-base">Status:</span>
                    <div className="flex bg-white/10 rounded-xl p-1 backdrop-blur-sm">
                      <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-white/10 rounded-lg">
                        <span className="text-xs md:text-sm font-medium text-white">Your data is secure and ready for backup or export! 🔒</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Animated Background Elements */}
                <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full animate-bounce"></div>
              </div>
              <DataExport />
            </div>
          </div>
        );


      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      )}

      {/* Mobile Navigation */}
      {isMobile && (
        <MobileNav
          currentView={currentView}
          onViewChange={setCurrentView}
          isOpen={mobileNavOpen}
          onToggle={toggleMobileNav}
        />
      )}

      {/* Main Content */}
      <div className={`
        transition-all duration-300
        ${!isMobile ? (sidebarCollapsed ? 'ml-16' : 'ml-64') : ''}
      `}>
        {/* Enhanced Top Navigation */}
        <EnhancedTopNav
          showSearch={currentView === 'home'}
        />

        {/* Content Area */}
        <main className="px-4 py-4 md:px-6 md:py-6">
          {/* Breadcrumb */}
          <Breadcrumb
            currentView={currentView}
            onNavigate={setCurrentView}
          />

          {/* Dynamic Content */}
          {renderContent()}
        </main>
      </div>

      {/* Floating Action Menu */}
      <FloatingActionMenu
        onAddCategory={handleAddCategory}
        onAddHabit={handleAddHabit}
      />

      {/* Dialogs */}
      <AddCategoryDialog
        open={showCategoryDialog}
        onOpenChange={setShowCategoryDialog}
        editCategory={editCategory}
      />

      <AddHabitDialog
        open={showHabitDialog}
        onOpenChange={setShowHabitDialog}
        categoryId={selectedCategoryId}
        editHabit={editHabit}
      />

      {selectedHabitForDetails && (
        <HabitDetails
          habit={selectedHabitForDetails}
          open={!!selectedHabitForDetails}
          onOpenChange={(open) => { if (!open) setSelectedHabitForDetails(null); }}
        />
      )}
    </div>
  );
}

function SuperEnhancedApp() {
  console.log('🚀 SuperEnhancedApp rendering...')
  return (
    <ToastProvider>
      <HabitProvider>
        <NavigationProvider>
          <AppContent />
        </NavigationProvider>
      </HabitProvider>
    </ToastProvider>
  );
}

export default SuperEnhancedApp;
