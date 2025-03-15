import React from 'react';
import { Task } from '../types';
import '../styles/TaskList.css';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onComplete: (taskId: number, completed: boolean) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete, onComplete }) => {
  // Функція для форматування дати
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Отримуємо пріоритет задачі у вигляді тексту
  const getPriorityText = (priority?: 'HIGH' | 'MEDIUM' | 'LOW'): string => {
    switch (priority) {
      case 'HIGH':
        return 'Високий';
      case 'MEDIUM':
        return 'Середній';
      case 'LOW':
        return 'Низький';
      default:
        return '';
    }
  };

  // Отримуємо іконку для пріоритету
  const getPriorityIcon = (priority?: 'HIGH' | 'MEDIUM' | 'LOW'): string => {
    switch (priority) {
      case 'HIGH':
        return '🔴';
      case 'MEDIUM':
        return '🟠';
      case 'LOW':
        return '🟢';
      default:
        return '';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-list">
        <div className="empty-icon">📝</div>
        <div className="empty-text">Немає запланованих задач</div>
        <div className="empty-subtext">Додайте нову задачу, щоб почати</div>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
          <div className="task-checkbox">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => onComplete(task.id, e.target.checked)}
              id={`task-${task.id}`}
            />
            <label htmlFor={`task-${task.id}`}></label>
          </div>
          
          <div className="task-content">
            <div className="task-header">
              <h3 className="task-title">{task.title}</h3>
              {task.priority && (
                <span className={`task-priority priority-${task.priority.toLowerCase()}`}>
                  {getPriorityIcon(task.priority)} {getPriorityText(task.priority)}
                </span>
              )}
            </div>
            
            <div className="task-details">
              <div className="task-date">
                <span className="task-icon">📅</span> {formatDate(task.date)}
              </div>
              
              {task.time && (
                <div className="task-time">
                  <span className="task-icon">⏰</span> {task.time}
                </div>
              )}
            </div>
            
            {task.description && (
              <div className="task-description">
                {task.description}
              </div>
            )}
          </div>
          
          <div className="task-actions">
            <button 
              className="task-btn edit-btn" 
              onClick={() => onEdit(task)}
              aria-label="Редагувати задачу"
            >
              <span className="task-btn-icon">✏️</span>
            </button>
            <button 
              className="task-btn delete-btn" 
              onClick={() => onDelete(task.id)}
              aria-label="Видалити задачу"
            >
              <span className="task-btn-icon">🗑️</span>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList; 