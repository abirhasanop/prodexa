import React, { useState, useEffect } from "react";
import { auth } from "../firebase/firebaseConfig";
import { Link } from "react-router-dom";
import { 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Target, 
  Calendar, 
  TrendingUp, 
  User,
  LogOut,
  ArrowRight,
  Sparkles,
  Trophy,
  Zap
} from "lucide-react";

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    if (auth.currentUser) {
      setUserName(auth.currentUser.displayName || "User");
    }
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const quickActions = [
    {
      title: "Todo List",
      description: "Manage your daily tasks",
      icon: <CheckCircle className="w-8 h-8" />,
      link: "/todo",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-100 dark:bg-purple-900"
    },
    {
      title: "Pomodoro Timer",
      description: "Focus with time blocking",
      icon: <Clock className="w-8 h-8" />,
      link: "/pomodoro",
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-100 dark:bg-red-900"
    },
    {
      title: "Notes & Journal",
      description: "Capture your thoughts",
      icon: <BookOpen className="w-8 h-8" />,
      link: "/notes",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-100 dark:bg-blue-900"
    },
    {
      title: "Goals",
      description: "Track your objectives",
      icon: <Target className="w-8 h-8" />,
      link: "/goals",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-100 dark:bg-green-900"
    },
    {
      title: "Habits",
      description: "Build lasting routines",
      icon: <TrendingUp className="w-8 h-8" />,
      link: "/habits",
      color: "from-yellow-500 to-amber-500",
      bgColor: "bg-yellow-100 dark:bg-yellow-900"
    },
    {
      title: "Calendar",
      description: "Plan your schedule",
      icon: <Calendar className="w-8 h-8" />,
      link: "/calendar",
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-100 dark:bg-indigo-900"
    }
  ];

  const motivationalStats = [
    { label: "Your Potential", value: "∞", icon: <Trophy className="w-6 h-6" /> },
    { label: "Today's Energy", value: "100%", icon: <Zap className="w-6 h-6" /> },
    { label: "Growth Mindset", value: "ON", icon: <TrendingUp className="w-6 h-6" /> },
    { label: "Success Mode", value: "✓", icon: <Target className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all">
      <div className="py-8 px-4 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="bg-white/95 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {getGreeting()}, {userName}! 👋
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
                    Ready to boost your productivity today?
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 transform hover:scale-105 flex-shrink-0"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

            {/* Current Time Display */}
            <div className="text-center mb-6">
              <div className="text-2xl font-mono text-gray-800 dark:text-gray-200 mb-2">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit', 
                  second: '2-digit', 
                  hour12: true 
                })}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>

            {/* Motivational Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {motivationalStats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center justify-center mb-2 text-purple-600 dark:text-purple-400">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 mb-4">
            <Sparkles className="w-6 sm:w-8 h-6 sm:h-8 text-white animate-pulse" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
              Your Productivity Hub
            </h2>
            <Sparkles className="w-6 sm:w-8 h-6 sm:h-8 text-white animate-pulse" />
          </div>
          <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Everything you need to stay organized, focused, and achieve your goals in one beautiful place
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 lg:mb-12 px-4 sm:px-0">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="group bg-white/95 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                <div className={`w-12 sm:w-16 h-12 sm:h-16 ${action.bgColor} rounded-xl flex items-center justify-center text-gray-700 dark:text-gray-200 group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                  <div className="w-6 sm:w-8 h-6 sm:h-8">
                    {action.icon}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {action.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className={`h-1 bg-gradient-to-r ${action.color} rounded-full flex-1 mr-4`}></div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>

        {/* Motivational Section */}
        <div className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-sm rounded-3xl p-6 sm:p-8 text-center mx-4 sm:mx-0">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              🎯 Today's Focus
            </h3>
            <p className="text-white/90 text-base sm:text-lg mb-6">
              "The secret of getting ahead is getting started. Your productivity journey begins with a single step."
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
              <Link
                to="/todo"
                className="px-4 sm:px-6 py-3 bg-white/20 dark:bg-gray-900/40 text-white rounded-xl hover:bg-white/30 dark:hover:bg-gray-800/60 transition-all duration-200 backdrop-blur-sm text-sm sm:text-base"
              >
                Add Your First Task
              </Link>
              <Link
                to="/pomodoro"
                className="px-4 sm:px-6 py-3 bg-white/20 dark:bg-gray-900/40 text-white rounded-xl hover:bg-white/30 dark:hover:bg-gray-800/60 transition-all duration-200 backdrop-blur-sm text-sm sm:text-base"
              >
                Start Focus Session
              </Link>
              <Link
                to="/notes"
                className="px-4 sm:px-6 py-3 bg-white/20 dark:bg-gray-900/40 text-white rounded-xl hover:bg-white/30 dark:hover:bg-gray-800/60 transition-all duration-200 backdrop-blur-sm text-sm sm:text-base"
              >
                Write a Note
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="text-center mt-8 lg:mt-12 px-4">
          <p className="text-white/70 text-xs sm:text-sm italic">
            "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort."
          </p>
        </div>
      </div>
    </div>
  );
}