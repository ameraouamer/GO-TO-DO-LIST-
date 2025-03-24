import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import useStore from '../store/useStore';

export default function Settings() {
  const { darkMode, toggleDarkMode, pomodoroSettings, updatePomodoroSettings } = useStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/"
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 dark:text-white" />
        </Link>
        <h1 className="text-3xl font-bold dark:text-white">Settings</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-2xl">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              Appearance
            </h2>
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {darkMode ? (
                <Moon className="w-5 h-5 dark:text-white" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
              <span className="dark:text-white">
                {darkMode ? 'Dark Mode' : 'Light Mode'}
              </span>
            </button>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              Pomodoro Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Work Duration (minutes)
                </label>
                <input
                  type="number"
                  value={pomodoroSettings.workDuration / 60}
                  onChange={(e) =>
                    updatePomodoroSettings({
                      workDuration: parseInt(e.target.value) * 60,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Break Duration (minutes)
                </label>
                <input
                  type="number"
                  value={pomodoroSettings.breakDuration / 60}
                  onChange={(e) =>
                    updatePomodoroSettings({
                      breakDuration: parseInt(e.target.value) * 60,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Long Break Duration (minutes)
                </label>
                <input
                  type="number"
                  value={pomodoroSettings.longBreakDuration / 60}
                  onChange={(e) =>
                    updatePomodoroSettings({
                      longBreakDuration: parseInt(e.target.value) * 60,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sessions before Long Break
                </label>
                <input
                  type="number"
                  value={pomodoroSettings.longBreakInterval}
                  onChange={(e) =>
                    updatePomodoroSettings({
                      longBreakInterval: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}