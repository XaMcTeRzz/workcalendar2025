import React from 'react';
import { useUser } from '../contexts/UserContext';
import { useTask } from '../contexts/TaskContext';
import Button from '../components/Button';

const Home: React.FC = () => {
  const { user } = useUser();
  const { tasks, isLoading } = useTask();
  
  // Фильтруем только незавершенные задачи
  const uncompletedTasks = tasks.filter(task => !task.completed);
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Вітаємо, {user?.name || 'Користувач'}!</h1>
      </div>
      
      <div className="page-section">
        <div className="card">
          <h2 className="card-title">Статистика задач</h2>
          <div className="card-content">
            <p>Загальна кількість задач: {tasks.length}</p>
            <p>Незавершені задачі: {uncompletedTasks.length}</p>
            <p>Завершені задачі: {tasks.length - uncompletedTasks.length}</p>
          </div>
        </div>
        
        <div className="card">
          <h2 className="card-title">Останні задачі</h2>
          <div className="card-content">
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Завантаження задач...</p>
              </div>
            ) : (
              <div className="task-list">
                {uncompletedTasks.length > 0 ? (
                  uncompletedTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="task-item">
                      <h3>{task.title}</h3>
                      <p>{task.description.substring(0, 100)}{task.description.length > 100 ? '...' : ''}</p>
                      <p className="task-date">Дата: {new Date(task.date).toLocaleDateString()}</p>
                      <div className="task-priority">
                        Пріоритет: 
                        <span className={`priority-badge priority-${task.priority}`}>
                          {task.priority === 'high' ? 'Високий' : 
                           task.priority === 'medium' ? 'Середній' : 'Низький'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Немає активних задач</p>
                )}
                
                <Button 
                  variant="primary" 
                  className="mt-3"
                  onClick={() => window.location.href = '/tasks'}
                >
                  Перейти до всіх задач
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 