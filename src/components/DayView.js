import React, { useState, useEffect } from 'react';
import { X, Plus, Edit3, Trash2, Clock, MapPin, User, CalendarIcon, CheckSquare, Bell } from 'lucide-react';

const DayView = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  events, 
  todos, 
  onAddEvent, 
  onEditEvent, 
  onDeleteEvent 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const eventTypes = [
    { value: 'meeting', label: '💼 Meeting', color: 'bg-purple-500' },
    { value: 'personal', label: '👤 Personal', color: 'bg-pink-500' },
    { value: 'work', label: '⚡ Work', color: 'bg-orange-500' },
    { value: 'health', label: '❤️ Health', color: 'bg-red-500' },
    { value: 'social', label: '🎉 Social', color: 'bg-green-500' }
  ];

  // Handle modal open/close animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay to trigger animation
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before hiding
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  const getEventTypeConfig = (type) => {
    return eventTypes.find(et => et.value === type) || eventTypes[0];
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Don't render if not visible
  if (!isVisible || !selectedDate) return null;

  const dayEvents = events.filter(event => 
    event.date === selectedDate.toISOString().split('T')[0]
  ).sort((a, b) => a.time.localeCompare(b.time));

  const dayTodos = todos.filter(todo => 
    todo.dueDate === selectedDate.toISOString().split('T')[0]
  );

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-300 ease-out ${
        isAnimating 
          ? 'bg-black/50 backdrop-blur-sm' 
          : 'bg-black/0 backdrop-blur-none'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div 
        className={`bg-white dark:bg-gray-800 dark:text-gray-100 rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-all duration-300 ease-out transform ${
          isAnimating 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={onAddEvent}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              <Plus size={16} />
              <span>Add Event</span>
            </button>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Events Section */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center">
            <CalendarIcon size={20} className="mr-2" />
            Events ({dayEvents.length})
          </h4>
          
          {dayEvents.length > 0 ? (
            <div className="space-y-3">
              {dayEvents.map((event, index) => {
                const typeConfig = getEventTypeConfig(event.type);
                return (
                  <div 
                    key={event.id} 
                    className={`p-4 rounded-xl border-l-4 ${typeConfig.color} bg-gray-50 dark:bg-gray-700/50 transition-all duration-200 hover:shadow-md transform hover:scale-[1.02] animate-fadeInUp`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-semibold text-gray-800 dark:text-gray-100">{event.title}</h5>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => onEditEvent(event)}
                          className="p-1 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/50 rounded transition-all duration-200 transform hover:scale-110"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => onDeleteEvent(event.id)}
                          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 rounded transition-all duration-200 transform hover:scale-110"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center space-x-2">
                        <Clock size={14} />
                        <span>{formatTime(event.time)}</span>
                        {event.reminder && <Bell size={14} className="text-yellow-500 animate-pulse" />}
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center space-x-2">
                          <MapPin size={14} />
                          <span>{event.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <User size={14} />
                        <span className={`px-2 py-1 rounded-full text-xs ${typeConfig.color} text-white transition-all duration-200 hover:shadow-md`}>
                          {typeConfig.label}
                        </span>
                      </div>
                      
                      {event.description && (
                        <p className="mt-2 text-gray-700 dark:text-gray-200">{event.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 animate-fadeIn">
              <div className="text-4xl mb-2">📅</div>
              <p className="text-gray-500 dark:text-gray-400 italic">No events scheduled for this day</p>
            </div>
          )}
        </div>

        {/* Todos Section */}
        {dayTodos.length > 0 && (
          <div className="animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center">
              <CheckSquare size={20} className="mr-2" />
              Tasks Due ({dayTodos.length})
            </h4>
            
            <div className="space-y-2">
              {dayTodos.map((todo, index) => (
                <div 
                  key={todo.id} 
                  className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border-l-4 transition-all duration-200 hover:shadow-md transform hover:scale-[1.02] animate-fadeInUp ${
                    todo.priority === 'high' ? 'border-red-500' :
                    todo.priority === 'medium' ? 'border-yellow-500' :
                    'border-green-500'
                  }`}
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-medium transition-all duration-200 ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-100'}`}>
                      {todo.text}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:shadow-md ${
                        todo.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {todo.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:shadow-md ${
                        todo.category === 'work' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        todo.category === 'personal' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' :
                        todo.category === 'shopping' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      }`}>
                        {todo.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default DayView;