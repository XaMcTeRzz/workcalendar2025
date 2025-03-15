// Тип для запланованої задачі
export interface Task {
  id: number;
  title: string;
  date: string | null;
  time: string | null;
}

// Тип для поточної задачі
export interface CurrentTask {
  id: number;
  note: string;
}

// Тип для налаштувань
export interface Settings {
  telegram_bot_token: string;
  telegram_chat_id: string;
  notification_time: number;
  notifications_enabled: boolean;
  task_notifications: boolean;
  current_tasks_notifications: boolean;
}

// Тип для відповіді API
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
} 