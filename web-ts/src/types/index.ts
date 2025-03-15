// Тип для запланованої задачі
export interface Task {
  id: number;
  title: string;
  description?: string;
  date: string;
  time?: string;
  completed: boolean;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
}

// Тип для поточної задачі
export interface CurrentTask {
  id: number;
  title: string;
  description?: string;
  date?: string;
  time?: string;
  created_at: string;
}

// Тип для налаштувань
export interface Settings {
  telegram_bot_token: string;
  telegram_chat_id: string;
  enable_notifications: boolean;
  notification_time: number;
  enable_voice_input: boolean;
  voice_language: string;
}

// Тип для відповіді API
export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface TaskFormProps {
  task?: Task | null;
  onClose: () => void;
  onSubmit: () => void;
} 