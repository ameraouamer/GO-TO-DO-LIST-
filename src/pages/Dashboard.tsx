import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Settings, Moon, Sun, PieChart, Timer, ListTodo, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';

const DEFAULT_ICONS = [
  { icon: '📝', name: 'Tasks' },
  { icon: '🏠', name: 'Home' },
  { icon: '💼', name: 'Work' },
  { icon: '📚', name: 'Study' },
  { icon: '🎯', name: 'Goals' },
];

export default function Dashboard() {
  const { lists, addList, removeList, darkMode, toggleDarkMode } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(DEFAULT_ICONS[0]);

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    addList({
      id: crypto.randomUUID(),
      name: newListName,
      icon: selectedIcon.icon,
      tasks: [],
    });

    setNewListName('');
    setIsCreating(false);
    setSelectedIcon(DEFAULT_ICONS[0]);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white">WELCOME BACK !</h1>
          <div className="flex items-center gap-2">
            <Link
              to="/timer"
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Pomodoro Timer"
            >
              <Timer className="w-6 h-6 dark:text-white" />
            </Link>
            <Link
              to="/tasks"
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="All Tasks"
            >
              <ListTodo className="w-6 h-6 dark:text-white" />
            </Link>
            <Link
              to="/analytics"
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Analytics"
            >
              <PieChart className="w-6 h-6 dark:text-white" />
            </Link>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? (
                <Moon className="w-6 h-6 dark:text-white" />
              ) : (
                <Sun className="w-6 h-6" />
              )}
            </button>
            <Link
              to="/settings"
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Settings"
            >
              <Settings className="w-6 h-6 dark:text-white" />
            </Link>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold dark:text-white">Your Lists</h2>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreating(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              <span>New List</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {lists.map((list) => (
                <motion.div
                  key={list.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative group"
                >
                  <Link
                    to={`/list/${list.id}`}
                    className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{list.icon}</span>
                      <h3 className="text-xl font-semibold dark:text-white">
                        {list.name}
                      </h3>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {list.tasks.length} tasks
                      {' • '}
                      {list.tasks.filter((t) => t.completed).length} completed
                    </div>
                  </Link>
                  <button
                    onClick={() => removeList(list.id)}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete List"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {isCreating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold mb-4 dark:text-white">Create New List</h3>
              <form onSubmit={handleCreateList}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    List Name
                  </label>
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="Enter list name..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Choose Icon
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {DEFAULT_ICONS.map((icon) => (
                      <button
                        key={icon.name}
                        type="button"
                        onClick={() => setSelectedIcon(icon)}
                        className={`p-3 rounded-lg text-2xl ${
                          selectedIcon.name === icon.name
                            ? 'bg-indigo-100 dark:bg-indigo-900'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {icon.icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Create List
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}