import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Coffee, Brain, Trophy } from 'lucide-react';

const PomodoroPage = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [sessions, setSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  // Settings
  const [workTime, setWorkTime] = useState(25);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState(4);

  const intervalRef = useRef(null);

  // Load stats from localStorage
  const [stats, setStats] = useState(() => {
    const savedStats = localStorage.getItem('pomodoro-stats');
    return savedStats ? JSON.parse(savedStats) : {
      totalSessions: 0,
      totalWorkTime: 0,
      totalBreakTime: 0,
      streak: 0,
      lastSessionDate: null
    };
  });

  useEffect(() => {
    localStorage.setItem('pomodoro-stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      playNotificationSound();
      handleTimerComplete();
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft]);

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio notification not available');
    }
  };

  const handleTimerComplete = () => {
    setIsActive(false);

    if (mode === 'work') {
      const newSessions = sessions + 1;
      setSessions(newSessions);

      // Update stats
      setStats(prevStats => ({
        ...prevStats,
        totalSessions: prevStats.totalSessions + 1,
        totalWorkTime: prevStats.totalWorkTime + workTime,
        lastSessionDate: new Date().toDateString()
      }));

      // Determine next break type
      if (newSessions % sessionsUntilLongBreak === 0) {
        setMode('longBreak');
        setTimeLeft(longBreakTime * 60);
      } else {
        setMode('shortBreak');
        setTimeLeft(shortBreakTime * 60);
      }
    } else {
      // Break finished
      setStats(prevStats => ({
        ...prevStats,
        totalBreakTime: prevStats.totalBreakTime + (mode === 'shortBreak' ? shortBreakTime : longBreakTime)
      }));

      setMode('work');
      setTimeLeft(workTime * 60);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(getTimeForMode(mode));
  };

  const getTimeForMode = (currentMode) => {
    switch(currentMode) {
      case 'work': return workTime * 60;
      case 'shortBreak': return shortBreakTime * 60;
      case 'longBreak': return longBreakTime * 60;
      default: return workTime * 60;
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(getTimeForMode(newMode));
    setIsActive(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = getTimeForMode(mode);
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getModeConfig = (currentMode) => {
    switch(currentMode) {
      case 'work':
        return { 
          title: 'Work Time', 
          icon: Brain, 
          color: 'from-red-500 to-orange-500',
          bgColor: 'from-red-400 via-orange-500 to-yellow-500'
        };
      case 'shortBreak':
        return { 
          title: 'Short Break', 
          icon: Coffee, 
          color: 'from-green-500 to-emerald-500',
          bgColor: 'from-green-400 via-emerald-500 to-teal-500'
        };
      case 'longBreak':
        return { 
          title: 'Long Break', 
          icon: Trophy, 
          color: 'from-blue-500 to-purple-500',
          bgColor: 'from-blue-400 via-purple-500 to-pink-500'
        };
      default:
        return { 
          title: 'Work Time', 
          icon: Brain, 
          color: 'from-red-500 to-orange-500',
          bgColor: 'from-red-400 via-orange-500 to-yellow-500'
        };
    }
  };

  const modeConfig = getModeConfig(mode);
  const Icon = modeConfig.icon;

  return (
    <div className={`py-8 min-h-screen bg-gradient-to-br ${modeConfig.bgColor} dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-1000`}>
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Icon className="w-8 sm:w-12 h-8 sm:h-12 text-white drop-shadow-lg" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
              🍅 Pomodoro Timer
            </h1>
          </div>
          <p className="text-white/80 text-base sm:text-lg">Focus better with the Pomodoro Technique</p>
        </div>

        {/* Mode Switcher */}
        <div className="flex justify-center mb-6 lg:mb-8">
          <div className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl p-2 flex flex-wrap sm:flex-nowrap space-y-2 sm:space-y-0 space-x-0 sm:space-x-2">
            {[
              { key: 'work', label: 'Work', icon: Brain },
              { key: 'shortBreak', label: 'Short Break', icon: Coffee },
              { key: 'longBreak', label: 'Long Break', icon: Trophy }
            ].map(({ key, label, icon: ModeIcon }) => (
              <button
                key={key}
                onClick={() => switchMode(key)}
                className={`flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-200 text-sm sm:text-base w-full sm:w-auto ${
                  mode === key
                    ? 'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-lg'
                    : 'text-white dark:text-gray-200 hover:bg-white/20 dark:hover:bg-gray-900/20'
                }`}
              >
                <ModeIcon size={16} className="sm:w-5 sm:h-5" />
                <span className="font-medium whitespace-nowrap">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Timer */}
        <div className="bg-white/95 dark:bg-gray-800/90 dark:text-gray-100 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-8 mb-6 lg:mb-8">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6">{modeConfig.title}</h2>
            
            {/* Circular Progress - Responsive */}
            <div className="relative w-48 sm:w-56 md:w-64 h-48 sm:h-56 md:h-64 mx-auto mb-6 sm:mb-8">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 256 256">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 120}`}
                  strokeDashoffset={`${2 * Math.PI * 120 * (1 - getProgress() / 100)}`}
                  className={`transition-all duration-1000 ease-out ${
                    mode === 'work' ? 'text-red-500' :
                    mode === 'shortBreak' ? 'text-green-500' :
                    'text-blue-500'
                  }`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium text-sm sm:text-base">
                    {isActive ? 'Running' : 'Paused'}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls - Responsive */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={toggleTimer}
                className={`flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r ${modeConfig.color} text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto`}
              >
                {isActive ? <Pause size={20} className="sm:w-6 sm:h-6" /> : <Play size={20} className="sm:w-6 sm:h-6" />}
                <span className="font-semibold text-base sm:text-lg">
                  {isActive ? 'Pause' : 'Start'}
                </span>
              </button>
              
              <button
                onClick={resetTimer}
                className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 sm:py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors duration-200 w-full sm:w-auto"
              >
                <RotateCcw size={18} className="sm:w-5 sm:h-5" />
                <span className="font-medium">Reset</span>
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 sm:py-4 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors duration-200 w-full sm:w-auto"
              >
                <Settings size={18} className="sm:w-5 sm:h-5" />
                <span className="font-medium">Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white/95 dark:bg-gray-800/90 dark:text-gray-100 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 mb-6 lg:mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Timer Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Work Time (minutes)</label>
                <input
                  type="number"
                  value={workTime}
                  onChange={(e) => setWorkTime(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 dark:bg-gray-900 dark:text-white"
                  min="1"
                  max="60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Short Break (minutes)</label>
                <input
                  type="number"
                  value={shortBreakTime}
                  onChange={(e) => setShortBreakTime(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 dark:bg-gray-900 dark:text-white"
                  min="1"
                  max="30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Long Break (minutes)</label>
                <input
                  type="number"
                  value={longBreakTime}
                  onChange={(e) => setLongBreakTime(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 dark:bg-gray-900 dark:text-white"
                  min="1"
                  max="60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Sessions until Long Break</label>
                <input
                  type="number"
                  value={sessionsUntilLongBreak}
                  onChange={(e) => setSessionsUntilLongBreak(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 dark:bg-gray-900 dark:text-white"
                  min="2"
                  max="10"
                />
              </div>
            </div>
          </div>
        )}

        {/* Stats - Improved Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white/90 dark:bg-gray-800/90 dark:text-gray-100 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-300">{sessions}</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium text-sm sm:text-base">Today's Sessions</div>
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 dark:text-gray-100 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-300">{stats.totalSessions}</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium text-sm sm:text-base">Total Sessions</div>
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 dark:text-gray-100 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-300">{Math.round(stats.totalWorkTime / 60)}h</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium text-sm sm:text-base">Total Focus Time</div>
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 dark:text-gray-100 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-300">{Math.round(stats.totalBreakTime / 60)}h</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium text-sm sm:text-base">Total Break Time</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroPage;