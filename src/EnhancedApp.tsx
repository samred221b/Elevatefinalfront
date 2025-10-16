import { useMemo, useState, useEffect } from 'react';
import { HabitProvider, useHabits } from './context/HabitContext';
import { FilterState } from './types/filters';
import { CategorySection } from './components/CategorySection';
import { AddCategoryDialog } from './components/AddCategoryDialog';
import { AddHabitDialog } from './components/AddHabitDialog';
import { HabitDetails } from './components/HabitDetails';
import { HabitTemplates } from './components/HabitTemplates';
import { AdvancedAnalytics } from './components/AdvancedAnalytics';
import { CalendarView } from './components/CalendarView';
import { SettingsView } from './components/SettingsView';
import { ProgressInsights } from './components/ProgressInsights';
import { BadgesView } from './components/BadgesView';
import { DataExport } from './components/DataExport';

// Navigation Components
import { Sidebar } from './components/navigation/Sidebar';
import { TopNav } from './components/navigation/TopNav';
import { FloatingActionMenu } from './components/navigation/FloatingActionMenu';
import { Breadcrumb } from './components/navigation/Breadcrumb';

type View = 'home' | 'templates' | 'analytics' | 'calendar' | 'profile' | 'help' | 'faq' | 'billing' | 'settings' | 'progress' | 'badges' | 'data';

function AppContent() {
  const { categories, isDataLoading } = useHabits();

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
  const [currentView, setCurrentView] = useState<View>('home');
  
  // Navigation states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
      list = list.filter(c => c.name.toLowerCase().includes(term));
    }

    return list.sort((a, b) => a.order - b.order);
  }, [categories, filters]);

  const handleAddCategory = () => {
    setEditCategory(null);
    setShowCategoryDialog(true);
  };

  const handleAddHabit = () => {
    setEditHabit(null);
    setSelectedCategoryId('');
    setShowHabitDialog(true);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      )}

      {/* Note: Mobile navigation removed - use SuperEnhancedApp for mobile support */}

      {/* Main Content */}
      <div className={`
        transition-all duration-300
        ${!isMobile ? (sidebarCollapsed ? 'ml-16' : 'ml-64') : ''}
        ${isMobile ? 'pb-20' : ''}
      `}>
        {/* Top Navigation */}
        <TopNav
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showSearch={currentView === 'home'}
        />

        {/* Content Area */}
        <main className="px-6 py-6">
          {/* Breadcrumb */}
          <Breadcrumb
            currentView={currentView}
            onNavigate={setCurrentView}
          />

          {/* View Content */}
          {currentView === 'home' && (
            <div className="space-y-6">
              {/* Note: Mobile search removed - use SuperEnhancedApp for mobile support */}

              {/* Categories */}
              <div className="space-y-4">
                {isDataLoading ? (
                  <div className="text-center py-10 text-gray-500">
                    <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
                    Loading your habits...
                  </div>
                ) : filteredCategories.length === 0 ? (
                  <div className="text-center py-16 rounded-2xl border border-dashed border-purple-300 dark:border-purple-800 text-gray-600 dark:text-gray-300">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-xl font-semibold mb-2">No habits yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Start building better habits today!
                    </p>
                    <button
                      onClick={handleAddCategory}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:shadow-lg transition-all"
                    >
                      Create Your First Category
                    </button>
                  </div>
                ) : (
                  filteredCategories.map(category => (
                    <CategorySection
                      key={category.id}
                      category={category}
                      filters={filters}
                      onEditCategory={(cat) => { setEditCategory(cat); setShowCategoryDialog(true); }}
                      onDeleteCategory={async (cat) => {
                        // Note: This is a simplified version - use SuperEnhancedApp for full functionality
                        console.log('Delete category:', cat.name);
                        alert('Delete functionality available in SuperEnhancedApp');
                      }}
                      onAddHabit={(categoryId) => { setSelectedCategoryId(categoryId); setShowHabitDialog(true); }}
                      onEditHabit={(habit) => { setEditHabit(habit); setShowHabitDialog(true); }}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {currentView === 'templates' && (
            <div className="rounded-2xl border border-purple-300/50 dark:border-purple-800/50 p-6 bg-white/60 dark:bg-gray-900/40 backdrop-blur">
              <HabitTemplates />
            </div>
          )}

          {currentView === 'analytics' && (
            <div className="rounded-2xl border border-purple-300/50 dark:border-purple-800/50 p-6 bg-white/60 dark:bg-gray-900/40 backdrop-blur">
              <AdvancedAnalytics />
            </div>
          )}

          {currentView === 'calendar' && (
            <div className="rounded-2xl border border-purple-300/50 dark:border-purple-800/50 p-6 bg-white/60 dark:bg-gray-900/40 backdrop-blur">
              <CalendarView />
            </div>
          )}

          {currentView === 'settings' && (
            <div className="rounded-2xl border border-purple-300/50 dark:border-purple-800/50 p-6 bg-white/60 dark:bg-gray-900/40 backdrop-blur">
              <SettingsView />
            </div>
          )}

          {currentView === 'progress' && (
            <div className="rounded-2xl border border-purple-300/50 dark:border-purple-800/50 p-6 bg-white/60 dark:bg-gray-900/40 backdrop-blur">
              <ProgressInsights />
            </div>
          )}

          {currentView === 'badges' && (
            <div className="rounded-2xl border border-purple-300/50 dark:border-purple-800/50 p-6 bg-white/60 dark:bg-gray-900/40 backdrop-blur">
              <BadgesView />
            </div>
          )}

          {currentView === 'data' && (
            <div className="rounded-2xl border border-purple-300/50 dark:border-purple-800/50 p-6 bg-white/60 dark:bg-gray-900/40 backdrop-blur">
              <DataExport />
            </div>
          )}
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

function EnhancedApp() {
  return (
    <HabitProvider>
      <AppContent />
    </HabitProvider>
  );
}

export default EnhancedApp;
