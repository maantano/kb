import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const apiClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

/** 요청 인터셉터: 모든 API 요청에 Access Token을 Authorization 헤더로 첨부 */
apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

/**
 * 응답 인터셉터: 401 Unauthorized 처리
 * 1. 401 응답 수신 시 /api/refresh로 토큰 갱신 시도
 * 2. 갱신 성공 → 새 토큰으로 원래 요청을 자동 재시도
 * 3. 갱신 실패 → 로그아웃 처리 후 로그인 페이지로 이동 (현재 경로를 redirect 파라미터로 보존)
 * 4. 동시 다발 401 발생 시 failedQueue에 대기시킨 후 갱신 완료 시 일괄 재시도
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh for sign-in and refresh endpoints
    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      originalRequest?.url === '/api/sign-in' ||
      originalRequest?.url === '/api/refresh'
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const currentRefreshToken = useAuthStore.getState().refreshToken;
      const response = await axios.post(
        '/api/refresh',
        null,
        {
          withCredentials: true,
          // [개발 환경 전용] MSW에서 cookie 전달이 불안정하여 헤더로 refresh token을 함께 전달합니다.
          // 프로덕션에서는 withCredentials: true로 httpOnly 쿠키만 전송하며, 이 헤더는 제거해야 합니다.
          headers: {
            'X-Refresh-Token': currentRefreshToken ?? '',
          },
        },
      );
      const { accessToken, refreshToken } = response.data;
      useAuthStore.getState().setTokens(accessToken, refreshToken);
      processQueue(null, accessToken);
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      useAuthStore.getState().logout();
      window.location.href = `/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`;
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
