import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import '../styles/VoiceInput.css';
import { useVoiceInputSettings } from '../context/VoiceInputContext';

// Список доступных языков
const AVAILABLE_LANGUAGES = [
  { code: 'ru-RU', name: 'Русский' },
  { code: 'uk-UA', name: 'Українська' },
  { code: 'en-US', name: 'English' }
];

interface VoiceInputProps {
  onResult: (text: string) => void;
  placeholder?: string;
  forField?: string;
  showLanguageButtons?: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ 
  onResult, 
  placeholder = 'Нажміть для голосового вводу',
  forField = '',
  showLanguageButtons = false
}) => {
  const { settings } = useVoiceInputSettings();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [notification, setNotification] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const selectedLanguage = settings.recognitionLanguage;

  // Функция для отображения уведомления
  const showTemporaryNotification = useCallback((message: string, duration = 3000) => {
    setNotification(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, duration);
  }, []);

  // Функция для выбора другого языка
  const handleLanguageChange = (langCode: string) => {
    if (recognitionRef.current) {
      stopListening();
      // Небольшая задержка перед запуском с новым языком
      setTimeout(() => {
        startListening(langCode);
      }, 300);
    }
  };

  const startListening = useCallback((langCode = selectedLanguage) => {
    if (!settings.enableVoiceInput) {
      showTemporaryNotification('Голосовой ввод отключен в настройках');
      return;
    }

    try {
      // Проверка поддержки браузером
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showTemporaryNotification('Ваш браузер не поддерживает голосовой ввод');
        return;
      }

      // Создание объекта распознавания речи
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.lang = langCode;
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        showTemporaryNotification('Говорите...');
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Ошибка распознавания речи:', event.error);
        if (event.error === 'not-allowed') {
          showTemporaryNotification('Доступ к микрофону запрещен');
        } else {
          showTemporaryNotification(`Ошибка: ${event.error}`);
        }
        stopListening();
      };

      recognition.onend = () => {
        if (isListening) {
          // Если мы всё ещё слушаем, значит это было автоматическое окончание
          // Перезапустим распознавание
          if (recognition) {
            try {
              recognition.start();
            } catch (e) {
              stopListening();
            }
          }
        }
      };

      recognition.start();
    } catch (error) {
      console.error('Ошибка запуска распознавания речи:', error);
      showTemporaryNotification('Не удалось запустить голосовой ввод');
      setIsListening(false);
    }
  }, [isListening, selectedLanguage, settings.enableVoiceInput, showTemporaryNotification]);

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);

    // Если есть что передать, вызываем колбэк
    if (transcript.trim()) {
      onResult(transcript.trim());
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Очистка при размонтировании компонента
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Получить текущее название языка
  const getCurrentLanguageName = () => {
    const language = AVAILABLE_LANGUAGES.find(lang => lang.code === selectedLanguage);
    return language ? language.name : 'Неизвестный';
  };

  return (
    <div className="voice-input-container">
      <button
        type="button"
        className={`voice-input-button ${isListening ? 'listening' : ''}`}
        onClick={toggleListening}
        aria-label={isListening ? 'Остановить голосовой ввод' : 'Начать голосовой ввод'}
      >
        <span className="voice-microphone-icon">
          {isListening ? <FaStop /> : <FaMicrophone />}
        </span>
        {isListening ? 'Остановить' : `${placeholder} (${getCurrentLanguageName()})`}
      </button>

      {showNotification && (
        <div className={`voice-notification-bubble ${showNotification ? 'show' : ''}`}>
          {notification}
        </div>
      )}

      {isListening && transcript && (
        <div className={`voice-input-transcript ${transcript ? 'show' : ''}`}>
          {transcript}
        </div>
      )}

      {showLanguageButtons && (
        <div className="voice-input-languages">
          {AVAILABLE_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              className={`voice-input-language-button ${selectedLanguage === lang.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
              type="button"
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VoiceInput; 