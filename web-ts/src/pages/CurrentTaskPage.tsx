import React, { useState, useEffect } from 'react';
import { fetchCurrentTasks, deleteCurrentTask } from '../services/api';
import CurrentTaskList from '../components/CurrentTaskList';
import CurrentTaskForm from '../components/CurrentTaskForm';
import { CurrentTask } from '../types';
import '../styles/CurrentTaskPage.css';
import { FaPlus } from 'react-icons/fa';

const CurrentTaskPage: React.FC = () => {
  const [currentTasks, setCurrentTasks] = useState<CurrentTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editTask, setEditTask] = useState<CurrentTask | null>(null);

  // Загрузка текущих задач
  const loadCurrentTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchCurrentTasks();
      if (response.success) {
        setCurrentTasks(response.data);
      } else {
        setError(response.message || 'Ошибка при загрузке текущих задач');
      }
    } catch (err) {
      console.error('Error fetching current tasks:', err);
      setError('Ошибка сервера. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  // Загрузка задач при монтировании компонента
  useEffect(() => {
    loadCurrentTasks();
  }, []);

  // Обработчик удаления текущей задачи
  const handleDelete = async (taskId: number) => {
    try {
      const response = await deleteCurrentTask(taskId);
      if (response.success) {
        setCurrentTasks(currentTasks.filter(task => task.id !== taskId));
      } else {
        setError(response.message || 'Ошибка при удалении текущей задачи');
      }
    } catch (err) {
      console.error('Error deleting current task:', err);
      setError('Ошибка сервера при удалении текущей задачи');
    }
  };

  // Обработчик редактирования текущей задачи
  const handleEdit = (task: CurrentTask) => {
    setEditTask(task);
    setShowForm(true);
  };

  // Обработчик добавления/обновления текущей задачи
  const handleTaskSubmit = () => {
    loadCurrentTasks();
    setShowForm(false);
    setEditTask(null);
  };

  // Отмена формы
  const handleCancel = () => {
    setShowForm(false);
    setEditTask(null);
  };

  // Открытие формы для создания новой текущей задачи
  const handleAddNew = () => {
    setEditTask(null);
    setShowForm(true);
  };

  return (
    <div className="current-task-page">
      <div className="current-task-page-header">
        <h1>Текущие задачи</h1>
        <button 
          className="add-current-task-button" 
          onClick={handleAddNew}
          aria-label="Добавить новую текущую задачу"
        >
          <FaPlus /> Добавить текущую задачу
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-message">Загрузка текущих задач...</div>
      ) : (
        <CurrentTaskList
          currentTasks={currentTasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {showForm && (
        <div className="current-task-form-overlay">
          <CurrentTaskForm
            onSubmit={handleTaskSubmit}
            onCancel={handleCancel}
            currentTask={editTask}
          />
        </div>
      )}
    </div>
  );
};

export default CurrentTaskPage; 