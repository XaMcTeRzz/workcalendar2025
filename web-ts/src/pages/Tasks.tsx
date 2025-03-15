import React, { useState } from 'react';
import { useTask } from '../contexts/TaskContext';
import { useVoiceInput } from '../contexts/VoiceInputContext';
import { useNotification } from '../components/NotificationService';
import Button from '../components/Button';
import FAB from '../components/FAB';
import TaskModal from '../components/TaskModal';
import { FaMicrophone, FaCheck, FaTrash, FaEdit } from 'react-icons/fa';

const Tasks: React.FC = () => {
  const { tasks, isLoading, updateTask, deleteTask, addTask } = useTask();
  const { isVoiceEnabled, startListening, stopListening, isListening } = useVoiceInput();
  const { showNotification } = useNotification();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Фильтрация задач
  const filteredTasks = tasks.filter(task => {
    // Сначала фильтруем по статусу
    if (filter === 'active' && task.completed) return false;
    if (filter === 'completed' && !task.completed) return false;
    
    // Затем по поисковому запросу, если он есть
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        (task.category && task.category.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // Обработчик изменения статуса задачи
  const handleToggleComplete = (id: string, completed: boolean) => {
    updateTask(id, { completed: !completed }).then(() => {
      showNotification(
        `Задача ${!completed ? 'завершена' : 'помечена как активная'}`, 
        'success'
      );
    });
  };
  
  // Обработчик добавления новой задачи
  const handleAddTask = async (newTask: {
    title: string;
    description: string;
    date: string;
    priority: 'low' | 'medium' | 'high';
    category: string;
  }) => {
    try {
      await addTask({
        ...newTask,
        completed: false,
      });
      setShowAddModal(false);
      showNotification('Задача успішно додана', 'success');
    } catch (error) {
      showNotification('Помилка при додаванні задачі', 'error');
    }
  };
  
  // Обработчик удаления задачи
  const handleDeleteTask = async (id: string, title: string) => {
    if (window.confirm(`Ви впевнені, що хочете видалити задачу "${title}"?`)) {
      try {
        await deleteTask(id);
        showNotification('Задача видалена', 'info');
      } catch (error) {
        showNotification('Помилка при видаленні задачі', 'error');
      }
    }
  };
  
  // Отображаем задачи с анимацией появления
  const renderTasks = () => {
    return filteredTasks.map((task, index) => (
      <div 
        key={task.id} 
        className={`task-card ${task.completed ? 'completed' : ''} fade-in priority-${task.priority}`}
        style={{ animationDelay: `${index * 0.05}s` }}
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
            onClick={() => handleDeleteTask(task.id, task.title)}
          >
            Видалити
          </Button>
        </div>
      </div>
    ));
  };
  
  // Обработчик поиска
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Задачі</h1>
        
        <div className="header-actions">
          {isSearchOpen ? (
            <div className="search-input-container">
              <input
                type="text"
                className="search-input"
                placeholder="Пошук задач..."
                value={searchQuery}
                onChange={handleSearchChange}
                autoFocus
              />
              <Button 
                variant="text"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
              >
                Відміна
              </Button>
            </div>
          ) : (
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
          )}
          
          <div className="action-buttons">
            {!isSearchOpen && (
              <Button
                variant="secondary"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Пошук"
              >
                Пошук
              </Button>
            )}
            
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
                {renderTasks()}
              </div>
            ) : (
              <div className="empty-state">
                {searchQuery ? (
                  <>
                    <p>Немає задач, що відповідають запиту "{searchQuery}"</p>
                    <Button 
                      variant="primary"
                      onClick={() => setSearchQuery('')}
                    >
                      Очистити запит
                    </Button>
                  </>
                ) : (
                  <>
                    <p>Немає задач для відображення</p>
                    <Button 
                      variant="primary"
                      onClick={() => setShowAddModal(true)}
                    >
                      Додати задачу
                    </Button>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
      
      <FAB onClick={() => setShowAddModal(true)} />
      
      <TaskModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddTask}
      />
    </div>
  );
};

export default Tasks; 