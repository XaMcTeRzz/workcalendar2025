import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <span className="navbar-logo-icon">📅</span>
            <span className="navbar-logo-text">Календар задач</span>
          </Link>

          {isMobile ? (
            <button 
              className="navbar-toggle" 
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
            >
              <span className={`navbar-toggle-icon ${isMenuOpen ? 'open' : ''}`}></span>
            </button>
          ) : (
            <ul className="navbar-menu">
              <li className="navbar-item">
                <Link 
                  to="/" 
                  className={`navbar-link ${isActive('/') ? 'active' : ''}`}
                >
                  <span className="navbar-link-icon">📋</span>
                  <span className="navbar-link-text">Задачі</span>
                </Link>
              </li>
              <li className="navbar-item">
                <Link 
                  to="/settings" 
                  className={`navbar-link ${isActive('/settings') ? 'active' : ''}`}
                >
                  <span className="navbar-link-icon">⚙️</span>
                  <span className="navbar-link-text">Налаштування</span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>

      {isMobile && isMenuOpen && (
        <div className="mobile-menu">
          <ul className="mobile-menu-list">
            <li className="mobile-menu-item">
              <Link 
                to="/" 
                className={`mobile-menu-link ${isActive('/') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <span className="mobile-menu-icon">📋</span>
                <span className="mobile-menu-text">Задачі</span>
              </Link>
            </li>
            <li className="mobile-menu-item">
              <Link 
                to="/settings" 
                className={`mobile-menu-link ${isActive('/settings') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <span className="mobile-menu-icon">⚙️</span>
                <span className="mobile-menu-text">Налаштування</span>
              </Link>
            </li>
          </ul>
        </div>
      )}

      {isMobile && (
        <div className="mobile-navbar">
          <Link 
            to="/" 
            className={`mobile-navbar-link ${isActive('/') ? 'active' : ''}`}
          >
            <span className="mobile-navbar-icon">📋</span>
            <span className="mobile-navbar-text">Задачі</span>
          </Link>
          <Link 
            to="/settings" 
            className={`mobile-navbar-link ${isActive('/settings') ? 'active' : ''}`}
          >
            <span className="mobile-navbar-icon">⚙️</span>
            <span className="mobile-navbar-text">Налаштування</span>
          </Link>
        </div>
      )}
    </>
  );
};

export default Navbar; 