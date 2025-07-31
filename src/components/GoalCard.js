import React from 'react';
import { Target, Calendar, Edit3, Trash2, CheckCircle, Circle } from 'lucide-react';

const GoalCard = ({ goal, onEdit, onDelete, onToggleMilestone }) => {
  const categories = [
    { value: 'personal', label: '👤 Personal', colorClass: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
    { value: 'career', label: '💼 Career', colorClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    { value: 'health', label: '❤️ Health', colorClass: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    { value: 'financial', label: '💰 Financial', colorClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    { value: 'learning', label: '📚 Learning', colorClass: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', colorClass: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300' },
    { value: 'medium', label: 'Medium', colorClass: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300' },
    { value: 'high', label: 'High', colorClass: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300' }
  ];

  const calculateGoalStatus = (goalData) => {
    if (goalData.progress === 100) return 'completed';
    if (new Date(goalData.deadline) < new Date() && goalData.progress < 100) return 'overdue';
    if (goalData.progress > 0) return 'in-progress';
    return 'not-started';
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCategoryConfig = (category) => {
    return categories.find(cat => cat.value === category) || categories[0];
  };

  const getPriorityConfig = (priority) => {
    return priorities.find(p => p.value === priority) || priorities[1];
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'in-progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
      case 'overdue': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      case 'not-started': return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getProgressBarColor = (category) => {
    switch(category) {
      case 'personal': return 'from-purple-500 to-purple-600';
      case 'career': return 'from-blue-500 to-blue-600';
      case 'health': return 'from-red-500 to-red-600';
      case 'financial': return 'from-green-500 to-green-600';
      case 'learning': return 'from-orange-500 to-orange-600';
      default: return 'from-purple-500 to-purple-600';
    }
  };

  const status = calculateGoalStatus(goal);
  const categoryConfig = getCategoryConfig(goal.category);
  const priorityConfig = getPriorityConfig(goal.priority);
  const daysRemaining = getDaysRemaining(goal.deadline);
  const progressBarColor = getProgressBarColor(goal.category);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-[1.02]">
      {/* Goal Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-purple-500" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{goal.title}</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{goal.description}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryConfig.colorClass}`}>
              {categoryConfig.label}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityConfig.colorClass}`}>
              {priorityConfig.label} Priority
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
              {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(goal)}
            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
            title="Edit Goal"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
            title="Delete Goal"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
          <span className="text-sm font-bold text-purple-600 dark:text-purple-300">{goal.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className={`bg-gradient-to-r ${progressBarColor} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${goal.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Deadline */}
      {goal.deadline && (
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Due: {new Date(goal.deadline).toLocaleDateString()}
          </span>
          {daysRemaining >= 0 ? (
            <span className={`text-xs px-2 py-1 rounded-full ${
              daysRemaining <= 7 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
              daysRemaining <= 30 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            }`}>
              {daysRemaining} days left
            </span>
          ) : (
            <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              {Math.abs(daysRemaining)} days overdue
            </span>
          )}
        </div>
      )}

      {/* Milestones */}
      {goal.milestones && goal.milestones.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            Milestones ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {goal.milestones.map(milestone => (
              <div
                key={milestone.id}
                className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <button
                  onClick={() => onToggleMilestone(goal.id, milestone.id)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    milestone.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                  }`}
                >
                  {milestone.completed ? <CheckCircle size={12} /> : <Circle size={12} />}
                </button>
                <span className={`text-sm flex-1 ${
                  milestone.completed
                    ? 'line-through text-gray-500 dark:text-gray-400'
                    : 'text-gray-700 dark:text-gray-200'
                }`}>
                  {milestone.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalCard;