import React, { useState } from 'react';
import { createCurrentTask } from '../services/api';
import '../styles/CurrentTaskForm.css';

interface CurrentTaskFormProps {
  onTaskAdded: () => void;
}

const CurrentTaskForm: React.FC<CurrentTaskFormProps> = ({ onTaskAdded }) => {
  const [note, setNote] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!note.trim()) {
      setError('Введіть текст нотатки');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await createCurrentTask({ 
        title: note,
        created_at: new Date().toISOString()
      });
      setNote('');
      onTaskAdded();
    } catch (err) {
      setError('Помилка при додаванні нотатки. Спробуйте ще раз.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendToTelegram = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Пока отключим эту функциональность, так как она не реализована в API
      alert('Функціональність тимчасово недоступна');
      /*
      const response = await sendToTelegram();
      if (response.success) {
        alert('Задачі успішно надіслано в Telegram!');
      } else {
        setError(response.message || 'Помилка при надсиланні в Telegram');
      }
      */
    } catch (err) {
      setError('Помилка при надсиланні в Telegram. Спробуйте ще раз.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="current-task-form-container">
      <h3 className="form-title">Додати нову нотатку</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="current-task-form">
        <div className="form-group">
          <label htmlFor="note" className="form-label">Текст нотатки</label>
          <input
            type="text"
            id="note"
            className="form-control"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Введіть текст нотатки"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isLoading}
        >
          {isLoading ? 'Додавання...' : 'Додати нотатку'}
        </button>
      </form>
      
      <div className="telegram-actions">
        <button 
          onClick={handleSendToTelegram} 
          className="btn btn-success" 
          disabled={isLoading}
        >
          {isLoading ? 'Надсилання...' : 'Надіслати в Telegram'}
        </button>
      </div>
    </div>
  );
};

export default CurrentTaskForm; 