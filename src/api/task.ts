import apiClient from './client';
import type { TaskItem, TaskDetail } from '../types';

export const fetchTasks = async (page: number): Promise<TaskItem[]> => {
  const response = await apiClient.get<TaskItem[]>('/api/task', {
    params: { page },
  });
  return response.data;
};

export const fetchTaskById = async (id: string): Promise<TaskDetail> => {
  const response = await apiClient.get<TaskDetail>(`/api/task/${id}`);
  return response.data;
};
