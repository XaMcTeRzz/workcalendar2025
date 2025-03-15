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
export const fetchTasks = async (): Promise<ApiResponse<Task[]>> => {
  const response = await api.get('/tasks');
  return response.data;
};

export const createTask = async (task: Task): Promise<ApiResponse<Task>> => {
  const response = await api.post('/tasks', task);
  return response.data;
};

export const updateTask = async (task: Task): Promise<ApiResponse<Task>> => {
  const response = await api.put(`/tasks/${task.id}`, task);
  return response.data;
};

export const deleteTask = async (id: number): Promise<ApiResponse<void>> => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

// Сервисы для работы с текущими задачами
export const fetchCurrentTasks = async (): Promise<ApiResponse<CurrentTask[]>> => {
  const response = await api.get('/current-tasks');
  return response.data;
};

export const createCurrentTask = async (task: CurrentTask): Promise<ApiResponse<CurrentTask>> => {
  const response = await api.post('/current-tasks', task);
  return response.data;
};

export const updateCurrentTask = async (task: CurrentTask): Promise<ApiResponse<CurrentTask>> => {
  const response = await api.put(`/current-tasks/${task.id}`, task);
  return response.data;
};

export const deleteCurrentTask = async (id: number): Promise<ApiResponse<void>> => {
  const response = await api.delete(`/current-tasks/${id}`);
  return response.data;
};

// Сервисы для работы с настройками
export const fetchSettings = async (): Promise<ApiResponse<Settings>> => {
  const response = await api.get('/settings');
  return response.data;
};

export const updateSettings = async (settings: Settings): Promise<ApiResponse<Settings>> => {
  const response = await api.put('/settings', settings);
  return response.data;
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