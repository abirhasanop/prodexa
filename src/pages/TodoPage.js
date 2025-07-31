import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Edit3, Calendar, Clock, Filter } from 'lucide-react';

const TodoPage = () => {
  // Load todos from localStorage or use default ones
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('awesome-todos');
    if (savedTodos) {
      return JSON.parse(savedTodos);
    }
    return [
      { id: 1, text: 'Welcome to your awesome todo app!', completed: false, priority: 'medium', dueDate: '2024-07-28', category: 'personal' },
      { id: 2, text: 'Check out other features in the navbar', completed: false, priority: 'high', dueDate: '2024-07-27', category: 'work' }
    ];
  });
  
  const [inputText, setInputText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('personal');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all');

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('awesome-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputText.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: inputText,
        completed: false,
        priority: priority,
        dueDate: dueDate,
        category: category
      }]);
      setInputText('');
      setDueDate('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: editText } : todo
    ));
    setEditingId(null);
    setEditText('');
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'border-l-red-500 bg-red-50 dark:bg-red-900/40 dark:border-l-red-600';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/40 dark:border-l-yellow-600';
      case 'low': return 'border-l-green-500 bg-green-50 dark:bg-green-900/40 dark:border-l-green-600';
      default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-800/60 dark:border-l-gray-600';
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'work': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'personal': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'shopping': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'health': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch(filter) {
      case 'completed': return todo.completed;
      case 'pending': return !todo.completed;
      case 'high': return todo.priority === 'high';
      case 'overdue': return new Date(todo.dueDate) < new Date() && !todo.completed;
      default: return true;
    }
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="py-8 min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            ✅ Todo Manager
          </h1>
          <p className="text-white/80 text-lg">Stay organized, stay productive</p>
          <div className="mt-4 inline-flex items-center space-x-4 bg-white/20 dark:bg-gray-800/40 backdrop-blur-sm rounded-full px-6 py-2">
            <div className="text-white">
              <span className="font-semibold">{completedCount}</span>
              <span className="text-white/80"> completed</span>
            </div>
            <div className="w-1 h-6 bg-white/30"></div>
            <div className="text-white">
              <span className="font-semibold">{totalCount - completedCount}</span>
              <span className="text-white/80"> remaining</span>
            </div>
          </div>
        </div>

        {/* Add Todo Section */}
        <div className="bg-white/95 dark:bg-gray-800/90 dark:text-gray-100 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none transition-colors dark:bg-gray-900 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              />
            </div>
            
            <div className="flex gap-3 flex-wrap">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-900 dark:text-white"
              >
                <option value="personal">👤 Personal</option>
                <option value="work">💼 Work</option>
                <option value="shopping">🛒 Shopping</option>
                <option value="health">❤️ Health</option>
              </select>
              
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-900 dark:text-white"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
              
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-900 dark:text-white"
              />
              
              <button
                onClick={addTodo}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <Plus size={20} />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white/90 dark:bg-gray-800/90 dark:text-gray-100 backdrop-blur-sm rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={18} className="text-gray-600 dark:text-gray-300" />
            <span className="text-gray-700 dark:text-gray-200 font-medium">Filter:</span>
            {['all', 'pending', 'completed', 'high', 'overdue'].map(filterType => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Todos List */}
        <div className="space-y-3">
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              className={`bg-white dark:bg-gray-800 dark:text-gray-100 rounded-xl shadow-lg border-l-4 ${getPriorityColor(todo.priority)} p-4 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl ${
                todo.completed ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      todo.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                    }`}
                  >
                    {todo.completed && <Check size={14} />}
                  </button>
                  
                  <div className="flex-1">
                    {editingId === todo.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-1 px-2 py-1 border rounded focus:outline-none focus:border-purple-500 dark:bg-gray-900 dark:text-white dark:border-gray-700"
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                        />
                        <button
                          onClick={() => saveEdit(todo.id)}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className={`text-lg ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-100'}`}>
                          {todo.text}
                        </p>
                        <div className="flex items-center space-x-3 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(todo.category)}`}>
                            {todo.category}
                          </span>
                          {todo.dueDate && (
                            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-300">
                              <Calendar size={14} />
                              <span>{new Date(todo.dueDate).toLocaleDateString()}</span>
                              {new Date(todo.dueDate) < new Date() && !todo.completed && (
                                <span className="text-red-500 font-semibold ml-2">Overdue!</span>
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    todo.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {todo.priority}
                  </span>
                  
                  {editingId !== todo.id && (
                    <button
                      onClick={() => startEditing(todo.id, todo.text)}
                      className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors duration-200"
                    >
                      <Edit3 size={16} />
                    </button>
                  )}
                  
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTodos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {filter === 'all' ? 'No todos yet!' : `No ${filter} todos!`}
            </h3>
            <p className="text-white/80">
              {filter === 'all' ? 'Add your first task above!' : 'Try changing the filter or add new todos.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoPage;