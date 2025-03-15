import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTask } from '../contexts/TaskContext';
import { useVoiceInput } from '../contexts/VoiceInputContext';
import { useNotification } from '../components/NotificationService';
import Button from '../components/Button';
import { FaSave, FaTrash, FaMicrophone, FaArrowLeft } from 'react-icons/fa';

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTaskById, updateTask, deleteTask } = useTask();
  const { isVoiceEnabled, startListening, stopListening, isListening, transcript, resetTranscript } = useVoiceInput();
  const { showNotification } = useNotification();
  
  const [task, setTask] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  
  useEffect(() => {
    if (id) {
      const taskData = getTaskById(id);
      if (taskData) {
        setTask(taskData);
      } else {
        showNotification('Задача не знайдена', 'error');
        navigate('/tasks', { replace: true });
      }
      setIsLoading(false);
    }
  }, [id, getTaskById, navigate, showNotification]);
  
  useEffect(() => {
    if (isListening && transcript && activeField) {
      setTask(prev => ({
        ...prev,
        [activeField]: transcript
      }));
      resetTranscript();
      stopListening();
      setActiveField(null);
      
      // Показываем подсказку о голосовом вводе
      showNotification(`Текст додано: "${transcript}"`, 'info', 2000);
    }
  }, [isListening, transcript, activeField, resetTranscript, stopListening, showNotification]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTask(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleVoiceInput = (fieldName: string) => {
    if (isVoiceEnabled) {
      setActiveField(fieldName);
      startListening();
      showNotification('Говоріть зараз...', 'info', 1500);
    } else {
      showNotification('Голосовий ввід вимкнено в налаштуваннях', 'info');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await updateTask(id!, {
        title: task.title,
        description: task.description,
        date: task.date,
        priority: task.priority,
        category: task.category,
        completed: task.completed
      });
      
      showNotification('Задача успішно оновлена', 'success');
      navigate('/tasks');
    } catch (error) {
      showNotification('Помилка при оновленні задачі', 'error');
      console.error('Error updating task:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Ви впевнені, що хочете видалити цю задачу?')) {
      try {
        await deleteTask(id!);
        showNotification('Задача успішно видалена', 'info');
        navigate('/tasks');
      } catch (error) {
        showNotification('Помилка при видаленні задачі', 'error');
        console.error('Error deleting task:', error);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Завантаження задачі...</p>
      </div>
    );
  }
  
  if (!task) {
    return (
      <div className="error-message">
        Задачу не знайдено
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <div className="page-header">
        <Button 
          variant="text" 
          startIcon={<FaArrowLeft />}
          onClick={() => navigate('/tasks')}
        >
          Назад до задач
        </Button>
        <h1>Деталі задачі</h1>
      </div>
      
      <div className="task-detail-container">
        <form onSubmit={handleSubmit} className="task-form">
          <div className="card">
            <div className="card-content">
              <div className="form-group">
                <label htmlFor="title">Назва:</label>
                <div className="input-with-voice">
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={task.title}
                    onChange={handleInputChange}
                    required
                    className="form-control"
                    placeholder="Введіть назву задачі"
                  />
                  {isVoiceEnabled && (
                    <button
                      type="button"
                      className="voice-btn"
                      onClick={() => handleVoiceInput('title')}
                    >
                      <FaMicrophone />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Опис:</label>
                <div className="input-with-voice">
                  <textarea
                    id="description"
                    name="description"
                    value={task.description}
                    onChange={handleInputChange}
                    rows={5}
                    className="form-control"
                    placeholder="Введіть опис задачі"
                  ></textarea>
                  {isVoiceEnabled && (
                    <button
                      type="button"
                      className="voice-btn"
                      onClick={() => handleVoiceInput('description')}
                    >
                      <FaMicrophone />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="date">Дата:</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={task.date}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="priority">Пріоритет:</label>
                <select
                  id="priority"
                  name="priority"
                  value={task.priority}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="low">Низький</option>
                  <option value="medium">Середній</option>
                  <option value="high">Високий</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="category">Категорія:</label>
                <div className="input-with-voice">
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={task.category || ''}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Введіть категорію (опціонально)"
                  />
                  {isVoiceEnabled && (
                    <button
                      type="button"
                      className="voice-btn"
                      onClick={() => handleVoiceInput('category')}
                    >
                      <FaMicrophone />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="form-group switch-group">
                <label htmlFor="completed">Завершено:</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    id="completed"
                    name="completed"
                    checked={task.completed}
                    onChange={(e) => {
                      setTask(prev => ({
                        ...prev,
                        completed: e.target.checked
                      }));
                    }}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <Button 
              type="submit"
              variant="primary"
              startIcon={<FaSave />}
              disabled={isSaving}
            >
              {isSaving ? 'Збереження...' : 'Зберегти зміни'}
            </Button>
            
            <Button 
              type="button"
              variant="danger"
              startIcon={<FaTrash />}
              onClick={handleDelete}
            >
              Видалити задачу
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskDetail; 