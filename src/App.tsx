import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes';

/**
 * React Query 전역 설정
 * - staleTime: 5분간 캐시된 데이터를 fresh로 취급하여 불필요한 재요청 방지
 * - retry: 실패 시 1회만 재시도 (401은 interceptor에서 refresh 처리)
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
