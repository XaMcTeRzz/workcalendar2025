import axios from 'axios';
import { Task, CurrentTask, Settings, ApiResponse } from '../types';

// Базовий URL для API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Створюємо екземпляр axios з базовими налаштуваннями
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Допоміжна функція для обробки відповіді
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Помилка запиту до сервера');
  }
  
  const data: ApiResponse<T> = await response.json();
  return data.data;
}

// Tasks API
export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks`);
  return handleResponse<Task[]>(response);
}

export async function createTask(task: Omit<Task, 'id'>): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  
  return handleResponse<Task>(response);
}

export async function updateTask(taskId: number, task: Partial<Task>): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  
  return handleResponse<Task>(response);
}

export async function deleteTask(taskId: number): Promise<void> {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'DELETE',
  });
  
  return handleResponse<void>(response);
}

// Current Task API
export async function fetchCurrentTasks(): Promise<CurrentTask[]> {
  const response = await fetch(`${API_URL}/current-tasks`);
  return handleResponse<CurrentTask[]>(response);
}

export async function fetchCurrentTask(taskId: number): Promise<CurrentTask> {
  const response = await fetch(`${API_URL}/current-tasks/${taskId}`);
  return handleResponse<CurrentTask>(response);
}

export async function createCurrentTask(task: Omit<CurrentTask, 'id' | 'created_at'>): Promise<CurrentTask> {
  const response = await fetch(`${API_URL}/current-tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  
  return handleResponse<CurrentTask>(response);
}

export async function deleteCurrentTask(taskId: number): Promise<void> {
  const response = await fetch(`${API_URL}/current-tasks/${taskId}`, {
    method: 'DELETE',
  });
  
  return handleResponse<void>(response);
}

export const sendToTelegram = async (id: number): Promise<void> => {
  await api.post(`/current_task/${id}/send`);
};

// Settings API
export async function fetchSettings(): Promise<Settings> {
  const response = await fetch(`${API_URL}/settings`);
  return handleResponse<Settings>(response);
}

export async function updateSettings(settings: Settings): Promise<Settings> {
  const response = await fetch(`${API_URL}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });
  
  return handleResponse<Settings>(response);
}

// Legacy services for backward compatibility
export const TaskService = {
  getTasks: fetchTasks,
  createTask,
  updateTask,
  deleteTask,
};

export const CurrentTaskService = {
  getCurrentTasks: fetchCurrentTasks,
  createCurrentTask,
  deleteCurrentTask,
  sendToTelegram,
};

export const SettingsService = {
  getSettings: fetchSettings,
  updateSettings,
};

export default api; 