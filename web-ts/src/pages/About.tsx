import React from 'react';
import { FaCalendarAlt, FaInfoCircle, FaCode, FaGithub, FaUserFriends, FaLaptopCode, FaCog } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';

const About: React.FC = () => {
  // Чтобы показать все наши варианты спиннеров в одном месте
  const spinnerTypes = [
    { type: 'circular' as const, text: 'Круговой спиннер' },
    { type: 'linear' as const, text: 'Линейный прогресс' },
    { type: 'pulse' as const, text: 'Пульсирующий индикатор' }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1><FaInfoCircle className="icon-margin-right" /> О приложении</h1>
      </div>

      <div className="about-container">
        <div className="card">
          <div className="card-content about-hero">
            <FaCalendarAlt className="about-logo" />
            <h2>WorkCalendar 2025</h2>
            <p className="about-version">Версия 1.2.0</p>
            <p className="about-tagline">Простое и эффективное управление задачами в стиле Material Design</p>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title"><FaCode className="icon-margin-right" /> Технологии</h2>
          <div className="card-content">
            <div className="tech-list">
              <div className="tech-item">
                <h3>Frontend</h3>
                <ul>
                  <li>React 18</li>
                  <li>TypeScript</li>
                  <li>Material Design</li>
                  <li>CSS3 с кастомизацией</li>
                </ul>
              </div>
              
              <div className="tech-item">
                <h3>Хранение данных</h3>
                <ul>
                  <li>LocalStorage</li>
                  <li>Context API</li>
                  <li>React Hooks</li>
                </ul>
              </div>
              
              <div className="tech-item">
                <h3>Особенности</h3>
                <ul>
                  <li>Адаптивный дизайн</li>
                  <li>Темная тема</li>
                  <li>Голосовой ввод</li>
                  <li>Визуализация данных</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title"><FaCog className="icon-margin-right" /> Функциональность</h2>
          <div className="card-content">
            <div className="features-grid">
              <div className="feature-card">
                <FaCalendarAlt className="feature-icon" />
                <h3>Календарь</h3>
                <p>Удобный ежемесячный календарь с отметками задач и быстрым доступом</p>
              </div>
              
              <div className="feature-card">
                <FaLaptopCode className="feature-icon" />
                <p>Управление задачами с разделением по категориям и приоритетам</p>
              </div>
              
              <div className="feature-card">
                <FaGithub className="feature-icon" />
                <h3>Интеграция с GitHub</h3>
                <p>Автоматическое развертывание через Vercel с GitHub-репозиторием</p>
              </div>
              
              <div className="feature-card">
                <FaUserFriends className="feature-icon" />
                <h3>Удобный UX</h3>
                <p>Модальные окна, уведомления и адаптивность для всех устройств</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Индикаторы загрузки</h2>
          <div className="card-content spinners-showcase">
            {spinnerTypes.map((spinner) => (
              <div key={spinner.type} className="spinner-showcase-item">
                <h3>{spinner.text}</h3>
                <div className="spinner-demo">
                  <LoadingSpinner
                    type={spinner.type}
                    size="medium"
                    text={`Пример ${spinner.text.toLowerCase()}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Наша команда</h2>
          <div className="card-content team-section">
            <div className="team-member">
              <div className="team-avatar">XM</div>
              <h3>XaMcTeRzz</h3>
              <p>Frontend разработчик</p>
              <div className="team-links">
                <a href="https://github.com/XaMcTeRzz" target="_blank" rel="noopener noreferrer">
                  <FaGithub />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 