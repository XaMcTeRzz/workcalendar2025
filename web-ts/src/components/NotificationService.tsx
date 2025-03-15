import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import '../styles/Notification.css';

export type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration: number;
}

// Создаем контекст для службы уведомлений
export const NotificationContext = React.createContext<{
  showNotification: (message: string, type?: NotificationType, duration?: number) => void;
}>({
  showNotification: () => {},
});

export const useNotification = () => React.useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Функция для показа нового уведомления
  const showNotification = useCallback((
    message: string, 
    type: NotificationType = 'info', 
    duration: number = 3000
  ) => {
    const id = Date.now().toString();
    
    // Добавляем новое уведомление
    setNotifications(prev => [...prev, { id, message, type, duration }]);
    
    // Автоматически удаляем уведомление после указанной длительности
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, duration);
  }, []);

  // Функция для удаления уведомления по идентификатору
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Значение провайдера
  const contextValue = {
    showNotification,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer 
        notifications={notifications} 
        removeNotification={removeNotification} 
      />
    </NotificationContext.Provider>
  );
};

interface NotificationContainerProps {
  notifications: Notification[];
  removeNotification: (id: string) => void;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({ 
  notifications,
  removeNotification 
}) => {
  // Используем портал для рендеринга уведомлений поверх всего остального содержимого
  return createPortal(
    <div className="notification-container">
      {notifications.map(notification => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
          onClose={() => removeNotification(notification.id)} 
        />
      ))}
    </div>,
    document.body
  );
};

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, notification.duration);

    return () => clearTimeout(timer);
  }, [notification.duration, onClose]);

  const getIconForType = () => {
    switch (notification.type) {
      case 'success':
        return <FaCheckCircle />;
      case 'error':
        return <FaExclamationCircle />;
      case 'info':
      default:
        return <FaInfoCircle />;
    }
  };

  return (
    <div className={`notification-item notification-${notification.type}`}>
      <div className="notification-icon">
        {getIconForType()}
      </div>
      <div className="notification-content">
        {notification.message}
      </div>
      <button className="notification-close" onClick={onClose}>
        <FaTimes />
      </button>
    </div>
  );
};

export default NotificationProvider; 