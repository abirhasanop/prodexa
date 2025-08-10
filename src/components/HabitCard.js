import React from 'react';
import { Edit3, Trash2, Flame, Calendar, Target, TrendingUp, Clock } from 'lucide-react';

const HabitCard = ({ habit, onEdit, onDelete, onToggleToday, todayCompletion }) => {
  const categories = [
    { value: 'health', label: '❤️ Health', colorClass: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    { value: 'productivity', label: '⚡ Productivity', colorClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    { value: 'personal', label: '👤 Personal', colorClass: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
    { value: 'fitness', label: '💪 Fitness', colorClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    { value: 'learning', label: '📚 Learning', colorClass: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
    { value: 'social', label: '🤝 Social', colorClass: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' }
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy', icon: '🟢', colorClass: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300' },
    { value: 'medium', label: 'Medium', icon: '🟡', colorClass: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300' },
    { value: 'hard', label: 'Hard', icon: '🔴', colorClass: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300' }
  ];

  const daysOfWeek = [
    { value: 'sunday', label: 'Sun', fullName: 'Sunday' },
    { value: 'monday', label: 'Mon', fullName: 'Monday' },
    { value: 'tuesday', label: 'Tue', fullName: 'Tuesday' },
    { value: 'wednesday', label: 'Wed', fullName: 'Wednesday' },
    { value: 'thursday', label: 'Thu', fullName: 'Thursday' },
    { value: 'friday', label: 'Fri', fullName: 'Friday' },
    { value: 'saturday', label: 'Sat', fullName: 'Saturday' }
  ];

  const getCategoryConfig = (category) => {
    return categories.find(cat => cat.value === category) || categories[2]; // default to personal
  };

  const getDifficultyConfig = (difficulty) => {
    return difficulties.find(diff => diff.value === difficulty) || difficulties[1]; // default to medium
  };

  const getStreakColor = (streak) => {
    if (streak >= 30) return 'text-purple-600 dark:text-purple-300';
    if (streak >= 14) return 'text-blue-600 dark:text-blue-300';
    if (streak >= 7) return 'text-green-600 dark:text-green-300';
    if (streak >= 3) return 'text-yellow-600 dark:text-yellow-300';
    return 'text-gray-600 dark:text-gray-300';
  };

  const getCompletionRate = () => {
    if (!habit.completionHistory || habit.completionHistory.length === 0) return 0;
    const completedDays = habit.completionHistory.filter(entry => entry.completed).length;
    return Math.round((completedDays / habit.completionHistory.length) * 100);
  };

  const getLast7Days = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const completion = habit.completionHistory?.find(entry => entry.date === dateStr);
      last7Days.push({
        date: dateStr,
        completed: completion?.completed || false,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }
    
    return last7Days;
  };

  // Check if today is a scheduled day for this habit
  const isTodayScheduled = () => {
    if (!habit.scheduledDays || habit.scheduledDays.length === 0) return true; // If no schedule set, assume all days
    
    const today = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayName = dayNames[today.getDay()];
    
    return habit.scheduledDays.includes(todayName);
  };

  // Get scheduled days display
  const getScheduledDaysDisplay = () => {
    if (!habit.scheduledDays || habit.scheduledDays.length === 0) return 'Every day';
    if (habit.scheduledDays.length === 7) return 'Every day';
    if (habit.scheduledDays.length === 5 && 
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].every(day => habit.scheduledDays.includes(day))) {
      return 'Weekdays';
    }
    if (habit.scheduledDays.length === 2 && 
        ['saturday', 'sunday'].every(day => habit.scheduledDays.includes(day))) {
      return 'Weekends';
    }
    
    return habit.scheduledDays
      .map(day => daysOfWeek.find(d => d.value === day)?.label)
      .filter(Boolean)
      .join(', ');
  };

  const categoryConfig = getCategoryConfig(habit.category);
  const difficultyConfig = getDifficultyConfig(habit.difficulty);
  const completionRate = getCompletionRate();
  const last7Days = getLast7Days();
  const todayScheduled = isTodayScheduled();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-[1.02]">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className="text-2xl">{habit.icon || '🎯'}</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{habit.name}</h3>
          </div>
          
          {habit.description && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{habit.description}</p>
          )}
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryConfig.colorClass}`}>
              {categoryConfig.label}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyConfig.colorClass}`}>
              {difficultyConfig.icon} {difficultyConfig.label}
            </span>
            {habit.targetDays && habit.targetDays < 7 && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                🎯 {habit.targetDays} days/week
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 flex items-center">
              <Clock size={10} className="mr-1" />
              {getScheduledDaysDisplay()}
            </span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(habit)}
            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
            title="Edit Habit"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete(habit.id)}
            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
            title="Delete Habit"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className={`text-2xl font-bold ${getStreakColor(habit.currentStreak || 0)}`}>
            {habit.currentStreak || 0}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
            <Flame size={12} className="mr-1" />
            Current Streak
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">
            {habit.bestStreak || 0}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
            <Target size={12} className="mr-1" />
            Best Streak
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-300">
            {completionRate}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
            <TrendingUp size={12} className="mr-1" />
            Success Rate
          </div>
        </div>
      </div>

      {/* 7-Day Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Last 7 Days</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {last7Days.filter(day => day.completed).length}/7 completed
          </span>
        </div>
        <div className="flex space-x-1">
          {last7Days.map((day, index) => (
            <div key={index} className="flex-1 text-center">
              <div className={`w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                day.completed 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                {day.completed ? '✓' : '○'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {day.dayName}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Action */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        {!todayScheduled ? (
          <div className="text-center py-3 px-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              📅 Not scheduled for today
            </span>
          </div>
        ) : (
          <>
            <button
              onClick={() => onToggleToday(habit.id)}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                todayCompletion?.completed
                  ? 'bg-green-500 text-white shadow-lg hover:bg-green-600'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg'
              }`}
            >
              {todayCompletion?.completed ? '✅ Completed Today!' : '⚡ Mark as Done Today'}
            </button>
            
            {todayCompletion?.completed && todayCompletion.completedAt && (
              <div className="text-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                Completed at {new Date(todayCompletion.completedAt).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HabitCard;