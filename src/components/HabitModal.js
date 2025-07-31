import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

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
    '🌅', '🚶', '🧹', '📱', '🎨', '🎪', '🌱', '⭐', '🔥', '🎉'
  ];

  const daysOfWeek = [
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' }
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {editingHabit ? 'Edit Habit' : 'Create New Habit'}
          </h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
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
            <div className="grid grid-cols-10 gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              {commonIcons.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => handleInputChange('icon', icon)}
                  className={`text-2xl p-2 rounded-lg transition-all ${
                    formData.icon === icon
                      ? 'bg-purple-500 text-white shadow-lg scale-110'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
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
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-900 dark:text-white"
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
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-900 dark:text-white h-20 resize-none"
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
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-900 dark:text-white"
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
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-900 dark:text-white"
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
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>1 day</span>
              <span>7 days</span>
            </div>
          </div>

          {/* Scheduled Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Schedule Days
            </label>
            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map(day => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => handleScheduledDayToggle(day.value)}
                  className={`p-2 text-sm font-medium rounded-lg transition-all ${
                    formData.scheduledDays.includes(day.value)
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Selected: {formData.scheduledDays.length} day{formData.scheduledDays.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Submit Buttons */}
          <div className="flex space-x-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center space-x-2"
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