import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Типы для настроек голосового ввода
export interface VoiceInputSettingsType {
  enableVoiceInput: boolean;
  recognitionLanguage: string;
}

// Интерфейс контекста
interface VoiceInputContextType {
  settings: VoiceInputSettingsType;
  updateSettings: (settings: Partial<VoiceInputSettingsType>) => void;
  saveSettings: () => void;
}

// Значения по умолчанию
const defaultSettings: VoiceInputSettingsType = {
  enableVoiceInput: true,
  recognitionLanguage: 'ru-RU'
};

// Создаем контекст
const VoiceInputContext = createContext<VoiceInputContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  saveSettings: () => {}
});

// Хук для использования контекста
export const useVoiceInputSettings = () => useContext(VoiceInputContext);

// Провайдер контекста
interface VoiceInputProviderProps {
  children: ReactNode;
}

export const VoiceInputProvider: React.FC<VoiceInputProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<VoiceInputSettingsType>(defaultSettings);
  
  // Загружаем настройки из localStorage при инициализации
  useEffect(() => {
    const savedSettings = localStorage.getItem('voiceInputSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (e) {
        console.error('Ошибка при загрузке настроек голосового ввода:', e);
      }
    }
  }, []);
  
  // Функция для обновления настроек
  const updateSettings = (newSettings: Partial<VoiceInputSettingsType>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  // Функция для сохранения настроек в localStorage
  const saveSettings = () => {
    try {
      localStorage.setItem('voiceInputSettings', JSON.stringify(settings));
    } catch (e) {
      console.error('Ошибка при сохранении настроек голосового ввода:', e);
    }
  };
  
  return (
    <VoiceInputContext.Provider value={{ settings, updateSettings, saveSettings }}>
      {children}
    </VoiceInputContext.Provider>
  );
};

export default VoiceInputProvider; 