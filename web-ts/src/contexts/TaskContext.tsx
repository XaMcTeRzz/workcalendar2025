import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
}

const defaultContext: TaskContextType = {
  tasks: [],
  isLoading: false,
  error: null,
  addTask: async () => {},
  updateTask: async () => {},
  deleteTask: async () => {},
  getTaskById: () => undefined,
};

export const TaskContext = createContext<TaskContextType>(defaultContext);

export const useTask = () => useContext(TaskContext);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Имитация загрузки задач при первом рендере
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        
        // Имитация задержки загрузки
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Демонстрационные задачи
        const demoTasks: Task[] = [
          {
            id: '1',
            title: 'Завершити проект',
            description: 'Доробити всі компоненти та оформити документацію',
            date: '2023-12-25',
            completed: false,
            priority: 'high',
            category: 'Робота',
            createdAt: '2023-12-01T10:00:00Z',
            updatedAt: '2023-12-01T10:00:00Z'
          },
          {
            id: '2',
            title: 'Купити продукти',
            description: 'Хліб, молоко, яйця, овочі',
            date: '2023-12-15',
            completed: true,
            priority: 'medium',
            category: 'Особисте',
            createdAt: '2023-12-05T14:30:00Z',
            updatedAt: '2023-12-05T15:45:00Z'
          },
          {
            id: '3',
            title: 'Зустріч з друзями',
            description: 'Кафе "Центральне", о 19:00',
            date: '2023-12-18',
            completed: false,
            priority: 'low',
            category: 'Особисте',
            createdAt: '2023-12-10T09:15:00Z',
            updatedAt: '2023-12-10T09:15:00Z'
          }
        ];
        
        setTasks(demoTasks);
        setError(null);
      } catch (err) {
        setError('Помилка завантаження задач');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTasks();
  }, []);

  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      
      // Имитация добавления задачи
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Имитация задержки
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTasks(prev => [...prev, newTask]);
      setError(null);
    } catch (err) {
      setError('Помилка додавання задачі');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (id: string, taskUpdate: Partial<Task>) => {
    try {
      setIsLoading(true);
      
      // Имитация задержки
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTasks(prev => 
        prev.map(task => 
          task.id === id 
            ? { 
                ...task, 
                ...taskUpdate, 
                updatedAt: new Date().toISOString() 
              } 
            : task
        )
      );
      
      setError(null);
    } catch (err) {
      setError('Помилка оновлення задачі');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Имитация задержки
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTasks(prev => prev.filter(task => task.id !== id));
      
      setError(null);
    } catch (err) {
      setError('Помилка видалення задачі');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTaskById = (id: string) => {
    return tasks.find(task => task.id === id);
  };

  const value = {
    tasks,
    isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
    getTaskById,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}; 