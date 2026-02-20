import apiClient from './client';
import type { SignInRequest, AuthTokens } from '../types';

export const signIn = async (data: SignInRequest): Promise<AuthTokens> => {
  const response = await apiClient.post<AuthTokens>('/api/sign-in', data);
  return response.data;
};
