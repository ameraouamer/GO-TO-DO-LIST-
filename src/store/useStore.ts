import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  listId: string;
  createdAt: number;
  priority?: 'low' | 'medium' | 'high';
}

export interface TaskList {
  id: string;
  name: string;
  icon: string;
  tasks: Task[];
}

interface PomodoroSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
}

interface AppState {
  lists: TaskList[];
  darkMode: boolean;
  pomodoroSettings: PomodoroSettings;
  currentTask: Task | null;
  addList: (list: TaskList) => void;
  removeList: (id: string) => void;
  addTask: (task: Task) => void;
  toggleTask: (taskId: string, listId: string) => void;
  removeTask: (taskId: string, listId: string) => void;
  setCurrentTask: (task: Task | null) => void;
  toggleDarkMode: () => void;
  updatePomodoroSettings: (settings: Partial<PomodoroSettings>) => void;
}

const useStore = create<AppState>()(
  persist(
    (set) => ({
      lists: [],
      darkMode: false,
      currentTask: null,
      pomodoroSettings: {
        workDuration: 25 * 60,
        breakDuration: 5 * 60,
        longBreakDuration: 15 * 60,
        longBreakInterval: 4,
      },
      addList: (list) =>
        set((state) => ({ lists: [...state.lists, list] })),
      removeList: (id) =>
        set((state) => ({ lists: state.lists.filter((list) => list.id !== id) })),
      addTask: (task) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === task.listId
              ? { ...list, tasks: [...list.tasks, task] }
              : list
          ),
        })),
      toggleTask: (taskId, listId) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  tasks: list.tasks.map((task) =>
                    task.id === taskId
                      ? { ...task, completed: !task.completed }
                      : task
                  ),
                }
              : list
          ),
        })),
      removeTask: (taskId, listId) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  tasks: list.tasks.filter((task) => task.id !== taskId),
                }
              : list
          ),
        })),
      setCurrentTask: (task) =>
        set(() => ({ currentTask: task })),
      toggleDarkMode: () =>
        set((state) => ({ darkMode: !state.darkMode })),
      updatePomodoroSettings: (settings) =>
        set((state) => ({
          pomodoroSettings: { ...state.pomodoroSettings, ...settings },
        })),
    }),
    {
      name: 'todo-pomodoro-storage',
    }
  )
);

export default useStore;