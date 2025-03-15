import React, { useState, useEffect } from 'react';
import { Task, TaskFormProps } from '../types';
import { createTask, updateTask } from '../services/api';
import VoiceInput from './VoiceInput';
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
  
  const handleVoiceInput = (text: string, field: keyof Omit<Task, 'id'>) => {
    setFormData(prev => ({
      ...prev,
      [field]: text
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
        await updateTask({
          ...formData,
          id: task.id
        });
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
        <h2>{task ? 'Редагувати задачу' : 'Створити нову задачу'}</h2>
        <button type="button" className="close-button" onClick={onClose}>×</button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Назва задачі</label>
          <div className="input-voice-container">
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Введіть назву задачі..."
              required
            />
            <VoiceInput 
              onTextReceived={(text) => handleVoiceInput(text, 'title')} 
              buttonLabel="🎤"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Опис (необов'язково)</label>
          <div className="input-voice-container">
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Введіть опис задачі..."
              rows={3}
            />
            <VoiceInput 
              onTextReceived={(text) => handleVoiceInput(text, 'description')} 
              buttonLabel="🎤"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Дата</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="time">Час (необов'язково)</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="priority">Пріоритет</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority || ''}
            onChange={handleInputChange}
          >
            <option value="">Оберіть пріоритет</option>
            <option value="HIGH">Високий</option>
            <option value="MEDIUM">Середній</option>
            <option value="LOW">Низький</option>
          </select>
        </div>
        
        {task && (
          <div className="form-check">
            <input
              type="checkbox"
              id="completed"
              name="completed"
              checked={formData.completed}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="completed">Виконано</label>
          </div>
        )}
        
        <div className="form-actions">
          <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
            Скасувати
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Збереження...' : (task ? 'Зберегти зміни' : 'Створити задачу')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm; 