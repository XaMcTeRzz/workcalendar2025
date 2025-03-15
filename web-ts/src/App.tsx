import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
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
          </Routes>
        </main>
        <footer className="footer">
          <div className="footer-content">
            <p className="footer-text">
              &copy; {new Date().getFullYear()} Календар задач
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App; 