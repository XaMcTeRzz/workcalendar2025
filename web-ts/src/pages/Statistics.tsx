import React, { useState, useEffect } from 'react';
import { useTask } from '../contexts/TaskContext';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNotification } from '../components/NotificationService';
import { FaDownload, FaChartBar, FaCalendarAlt, FaFilter } from 'react-icons/fa';

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
  overdueTasks: number;
  averageCompletionTime: number;
}

const Statistics: React.FC = () => {
  const { tasks } = useTask();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState<boolean>(true);
  const [chartType, setChartType] = useState<'bar' | 'donut'>('bar');
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
    overdueTasks: 0,
    averageCompletionTime: 0
  });
  
  const [timeFrame, setTimeFrame] = useState<'all' | 'month' | 'week'>('all');
  
  useEffect(() => {
    setLoading(true);
    
    // Имитация загрузки данных
    setTimeout(() => {
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
      
      // Расчет просроченных задач
      const now = new Date();
      const overdueTasks = filteredTasks.filter(task => {
        const taskDate = new Date(task.date);
        return !task.completed && taskDate < now;
      }).length;
      
      // Расчет среднего времени выполнения задачи (для завершенных задач)
      let totalCompletionTime = 0;
      const completedWithDates = filteredTasks.filter(task => 
        task.completed && task.updatedAt && task.date
      );
      
      completedWithDates.forEach(task => {
        const startDate = new Date(task.date);
        const endDate = new Date(task.updatedAt);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        totalCompletionTime += diffDays;
      });
      
      const averageCompletionTime = completedWithDates.length > 0 
        ? totalCompletionTime / completedWithDates.length 
        : 0;
      
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
        overdueTasks,
        averageCompletionTime
      });
      
      setLoading(false);
    }, 800); // Имитируем загрузку данных
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

  const exportReport = () => {
    // Создаем отчет в формате CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Заголовки
    csvContent += "Категория,Значение\n";
    
    // Общая статистика
    csvContent += `Всего задач,${stats.totalTasks}\n`;
    csvContent += `Завершенные задачи,${stats.completedTasks}\n`;
    csvContent += `Задачи в процессе,${stats.pendingTasks}\n`;
    csvContent += `Процент выполнения,${stats.completionRate.toFixed(1)}%\n`;
    csvContent += `Просроченные задачи,${stats.overdueTasks}\n`;
    csvContent += `Среднее время выполнения (днів),${stats.averageCompletionTime.toFixed(1)}\n\n`;
    
    // По приоритетам
    csvContent += "Приоритет,Количество\n";
    csvContent += `Высокий,${stats.tasksPerPriority.high}\n`;
    csvContent += `Средний,${stats.tasksPerPriority.medium}\n`;
    csvContent += `Низкий,${stats.tasksPerPriority.low}\n\n`;
    
    // По категориям
    csvContent += "Категория,Количество\n";
    Object.entries(stats.tasksPerCategory).forEach(([category, count]) => {
      csvContent += `${category},${count}\n`;
    });
    
    // Создаем и скачиваем файл
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    
    // Устанавливаем имя файла с датой
    const now = new Date();
    const fileName = `tasks-report-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.csv`;
    link.setAttribute("download", fileName);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Отчет успешно скачан', 'success', 3000);
  };
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1><FaChartBar className="icon-margin-right" /> Статистика</h1>
        
        <div className="header-actions">
          <div className="time-frame-selector">
            <FaFilter className="icon-margin-right" />
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
              <FaCalendarAlt className="icon-margin-right" />
              Цей місяць
            </Button>
            <Button 
              variant={timeFrame === 'week' ? 'primary' : 'text'}
              onClick={() => setTimeFrame('week')}
            >
              Цей тиждень
            </Button>
          </div>
          
          <Button 
            variant="secondary"
            onClick={exportReport}
            disabled={loading}
          >
            <FaDownload className="icon-margin-right" />
            Завантажити звіт
          </Button>
          
          <div className="chart-toggle">
            <Button
              variant={chartType === 'bar' ? 'primary' : 'text'}
              onClick={() => setChartType('bar')}
            >
              Стовпці
            </Button>
            <Button
              variant={chartType === 'donut' ? 'primary' : 'text'}
              onClick={() => setChartType('donut')}
            >
              Кільця
            </Button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <LoadingSpinner 
          type="pulse" 
          size="large" 
          fullPage={false} 
          text="Завантаження статистики..." 
        />
      ) : (
        <div className="statistics-container">
          <div className="card stats-card">
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
              <div className="stat-item">
                <div className="stat-value">{stats.overdueTasks}</div>
                <div className="stat-label">Прострочено</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.averageCompletionTime.toFixed(1)}</div>
                <div className="stat-label">Середній час виконання (днів)</div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h2 className="card-title">Задачі за пріоритетом</h2>
            <div className="card-content">
              {chartType === 'bar' ? (
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
              ) : (
                <div className="donut-chart-container">
                  <div className="donut-chart" style={{ 
                    background: `conic-gradient(
                      #F06292 0% ${stats.tasksPerPriority.high / stats.totalTasks * 100}%, 
                      #4FC3F7 ${stats.tasksPerPriority.high / stats.totalTasks * 100}% ${(stats.tasksPerPriority.high + stats.tasksPerPriority.medium) / stats.totalTasks * 100}%, 
                      #AED581 ${(stats.tasksPerPriority.high + stats.tasksPerPriority.medium) / stats.totalTasks * 100}% 100%
                    )`
                  }}>
                    <div className="donut-chart-center"></div>
                  </div>
                  <div className="donut-chart-legend">
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#F06292' }}></div>
                      <div className="legend-text">Високий ({stats.tasksPerPriority.high})</div>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#4FC3F7' }}></div>
                      <div className="legend-text">Середній ({stats.tasksPerPriority.medium})</div>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#AED581' }}></div>
                      <div className="legend-text">Низький ({stats.tasksPerPriority.low})</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="card">
            <h2 className="card-title">Задачі за категоріями</h2>
            <div className="card-content">
              {Object.keys(stats.tasksPerCategory).length > 0 ? (
                chartType === 'bar' ? (
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
                  <div className="donut-chart-container">
                    <div className="donut-chart" style={{ 
                      background: generateConicGradient(stats.tasksPerCategory)
                    }}>
                      <div className="donut-chart-center"></div>
                    </div>
                    <div className="donut-chart-legend">
                      {Object.entries(stats.tasksPerCategory).map(([category, count], index) => (
                        <div className="legend-item" key={category}>
                          <div className="legend-color" style={{ 
                            backgroundColor: getColorForIndex(index)
                          }}></div>
                          <div className="legend-text">{category} ({count})</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ) : (
                <div className="empty-state">
                  <p>Немає даних про категорії</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Вспомогательные функции для кольцевой диаграммы
function getColorForIndex(index: number): string {
  // Список цветов Material Design
  const colors = [
    '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', 
    '#536DFE', '#448AFF', '#40C4FF', '#18FFFF',
    '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41',
    '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'
  ];
  
  return colors[index % colors.length];
}

function generateConicGradient(data: Record<string, number>): string {
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);
  
  let cumulativePercentage = 0;
  let gradientString = '';
  
  Object.entries(data).forEach(([_, count], index) => {
    const percentage = (count / total) * 100;
    const nextPercentage = cumulativePercentage + percentage;
    
    gradientString += `${getColorForIndex(index)} ${cumulativePercentage}% ${nextPercentage}%`;
    
    if (index < Object.keys(data).length - 1) {
      gradientString += ', ';
    }
    
    cumulativePercentage = nextPercentage;
  });
  
  return `conic-gradient(${gradientString})`;
}

export default Statistics; 