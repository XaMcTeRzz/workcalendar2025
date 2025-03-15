import React, { useState, useEffect } from 'react';
import { SettingsService } from '../services/api';
import { Settings } from '../types';
import '../styles/SettingsPage.css';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    telegram_bot_token: '',
    telegram_chat_id: '',
    notification_time: 15,
    notifications_enabled: true,
    task_notifications: true,
    current_tasks_notifications: true
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const settingsData = await SettingsService.getSettings();
        setSettings(settingsData);
      } catch (err) {
        setError('Помилка при завантаженні налаштувань. Спробуйте оновити сторінку.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleTelegramSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await SettingsService.saveTelegramSettings(
        settings.telegram_bot_token,
        settings.telegram_chat_id
      );
      setSuccessMessage('Налаштування Telegram збережено!');
    } catch (err) {
      setError('Помилка при збереженні налаштувань Telegram. Спробуйте ще раз.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await SettingsService.saveNotificationSettings(
        settings.notifications_enabled,
        settings.notification_time
      );
      setSuccessMessage('Налаштування сповіщень збережено!');
    } catch (err) {
      setError('Помилка при збереженні налаштувань сповіщень. Спробуйте ще раз.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (isLoading) {
    return <div className="loading">Завантаження налаштувань...</div>;
  }

  return (
    <div className="settings-page">
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="card">
        <div className="card-header">
          Налаштування Telegram
        </div>
        <div className="card-body">
          <form onSubmit={handleTelegramSubmit}>
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
              <small className="form-text text-muted">
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
              <small className="form-text text-muted">
                Ваш особистий ID або ID групи
              </small>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isSaving}
            >
              {isSaving ? 'Збереження...' : 'Зберегти налаштування'}
            </button>
          </form>
        </div>
      </div>
      
      <div className="card mt-4">
        <div className="card-header">
          Налаштування сповіщень
        </div>
        <div className="card-body">
          <form onSubmit={handleNotificationSubmit}>
            <div className="form-group form-check">
              <input
                type="checkbox"
                id="notifications_enabled"
                name="notifications_enabled"
                className="form-check-input"
                checked={settings.notifications_enabled}
                onChange={handleInputChange}
              />
              <label htmlFor="notifications_enabled" className="form-check-label">
                Увімкнути сповіщення
              </label>
            </div>
            
            <div className="form-group">
              <label htmlFor="notification_time" className="form-label">
                Час сповіщення (хвилин до події)
              </label>
              <input
                type="number"
                id="notification_time"
                name="notification_time"
                className="form-control"
                value={settings.notification_time}
                onChange={handleInputChange}
                min="1"
                max="60"
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isSaving}
            >
              {isSaving ? 'Збереження...' : 'Зберегти налаштування'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 