import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { Plus } from 'lucide-react';
import EventModal from '../components/EventModal';
import DayView from '../components/DayView';
import CalendarSidebar from '../components/CalendarSidebar';
import 'react-calendar/dist/Calendar.css';

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDayView, setShowDayView] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Load events from localStorage
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('calendar-events');
    return savedEvents ? JSON.parse(savedEvents) : [
      {
        id: 1,
        title: 'Team Meeting',
        description: 'Weekly team sync meeting',
        date: '2025-07-31',
        time: '10:00',
        type: 'meeting',
        location: 'Conference Room A',
        reminder: true
      }
    ];
  });

  // Load todos from localStorage
  const [todos] = useState(() => {
    const savedTodos = localStorage.getItem('awesome-todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  // Save events to localStorage
  useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(events));
  }, [events]);

  const handleSaveEvent = (eventData) => {
    if (editingEvent) {
      // Update existing event
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? { ...eventData, id: editingEvent.id }
          : event
      ));
      setEditingEvent(null);
    } else {
      // Create new event
      const newEvent = {
        ...eventData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      setEvents([...events, newEvent]);
    }
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEventModal(true);
    setShowDayView(false);
  };

  const handleDayClick = (clickedDate) => {
    setSelectedDate(clickedDate);
    setShowDayView(true);
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowEventModal(true);
  };

  const handleAddEventFromDay = () => {
    setEditingEvent(null);
    setShowEventModal(true);
    setShowDayView(false);
  };

  const hasEventsOrTodos = (targetDate) => {
    const dateStr = targetDate.toISOString().split('T')[0];
    const hasEvents = events.some(event => event.date === dateStr);
    const hasTodos = todos.some(todo => todo.dueDate === dateStr);
    return hasEvents || hasTodos;
  };

  return (
    <div className="py-8 min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            📅 Smart Calendar
          </h1>
          <p className="text-white/80 text-lg">
            Manage your events, meetings, and view your scheduled tasks
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 dark:bg-gray-800/90 dark:text-gray-100 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <button
                  onClick={handleAddEvent}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
                >
                  <Plus size={18} />
                  <span>Add Event</span>
                </button>
              </div>

              <Calendar
                onChange={setDate}
                value={date}
                className="react-calendar border-0 w-full"
                tileContent={({ date: tileDate }) => {
                  if (hasEventsOrTodos(tileDate)) {
                    return (
                      <div className="flex justify-center mt-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      </div>
                    );
                  }
                  return null;
                }}
                onClickDay={handleDayClick}
              />
            </div>
          </div>

          {/* Sidebar */}
          <CalendarSidebar events={events} todos={todos} />
        </div>
      </div>

      {/* Custom Calendar CSS */}
      <style>
        {`
          .react-calendar {
            width: 100%;
            background: transparent;
            font-family: inherit;
          }
          .react-calendar__tile {
            position: relative;
            padding: 0.75em 0.5em;
            background: none;
            border: none;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.2s ease;
          }
          .react-calendar__tile--active,
          .react-calendar__tile--now {
            background: linear-gradient(to right, #a21caf, #ec4899) !important;
            color: #fff !important;
            border-radius: 12px !important;
            font-weight: bold;
          }
          .react-calendar__tile:enabled:hover {
            background: #f3e8ff !important;
            color: #a21caf !important;
            border-radius: 12px !important;
          }
          .react-calendar__navigation button {
            color: #a21caf;
            font-weight: bold;
            font-size: 1.1rem;
            border: none;
            background: none;
            padding: 0.5rem;
            border-radius: 8px;
            transition: all 0.2s ease;
          }
          .react-calendar__navigation button:hover {
            background: #f3e8ff;
          }
          .dark .react-calendar__navigation button {
            color: #f472b6 !important;
          }
          .dark .react-calendar__navigation button:hover {
            background: #581c87 !important;
          }
          .dark .react-calendar__tile:enabled:hover {
            background: #581c87 !important;
            color: #f472b6 !important;
          }
        `}
      </style>

      {/* Modals */}
      <EventModal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        editingEvent={editingEvent}
        selectedDate={selectedDate}
      />

      <DayView
        isOpen={showDayView}
        onClose={() => setShowDayView(false)}
        selectedDate={selectedDate}
        events={events}
        todos={todos}
        onAddEvent={handleAddEventFromDay}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
      />
    </div>
  );
};

export default CalendarPage;