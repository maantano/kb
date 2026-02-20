import apiClient from './client';
import type { Dashboard } from '../types';

export const fetchDashboard = async (): Promise<Dashboard> => {
  const response = await apiClient.get<Dashboard>('/api/dashboard');
  return response.data;
};
