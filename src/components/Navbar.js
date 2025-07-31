import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Todo' },
  { to: '/pomodoro', label: 'Pomodoro' },
  { to: '/notes', label: 'Notes' },
  { to: '/habits', label: 'Habits' },
  { to: '/goals', label: 'Goals' },
  { to: '/calendar', label: 'Calendar' },
];

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-gray-900/90 backdrop-blur shadow-md">
  <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
    {/* Logo on the left */}
    <span className="text-2xl font-bold text-purple-600 dark:text-pink-400 whitespace-nowrap">
      Awesome Todo
    </span>
    {/* Links and buttons on the right */}
    <div className="flex items-center space-x-2">
      <div className="hidden md:flex space-x-2">
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`px-3 py-2 rounded-lg font-medium transition ${
              location.pathname === link.to
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      {/* Dark mode toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="text-2xl px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition"
        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? '🌙' : '☀️'}
      </button>
      {/* Mobile menu button */}
      <button
        className="md:hidden text-2xl px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>
    </div>
  </div>
  {/* Mobile menu */}
  {isMobileMenuOpen && (
    <div className="md:hidden bg-white/95 dark:bg-gray-900/95 px-4 pb-4">
      {navLinks.map(link => (
        <Link
          key={link.to}
          to={link.to}
          className={`block px-3 py-2 rounded-lg font-medium mb-1 transition ${
            location.pathname === link.to
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow'
              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {link.label}
        </Link>
      ))}
    </div>
  )}
</nav>
  );
};

export default Navbar;