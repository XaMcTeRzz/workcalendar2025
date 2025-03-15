import React, { useState, useEffect } from 'react';
import { Settings } from '../types';
import { fetchSettings, updateSettings } from '../services/api';
import '../styles/SettingsPage.css';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    telegram_bot_token: '',
    telegram_chat_id: '',
    enable_notifications: false,
    notification_time: 9,
    enable_voice_input: true,
    voice_language: 'uk-UA'
  });
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await fetchSettings();
        // Добавляем настройки голосового ввода, если их нет в полученных данных
        const updatedData = {
          ...data,
          enable_voice_input: data.enable_voice_input !== undefined ? data.enable_voice_input : true,
          voice_language: data.voice_language || 'uk-UA'
        };
        setSettings(updatedData);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
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

  // Тест поддержки SpeechRecognition
  const isSpeechRecognitionSupported = Boolean(
    window.SpeechRecognition || (window as any).webkitSpeechRecognition
  );

  return (
    <div className="settings-page">
      <h1 className="settings-title">
        <span className="settings-icon">⚙️</span>
        Налаштування
      </h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      {loading ? (
        <div className="loading">Завантаження налаштувань...</div>
      ) : (
        <form onSubmit={handleSubmit} className="settings-form">
          {/* Настройки голосового ввода */}
          <div className="settings-card">
            <div className="settings-card-header">
              <span className="settings-card-icon">🎤</span>
              Голосове введення
            </div>
            <div className="settings-card-body">
              {isSpeechRecognitionSupported ? (
                <>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="enable_voice_input"
                      name="enable_voice_input"
                      checked={settings.enable_voice_input}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="enable_voice_input">
                      Увімкнути голосове введення
                      <span className="form-text">Дозволяє використовувати мікрофон для введення тексту</span>
                    </label>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="voice_language">Мова розпізнавання</label>
                    <select
                      id="voice_language"
                      name="voice_language"
                      value={settings.voice_language}
                      onChange={handleInputChange}
                      disabled={!settings.enable_voice_input}
                    >
                      <option value="uk-UA">Українська</option>
                      <option value="ru-RU">Російська</option>
                      <option value="en-US">Англійська (США)</option>
                      <option value="en-GB">Англійська (Великобританія)</option>
                      <option value="de-DE">Німецька</option>
                      <option value="fr-FR">Французька</option>
                      <option value="pl-PL">Польська</option>
                    </select>
                  </div>
                </>
              ) : (
                <div className="browser-warning">
                  Ваш браузер не підтримує голосове введення. Спробуйте використовувати Chrome, Edge або Safari.
                </div>
              )}
            </div>
          </div>

          {/* Настройки Telegram */}
          <div className="settings-card">
            <div className="settings-card-header">
              <span className="settings-card-icon">🤖</span>
              Налаштування Telegram
            </div>
            <div className="settings-card-body">
              <div className="form-group">
                <label htmlFor="telegram_bot_token">Токен бота</label>
                <input
                  type="text"
                  id="telegram_bot_token"
                  name="telegram_bot_token"
                  value={settings.telegram_bot_token}
                  onChange={handleInputChange}
                  placeholder="Введіть токен бота"
                />
                <small className="form-text">
                  Отримайте токен у <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer">@BotFather</a>
                </small>
              </div>
              
              <div className="form-group">
                <label htmlFor="telegram_chat_id">ID чату</label>
                <input
                  type="text"
                  id="telegram_chat_id"
                  name="telegram_chat_id"
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
          
          {/* Настройки уведомлений */}
          <div className="settings-card">
            <div className="settings-card-header">
              <span className="settings-card-icon">🔔</span>
              Налаштування сповіщень
            </div>
            <div className="settings-card-body">
              <div className="form-check">
                <input
                  type="checkbox"
                  id="enable_notifications"
                  name="enable_notifications"
                  checked={settings.enable_notifications}
                  onChange={handleInputChange}
                />
                <label htmlFor="enable_notifications">
                  Увімкнути сповіщення
                  <span className="form-text">Отримувати сповіщення про заплановані задачі</span>
                </label>
              </div>
              
              <div className="form-group">
                <label htmlFor="notification_time">Час сповіщень</label>
                <input
                  type="number"
                  id="notification_time"
                  name="notification_time"
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
          
          <button type="submit" className="save-button" disabled={loading}>
            <span className="save-icon">💾</span>
            Зберегти налаштування
          </button>
        </form>
      )}
    </div>
  );
};

export default SettingsPage; 