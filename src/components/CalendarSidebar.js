import React from 'react';
import { CalendarIcon, Clock, Bell } from 'lucide-react';

const CalendarSidebar = ({ events, todos }) => {
  const eventTypes = [
    { value: 'meeting', label: '💼 Meeting', color: 'bg-purple-500' },
    { value: 'personal', label: '👤 Personal', color: 'bg-pink-500' },
    { value: 'work', label: '⚡ Work', color: 'bg-orange-500' },
    { value: 'health', label: '❤️ Health', color: 'bg-red-500' },
    { value: 'social', label: '🎉 Social', color: 'bg-green-500' }
  ];

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getEventTypeConfig = (type) => {
    return eventTypes.find(et => et.value === type) || eventTypes[0];
  };

  const getTodaysEvents = () => {
    const today = new Date().toISOString().split('T')[0];
    return events.filter(event => event.date === today).slice(0, 3);
  };

  const getWeekEvents = () => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= weekStart && eventDate <= weekEnd;
    }).length;
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    return events.filter(event => new Date(event.date) > today).length;
  };

  return (
    <div className="space-y-6">
      {/* Today's Events */}
      <div className="bg-white/90 dark:bg-gray-800/90 dark:text-gray-100 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <CalendarIcon size={20} className="mr-2" />
          Today's Events
        </h3>
        
        {getTodaysEvents().length > 0 ? (
          <div className="space-y-3">
            {getTodaysEvents().map(event => {
              const typeConfig = getEventTypeConfig(event.type);
              return (
                <div key={event.id} className={`p-3 rounded-lg border-l-4 ${typeConfig.color} bg-gray-50 dark:bg-gray-700/50`}>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{event.title}</h4>
                  <div className="flex items-center space-x-2 mt-1 text-xs text-gray-600 dark:text-gray-300">
                    <Clock size={12} />
                    <span>{formatTime(event.time)}</span>
                    {event.reminder && <Bell size={12} className="text-yellow-500" />}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm italic">No events today</p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="bg-white/90 dark:bg-gray-800/90 dark:text-gray-100 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Quick Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Total Events</span>
            <span className="font-semibold text-purple-600 dark:text-purple-300">{events.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">This Week</span>
            <span className="font-semibold text-pink-600 dark:text-pink-300">{getWeekEvents()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Upcoming</span>
            <span className="font-semibold text-green-600 dark:text-green-300">{getUpcomingEvents()}</span>
          </div>
        </div>
      </div>

      {/* Event Types */}
      <div className="bg-white/90 dark:bg-gray-800/90 dark:text-gray-100 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Event Types</h3>
        <div className="space-y-2">
          {eventTypes.map(type => {
            const count = events.filter(event => event.type === type.value).length;
            return (
              <div key={type.value} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{type.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarSidebar;