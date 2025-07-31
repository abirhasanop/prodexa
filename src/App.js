import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TodoPage from './pages/TodoPage';
import PomodoroPage from './pages/PomodoroPage';
import NotesPage from './pages/NotesPage';
import HabitsPage from './pages/HabitsPage';
import GoalsPage from './pages/GoalsPage';
import CalendarPage from './pages/CalendarPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        <div className="pt-20"> {/* Add padding for fixed navbar */}
          <Routes>
            <Route path="/" element={<TodoPage />} />
            <Route path="/pomodoro" element={<PomodoroPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/habits" element={<HabitsPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;