import axios from 'axios';
import { Task, CurrentTask, Settings, ApiResponse } from '../types';

// Создаем базовый инстанс axios
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Сервисы для работы с задачами
export const fetchTasks = async (): Promise<Task[]> => {
  const response = await api.get('/tasks');
  return response.data.data || [];
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  const response = await api.post('/tasks', task);
  return response.data.data;
};

export const updateTask = async (task: Task): Promise<Task> => {
  const response = await api.put(`/tasks/${task.id}`, task);
  return response.data.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`);
  return;
};

// Сервисы для работы с текущими задачами
export const fetchCurrentTasks = async (): Promise<CurrentTask[]> => {
  const response = await api.get('/current-tasks');
  return response.data.data || [];
};

export const createCurrentTask = async (task: Omit<CurrentTask, 'id'>): Promise<CurrentTask> => {
  const response = await api.post('/current-tasks', task);
  return response.data.data;
};

export const updateCurrentTask = async (task: CurrentTask): Promise<CurrentTask> => {
  const response = await api.put(`/current-tasks/${task.id}`, task);
  return response.data.data;
};

export const deleteCurrentTask = async (id: number): Promise<void> => {
  await api.delete(`/current-tasks/${id}`);
  return;
};

// Сервисы для работы с настройками
export const fetchSettings = async (): Promise<Settings> => {
  const response = await api.get('/settings');
  return response.data.data;
};

export const updateSettings = async (settings: Settings): Promise<Settings> => {
  const response = await api.put('/settings', settings);
  return response.data.data;
};

export default {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  fetchCurrentTasks,
  createCurrentTask,
  updateCurrentTask,
  deleteCurrentTask,
  fetchSettings,
  updateSettings,
}; 