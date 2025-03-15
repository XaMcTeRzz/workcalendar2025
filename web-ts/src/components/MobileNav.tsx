import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaClipboardList, FaCog } from 'react-icons/fa';

const MobileNav: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', name: 'Головна', icon: <FaHome /> },
    { path: '/calendar', name: 'Календар', icon: <FaCalendarAlt /> },
    { path: '/tasks', name: 'Задачі', icon: <FaClipboardList /> },
    { path: '/settings', name: 'Налаштування', icon: <FaCog /> },
  ];

  return (
    <nav className="mobile-nav">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
        >
          <span className="mobile-nav-icon">{item.icon}</span>
          <span className="mobile-nav-text">{item.name}</span>
        </Link>
      ))}
    </nav>
  );
};

export default MobileNav; 