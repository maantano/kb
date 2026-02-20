import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * 인증이 필요한 라우트를 감싸는 가드 컴포넌트
 * - 미인증 시 로그인 페이지로 리다이렉트하며, 현재 경로를 redirect 쿼리 파라미터로 전달
 * - 로그인 성공 후 원래 접근하려던 페이지로 복귀 가능
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={`/sign-in?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
}
