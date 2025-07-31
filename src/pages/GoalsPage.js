import React, { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import GoalCard from '../components/GoalCard';
import GoalModal from '../components/GoalModal';

const GoalsPage = () => {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('awesome-goals');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: 'Learn React Development',
        description: 'Master React and build amazing applications',
        category: 'learning',
        priority: 'high',
        deadline: '2025-12-31',
        progress: 50,
        status: 'in-progress',
        milestones: [
          { id: 1, text: 'Complete React basics', completed: true },
          { id: 2, text: 'Build first project', completed: true },
          { id: 3, text: 'Learn advanced concepts', completed: false },
          { id: 4, text: 'Deploy production app', completed: false }
        ],
        createdAt: '2025-01-15',
        completedAt: null
      },
      {
        id: 2,
        title: 'Run a Marathon',
        description: 'Complete a full 42km marathon race',
        category: 'health',
        priority: 'medium',
        deadline: '2025-10-15',
        progress: 25,
        status: 'in-progress',
        milestones: [
          { id: 1, text: 'Run 5km without stopping', completed: true },
          { id: 2, text: 'Run 10km distance', completed: false },
          { id: 3, text: 'Complete half marathon', completed: false },
          { id: 4, text: 'Run full marathon', completed: false }
        ],
        createdAt: '2025-01-10',
        completedAt: null
      }
    ];
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [filter, setFilter] = useState('all');

  // Save goals to localStorage whenever goals change
  useEffect(() => {
    localStorage.setItem('awesome-goals', JSON.stringify(goals));
  }, [goals]);

  // Calculate goal status
  const calculateGoalStatus = (goal) => {
    if (goal.progress === 100) return 'completed';
    if (new Date(goal.deadline) < new Date() && goal.progress < 100) return 'overdue';
    if (goal.progress > 0) return 'in-progress';
    return 'not-started';
  };

  // Calculate progress based on milestones
  const calculateProgress = (milestones) => {
    if (!milestones || milestones.length === 0) return 0;
    const completedCount = milestones.filter(m => m.completed).length;
    return Math.round((completedCount / milestones.length) * 100);
  };

  // Update goal progress and status
  const updateGoalProgress = (goalId) => {
    setGoals(prevGoals => 
      prevGoals.map(goal => {
        if (goal.id === goalId) {
          const newProgress = calculateProgress(goal.milestones);
          const newStatus = calculateGoalStatus({ ...goal, progress: newProgress });
          
          return {
            ...goal,
            progress: newProgress,
            status: newStatus,
            completedAt: newProgress === 100 && goal.completedAt === null ? new Date().toISOString() : goal.completedAt
          };
        }
        return goal;
      })
    );
  };

  // Handle milestone toggle
  const handleToggleMilestone = (goalId, milestoneId) => {
    setGoals(prevGoals => {
      const updatedGoals = prevGoals.map(goal => {
        if (goal.id === goalId) {
          const updatedMilestones = goal.milestones.map(milestone =>
            milestone.id === milestoneId
              ? { ...milestone, completed: !milestone.completed }
              : milestone
          );
          
          const newProgress = calculateProgress(updatedMilestones);
          const newStatus = calculateGoalStatus({ ...goal, progress: newProgress });
          
          return {
            ...goal,
            milestones: updatedMilestones,
            progress: newProgress,
            status: newStatus,
            completedAt: newProgress === 100 && goal.completedAt === null ? new Date().toISOString() : 
                          newProgress < 100 ? null : goal.completedAt
          };
        }
        return goal;
      });
      
      return updatedGoals;
    });
  };

  // Handle goal creation/editing
  const handleSaveGoal = (goalData) => {
    if (editingGoal) {
      // Update existing goal
      setGoals(prevGoals =>
        prevGoals.map(goal =>
          goal.id === editingGoal.id
            ? {
                ...goal,
                ...goalData,
                progress: calculateProgress(goalData.milestones),
                status: calculateGoalStatus({ ...goal, ...goalData, progress: calculateProgress(goalData.milestones) }),
                updatedAt: new Date().toISOString()
              }
            : goal
        )
      );
      setEditingGoal(null);
    } else {
      // Create new goal
      const newGoal = {
        id: Date.now(),
        ...goalData,
        progress: calculateProgress(goalData.milestones),
        status: 'not-started',
        createdAt: new Date().toISOString(),
        completedAt: null
      };
      
      // Update status based on progress
      newGoal.status = calculateGoalStatus(newGoal);
      
      setGoals(prevGoals => [...prevGoals, newGoal]);
    }
    setShowCreateModal(false);
  };

  // Handle goal deletion
  const handleDeleteGoal = (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
    }
  };

  // Handle goal editing
  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setShowCreateModal(true);
  };

  // Filter goals
  const getFilteredGoals = () => {
    return goals.filter(goal => {
      const status = calculateGoalStatus(goal);
      switch(filter) {
        case 'completed': return status === 'completed';
        case 'in-progress': return status === 'in-progress';
        case 'overdue': return status === 'overdue';
        case 'not-started': return status === 'not-started';
        default: return true;
      }
    });
  };

  // Calculate statistics
  const stats = {
    total: goals.length,
    completed: goals.filter(g => calculateGoalStatus(g) === 'completed').length,
    inProgress: goals.filter(g => calculateGoalStatus(g) === 'in-progress').length,
    overdue: goals.filter(g => calculateGoalStatus(g) === 'overdue').length
  };

  return (
    <div className="py-8 min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            🎯 Goal Tracker
          </h1>
          <p className="text-white/80 text-lg">
            Set ambitious goals, track progress, and achieve greatness
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">{stats.total}</div>
            <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">Total Goals</div>
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-300">{stats.completed}</div>
            <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">Completed</div>
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">{stats.inProgress}</div>
            <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">In Progress</div>
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-300">{stats.overdue}</div>
            <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">Overdue</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Filters */}
            <div className="flex items-center gap-3">
              <Filter size={18} className="text-gray-600 dark:text-gray-300" />
              <div className="flex flex-wrap gap-2">
                {['all', 'not-started', 'in-progress', 'completed', 'overdue'].map(filterType => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm ${
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

            {/* Add Goal Button */}
            <button
              onClick={() => {
                setEditingGoal(null);
                setShowCreateModal(true);
              }}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Plus size={20} />
              <span className="font-semibold">New Goal</span>
            </button>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {getFilteredGoals().map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
              onToggleMilestone={handleToggleMilestone}
            />
          ))}
        </div>

        {/* Empty State */}
        {getFilteredGoals().length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {filter === 'all' ? 'No goals yet!' : `No ${filter.replace('-', ' ')} goals!`}
            </h3>
            <p className="text-white/80 mb-6">
              {filter === 'all' ? 'Start by creating your first goal!' : 'Try changing the filter or create new goals.'}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => {
                  setEditingGoal(null);
                  setShowCreateModal(true);
                }}
                className="px-6 py-3 bg-white/20 dark:bg-gray-800/40 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 dark:hover:bg-gray-700 transition-colors"
              >
                Create Your First Goal
              </button>
            )}
          </div>
        )}

        {/* Goal Modal */}
        <GoalModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setEditingGoal(null);
          }}
          onSave={handleSaveGoal}
          editingGoal={editingGoal}
        />
      </div>
    </div>
  );
};

export default GoalsPage;