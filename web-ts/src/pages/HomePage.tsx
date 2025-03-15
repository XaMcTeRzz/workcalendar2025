import React, { useState, useEffect } from 'react';
import { Task, CurrentTask } from '../types';
import { fetchTasks, fetchCurrentTasks, deleteTask, updateTask } from '../services/api';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import CurrentTaskList from '../components/CurrentTaskList';
import '../styles/HomePage.css';

const HomePage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTasks, setCurrentTasks] = useState<CurrentTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, currentTasksData] = await Promise.all([
        fetchTasks(),
        fetchCurrentTasks()
      ]);
      
      setTasks(tasksData);
      setCurrentTasks(currentTasksData);
      setError(null);
    } catch (err) {
      setError('Помилка завантаження даних. Спробуйте пізніше.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setShowAddForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowAddForm(true);
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Помилка видалення задачі. Спробуйте ще раз.');
      console.error('Error deleting task:', err);
    }
  };

  const handleTaskFormClose = () => {
    setShowAddForm(false);
    setEditingTask(null);
  };

  const handleTaskFormSubmit = () => {
    setShowAddForm(false);
    setEditingTask(null);
    loadData();
  };

  const handleTaskComplete = async (taskId: number, completed: boolean) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      const updatedTask = { ...task, completed };
      await updateTask(updatedTask);
      
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, completed } : t
      ));
    } catch (err) {
      setError('Помилка оновлення статусу задачі. Спробуйте ще раз.');
      console.error('Error updating task status:', err);
    }
  };

  return (
    <div className="home-page">
      <div className="page-header">
        <h1 className="page-title">
          <span className="page-title-icon">📅</span>
          Календар задач
        </h1>
        <button 
          className="btn-add" 
          onClick={handleAddTask}
          aria-label="Додати нову задачу"
        >
          <span className="btn-icon">+</span>
          <span className="btn-text">Додати задачу</span>
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Завантаження даних...</div>
      ) : (
        <div className="content-container">
          <div className="tasks-container">
            <div className="section-header">
              <h2 className="section-title">
                <span className="section-icon">📋</span>
                Заплановані задачі
              </h2>
            </div>
            <TaskList 
              tasks={tasks} 
              onEdit={handleEditTask} 
              onDelete={handleDeleteTask}
              onComplete={handleTaskComplete}
            />
          </div>

          <div className="current-tasks-container">
            <div className="section-header">
              <h2 className="section-title">
                <span className="section-icon">⏰</span>
                Поточні задачі
              </h2>
            </div>
            <CurrentTaskList currentTasks={currentTasks} />
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <TaskForm 
              task={editingTask} 
              onClose={handleTaskFormClose} 
              onSubmit={handleTaskFormSubmit}
            />
          </div>
        </div>
      )}

      <button 
        className="fab" 
        onClick={handleAddTask}
        aria-label="Додати нову задачу"
      >
        <span className="fab-icon">+</span>
      </button>
    </div>
  );
};

export default HomePage; 