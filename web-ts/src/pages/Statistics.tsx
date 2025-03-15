import React, { useState, useEffect } from 'react';
import { useTask } from '../contexts/TaskContext';
import Button from '../components/Button';

interface Stats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  tasksPerPriority: {
    high: number;
    medium: number;
    low: number;
  };
  tasksPerCategory: Record<string, number>;
}

const Statistics: React.FC = () => {
  const { tasks } = useTask();
  const [stats, setStats] = useState<Stats>({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    completionRate: 0,
    tasksPerPriority: {
      high: 0,
      medium: 0,
      low: 0,
    },
    tasksPerCategory: {},
  });
  
  const [timeFrame, setTimeFrame] = useState<'all' | 'month' | 'week'>('all');
  
  useEffect(() => {
    // Фильтрация задач по выбранному временному периоду
    const filteredTasks = tasks.filter(task => {
      if (timeFrame === 'all') return true;
      
      const taskDate = new Date(task.date);
      const now = new Date();
      
      if (timeFrame === 'month') {
        return taskDate.getMonth() === now.getMonth() && 
               taskDate.getFullYear() === now.getFullYear();
      }
      
      if (timeFrame === 'week') {
        // Получаем начало текущей недели (понедельник)
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
        startOfWeek.setHours(0, 0, 0, 0);
        
        return taskDate >= startOfWeek;
      }
      
      return false;
    });
    
    // Обработка данных для статистики
    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Группировка по приоритету
    const tasksPerPriority = {
      high: filteredTasks.filter(task => task.priority === 'high').length,
      medium: filteredTasks.filter(task => task.priority === 'medium').length,
      low: filteredTasks.filter(task => task.priority === 'low').length,
    };
    
    // Группировка по категориям
    const tasksPerCategory: Record<string, number> = {};
    filteredTasks.forEach(task => {
      const category = task.category || 'Без категорії';
      tasksPerCategory[category] = (tasksPerCategory[category] || 0) + 1;
    });
    
    setStats({
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      tasksPerPriority,
      tasksPerCategory,
    });
  }, [tasks, timeFrame]);
  
  // Рассчитываем максимальное значение для графиков
  const maxPriorityValue = Math.max(
    stats.tasksPerPriority.high,
    stats.tasksPerPriority.medium,
    stats.tasksPerPriority.low
  );
  
  const maxCategoryValue = Math.max(
    ...Object.values(stats.tasksPerCategory)
  );
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Статистика</h1>
        
        <div className="time-frame-selector">
          <Button 
            variant={timeFrame === 'all' ? 'primary' : 'text'}
            onClick={() => setTimeFrame('all')}
          >
            Всі задачі
          </Button>
          <Button 
            variant={timeFrame === 'month' ? 'primary' : 'text'}
            onClick={() => setTimeFrame('month')}
          >
            Цей місяць
          </Button>
          <Button 
            variant={timeFrame === 'week' ? 'primary' : 'text'}
            onClick={() => setTimeFrame('week')}
          >
            Цей тиждень
          </Button>
        </div>
      </div>
      
      <div className="statistics-container">
        <div className="card">
          <h2 className="card-title">Загальна статистика</h2>
          <div className="card-content stats-summary">
            <div className="stat-item">
              <div className="stat-value">{stats.totalTasks}</div>
              <div className="stat-label">Всього задач</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.completedTasks}</div>
              <div className="stat-label">Завершено</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.pendingTasks}</div>
              <div className="stat-label">В процесі</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.completionRate.toFixed(1)}%</div>
              <div className="stat-label">Виконано</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="card-title">Задачі за пріоритетом</h2>
          <div className="card-content">
            <div className="chart-bars">
              <div className="chart-bar-group">
                <div className="chart-label">Високий</div>
                <div className="chart-bar-wrapper">
                  <div 
                    className="chart-bar high-priority"
                    style={{ 
                      width: maxPriorityValue > 0 
                        ? `${(stats.tasksPerPriority.high / maxPriorityValue) * 100}%` 
                        : '0%' 
                    }}
                  ></div>
                  <div className="chart-value">{stats.tasksPerPriority.high}</div>
                </div>
              </div>
              
              <div className="chart-bar-group">
                <div className="chart-label">Середній</div>
                <div className="chart-bar-wrapper">
                  <div 
                    className="chart-bar medium-priority"
                    style={{ 
                      width: maxPriorityValue > 0 
                        ? `${(stats.tasksPerPriority.medium / maxPriorityValue) * 100}%` 
                        : '0%' 
                    }}
                  ></div>
                  <div className="chart-value">{stats.tasksPerPriority.medium}</div>
                </div>
              </div>
              
              <div className="chart-bar-group">
                <div className="chart-label">Низький</div>
                <div className="chart-bar-wrapper">
                  <div 
                    className="chart-bar low-priority"
                    style={{ 
                      width: maxPriorityValue > 0 
                        ? `${(stats.tasksPerPriority.low / maxPriorityValue) * 100}%` 
                        : '0%' 
                    }}
                  ></div>
                  <div className="chart-value">{stats.tasksPerPriority.low}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="card-title">Задачі за категоріями</h2>
          <div className="card-content">
            {Object.keys(stats.tasksPerCategory).length > 0 ? (
              <div className="chart-bars">
                {Object.entries(stats.tasksPerCategory).map(([category, count]) => (
                  <div className="chart-bar-group" key={category}>
                    <div className="chart-label">{category}</div>
                    <div className="chart-bar-wrapper">
                      <div 
                        className="chart-bar category-bar"
                        style={{ 
                          width: maxCategoryValue > 0 
                            ? `${(count / maxCategoryValue) * 100}%` 
                            : '0%' 
                        }}
                      ></div>
                      <div className="chart-value">{count}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Немає даних про категорії</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 