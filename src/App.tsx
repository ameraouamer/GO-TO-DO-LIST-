import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useStore from './store/useStore';
import Dashboard from './pages/Dashboard';
import ListPage from './pages/ListPage';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import TimerPage from './pages/TimerPage';
import AllTasksPage from './pages/AllTasksPage';

function App() {
  const { darkMode } = useStore();

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/list/:id" element={<ListPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/timer" element={<TimerPage />} />
            <Route path="/tasks" element={<AllTasksPage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App