import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PomodoroTimer from '../components/PomodoroTimer';
import useStore from '../store/useStore';

export default function TimerPage() {
  const { currentTask } = useStore();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 dark:text-white" />
          </Link>
          <h1 className="text-3xl font-bold dark:text-white">Pomodoro Timer</h1>
        </div>

        {currentTask && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold dark:text-white mb-2">Current Task</h2>
            <p className="text-gray-600 dark:text-gray-400">{currentTask.title}</p>
          </div>
        )}

        <div className="flex justify-center">
          <PomodoroTimer />
        </div>
      </div>
    </div>
  );
}