import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import TestPage from './pages/TestPage';
import Navbar from './components/Navbar';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/test" element={<TestPage />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>Календар задач &copy; 2023</p>
        </footer>
        
        {/* Мобільна навігація */}
        <div className="mobile-nav">
          <Link to="/" className="mobile-nav-link">Задачі</Link>
          <Link to="/settings" className="mobile-nav-link">Налаштування</Link>
          <Link to="/test" className="mobile-nav-link">Тест</Link>
        </div>
      </div>
    </Router>
  );
};

export default App; 