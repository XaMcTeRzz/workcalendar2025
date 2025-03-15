import React from 'react';
import { CurrentTask } from '../types';
import '../styles/CurrentTaskList.css';

interface CurrentTaskListProps {
  currentTasks: CurrentTask[];
}

const CurrentTaskList: React.FC<CurrentTaskListProps> = ({ currentTasks }) => {
  // Функція для форматування дати
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Функція для форматування часу створення
  const formatCreatedAt = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (currentTasks.length === 0) {
    return (
      <div className="empty-current-tasks">
        <div className="empty-icon">⏰</div>
        <div className="empty-text">Немає поточних задач</div>
        <div className="empty-subtext">Поточні задачі з'являться тут</div>
      </div>
    );
  }

  return (
    <ul className="current-task-list">
      {currentTasks.map((task) => (
        <li key={task.id} className="current-task-item">
          <div className="current-task-header">
            <h3 className="current-task-title">{task.title}</h3>
          </div>
          
          <div className="current-task-details">
            {task.date && (
              <div className="current-task-date">
                <span className="current-task-icon">📅</span> {formatDate(task.date)}
              </div>
            )}
            
            {task.time && (
              <div className="current-task-time">
                <span className="current-task-icon">⏰</span> {task.time}
              </div>
            )}
          </div>
          
          {task.description && (
            <div className="current-task-description">
              {task.description}
            </div>
          )}
          
          <div className="current-task-footer">
            <div className="current-task-created">
              <span className="current-task-created-icon">🕒</span>
              Створено: {formatCreatedAt(task.created_at)}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CurrentTaskList; 