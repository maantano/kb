import apiClient from './client';
import type { User } from '../types';

export const fetchUser = async (): Promise<User> => {
  const response = await apiClient.get<User>('/api/user');
  return response.data;
};
