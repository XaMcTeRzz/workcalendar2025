import React, { useState } from 'react';
import { useTask } from '../contexts/TaskContext';
import Button from '../components/Button';
import FAB from '../components/FAB';

const Calendar: React.FC = () => {
  const { tasks } = useTask();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Вспомогательные функции для работы с календарем
  const getMonthName = (date: Date) => {
    return date.toLocaleString('uk-UA', { month: 'long' });
  };
  
  const getYear = (date: Date) => {
    return date.getFullYear();
  };
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay() || 7; // Переводим 0 (воскресенье) в 7 для соответствия с украинским календарем
  };
  
  // Навигация по месяцам
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };
  
  // Формирование сетки календаря
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];
    
    // Пустые ячейки до первого дня месяца
    for (let i = 1; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const tasksForDay = tasks.filter(task => task.date === dateString);
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${tasksForDay.length > 0 ? 'has-tasks' : ''}`}
        >
          <div className="day-number">{day}</div>
          
          {tasksForDay.length > 0 && (
            <div className="day-tasks">
              {tasksForDay.slice(0, 3).map(task => (
                <div 
                  key={task.id} 
                  className={`day-task priority-${task.priority} ${task.completed ? 'completed' : ''}`}
                >
                  {task.title}
                </div>
              ))}
              
              {tasksForDay.length > 3 && (
                <div className="more-tasks">+{tasksForDay.length - 3}</div>
              )}
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Календар</h1>
        
        <div className="month-navigation">
          <Button variant="text" onClick={goToPreviousMonth}>
            &lt; Попередній
          </Button>
          
          <h2 className="current-month">
            {getMonthName(currentMonth)} {getYear(currentMonth)}
          </h2>
          
          <Button variant="text" onClick={goToNextMonth}>
            Наступний &gt;
          </Button>
        </div>
      </div>
      
      <div className="calendar-container">
        <div className="calendar-header">
          <div className="weekday">Пн</div>
          <div className="weekday">Вт</div>
          <div className="weekday">Ср</div>
          <div className="weekday">Чт</div>
          <div className="weekday">Пт</div>
          <div className="weekday">Сб</div>
          <div className="weekday">Нд</div>
        </div>
        
        <div className="calendar-grid">
          {renderCalendarDays()}
        </div>
      </div>
      
      <FAB onClick={() => setShowAddModal(true)} />
    </div>
  );
};

export default Calendar; 