import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchTasks } from '../api/task';
import { queryKeys } from '../constants/queryKeys';

const PAGE_SIZE = 20;

/**
 * 할 일 목록 무한 스크롤 훅
 * - useInfiniteQuery로 페이지 기반 무한 스크롤 구현
 * - 마지막 페이지의 항목 수가 PAGE_SIZE 미만이면 다음 페이지 없음으로 판단
 */
export function useTasks() {
  return useInfiniteQuery({
    queryKey: queryKeys.tasks,
    queryFn: ({ pageParam }) => fetchTasks(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return lastPageParam + 1;
    },
  });
}
