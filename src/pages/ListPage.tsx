import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TaskList from '../components/TaskList';

export default function ListPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/"
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 dark:text-white" />
        </Link>
        <h1 className="text-3xl font-bold dark:text-white">Tasks</h1>
      </div>
      <TaskList listId={id} />
    </div>
  );
}