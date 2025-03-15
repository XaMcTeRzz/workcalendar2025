import React, { useState, useEffect, createContext, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TaskPage from './pages/TaskPage';
import CurrentTaskPage from './pages/CurrentTaskPage';
import SettingsPage from './pages/SettingsPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { fetchSettings } from './services/api';
import './styles/App.css';
import { VoiceInputProvider } from './context/VoiceInputContext';
import LoadingSpinner from './components/LoadingSpinner';

// Типы для настроек
export interface Settings {
  theme: 'light' | 'dark';
  notification_time: number;
  notification_enabled: boolean;
  enable_notifications: boolean;
}

// Контекст для настроек приложения
export const SettingsContext = createContext<{
  settings: Settings | null;
  isLoading: boolean;
  error: string | null;
  updateSettings: (newSettings: Partial<Settings>) => void;
}>({
  settings: null,
  isLoading: false,
  error: null,
  updateSettings: () => {},
});

const App: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка настроек при инициализации
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetchSettings();
        if (response.success) {
          setSettings(response.data);
        } else {
          setError(response.message || 'Не удалось загрузить настройки');
        }
      } catch (err) {
        setError('Ошибка при загрузке настроек');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Функция для обновления настроек
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => {
      if (!prev) return prev;
      return { ...prev, ...newSettings };
    });
  };

  // Мемоизированное значение контекста
  const settingsContextValue = useMemo(() => ({
    settings,
    isLoading,
    error,
    updateSettings,
  }), [settings, isLoading, error]);

  // Пока загружаются настройки, показываем спиннер
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <SettingsContext.Provider value={settingsContextValue}>
      <VoiceInputProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <main className="content-container">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tasks" element={<TaskPage />} />
                <Route path="/current" element={<CurrentTaskPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </VoiceInputProvider>
    </SettingsContext.Provider>
  );
};

export default App; 