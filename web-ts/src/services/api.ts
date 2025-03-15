import axios from 'axios';
import { Task, CurrentTask, Settings, ApiResponse } from '../types';

// Базовий URL для API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Створюємо екземпляр axios з базовими налаштуваннями
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Сервіс для роботи з задачами
export const TaskService = {
  // Отримання всіх задач
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get<{ tasks: Task[] }>('/api/tasks');
    return response.data.tasks;
  },

  // Додавання нової задачі
  addTask: async (title: string, date?: string, time?: string): Promise<ApiResponse<Task>> => {
    const formData = new FormData();
    formData.append('title', title);
    if (date) formData.append('date', date);
    if (time) formData.append('time', time);

    const response = await api.post<ApiResponse<Task>>('/add_task', formData);
    return response.data;
  },
};

// Сервіс для роботи з поточними задачами
export const CurrentTaskService = {
  // Отримання всіх поточних задач
  getCurrentTasks: async (): Promise<CurrentTask[]> => {
    const response = await api.get<{ current_tasks: CurrentTask[] }>('/api/current-tasks');
    return response.data.current_tasks;
  },

  // Додавання нової поточної задачі
  addCurrentTask: async (note: string): Promise<ApiResponse<CurrentTask>> => {
    const formData = new FormData();
    formData.append('note', note);

    const response = await api.post<ApiResponse<CurrentTask>>('/add_current', formData);
    return response.data;
  },

  // Надсилання поточних задач в Telegram
  sendToTelegram: async (): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>('/send_to_telegram');
    return response.data;
  },
};

// Сервіс для роботи з налаштуваннями
export const SettingsService = {
  // Отримання налаштувань
  getSettings: async (): Promise<Settings> => {
    const response = await api.get<Settings>('/settings');
    return response.data;
  },

  // Збереження налаштувань Telegram
  saveTelegramSettings: async (botToken: string, chatId: string): Promise<ApiResponse<Settings>> => {
    const formData = new FormData();
    formData.append('bot_token', botToken);
    formData.append('chat_id', chatId);

    const response = await api.post<ApiResponse<Settings>>('/save_telegram_settings', formData);
    return response.data;
  },

  // Збереження налаштувань сповіщень
  saveNotificationSettings: async (
    enableNotifications: boolean,
    notificationTime: number
  ): Promise<ApiResponse<Settings>> => {
    const formData = new FormData();
    if (enableNotifications) formData.append('enable_notifications', 'on');
    formData.append('notification_time', notificationTime.toString());

    const response = await api.post<ApiResponse<Settings>>('/save_notification_settings', formData);
    return response.data;
  },
}; 