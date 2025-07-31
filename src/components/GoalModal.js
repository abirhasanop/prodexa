import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

const GoalModal = ({ isOpen, onClose, onSave, editingGoal = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal',
    priority: 'medium',
    deadline: '',
    milestones: []
  });
  const [newMilestone, setNewMilestone] = useState('');

  const categories = [
    { value: 'personal', label: '👤 Personal' },
    { value: 'career', label: '💼 Career' },
    { value: 'health', label: '❤️ Health' },
    { value: 'financial', label: '💰 Financial' },
    { value: 'learning', label: '📚 Learning' }
  ];

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  // Set form data when editing or reset when creating new
  useEffect(() => {
    if (editingGoal) {
      setFormData({
        title: editingGoal.title || '',
        description: editingGoal.description || '',
        category: editingGoal.category || 'personal',
        priority: editingGoal.priority || 'medium',
        deadline: editingGoal.deadline || '',
        milestones: editingGoal.milestones || []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'personal',
        priority: 'medium',
        deadline: '',
        milestones: []
      });
    }
    setNewMilestone('');
  }, [editingGoal, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addMilestone = () => {
    if (newMilestone.trim()) {
      const milestone = {
        id: Date.now(),
        text: newMilestone.trim(),
        completed: false
      };
      setFormData(prev => ({
        ...prev,
        milestones: [...prev.milestones, milestone]
      }));
      setNewMilestone('');
    }
  };

  const removeMilestone = (milestoneId) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(m => m.id !== milestoneId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSave(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      category: 'personal',
      priority: 'medium',
      deadline: '',
      milestones: []
    });
    setNewMilestone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {editingGoal ? 'Edit Goal' : 'Create New Goal'}
          </h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Goal Title *
            </label>
            <input
              type="text"
              placeholder="Goal title..."
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-900 dark:text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Description
            </label>
            <textarea
              placeholder="Goal description..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-900 dark:text-white h-20 resize-none"
            />
          </div>
          
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
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-900 dark:text-white"
              >
                {priorities.map(p => (
                  <option key={p.value} value={p.value}>{p.label} Priority</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Deadline
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => handleInputChange('deadline', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-900 dark:text-white"
            />
          </div>
          
          {/* Milestones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Milestones
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add milestone..."
                value={newMilestone}
                onChange={(e) => setNewMilestone(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMilestone())}
                className="flex-1 px-3 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none dark:bg-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={addMilestone}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-1"
              >
                <Plus size={16} />
                Add
              </button>
            </div>
            
            {formData.milestones.length > 0 && (
              <div className="space-y-1 max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                {formData.milestones.map(milestone => (
                  <div key={milestone.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-200 flex-1">{milestone.text}</span>
                    <button
                      type="button"
                      onClick={() => removeMilestone(milestone.id)}
                      className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              {editingGoal ? 'Update Goal' : 'Create Goal'}
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

export default GoalModal;