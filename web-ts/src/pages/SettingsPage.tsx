import React, { useState, useEffect } from 'react';
import { Settings } from '../types';
import { fetchSettings, updateSettings } from '../services/api';
import '../styles/SettingsPage.css';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    telegram_bot_token: '',
    telegram_chat_id: '',
    enable_notifications: false,
    notification_time: 9
  });
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await fetchSettings();
        setSettings(data);
        setError(null);
      } catch (err) {
        setError('Помилка завантаження налаштувань. Спробуйте пізніше.');
        console.error('Error loading settings:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await updateSettings(settings);
      setSuccess('Налаштування успішно збережено');
      setError(null);
      
      // Очистити повідомлення про успіх через 3 секунди
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError('Помилка збереження налаштувань. Спробуйте пізніше.');
      console.error('Error saving settings:', err);
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <h1 className="settings-title">
        <span className="settings-title-icon">⚙️</span>
        Налаштування
      </h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      {loading ? (
        <div className="loading">Завантаження налаштувань...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="card-header">
              <span className="card-header-icon">🤖</span>
              Налаштування Telegram
            </div>
            <div className="card-body">
              <div className="form-group">
                <label htmlFor="telegram_bot_token" className="form-label">Токен бота</label>
                <input
                  type="text"
                  id="telegram_bot_token"
                  name="telegram_bot_token"
                  className="form-control"
                  value={settings.telegram_bot_token}
                  onChange={handleInputChange}
                  placeholder="Введіть токен бота"
                />
                <small className="form-text">
                  Отримайте токен у <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer">@BotFather</a>
                </small>
              </div>
              
              <div className="form-group">
                <label htmlFor="telegram_chat_id" className="form-label">ID чату</label>
                <input
                  type="text"
                  id="telegram_chat_id"
                  name="telegram_chat_id"
                  className="form-control"
                  value={settings.telegram_chat_id}
                  onChange={handleInputChange}
                  placeholder="Введіть ID чату"
                />
                <small className="form-text">
                  Використовуйте <a href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer">@userinfobot</a> для отримання ID
                </small>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <span className="card-header-icon">🔔</span>
              Налаштування сповіщень
            </div>
            <div className="card-body">
              <div className="form-check">
                <input
                  type="checkbox"
                  id="enable_notifications"
                  name="enable_notifications"
                  className="form-check-input"
                  checked={settings.enable_notifications}
                  onChange={handleInputChange}
                />
                <label htmlFor="enable_notifications" className="form-check-label">
                  Увімкнути сповіщення
                  <span className="form-text">Отримувати сповіщення про заплановані задачі</span>
                </label>
              </div>
              
              <div className="form-group">
                <label htmlFor="notification_time" className="form-label">Час сповіщень</label>
                <input
                  type="number"
                  id="notification_time"
                  name="notification_time"
                  className="form-control"
                  value={settings.notification_time}
                  onChange={handleInputChange}
                  min="0"
                  max="23"
                  disabled={!settings.enable_notifications}
                />
                <small className="form-text">
                  Година доби (0-23), коли надсилати сповіщення
                </small>
              </div>
            </div>
          </div>
          
          <button type="submit" className="btn-save" disabled={loading}>
            <span className="btn-icon">💾</span>
            Зберегти налаштування
          </button>
        </form>
      )}
    </div>
  );
};

export default SettingsPage; 