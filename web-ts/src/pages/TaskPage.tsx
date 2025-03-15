import React, { useState, useEffect } from 'react';
import { fetchTasks, deleteTask } from '../services/api';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { Task } from '../types';
import '../styles/TaskPage.css';
import { FaPlus } from 'react-icons/fa';

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  // Загрузка задач
  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchTasks();
      if (response.success) {
        setTasks(response.data);
      } else {
        setError(response.message || 'Ошибка при загрузке задач');
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Ошибка сервера. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  // Загрузка задач при монтировании компонента
  useEffect(() => {
    loadTasks();
  }, []);

  // Обработчик удаления задачи
  const handleDelete = async (taskId: number) => {
    try {
      const response = await deleteTask(taskId);
      if (response.success) {
        setTasks(tasks.filter(task => task.id !== taskId));
      } else {
        setError(response.message || 'Ошибка при удалении задачи');
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Ошибка сервера при удалении задачи');
    }
  };

  // Обработчик редактирования задачи
  const handleEdit = (task: Task) => {
    setEditTask(task);
    setShowForm(true);
  };

  // Обработчик добавления/обновления задачи
  const handleTaskSubmit = () => {
    loadTasks();
    setShowForm(false);
    setEditTask(null);
  };

  // Отмена формы
  const handleCancel = () => {
    setShowForm(false);
    setEditTask(null);
  };

  // Открытие формы для создания новой задачи
  const handleAddNew = () => {
    setEditTask(null);
    setShowForm(true);
  };

  return (
    <div className="task-page">
      <div className="task-page-header">
        <h1>Управление задачами</h1>
        <button 
          className="add-task-button" 
          onClick={handleAddNew}
          aria-label="Добавить новую задачу"
        >
          <FaPlus /> Добавить задачу
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-message">Загрузка задач...</div>
      ) : (
        <TaskList
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {showForm && (
        <div className="task-form-overlay">
          <TaskForm
            onSubmit={handleTaskSubmit}
            onCancel={handleCancel}
            task={editTask}
          />
        </div>
      )}
    </div>
  );
};

export default TaskPage; 