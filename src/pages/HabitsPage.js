import React, { useState, useEffect } from 'react';
import { Plus, Filter, BarChart3, RotateCcw } from 'lucide-react';
import HabitCard from '../components/HabitCard';
import HabitModal from '../components/HabitModal';
import HabitStats from '../components/HabitStats';

const HabitsPage = () => {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('awesome-habits');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: 'Drink 8 glasses of water',
        description: 'Stay hydrated throughout the day for better health',
        icon: '💧',
        category: 'health',
        difficulty: 'easy',
        targetDays: 7,
        scheduledDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        currentStreak: 5,
        bestStreak: 12,
        completionHistory: generateSampleHistory(5, 12),
        createdAt: '2025-01-20'
      },
      {
        id: 2,
        name: 'Read for 30 minutes',
        description: 'Expand knowledge and improve focus through daily reading',
        icon: '📚',
        category: 'learning',
        difficulty: 'medium',
        targetDays: 5,
        scheduledDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        currentStreak: 3,
        bestStreak: 8,
        completionHistory: generateSampleHistory(3, 8),
        createdAt: '2025-01-18'
      }
    ];
  });

  const [showModal, setShowModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'stats'

  // Generate sample history for default habits
  function generateSampleHistory(currentStreak, bestStreak) {
    const history = [];
    const today = new Date();
    
    // Generate last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Make current streak consecutive completed days
      const completed = i < currentStreak || (Math.random() > 0.3 && i > currentStreak + 2);
      
      history.push({
        date: dateStr,
        completed,
        completedAt: completed ? new Date(date.getTime() + Math.random() * 12 * 60 * 60 * 1000).toISOString() : null
      });
    }
    
    return history;
  }

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('awesome-habits', JSON.stringify(habits));
  }, [habits]);

  // Calculate streak based on completion history
  const calculateCurrentStreak = (completionHistory) => {
    if (!completionHistory || completionHistory.length === 0) return 0;
    
    const sortedHistory = [...completionHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
    let streak = 0;
    
    for (const entry of sortedHistory) {
      if (entry.completed) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Update habit streaks
  const updateHabitStreaks = () => {
    setHabits(prevHabits =>
      prevHabits.map(habit => {
        const currentStreak = calculateCurrentStreak(habit.completionHistory);
        const bestStreak = Math.max(habit.bestStreak || 0, currentStreak);
        
        return {
          ...habit,
          currentStreak,
          bestStreak
        };
      })
    );
  };

  // Run streak calculation on component mount and when habits change
  useEffect(() => {
    updateHabitStreaks();
  }, []); // Only run once on mount

  // Handle habit save (create/edit)
  const handleSaveHabit = (habitData) => {
    if (editingHabit) {
      // Update existing habit
      setHabits(prevHabits =>
        prevHabits.map(habit =>
          habit.id === editingHabit.id
            ? {
                ...habit,
                ...habitData,
                updatedAt: new Date().toISOString()
              }
            : habit
        )
      );
      setEditingHabit(null);
    } else {
      // Create new habit
      const newHabit = {
        id: Date.now(),
        ...habitData,
        currentStreak: 0,
        bestStreak: 0,
        completionHistory: [],
        createdAt: new Date().toISOString()
      };
      setHabits([...habits, newHabit]);
    }
    setShowModal(false);
  };

  // Handle habit deletion
  const handleDeleteHabit = (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      setHabits(habits.filter(habit => habit.id !== habitId));
    }
  };

  // Handle editing
  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setShowModal(true);
  };

  // Toggle today's completion
  const handleToggleToday = (habitId) => {
    const today = new Date().toISOString().split('T')[0];
    
    setHabits(prevHabits =>
      prevHabits.map(habit => {
        if (habit.id === habitId) {
          const updatedHistory = [...(habit.completionHistory || [])];
          const existingIndex = updatedHistory.findIndex(entry => entry.date === today);
          
          if (existingIndex >= 0) {
            // Toggle existing entry
            updatedHistory[existingIndex] = {
              ...updatedHistory[existingIndex],
              completed: !updatedHistory[existingIndex].completed,
              completedAt: !updatedHistory[existingIndex].completed 
                ? new Date().toISOString() 
                : null
            };
          } else {
            // Add new entry
            updatedHistory.push({
              date: today,
              completed: true,
              completedAt: new Date().toISOString()
            });
          }
          
          const newCurrentStreak = calculateCurrentStreak(updatedHistory);
          const newBestStreak = Math.max(habit.bestStreak || 0, newCurrentStreak);
          
          return {
            ...habit,
            completionHistory: updatedHistory,
            currentStreak: newCurrentStreak,
            bestStreak: newBestStreak
          };
        }
        return habit;
      })
    );
  };

  // Get today's completion for a habit
  const getTodayCompletion = (habit) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completionHistory?.find(entry => entry.date === today);
  };

  // Filter habits
  const getFilteredHabits = () => {
    return habits.filter(habit => {
      switch(filter) {
        case 'completed-today':
          return getTodayCompletion(habit)?.completed;
        case 'pending-today':
          return !getTodayCompletion(habit)?.completed;
        case 'active-streak':
          return habit.currentStreak > 0;
        case 'needs-attention':
          return habit.currentStreak === 0;
        default:
          return true;
      }
    });
  };

  // Reset all habits for today (mark as not completed)
  const handleResetToday = () => {
    if (window.confirm('Are you sure you want to reset all habits for today?')) {
      const today = new Date().toISOString().split('T')[0];
      
      setHabits(prevHabits =>
        prevHabits.map(habit => {
          const updatedHistory = habit.completionHistory?.map(entry =>
            entry.date === today
              ? { ...entry, completed: false, completedAt: null }
              : entry
          ) || [];
          
          const newCurrentStreak = calculateCurrentStreak(updatedHistory);
          
          return {
            ...habit,
            completionHistory: updatedHistory,
            currentStreak: newCurrentStreak
          };
        })
      );
    }
  };

  return (
    <div className="py-8 min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            🌱 Habits Tracker
          </h1>
          <p className="text-white/80 text-lg">
            Build better habits, track your progress, and transform your life
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-2 rounded-xl transition-all font-medium text-sm ${
                  viewMode === 'cards'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                📱 Habits
              </button>
              <button
                onClick={() => setViewMode('stats')}
                className={`px-4 py-2 rounded-xl transition-all font-medium text-sm flex items-center gap-2 ${
                  viewMode === 'stats'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <BarChart3 size={16} />
                Statistics
              </button>
            </div>

            {/* Filters (only show in cards view) */}
            {viewMode === 'cards' && (
              <div className="flex items-center gap-3">
                <Filter size={18} className="text-gray-600 dark:text-gray-300" />
                <div className="flex flex-wrap gap-2">
                  {['all', 'completed-today', 'pending-today', 'active-streak', 'needs-attention'].map(filterType => (
                    <button
                      key={filterType}
                      onClick={() => setFilter(filterType)}
                      className={`px-3 py-1 rounded-xl transition-all font-medium text-sm ${
                        filter === filterType
                          ? 'bg-purple-500 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {filterType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {viewMode === 'cards' && (
                <button
                  onClick={handleResetToday}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                  title="Reset all habits for today"
                >
                  <RotateCcw size={16} />
                  <span className="hidden sm:inline">Reset Today</span>
                </button>
              )}
              
              <button
                onClick={() => {
                  setEditingHabit(null);
                  setShowModal(true);
                }}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Plus size={20} />
                <span className="font-semibold">New Habit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'stats' ? (
          <HabitStats habits={habits} />
        ) : (
          <>
            {/* Habits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {getFilteredHabits().map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onEdit={handleEditHabit}
                  onDelete={handleDeleteHabit}
                  onToggleToday={handleToggleToday}
                  todayCompletion={getTodayCompletion(habit)}
                />
              ))}
            </div>

            {/* Empty State */}
            {getFilteredHabits().length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {filter === 'all' ? 'No habits yet!' : `No ${filter.replace('-', ' ')} habits!`}
                </h3>
                <p className="text-white/80 mb-6">
                  {filter === 'all' 
                    ? 'Start building better habits today!' 
                    : 'Try changing the filter or create new habits.'
                  }
                </p>
                {filter === 'all' && (
                  <button
                    onClick={() => {
                      setEditingHabit(null);
                      setShowModal(true);
                    }}
                    className="px-6 py-3 bg-white/20 dark:bg-gray-800/40 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 dark:hover:bg-gray-700 transition-colors"
                  >
                    Create Your First Habit
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* Habit Modal */}
        <HabitModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingHabit(null);
          }}
          onSave={handleSaveHabit}
          editingHabit={editingHabit}
        />
      </div>
    </div>
  );
};

export default HabitsPage;