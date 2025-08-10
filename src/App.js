import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import TodoPage from './pages/TodoPage';
import PomodoroPage from './pages/PomodoroPage';
import NotesPage from './pages/NotesPage';
import HabitsPage from './pages/HabitsPage';
import GoalsPage from './pages/GoalsPage';
import CalendarPage from './pages/CalendarPage';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-white">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar user={user} />
        <div className="pt-20">
          <Routes>
            {/* Public Routes */}
            {!user && (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            )}

            {/* Protected Routes */}
            {user && (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/todo" element={<TodoPage />} />
                <Route path="/pomodoro" element={<PomodoroPage />} />
                <Route path="/notes" element={<NotesPage />} />
                <Route path="/habits" element={<HabitsPage />} />
                <Route path="/goals" element={<GoalsPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
