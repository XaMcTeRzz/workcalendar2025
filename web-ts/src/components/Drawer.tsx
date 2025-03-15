import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaClipboardList, FaCog, FaChartBar, FaTimes } from 'react-icons/fa';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  // Закрытие drawer при нажатии Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Блокировка прокрутки body когда drawer открыт
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const menuItems = [
    { path: '/', name: 'Головна', icon: <FaHome /> },
    { path: '/calendar', name: 'Календар', icon: <FaCalendarAlt /> },
    { path: '/tasks', name: 'Задачі', icon: <FaClipboardList /> },
    { path: '/statistics', name: 'Статистика', icon: <FaChartBar /> },
    { path: '/settings', name: 'Налаштування', icon: <FaCog /> },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`drawer-backdrop ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <button 
            className="toolbar-nav-icon" 
            onClick={onClose}
            aria-label="Закрити меню"
          >
            <FaTimes />
          </button>
          <div className="drawer-app-name">Календар Задач</div>
        </div>
        
        <nav className="drawer-content">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`drawer-menu-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="drawer-menu-icon">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Drawer; 