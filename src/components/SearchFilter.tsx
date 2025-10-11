import { useState } from 'react'
import { Input } from './ui/input'
import { Select } from './ui/select'
import { Button } from './ui/button'
import { Search, X, Filter } from 'lucide-react'
import { useHabits } from '@/context/HabitContext'

interface SearchFilterProps {
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  searchTerm: string
  categoryId: string
  difficulty: string
  frequency: string
  showArchived: boolean
}

export function SearchFilter({ onFilterChange }: SearchFilterProps) {
  const { categories } = useHabits()
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    categoryId: 'all',
    difficulty: 'all',
    frequency: 'all',
    showArchived: false,
  })
  const [showAdvanced, setShowAdvanced] = useState(false)

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      searchTerm: '',
      categoryId: 'all',
      difficulty: 'all',
      frequency: 'all',
      showArchived: false,
    }
    setFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  const hasActiveFilters = 
    filters.searchTerm !== '' ||
    filters.categoryId !== 'all' ||
    filters.difficulty !== 'all' ||
    filters.frequency !== 'all' ||
    filters.showArchived

  return (
    <div className="space-y-4">
      {/* Beautiful Colorful Search Bar with Gradient */}
      <div className="relative">
        <div className="flex gap-3">
          {/* Vibrant Search Input with Glass Effect */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 dark:text-slate-400 z-10" />
            <Input
              placeholder="Search your habits..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="pl-12 pr-4 h-14 bg-transparent backdrop-blur-xl border-2 border-slate-400/60 dark:border-slate-400/60 focus:border-teal-500 dark:focus:border-teal-400 rounded-2xl transition-all duration-300 text-gray-900 dark:text-white placeholder:text-slate-600 dark:placeholder:text-slate-400 shadow-lg hover:shadow-xl focus:shadow-2xl focus:scale-[1.01] hover:border-slate-500 dark:hover:border-slate-300"
            />
          </div>

          {/* Colorful Filter Button with Gradient */}
          <Button
            variant={showAdvanced ? "default" : "outline"}
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`h-14 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
              showAdvanced 
                ? 'bg-gradient-to-r from-slate-800 to-teal-500 hover:from-slate-900 hover:to-teal-600 text-white border-0' 
                : 'bg-transparent backdrop-blur-xl border-2 border-slate-400/60 dark:border-slate-400/60 hover:border-teal-500 dark:hover:border-teal-400 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </Button>

          {/* Stylish Clear Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="h-14 px-6 rounded-2xl font-semibold bg-transparent hover:bg-red-500/10 text-red-600 dark:text-red-400 border-2 border-red-400/60 dark:border-red-400/60 hover:border-red-500 dark:hover:border-red-400 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <X className="w-5 h-5 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Beautiful Advanced Filters with Gradient Background */}
      {showAdvanced && (
        <div className="relative overflow-hidden rounded-2xl">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-orange-500/20"></div>
          <div className="relative bg-transparent backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-400/60 dark:border-purple-400/60 shadow-xl">
            <h3 className="text-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-5">
              🎯 Filter Options
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Category Filter with Colorful Border */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-purple-700 dark:text-purple-300">
                  📂 Category
                </label>
                <Select
                  value={filters.categoryId}
                  onChange={(e) => updateFilter('categoryId', e.target.value)}
                  className="h-11 bg-transparent backdrop-blur-sm border-2 border-purple-400/60 dark:border-purple-400/60 hover:border-purple-500 dark:hover:border-purple-400 focus:border-purple-600 dark:focus:border-purple-300 rounded-xl transition-all duration-200 text-gray-900 dark:text-white shadow-md hover:shadow-lg"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Difficulty Filter with Colorful Border */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-pink-700 dark:text-pink-300">
                  ⚡ Difficulty
                </label>
                <Select
                  value={filters.difficulty}
                  onChange={(e) => updateFilter('difficulty', e.target.value)}
                  className="h-11 bg-transparent backdrop-blur-sm border-2 border-pink-400/60 dark:border-pink-400/60 hover:border-pink-500 dark:hover:border-pink-400 focus:border-pink-600 dark:focus:border-pink-300 rounded-xl transition-all duration-200 text-gray-900 dark:text-white shadow-md hover:shadow-lg"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </Select>
              </div>

              {/* Frequency Filter with Colorful Border */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-orange-700 dark:text-orange-300">
                  🔄 Frequency
                </label>
                <Select
                  value={filters.frequency}
                  onChange={(e) => updateFilter('frequency', e.target.value)}
                  className="h-11 bg-transparent backdrop-blur-sm border-2 border-orange-400/60 dark:border-orange-400/60 hover:border-orange-500 dark:hover:border-orange-400 focus:border-orange-600 dark:focus:border-orange-300 rounded-xl transition-all duration-200 text-gray-900 dark:text-white shadow-md hover:shadow-lg"
                >
                  <option value="all">All Frequencies</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
