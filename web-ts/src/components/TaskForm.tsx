import React, { useState, useEffect } from 'react';
import { Task, TaskFormProps } from '../types';
import { createTask, updateTask } from '../services/api';
import '../styles/TaskForm.css';

const TaskForm: React.FC<TaskFormProps> = ({ task, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    completed: false,
    priority: undefined
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        date: task.date,
        time: task.time || '',
        completed: task.completed,
        priority: task.priority
      });
    }
  }, [task]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Назва задачі обов\'язкова');
      return;
    }
    
    if (!formData.date) {
      setError('Дата обов\'язкова');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      if (task) {
        await updateTask(task.id, formData);
      } else {
        await createTask(formData);
      }
      
      onSubmit();
    } catch (err) {
      setError('Помилка збереження задачі. Спробуйте ще раз.');
      console.error('Error saving task:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-container">
      <div className="task-form-header">
        <h2 className="task-form-title">
          {task ? 'Редагувати задачу' : 'Додати нову задачу'}
        </h2>
        <button 
          className="task-form-close" 
          onClick={onClose}
          aria-label="Закрити форму"
        >
          &times;
        </button>
      </div>
      
      {error && <div className="task-form-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">Назва задачі *</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Введіть назву задачі"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description" className="form-label">Опис</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Введіть опис задачі"
            rows={3}
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date" className="form-label">Дата *</label>
            <input
              type="date"
              id="date"
              name="date"
              className="form-control"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="time" className="form-label">Час</label>
            <input
              type="time"
              id="time"
              name="time"
              className="form-control"
              value={formData.time}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="priority" className="form-label">Пріоритет</label>
          <select
            id="priority"
            name="priority"
            className="form-control"
            value={formData.priority || ''}
            onChange={handleInputChange}
          >
            <option value="">Без пріоритету</option>
            <option value="HIGH">Високий</option>
            <option value="MEDIUM">Середній</option>
            <option value="LOW">Низький</option>
          </select>
        </div>
        
        <div className="form-check">
          <input
            type="checkbox"
            id="completed"
            name="completed"
            className="form-check-input"
            checked={formData.completed}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="completed" className="form-check-label">
            Виконано
          </label>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel" 
            onClick={onClose}
            disabled={loading}
          >
            Скасувати
          </button>
          <button 
            type="submit" 
            className="btn-submit" 
            disabled={loading}
          >
            {loading ? 'Збереження...' : task ? 'Зберегти зміни' : 'Додати задачу'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm; 