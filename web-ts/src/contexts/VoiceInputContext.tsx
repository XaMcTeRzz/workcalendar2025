import React, { createContext, useState, useContext, ReactNode } from 'react';

interface VoiceInputContextType {
  isVoiceEnabled: boolean;
  toggleVoiceEnabled: () => void;
  language: string;
  setLanguage: (lang: string) => void;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
  resetTranscript: () => void;
  appendTranscript: (text: string) => void;
}

const defaultContext: VoiceInputContextType = {
  isVoiceEnabled: false,
  toggleVoiceEnabled: () => {},
  language: 'uk-UA',
  setLanguage: () => {},
  isListening: false,
  startListening: () => {},
  stopListening: () => {},
  transcript: '',
  resetTranscript: () => {},
  appendTranscript: () => {},
};

export const VoiceInputContext = createContext<VoiceInputContextType>(defaultContext);

export const useVoiceInput = () => useContext(VoiceInputContext);

interface VoiceInputProviderProps {
  children: ReactNode;
}

export const VoiceInputProvider: React.FC<VoiceInputProviderProps> = ({ children }) => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [language, setLanguage] = useState('uk-UA');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const toggleVoiceEnabled = () => {
    setIsVoiceEnabled(prev => !prev);
  };

  const startListening = () => {
    if (isVoiceEnabled) {
      setIsListening(true);
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const resetTranscript = () => {
    setTranscript('');
  };

  const appendTranscript = (text: string) => {
    setTranscript(prev => prev + ' ' + text);
  };

  const value = {
    isVoiceEnabled,
    toggleVoiceEnabled,
    language,
    setLanguage,
    isListening,
    startListening,
    stopListening,
    transcript,
    resetTranscript,
    appendTranscript
  };

  return (
    <VoiceInputContext.Provider value={value}>
      {children}
    </VoiceInputContext.Provider>
  );
}; 