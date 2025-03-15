import React, { useState, useEffect, useContext } from 'react';
import { VoiceSettingsContext } from '../App';
import '../styles/VoiceInput.css';

interface VoiceInputProps {
  onTextReceived: (text: string) => void;
  buttonLabel?: string;
  placeholder?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  onTextReceived,
  buttonLabel = 'Диктувати',
  placeholder = 'Натисніть, щоб почати диктувати...'
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [supported, setSupported] = useState<boolean>(true);

  // Получаем настройки из контекста
  const { voiceEnabled, voiceLanguage } = useContext(VoiceSettingsContext);

  // Проверяем поддержку API распознавания речи
  useEffect(() => {
    // @ts-ignore - игнорируем отсутствие типов для SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      setErrorMessage('Ваш браузер не поддерживает распознавание речи');
    }
  }, []);

  // Если голосовой ввод отключен в настройках, не показываем компонент
  if (!voiceEnabled) {
    return null;
  }

  const startListening = () => {
    setErrorMessage(null);

    // @ts-ignore - игнорируем отсутствие типов для SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setErrorMessage('Ваш браузер не поддерживает распознавание речи');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = voiceLanguage; // Используем язык из настроек
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTextReceived(transcript);
      };

      recognition.onerror = (event: any) => {
        setErrorMessage(`Помилка розпізнавання: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (error) {
      setErrorMessage('Помилка при запуску розпізнавання мови');
      setIsListening(false);
    }
  };

  if (!supported) {
    return (
      <div className="voice-input-container">
        <div className="voice-input-error">
          {errorMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="voice-input-container">
      <button
        type="button"
        className={`voice-input-button ${isListening ? 'listening' : ''}`}
        onClick={startListening}
        disabled={isListening}
        title={`Розпізнавання голосу (${voiceLanguage})`}
      >
        <span className="voice-input-icon">🎤</span>
        {isListening ? 'Слухаю...' : buttonLabel}
      </button>
      
      {errorMessage && (
        <div className="voice-input-error">
          {errorMessage}
        </div>
      )}
      
      {isListening && (
        <div className="voice-input-status">
          Говоріть зараз...
        </div>
      )}
    </div>
  );
};

export default VoiceInput; 