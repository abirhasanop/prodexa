import React, { useState, useEffect } from 'react';

const defaultHabits = [
  { id: 1, name: 'Drink Water', streak: 0, completed: false },
  { id: 2, name: 'Read 10 pages', streak: 0, completed: false },
];

const HabitsPage = () => {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : defaultHabits;
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    if (input.trim() === '') return;
    setHabits([
      ...habits,
      { id: Date.now(), name: input, streak: 0, completed: false }
    ]);
    setInput('');
  };

  const toggleHabit = (id) => {
    setHabits(habits.map(habit =>
      habit.id === id
        ? {
            ...habit,
            completed: !habit.completed,
            streak: !habit.completed ? habit.streak + 1 : habit.streak
          }
        : habit
    ));
  };

  const resetHabits = () => {
    setHabits(habits.map(habit => ({ ...habit, completed: false })));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  return (
    <div className="py-8 min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            🌱 Habits Tracker
          </h1>
          <p className="text-white/80 text-lg">
            Build good habits and track your daily streaks!
          </p>
        </div>
        <div className="bg-white/90 dark:bg-gray-800/90 dark:text-gray-100 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
          <div className="flex mb-6">
            <input
              type="text"
              className="flex-1 rounded-l-full px-4 py-2 border-0 focus:ring-2 focus:ring-pink-400 dark:bg-gray-900 dark:text-white"
              placeholder="Add a new habit..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addHabit()}
            />
            <button
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-r-full font-bold hover:from-pink-500 hover:to-purple-500 transition"
              onClick={addHabit}
            >
              Add
            </button>
          </div>
          <ul>
            {habits.map(habit => (
              <li
                key={habit.id}
                className={`flex items-center justify-between mb-4 p-3 rounded-xl ${habit.completed ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}
              >
                <span
                  className={`flex-1 text-lg cursor-pointer ${habit.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-100'}`}
                  onClick={() => toggleHabit(habit.id)}
                  title="Mark as done"
                >
                  {habit.name}
                </span>
                <span className="mx-4 text-sm text-purple-700 dark:text-pink-300 font-semibold">
                  🔥 Streak: {habit.streak}
                </span>
                <button
                  className="ml-2 text-pink-500 hover:text-red-600 font-bold text-xl"
                  onClick={() => deleteHabit(habit.id)}
                  title="Delete"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          {habits.length > 0 && (
            <button
              className="mt-6 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-full font-bold hover:from-purple-500 hover:to-pink-500 transition"
              onClick={resetHabits}
            >
              Reset Today's Habits
            </button>
          )}
          {habits.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-300 mt-8">No habits yet. Add one above!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitsPage;