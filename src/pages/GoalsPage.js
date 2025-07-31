import React, { useState, useEffect } from 'react';

const GoalsPage = () => {
  // Load from localStorage or use default
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Learn React', completed: false },
      { id: 2, text: 'Exercise 3 times a week', completed: false },
    ];
  });
  const [input, setInput] = useState('');

  // Save to localStorage whenever goals change
  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const addGoal = () => {
    if (input.trim() === '') return;
    setGoals([
      ...goals,
      { id: Date.now(), text: input, completed: false }
    ]);
    setInput('');
  };

  const toggleGoal = (id) => {
    setGoals(goals.map(goal =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  return (
    <div className="py-8 min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            🏆 Goals
          </h1>
          <p className="text-white/80 text-lg">
            Set and track your personal goals!
          </p>
        </div>
        <div className="bg-white/90 dark:bg-gray-800/90 dark:text-gray-100 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
          <div className="flex mb-6">
            <input
              type="text"
              className="flex-1 rounded-l-full px-4 py-2 border-0 focus:ring-2 focus:ring-pink-400 dark:bg-gray-900 dark:text-white"
              placeholder="Add a new goal..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addGoal()}
            />
            <button
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-r-full font-bold hover:from-pink-500 hover:to-purple-500 transition"
              onClick={addGoal}
            >
              Add
            </button>
          </div>
          <ul>
            {goals.map(goal => (
              <li
                key={goal.id}
                className={`flex items-center justify-between mb-4 p-3 rounded-xl ${goal.completed ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}
              >
                <span
                  className={`flex-1 text-lg cursor-pointer ${goal.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-100'}`}
                  onClick={() => toggleGoal(goal.id)}
                >
                  {goal.text}
                </span>
                <button
                  className="ml-4 text-pink-500 hover:text-red-600 font-bold text-xl"
                  onClick={() => deleteGoal(goal.id)}
                  title="Delete"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          {goals.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-300 mt-8">No goals yet. Add one above!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;