import React, { useState } from 'react';
import { TaskService } from '../services/api';
import '../styles/TaskForm.css';

interface TaskFormProps {
  onTaskAdded: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskAdded }) => {
  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Введіть назву задачі');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await TaskService.addTask(title, date || undefined, time || undefined);
      setTitle('');
      setDate('');
      setTime('');
      onTaskAdded();
    } catch (err) {
      setError('Помилка при додаванні задачі. Спробуйте ще раз.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="task-form-container">
      <h3 className="form-title">Додати нову задачу</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">Назва задачі</label>
          <input
            type="text"
            id="title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введіть назву задачі"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="date" className="form-label">Дата</label>
          <input
            type="date"
            id="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="time" className="form-label">Час</label>
          <input
            type="time"
            id="time"
            className="form-control"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isLoading}
        >
          {isLoading ? 'Додавання...' : 'Додати задачу'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm; 