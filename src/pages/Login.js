import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebaseConfig";
import { Link } from "react-router-dom";
import { LogIn, User, ArrowRight, Sparkles } from "lucide-react";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google login error:", error);
      alert("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Sparkles className="w-12 h-12 text-white animate-pulse" />
            <h1 className="text-5xl font-bold text-white drop-shadow-lg">
              Prodexa
            </h1>
            <Sparkles className="w-12 h-12 text-white animate-pulse" />
          </div>
          <p className="text-xl text-white/90 mb-4 max-w-md mx-auto leading-relaxed">
            Your all-in-one productivity companion for todos, notes, habits, and more
          </p>
          <div className="flex items-center justify-center space-x-8 text-white/80 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Task Management</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Pomodoro Timer</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Note Taking</span>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Sign in to access your productivity dashboard
            </p>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className={`w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-200 transform hover:scale-105 shadow-lg group ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className="w-6 h-6">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <span className="text-gray-700 dark:text-gray-200 font-semibold">
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </span>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
          </button>

          {/* Features Preview */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
              What you'll get access to:
            </p>
            <div className="grid grid-cols-3 gap-3 text-sm mb-3">
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">📝</span>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Smart Todos</span>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">🍅</span>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Pomodoro</span>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">📚</span>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Notes</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="text-center">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">🎯</span>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Goals</span>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">🔥</span>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Habits</span>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">📅</span>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Calendar</span>
              </div>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link 
                to="/register" 
                className="text-purple-600 dark:text-purple-400 font-medium hover:underline"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-white/60 text-sm">
            Join thousands of users boosting their productivity
          </p>
        </div>
      </div>
    </div>
  );
}