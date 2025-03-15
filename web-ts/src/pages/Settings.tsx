import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useVoiceInput } from '../contexts/VoiceInputContext';
import Button from '../components/Button';
import { FaSave } from 'react-icons/fa';

const Settings: React.FC = () => {
  const { user, updateUserSettings } = useUser();
  const { isVoiceEnabled, toggleVoiceEnabled, language, setLanguage } = useVoiceInput();
  
  const [formState, setFormState] = useState({
    theme: user?.settings.theme || 'dark',
    notifications: user?.settings.notifications || false,
    language: language || 'uk-UA',
    voiceEnabled: isVoiceEnabled
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
    } catch (error) {
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
            <h2 className="card-title">Інтерфейс</h2>
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
            </div>
          </div>
          
          <div className="card">
            <h2 className="card-title">Сповіщення</h2>
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
            <h2 className="card-title">Голосовий ввід</h2>
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