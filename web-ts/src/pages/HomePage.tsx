import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaTasks, FaCalendarCheck, FaBell, FaCog } from 'react-icons/fa';
import { fetchTasks, fetchCurrentTasks } from '../services/api';
import { Task, CurrentTask } from '../types';
import '../styles/HomePage.css';

const HomePage: React.FC = () => {
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [currentTasks, setCurrentTasks] = useState<CurrentTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Загружаем данные параллельно
        const [tasksResponse, currentTasksResponse] = await Promise.all([
          fetchTasks(),
          fetchCurrentTasks()
        ]);

        if (tasksResponse.success && currentTasksResponse.success) {
          // Получаем последние 3 задачи
          const sortedTasks = tasksResponse.data
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3);
          
          setRecentTasks(sortedTasks);
          setCurrentTasks(currentTasksResponse.data.slice(0, 3));
        } else {
          setError('Ошибка при загрузке данных');
        }
      } catch (err) {
        console.error('Error loading home page data:', err);
        setError('Ошибка сервера. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <h1>Управляйте своими задачами эффективно</h1>
        <p className="hero-description">
          Планируйте, отслеживайте и выполняйте задачи с удобным календарем и уведомлениями
        </p>
        <div className="hero-actions">
          <Link to="/tasks" className="btn btn-primary">
            <FaPlus className="btn-icon" /> Создать задачу
          </Link>
          <Link to="/settings" className="btn btn-secondary">
            <FaCog className="btn-icon" /> Настройки
          </Link>
        </div>
      </section>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка данных...</p>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="dashboard-sections">
          <section className="dashboard-section">
            <div className="section-header">
              <h2><FaTasks className="section-icon" /> Недавние задачи</h2>
              <Link to="/tasks" className="section-link">Все задачи</Link>
            </div>
            <div className="card-container">
              {recentTasks.length > 0 ? (
                recentTasks.map(task => (
                  <div className="dashboard-card" key={task.id}>
                    <h3 className="card-title">{task.title}</h3>
                    <p className="card-date">{formatDate(task.date)}</p>
                    <p className="card-description">
                      {task.description.length > 100 
                        ? `${task.description.substring(0, 100)}...` 
                        : task.description}
                    </p>
                    <div className="card-footer">
                      {task.priority && (
                        <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-message">Нет недавних задач</p>
              )}
            </div>
          </section>

          <section className="dashboard-section">
            <div className="section-header">
              <h2><FaCalendarCheck className="section-icon" /> Текущие задачи</h2>
              <Link to="/current" className="section-link">Все текущие</Link>
            </div>
            <div className="card-container">
              {currentTasks.length > 0 ? (
                currentTasks.map(task => (
                  <div className="dashboard-card" key={task.id}>
                    <h3 className="card-title">{task.title}</h3>
                    {task.created_at && (
                      <p className="card-date">Создано: {formatDate(task.created_at)}</p>
                    )}
                    <p className="card-description">
                      {task.description.length > 100 
                        ? `${task.description.substring(0, 100)}...` 
                        : task.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="empty-message">Нет текущих задач</p>
              )}
            </div>
          </section>
        </div>
      )}

      <section className="features-section">
        <h2>Ключевые возможности</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaTasks className="feature-icon" />
            <h3>Управление задачами</h3>
            <p>Создавайте, редактируйте и отслеживайте свои задачи с удобным интерфейсом</p>
          </div>
          <div className="feature-card">
            <FaCalendarCheck className="feature-icon" />
            <p>Отмечайте текущие задачи и отслеживайте их статус выполнения</p>
          </div>
          <div className="feature-card">
            <FaBell className="feature-icon" />
            <h3>Уведомления</h3>
            <p>Получайте своевременные уведомления о предстоящих задачах</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 