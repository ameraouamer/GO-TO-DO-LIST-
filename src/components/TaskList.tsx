import React, { useState } from 'react';
import { Check, Trash2, Plus, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useStore, { Task } from '../store/useStore';
import { cn } from '../lib/utils';

interface TaskListProps {
  listId: string;
}

export default function TaskList({ listId }: TaskListProps) {
  const { lists, addTask, toggleTask, removeTask, setCurrentTask } = useStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const navigate = useNavigate();

  const list = lists.find((l) => l.id === listId);
  if (!list) return null;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const task: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      completed: false,
      listId,
      createdAt: Date.now(),
      priority,
    };

    addTask(task);
    setNewTaskTitle('');
    setPriority('medium');
  };

  const handleTaskDoubleClick = (task: Task) => {
    setCurrentTask(task);
    navigate('/timer');
  };

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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">{list.icon}</span>
        <div>
          <h2 className="text-2xl font-bold dark:text-white">{list.name}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {list.tasks.filter(t => !t.completed).length} remaining •{' '}
            {list.tasks.filter(t => t.completed).length} completed
          </p>
        </div>
      </div>

      <form onSubmit={handleAddTask} className="mb-8">
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-3 transition-colors shadow-lg"
          >
            <Plus size={20} />
          </motion.button>
        </div>
        <div className="flex gap-2">
          {(['low', 'medium', 'high'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                priority === p ? getPriorityColor(p) : 'bg-gray-100 dark:bg-gray-700'
              )}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </form>

      <AnimatePresence>
        <div className="space-y-3">
          {list.tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onDoubleClick={() => handleTaskDoubleClick(task)}
              className={cn(
                "flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 group transition-colors cursor-pointer",
                task.completed && "bg-gray-50 dark:bg-gray-700/50"
              )}
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleTask(task.id, listId)}
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
                onClick={() => removeTask(task.id, listId)}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition-all"
              >
                <Trash2 size={18} />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}