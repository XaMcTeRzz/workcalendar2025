import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaTasks, FaCalendarCheck, FaCog } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        &copy; {currentYear} Календар Задач. Всі права захищені.
      </div>
    </footer>
  );
};

export default Footer; 