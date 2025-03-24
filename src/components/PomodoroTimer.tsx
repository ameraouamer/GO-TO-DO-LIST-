import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { formatTime } from '../lib/utils';

export default function PomodoroTimer() {
  const { pomodoroSettings } = useStore();
  const [timeLeft, setTimeLeft] = useState(pomodoroSettings.workDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const progress = (timeLeft / (isBreak ? pomodoroSettings.breakDuration : pomodoroSettings.workDuration)) * 100;

  useEffect(() => {
    let interval: number;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (soundEnabled) {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play();
      }
      if (!isBreak) {
        setSessionCount((count) => count + 1);
        if (sessionCount + 1 >= pomodoroSettings.longBreakInterval) {
          setTimeLeft(pomodoroSettings.longBreakDuration);
          setSessionCount(0);
        } else {
          setTimeLeft(pomodoroSettings.breakDuration);
        }
      } else {
        setTimeLeft(pomodoroSettings.workDuration);
      }
      setIsBreak(!isBreak);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, sessionCount, pomodoroSettings, soundEnabled]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(pomodoroSettings.workDuration);
    setIsBreak(false);
    setSessionCount(0);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-sm">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          {isBreak ? 'Break Time' : 'Focus Time'}
        </h2>
        
        <div className="relative mb-8">
          <motion.div
            className="w-48 h-48 mx-auto rounded-full border-8 border-gray-200 dark:border-gray-700 flex items-center justify-center"
            style={{ position: 'relative' }}
          >
            <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
              <motion.circle
                initial={{ pathLength: 1 }}
                animate={{ pathLength: progress / 100 }}
                transition={{ duration: 0.5 }}
                cx="50"
                cy="50"
                r="46"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-indigo-600 dark:text-indigo-500"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-5xl font-mono dark:text-white">
              {formatTime(timeLeft)}
            </span>
          </motion.div>
        </div>

        <div className="flex justify-center items-center gap-4 mb-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleTimer}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 transition-colors shadow-lg"
          >
            {isRunning ? <Pause size={28} /> : <Play size={28} />}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={resetTimer}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full p-4 transition-colors shadow-lg"
          >
            <RotateCcw size={28} className="dark:text-white" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full p-4 transition-colors shadow-lg"
          >
            {soundEnabled ? (
              <Volume2 size={28} className="dark:text-white" />
            ) : (
              <VolumeX size={28} className="dark:text-white" />
            )}
          </motion.button>
        </div>

        <div className="flex justify-center gap-2">
          {Array.from({ length: pomodoroSettings.longBreakInterval }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < sessionCount
                  ? 'bg-indigo-600 dark:bg-indigo-500'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}