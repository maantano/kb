import { useQuery } from '@tanstack/react-query';
import { fetchTaskById } from '../api/task';
import { queryKeys } from '../constants/queryKeys';

export function useTask(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.task(id) : ['task'],
    queryFn: () => {
      if (!id) throw new Error('Task ID is required');
      return fetchTaskById(id);
    },
    enabled: !!id,
    retry: false,
  });
}
