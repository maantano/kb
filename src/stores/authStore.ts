import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

/**
 * 프로덕션 환경에서는 refreshToken을 localStorage가 아닌 httpOnly 쿠키로 관리해야 합니다.
 * 현재 구현은 MSW 개발 환경에서의 동작을 위해 localStorage와 document.cookie를 병행합니다.
 * accessToken은 메모리(Zustand)에서 관리하고, 새로고침 시 refresh API로 재발급받는 것이 보안상 권장됩니다.
 */
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    // MSW 환경에서 /api/refresh 핸들러가 cookie를 읽을 수 있도록 설정합니다.
    // 프로덕션에서는 서버가 Set-Cookie 헤더로 httpOnly 쿠키를 설정합니다.
    document.cookie = `token=${refreshToken}; path=/;`;
    set({ accessToken, refreshToken, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    // [개발 환경 전용] MSW 핸들러의 globalThis에 저장된 refresh token도 함께 정리합니다.
    (globalThis as Record<string, unknown>).__MSW_REFRESH_TOKEN__ = null;
    set({ accessToken: null, refreshToken: null, isAuthenticated: false });
  },
}));
