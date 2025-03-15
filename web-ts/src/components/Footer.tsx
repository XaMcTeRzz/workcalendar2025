import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaTasks, FaCalendarCheck, FaCog } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  
  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-info">
            <p>&copy; {year} Календар задач</p>
          </div>
          <div className="footer-links">
            <a href="https://github.com/XaMcTeRzz/workcalendar2025" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://telegram.me/workcalendar_bot" target="_blank" rel="noopener noreferrer">
              Telegram
            </a>
          </div>
        </div>
      </footer>
      
      {/* Мобильная навигация */}
      <nav className="mobile-nav">
        <Link to="/" className="mobile-nav-item">
          <FaHome className="mobile-nav-icon" />
          <span className="mobile-nav-text">Главная</span>
        </Link>
        <Link to="/tasks" className="mobile-nav-item">
          <FaTasks className="mobile-nav-icon" />
          <span className="mobile-nav-text">Задачи</span>
        </Link>
        <Link to="/current" className="mobile-nav-item">
          <FaCalendarCheck className="mobile-nav-icon" />
          <span className="mobile-nav-text">Текущие</span>
        </Link>
        <Link to="/settings" className="mobile-nav-item">
          <FaCog className="mobile-nav-icon" />
          <span className="mobile-nav-text">Настройки</span>
        </Link>
      </nav>
    </>
  );
};

export default Footer; 