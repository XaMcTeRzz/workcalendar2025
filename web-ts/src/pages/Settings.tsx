import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useVoiceInput } from '../contexts/VoiceInputContext';
import { useNotification } from '../components/NotificationService';
import Button from '../components/Button';
import { FaSave, FaCog, FaMicrophone, FaPalette, FaFont, FaBell } from 'react-icons/fa';

const Settings: React.FC = () => {
  const { user, updateUserSettings } = useUser();
  const { isVoiceEnabled, toggleVoiceEnabled, language, setLanguage } = useVoiceInput();
  const { showNotification } = useNotification();
  
  const [formState, setFormState] = useState({
    theme: user?.settings.theme || 'dark',
    colorScheme: 'default', // default, blue, green, purple
    useRoundedCorners: true,
    fontScale: 'normal', // small, normal, large
    notifications: user?.settings.notifications || false,
    language: language || 'uk-UA',
    voiceEnabled: isVoiceEnabled,
    useAnimations: true
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormState(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormState(prev => ({ ...prev, [name]: value }));
    }
    
    setSaveSuccess(false);
  };
  
  const handleVoiceToggle = () => {
    const newVoiceEnabled = !formState.voiceEnabled;
    setFormState(prev => ({ ...prev, voiceEnabled: newVoiceEnabled }));
    setSaveSuccess(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Имитация задержки сохранения
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Обновление настроек пользователя
      updateUserSettings({
        theme: formState.theme as 'light' | 'dark',
        notifications: formState.notifications
      });
      
      // Обновление настроек голосового ввода
      if (formState.voiceEnabled !== isVoiceEnabled) {
        toggleVoiceEnabled();
      }
      
      if (formState.language !== language) {
        setLanguage(formState.language);
      }
      
      setSaveSuccess(true);
      showNotification('Налаштування успішно збережені', 'success');
    } catch (error) {
      showNotification('Помилка при збереженні налаштувань', 'error');
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Налаштування</h1>
      </div>
      
      <div className="settings-container">
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="card">
            <h2 className="card-title">
              <FaPalette style={{ marginRight: '8px' }} />
              Зовнішній вигляд
            </h2>
            <div className="card-content">
              <div className="form-group">
                <label htmlFor="theme">Тема:</label>
                <select 
                  id="theme" 
                  name="theme" 
                  value={formState.theme} 
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="dark">Темна</option>
                  <option value="light">Світла</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="colorScheme">Кольорова схема:</label>
                <select 
                  id="colorScheme" 
                  name="colorScheme" 
                  value={formState.colorScheme} 
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="default">Стандартна (пурпурова)</option>
                  <option value="blue">Блакитна</option>
                  <option value="green">Зелена</option>
                  <option value="purple">Фіолетова</option>
                </select>
              </div>
              
              <div className="form-group switch-group">
                <label htmlFor="useRoundedCorners">Округлені кути елементів:</label>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    id="useRoundedCorners" 
                    name="useRoundedCorners" 
                    checked={formState.useRoundedCorners} 
                    onChange={handleChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="form-group switch-group">
                <label htmlFor="useAnimations">Анімації інтерфейсу:</label>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    id="useAnimations" 
                    name="useAnimations" 
                    checked={formState.useAnimations} 
                    onChange={handleChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h2 className="card-title">
              <FaFont style={{ marginRight: '8px' }} />
              Текст і мова
            </h2>
            <div className="card-content">
              <div className="form-group">
                <label htmlFor="language">Мова інтерфейсу:</label>
                <select 
                  id="language" 
                  name="language" 
                  value={formState.language} 
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="uk-UA">Українська</option>
                  <option value="ru-RU">Російська</option>
                  <option value="en-US">Англійська</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="fontScale">Розмір шрифту:</label>
                <select 
                  id="fontScale" 
                  name="fontScale" 
                  value={formState.fontScale} 
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="small">Маленький</option>
                  <option value="normal">Звичайний</option>
                  <option value="large">Великий</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h2 className="card-title">
              <FaBell style={{ marginRight: '8px' }} />
              Сповіщення
            </h2>
            <div className="card-content">
              <div className="form-group switch-group">
                <label htmlFor="notifications">Включити сповіщення:</label>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    id="notifications" 
                    name="notifications" 
                    checked={formState.notifications} 
                    onChange={handleChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h2 className="card-title">
              <FaMicrophone style={{ marginRight: '8px' }} />
              Голосовий ввід
            </h2>
            <div className="card-content">
              <div className="form-group switch-group">
                <label htmlFor="voiceEnabled">Включити голосовий ввід:</label>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    id="voiceEnabled" 
                    name="voiceEnabled" 
                    checked={formState.voiceEnabled} 
                    onChange={handleVoiceToggle}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              {formState.voiceEnabled && (
                <div className="form-group">
                  <label htmlFor="voiceLanguage">Мова розпізнавання:</label>
                  <select 
                    id="voiceLanguage" 
                    name="language" 
                    value={formState.language} 
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="uk-UA">Українська</option>
                    <option value="ru-RU">Російська</option>
                    <option value="en-US">Англійська</option>
                  </select>
                </div>
              )}
            </div>
          </div>
          
          {saveSuccess && (
            <div className="success-message">
              Налаштування успішно збережені!
            </div>
          )}
          
          <Button 
            type="submit"
            variant="primary"
            startIcon={<FaSave />}
            disabled={isSaving}
            fullWidth
          >
            {isSaving ? 'Збереження...' : 'Зберегти налаштування'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Settings; 