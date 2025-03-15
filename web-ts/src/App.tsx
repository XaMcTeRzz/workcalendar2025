import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import './styles/App.css';

// Используем ленивую загрузку для уменьшения размера бандла
const HomePage = React.lazy(() => import('./pages/HomePage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const TestPage = React.lazy(() => import('./pages/TestPage'));

// Компонент загрузки
const Loading = () => <div className="loading">Завантаження...</div>;

// Предотвращаем ошибки для Vercel
const SimpleTestPage = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1>Тестовая страница</h1>
    <p>Если вы видите эту страницу, значит приложение успешно развернуто на Vercel.</p>
  </div>
);

const App: React.FC = () => {
  // Обработка ошибок для предотвращения черного экрана
  try {
    return (
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/test" element={<SimpleTestPage />} />
                <Route path="*" element={<SimpleTestPage />} />
              </Routes>
            </Suspense>
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
  } catch (error) {
    // Резервный интерфейс при ошибке
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Произошла ошибка при загрузке приложения</h1>
        <p>Пожалуйста, попробуйте обновить страницу.</p>
        <button onClick={() => window.location.reload()}>Обновить</button>
      </div>
    );
  }
};

export default App; 