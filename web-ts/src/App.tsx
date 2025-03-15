import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import './styles/App.css';

// Компонент для мобільної навігації
const MobileNav: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="mobile-nav">
      <div className="mobile-nav-item">
        <Link to="/" className={`mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          <div className="mobile-nav-icon">📋</div>
          <span>Задачі</span>
        </Link>
      </div>
      <div className="mobile-nav-item">
        <Link to="/settings" className={`mobile-nav-link ${location.pathname === '/settings' ? 'active' : ''}`}>
          <div className="mobile-nav-icon">⚙️</div>
          <span>Налаштування</span>
        </Link>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </main>
        <footer className="footer">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} Календар задач. Всі права захищено.</p>
          </div>
        </footer>
        
        {/* Мобільна навігація */}
        <MobileNav />
      </div>
    </Router>
  );
};

export default App; 