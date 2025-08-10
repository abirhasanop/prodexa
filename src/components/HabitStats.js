import React from 'react';
import { BarChart3, TrendingUp, Target, Calendar, Flame, Award } from 'lucide-react';

const HabitStats = ({ habits }) => {
  const today = new Date().toISOString().split('T')[0];

  // Calculate stats
  const totalHabits = habits.length;
  const completedToday = habits.filter(habit => {
    const todayCompletion = habit.completionHistory?.find(entry => entry.date === today);
    return todayCompletion?.completed;
  }).length;

  const activeStreaks = habits.filter(habit => habit.currentStreak > 0).length;
  const totalStreakDays = habits.reduce((sum, habit) => sum + (habit.currentStreak || 0), 0);
  const bestStreak = Math.max(...habits.map(habit => habit.bestStreak || 0), 0);

  // Calculate overall completion rate
  const totalCompletions = habits.reduce((sum, habit) => {
    return sum + (habit.completionHistory?.filter(entry => entry.completed).length || 0);
  }, 0);
  
  const totalPossibleCompletions = habits.reduce((sum, habit) => {
    return sum + (habit.completionHistory?.length || 0);
  }, 0);
  
  const overallCompletionRate = totalPossibleCompletions > 0 
    ? Math.round((totalCompletions / totalPossibleCompletions) * 100)
    : 0;

  // Get category breakdown
  const categoryStats = habits.reduce((acc, habit) => {
    const category = habit.category || 'personal';
    if (!acc[category]) {
      acc[category] = { count: 0, completed: 0 };
    }
    acc[category].count++;
    
    const todayCompletion = habit.completionHistory?.find(entry => entry.date === today);
    if (todayCompletion?.completed) {
      acc[category].completed++;
    }
    
    return acc;
  }, {});

  const categories = [
    { value: 'health', label: '❤️ Health', color: 'bg-red-500' },
    { value: 'productivity', label: '⚡ Productivity', color: 'bg-blue-500' },
    { value: 'personal', label: '👤 Personal', color: 'bg-purple-500' },
    { value: 'fitness', label: '💪 Fitness', color: 'bg-green-500' },
    { value: 'learning', label: '📚 Learning', color: 'bg-orange-500' },
    { value: 'social', label: '🤝 Social', color: 'bg-pink-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">{totalHabits}</div>
          <div className="text-gray-600 dark:text-gray-300 text-sm font-medium flex items-center justify-center">
            <Target className="w-4 h-4 mr-1" />
            Total Habits
          </div>
        </div>
        
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-300">
            {completedToday}/{totalHabits}
          </div>
          <div className="text-gray-600 dark:text-gray-300 text-sm font-medium flex items-center justify-center">
            <Calendar className="w-4 h-4 mr-1" />
            Today
          </div>
        </div>
        
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-300">{activeStreaks}</div>
          <div className="text-gray-600 dark:text-gray-300 text-sm font-medium flex items-center justify-center">
            <Flame className="w-4 h-4 mr-1" />
            Active Streaks
          </div>
        </div>
        
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">{overallCompletionRate}%</div>
          <div className="text-gray-600 dark:text-gray-300 text-sm font-medium flex items-center justify-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            Success Rate
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Achievement Stats */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-500" />
            Achievements
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300 text-sm">Best Streak Ever</span>
              <span className="font-bold text-purple-600 dark:text-purple-300">{bestStreak} days</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300 text-sm">Total Streak Days</span>
              <span className="font-bold text-green-600 dark:text-green-300">{totalStreakDays} days</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300 text-sm">Total Completions</span>
              <span className="font-bold text-blue-600 dark:text-blue-300">{totalCompletions}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300 text-sm">Today's Progress</span>
              <span className="font-bold text-yellow-600 dark:text-yellow-300">
                {totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
            Categories
          </h3>
          
          <div className="space-y-3">
            {Object.entries(categoryStats).map(([categoryKey, stats]) => {
              const categoryConfig = categories.find(cat => cat.value === categoryKey);
              const completionRate = stats.count > 0 ? Math.round((stats.completed / stats.count) * 100) : 0;
              
              return (
                <div key={categoryKey} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {categoryConfig?.label || categoryKey}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {stats.completed}/{stats.count} ({completionRate}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${categoryConfig?.color || 'bg-gray-500'}`}
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
            
            {Object.keys(categoryStats).length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-sm italic text-center py-4">
                No habits created yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-green-500" />
          This Week's Progress
        </h3>
        
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            const dateStr = date.toISOString().split('T')[0];
            
            const dayCompletions = habits.reduce((count, habit) => {
              const completion = habit.completionHistory?.find(entry => entry.date === dateStr);
              return count + (completion?.completed ? 1 : 0);
            }, 0);
            
            const completionRate = totalHabits > 0 ? (dayCompletions / totalHabits) * 100 : 0;
            
            return (
              <div key={i} className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div 
                  className={`w-full h-16 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                    completionRate >= 100 ? 'bg-green-500 text-white' :
                    completionRate >= 75 ? 'bg-yellow-500 text-white' :
                    completionRate >= 50 ? 'bg-orange-500 text-white' :
                    completionRate > 0 ? 'bg-red-500 text-white' :
                    'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {Math.round(completionRate)}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {dayCompletions}/{totalHabits}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 text-center">
          <div className="flex justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
              Perfect (100%)
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded mr-1"></div>
              Great (75%+)
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded mr-1"></div>
              Good (50%+)
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-1"></div>
              Started (1%+)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitStats;