import React, { useState, useEffect } from 'react';
import { X, Save, Info } from 'lucide-react';

const HabitModal = ({ isOpen, onClose, onSave, editingHabit = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🎯',
    category: 'personal',
    difficulty: 'medium',
    targetDays: 7,
    scheduledDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  });

  const categories = [
    { value: 'health', label: '❤️ Health' },
    { value: 'productivity', label: '⚡ Productivity' },
    { value: 'personal', label: '👤 Personal' },
    { value: 'fitness', label: '💪 Fitness' },
    { value: 'learning', label: '📚 Learning' },
    { value: 'social', label: '🤝 Social' }
  ];

  const difficulties = [
    { value: 'easy', label: '🟢 Easy' },
    { value: 'medium', label: '🟡 Medium' },
    { value: 'hard', label: '🔴 Hard' }
  ];

  const commonIcons = [
    '🎯', '💪', '📚', '🏃', '💧', '🧘', '🍎', '💤', '🎵', '✍️',
    '🌅', '🚶', '🧹', '📱', '🎨', '🎪', '🌱', '⭐', '🔥', '🎉',
    '☕', '🥗', '🏋️', '🚴', '🏊', '🎸', '📝', '🎭', '🌸', '🍵'
  ];

  const daysOfWeek = [
    { value: 'monday', label: 'Mon', fullName: 'Monday' },
    { value: 'tuesday', label: 'Tue', fullName: 'Tuesday' },
    { value: 'wednesday', label: 'Wed', fullName: 'Wednesday' },
    { value: 'thursday', label: 'Thu', fullName: 'Thursday' },
    { value: 'friday', label: 'Fri', fullName: 'Friday' },
    { value: 'saturday', label: 'Sat', fullName: 'Saturday' },
    { value: 'sunday', label: 'Sun', fullName: 'Sunday' }
  ];

  useEffect(() => {
    if (editingHabit) {
      setFormData({
        name: editingHabit.name || '',
        description: editingHabit.description || '',
        icon: editingHabit.icon || '🎯',
        category: editingHabit.category || 'personal',
        difficulty: editingHabit.difficulty || 'medium',
        targetDays: editingHabit.targetDays || 7,
        scheduledDays: editingHabit.scheduledDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      });
    } else {
      setFormData({
        name: '',
        description: '',
        icon: '🎯',
        category: 'personal',
        difficulty: 'medium',
        targetDays: 7,
        scheduledDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      });
    }
  }, [editingHabit, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScheduledDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      scheduledDays: prev.scheduledDays.includes(day)
        ? prev.scheduledDays.filter(d => d !== day)
        : [...prev.scheduledDays, day]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      icon: '🎯',
      category: 'personal',
      difficulty: 'medium',
      targetDays: 7,
      scheduledDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    });
    onClose();
  };

  const selectAllDays = () => {
    setFormData(prev => ({
      ...prev,
      scheduledDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }));
  };

  const selectWeekdays = () => {
    setFormData(prev => ({
      ...prev,
      scheduledDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    }));
  };

  const selectWeekends = () => {
    setFormData(prev => ({
      ...prev,
      scheduledDays: ['saturday', 'sunday']
    }));
  };

  const clearDays = () => {
    setFormData(prev => ({
      ...prev,
      scheduledDays: []
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {editingHabit ? 'Edit Habit' : 'Create New Habit'}
          </h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Choose Icon
            </label>
            <div className="grid grid-cols-6 gap-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl max-h-40 overflow-y-auto">
              {commonIcons.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => handleInputChange('icon', icon)}
                  className={`
                    aspect-square flex items-center justify-center text-xl rounded-lg transition-all duration-200 border-2
                    ${formData.icon === icon
                      ? 'bg-purple-500 border-purple-600 text-white shadow-lg transform scale-110'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700'
                    }
                  `}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Habit Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Habit Name *
            </label>
            <input
              type="text"
              placeholder="e.g., Drink 8 glasses of water"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-900 dark:text-white transition-colors"
              required
            />
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Description (Optional)
            </label>
            <textarea
              placeholder="Why is this habit important to you?"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-900 dark:text-white h-20 resize-none transition-colors"
            />
          </div>
          
          {/* Category and Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-900 dark:text-white transition-colors"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-900 dark:text-white transition-colors"
              >
                {difficulties.map(diff => (
                  <option key={diff.value} value={diff.value}>{diff.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Target Days per Week: {formData.targetDays}
            </label>
            <input
              type="range"
              min="1"
              max="7"
              value={formData.targetDays}
              onChange={(e) => handleInputChange('targetDays', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>1 day</span>
              <span>7 days</span>
            </div>
          </div>

          {/* Scheduled Days */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center">
                Schedule Days
                <div className="ml-2 group relative">
                  <Info size={14} className="text-gray-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity w-64 z-10">
                    Choose which days of the week you want to be reminded about this habit. This helps with planning and tracking consistency.
                  </div>
                </div>
              </label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={selectAllDays}
                  className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={selectWeekdays}
                  className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  Weekdays
                </button>
                <button
                  type="button"
                  onClick={selectWeekends}
                  className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                >
                  Weekends
                </button>
                <button
                  type="button"
                  onClick={clearDays}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map(day => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => handleScheduledDayToggle(day.value)}
                  className={`p-2 text-sm font-medium rounded-lg transition-all border-2 ${
                    formData.scheduledDays.includes(day.value)
                      ? 'bg-purple-500 border-purple-600 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700'
                  }`}
                  title={day.fullName}
                >
                  {day.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Selected: {formData.scheduledDays.length} day{formData.scheduledDays.length !== 1 ? 's' : ''}
              {formData.scheduledDays.length > 0 && (
                <span className="ml-2">
                  ({formData.scheduledDays.map(day => 
                    daysOfWeek.find(d => d.value === day)?.label
                  ).join(', ')})
                </span>
              )}
            </p>
          </div>
          
          {/* Submit Buttons */}
          <div className="flex space-x-3 mt-6">
            <button
              type="submit"
              disabled={!formData.name.trim()}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              <span>{editingHabit ? 'Update Habit' : 'Create Habit'}</span>
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitModal;