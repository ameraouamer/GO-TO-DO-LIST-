import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import useStore from '../store/useStore';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

export default function Analytics() {
  const { lists } = useStore();

  // Calculate task statistics
  const totalTasks = lists.reduce((acc, list) => acc + list.tasks.length, 0);
  const completedTasks = lists.reduce(
    (acc, list) => acc + list.tasks.filter(t => t.completed).length,
    0
  );

  // Prepare data for charts
  const listData = lists.map(list => ({
    name: list.name,
    total: list.tasks.length,
    completed: list.tasks.filter(t => t.completed).length,
  }));

  const priorityData = lists.flatMap(list => list.tasks).reduce((acc, task) => {
    const priority = task.priority || 'medium';
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(priorityData).map(([name, value]) => ({
    name,
    value,
  }));

  // Calculate completion rate over time
  const tasksByDate = lists.flatMap(list => list.tasks)
    .reduce((acc, task) => {
      const date = new Date(task.createdAt).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { total: 0, completed: 0 };
      }
      acc[date].total++;
      if (task.completed) {
        acc[date].completed++;
      }
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);

  const timelineData = Object.entries(tasksByDate).map(([date, data]) => ({
    date,
    'Completion Rate': (data.completed / data.total) * 100,
  }));

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
          <h1 className="text-3xl font-bold dark:text-white">Analytics & Insights</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Task Overview</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 dark:bg-indigo-900/50 rounded-lg p-4">
                <p className="text-sm text-indigo-600 dark:text-indigo-300">Total Tasks</p>
                <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-200">
                  {totalTasks}
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/50 rounded-lg p-4">
                <p className="text-sm text-green-600 dark:text-green-300">Completed</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-200">
                  {completedTasks}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Task Priority Distribution</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Tasks by List</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={listData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" name="Total Tasks" fill="#4F46E5" />
                <Bar dataKey="completed" name="Completed Tasks" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Task Completion Rate Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Completion Rate"
                  stroke="#4F46E5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}