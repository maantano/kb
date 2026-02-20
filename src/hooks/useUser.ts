import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../api/user';
import { queryKeys } from '../constants/queryKeys';

export function useUser() {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: fetchUser,
    placeholderData: (previousData) => previousData,
  });
}
