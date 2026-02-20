import { useQuery } from '@tanstack/react-query';
import { fetchDashboard } from '../api/dashboard';
import { queryKeys } from '../constants/queryKeys';

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: fetchDashboard,
    // refetch 실패 시 이전 데이터를 유지하여 빈 화면 방지
    placeholderData: (previousData) => previousData,
  });
}
