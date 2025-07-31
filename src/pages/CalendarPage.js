import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="py-8 min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            📅 Calendar
          </h1>
          <p className="text-white/80 text-lg">
            View your tasks and events on a beautiful calendar
          </p>
        </div>

        {/* Calendar Card */}
        <div className="bg-white/90 dark:bg-gray-800/90 dark:text-gray-100 backdrop-blur-lg rounded-3xl shadow-2xl p-8 flex flex-col items-center">
          <Calendar
            onChange={setDate}
            value={date}
            className="react-calendar border-0"
            tileClassName={({ date: d }) =>
              d.toDateString() === date.toDateString()
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full'
                : ''
            }
          />
          <p className="mt-8 text-lg text-gray-700 dark:text-gray-200">
            Selected date:{' '}
            <span className="font-semibold text-pink-600 dark:text-pink-400">
              {date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </p>
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
          .react-calendar__tile--active,
          .react-calendar__tile--now {
            background: linear-gradient(to right, #a21caf, #ec4899) !important;
            color: #fff !important;
            border-radius: 9999px !important;
          }
          .react-calendar__tile:enabled:hover {
            background: #f3e8ff !important;
            color: #a21caf !important;
            border-radius: 9999px !important;
          }
          .react-calendar__navigation button {
            color: #a21caf;
            font-weight: bold;
            font-size: 1.1rem;
          }
          .dark .react-calendar__navigation button {
            color: #f472b6 !important;
          }
        `}
      </style>
    </div>
  );
};

export default CalendarPage;