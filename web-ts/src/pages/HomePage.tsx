import React, { useState, useEffect } from 'react';
import TaskForm from '../components/TaskForm';
import CurrentTaskForm from '../components/CurrentTaskForm';
import { TaskService, CurrentTaskService } from '../services/api';
import { Task, CurrentTask } from '../types';
import '../styles/HomePage.css';

const HomePage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTasks, setCurrentTasks] = useState<CurrentTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [tasksData, currentTasksData] = await Promise.all([
        TaskService.getTasks(),
        CurrentTaskService.getCurrentTasks()
      ]);

      setTasks(tasksData);
      setCurrentTasks(currentTasksData);
    } catch (err) {
      setError('Помилка при завантаженні даних. Спробуйте оновити сторінку.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTaskAdded = () => {
    fetchData();
  };

  const formatDateTime = (date: string | null, time: string | null) => {
    if (!date) return '';
    
    let result = date;
    if (time) {
      result += ` о ${time}`;
    }
    
    return result;
  };

  return (
    <div className="home-page">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              Заплановані задачі
            </div>
            <div className="card-body">
              <TaskForm onTaskAdded={handleTaskAdded} />
              
              <h3 className="section-title">Список задач</h3>
              
              {isLoading ? (
                <div className="loading">Завантаження...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : tasks.length === 0 ? (
                <div className="empty-message">Немає запланованих задач</div>
              ) : (
                <ul className="task-list">
                  {tasks.map((task) => (
                    <li key={task.id} className="task-item">
                      <div>
                        <div className="task-title">{task.title}</div>
                        {(task.date || task.time) && (
                          <div className="task-date">
                            {formatDateTime(task.date, task.time)}
                          </div>
                        )}
                      </div>
                      <div className="task-actions">
                        <button className="task-action-btn">✏️</button>
                        <button className="task-action-btn">🗑️</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              Поточні задачі
            </div>
            <div className="card-body">
              <CurrentTaskForm onTaskAdded={handleTaskAdded} />
              
              <h3 className="section-title">Список поточних задач</h3>
              
              {isLoading ? (
                <div className="loading">Завантаження...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : currentTasks.length === 0 ? (
                <div className="empty-message">Немає поточних задач</div>
              ) : (
                <ul className="task-list">
                  {currentTasks.map((task) => (
                    <li key={task.id} className="task-item">
                      <div className="task-title">{task.note}</div>
                      <div className="task-actions">
                        <button className="task-action-btn">✏️</button>
                        <button className="task-action-btn">🗑️</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 