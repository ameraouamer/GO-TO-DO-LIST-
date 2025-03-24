import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Clock, Filter, SortAsc, SortDesc, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { cn } from '../lib/utils';

type SortOption = 'date-asc' | 'date-desc' | 'priority' | 'status';
type FilterOption = 'all' | 'completed' | 'pending';
type PriorityFilter = 'all' | 'high' | 'medium' | 'low';

export default function AllTasksPage() {
  const { lists, toggleTask, removeTask } = useStore();
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [filterStatus, setFilterStatus] = useState<FilterOption>('all');
  const [filterPriority, setFilterPriority] = useState<PriorityFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allTasks = useMemo(() => {
    const tasks = lists.flatMap(list => 
      list.tasks.map(task => ({
        ...task,
        listName: list.name,
        listIcon: list.icon
      }))
    );

    // Apply filters
    let filteredTasks = tasks.filter(task => {
      const matchesStatus = 
        filterStatus === 'all' ? true :
        filterStatus === 'completed' ? task.completed :
        !task.completed;

      const matchesPriority =
        filterPriority === 'all' ? true :
        task.priority === filterPriority;

      const matchesSearch =
        searchQuery === '' ? true :
        task.title.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesPriority && matchesSearch;
    });

    // Apply sorting
    switch (sortBy) {
      case 'date-asc':
        return filteredTasks.sort((a, b) => a.createdAt - b.createdAt);
      case 'date-desc':
        return filteredTasks.sort((a, b) => b.createdAt - a.createdAt);
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return filteredTasks.sort((a, b) => 
          (priorityOrder[a.priority || 'low'] - priorityOrder[b.priority || 'low']));
      case 'status':
        return filteredTasks.sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
      default:
        return filteredTasks;
    }
  }, [lists, sortBy, filterStatus, filterPriority, searchQuery]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

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
          <h1 className="text-3xl font-bold dark:text-white">All Tasks</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search Tasks
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by task name..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterOption)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as PriorityFilter)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Showing {allTasks.length} tasks
          </div>

          <AnimatePresence>
            <div className="space-y-3">
              {allTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 group transition-colors",
                    task.completed && "bg-gray-50 dark:bg-gray-700/50"
                  )}
                >
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleTask(task.id, task.listId)}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                      task.completed
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300 dark:border-gray-500"
                    )}
                  >
                    {task.completed && <Check size={14} className="text-white" />}
                  </motion.button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg dark:text-white">{task.listIcon}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {task.listName}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "block dark:text-white transition-colors",
                        task.completed && "line-through text-gray-500 dark:text-gray-400"
                      )}
                    >
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full",
                        getPriorityColor(task.priority || 'medium')
                      )}>
                        {task.priority || 'medium'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeTask(task.id, task.listId)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition-all"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}