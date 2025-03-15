import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import Navbar from './components/Navbar';
import { fetchSettings } from './services/api';
import { Settings } from './types';
import './styles/App.css';

// Контекст для настроек голосового ввода
export const VoiceSettingsContext = createContext<{
  voiceEnabled: boolean;
  voiceLanguage: string;
}>({
  voiceEnabled: true,
  voiceLanguage: 'uk-UA'
});

const App: React.FC = () => {
  const [voiceSettings, setVoiceSettings] = useState({
    voiceEnabled: true,
    voiceLanguage: 'uk-UA'
  });

  useEffect(() => {
    // Загружаем настройки при первом рендере
    const loadSettings = async () => {
      try {
        const settings = await fetchSettings();
        setVoiceSettings({
          voiceEnabled: settings.enable_voice_input !== undefined ? settings.enable_voice_input : true,
          voiceLanguage: settings.voice_language || 'uk-UA'
        });
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };

    loadSettings();
  }, []);

  return (
    <VoiceSettingsContext.Provider value={voiceSettings}>
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
              <p>&copy; {new Date().getFullYear()} Календар задач. Всі права захищені.</p>
            </div>
          </footer>
          
          {/* Мобильная навигация */}
          <nav className="mobile-nav">
            <Link to="/" className="mobile-nav-item">
              <span className="mobile-nav-icon">📋</span>
              <span className="mobile-nav-text">Задачі</span>
            </Link>
            <Link to="/settings" className="mobile-nav-item">
              <span className="mobile-nav-icon">⚙️</span>
              <span className="mobile-nav-text">Налаштування</span>
            </Link>
          </nav>
        </div>
      </Router>
    </VoiceSettingsContext.Provider>
  );
};

export default App; 