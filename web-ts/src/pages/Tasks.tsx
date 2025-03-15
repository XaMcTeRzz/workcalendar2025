import React, { useState } from 'react';
import { useTask } from '../contexts/TaskContext';
import { useVoiceInput } from '../contexts/VoiceInputContext';
import Button from '../components/Button';
import FAB from '../components/FAB';
import { FaMicrophone, FaCheck, FaTrash, FaEdit } from 'react-icons/fa';

const Tasks: React.FC = () => {
  const { tasks, isLoading, updateTask, deleteTask } = useTask();
  const { isVoiceEnabled, startListening, stopListening, isListening } = useVoiceInput();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Фильтрация задач
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });
  
  // Обработчик изменения статуса задачи
  const handleToggleComplete = (id: string, completed: boolean) => {
    updateTask(id, { completed: !completed });
  };
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Задачі</h1>
        
        <div className="header-actions">
          <div className="filter-buttons">
            <Button 
              variant={filter === 'all' ? 'primary' : 'text'}
              onClick={() => setFilter('all')}
            >
              Всі
            </Button>
            <Button 
              variant={filter === 'active' ? 'primary' : 'text'}
              onClick={() => setFilter('active')}
            >
              Активні
            </Button>
            <Button 
              variant={filter === 'completed' ? 'primary' : 'text'}
              onClick={() => setFilter('completed')}
            >
              Завершені
            </Button>
          </div>
          
          {isVoiceEnabled && (
            <Button
              variant="secondary"
              onClick={isListening ? stopListening : startListening}
              startIcon={<FaMicrophone />}
            >
              {isListening ? 'Зупинити' : 'Голос'}
            </Button>
          )}
        </div>
      </div>
      
      <div className="tasks-container">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Завантаження задач...</p>
          </div>
        ) : (
          <>
            {filteredTasks.length > 0 ? (
              <div className="task-list">
                {filteredTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`task-card ${task.completed ? 'completed' : ''}`}
                  >
                    <div className="task-card-header">
                      <h3 className="task-title">{task.title}</h3>
                      <span className={`priority-badge priority-${task.priority}`}>
                        {task.priority === 'high' ? 'Високий' : 
                         task.priority === 'medium' ? 'Середній' : 'Низький'}
                      </span>
                    </div>
                    
                    <div className="task-card-content">
                      <p className="task-description">{task.description}</p>
                      <p className="task-date">
                        <strong>Дата:</strong> {new Date(task.date).toLocaleDateString()}
                      </p>
                      {task.category && (
                        <p className="task-category">
                          <strong>Категорія:</strong> {task.category}
                        </p>
                      )}
                    </div>
                    
                    <div className="task-card-actions">
                      <Button 
                        variant="text"
                        startIcon={<FaCheck />}
                        onClick={() => handleToggleComplete(task.id, task.completed)}
                      >
                        {task.completed ? 'Відмінити' : 'Завершити'}
                      </Button>
                      
                      <Button 
                        variant="text"
                        startIcon={<FaEdit />}
                        onClick={() => window.location.href = `/task/${task.id}`}
                      >
                        Редагувати
                      </Button>
                      
                      <Button 
                        variant="text"
                        startIcon={<FaTrash />}
                        onClick={() => deleteTask(task.id)}
                      >
                        Видалити
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Немає задач для відображення</p>
                <Button 
                  variant="primary"
                  onClick={() => setShowAddModal(true)}
                >
                  Додати задачу
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      
      <FAB onClick={() => setShowAddModal(true)} />
    </div>
  );
};

export default Tasks; 