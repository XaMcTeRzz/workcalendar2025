import React, { useState, useEffect } from 'react';
import { FaTimes, FaMicrophone, FaSave } from 'react-icons/fa';
import { useVoiceInput } from '../contexts/VoiceInputContext';
import Button from './Button';
import '../styles/Modal.css';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: {
    title: string;
    description: string;
    date: string;
    priority: 'low' | 'medium' | 'high';
    category: string;
  }) => void;
  initialTask?: {
    title: string;
    description: string;
    date: string;
    priority: 'low' | 'medium' | 'high';
    category: string;
  };
  title?: string;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
  title = 'Додати задачу'
}) => {
  const today = new Date().toISOString().split('T')[0];
  
  const [task, setTask] = useState({
    title: '',
    description: '',
    date: today,
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: '',
  });
  
  const { isVoiceEnabled, startListening, stopListening, isListening, transcript, resetTranscript } = useVoiceInput();
  const [activeField, setActiveField] = useState<string | null>(null);
  
  // Сброс формы при открытии/закрытии или если переданы начальные данные
  useEffect(() => {
    if (isOpen) {
      if (initialTask) {
        setTask(initialTask);
      } else {
        setTask({
          title: '',
          description: '',
          date: today,
          priority: 'medium',
          category: '',
        });
      }
    }
  }, [isOpen, initialTask, today]);
  
  // Обработка голосового ввода
  useEffect(() => {
    if (isListening && transcript && activeField) {
      setTask(prev => ({
        ...prev,
        [activeField]: transcript
      }));
      resetTranscript();
      stopListening();
      setActiveField(null);
    }
  }, [isListening, transcript, activeField, resetTranscript, stopListening]);
  
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
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(task);
  };
  
  // Блокировка прокрутки body когда модальное окно открыто
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      
      <div className="modal-container">
        <div className="modal">
          <div className="modal-header">
            <h2>{title}</h2>
            <button className="close-button" onClick={onClose} aria-label="Закрити">
              <FaTimes />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="modal-body">
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
                  rows={4}
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
                min={today}
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
                  value={task.category}
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
            
            <div className="modal-actions">
              <Button 
                type="button"
                variant="text"
                onClick={onClose}
              >
                Відміна
              </Button>
              
              <Button 
                type="submit"
                variant="primary"
                startIcon={<FaSave />}
              >
                Зберегти
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TaskModal; 