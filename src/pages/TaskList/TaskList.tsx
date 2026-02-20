import { useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useTasks } from '../../hooks/useTasks';
import TaskCard from '../../components/TaskCard/TaskCard';
import LoadingSpinner from '../../components/feedback/LoadingSpinner';
import styles from './TaskList.module.css';

export default function TaskList() {
  const navigate = useNavigate();
  const parentRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useTasks();

  const allTasks = data?.pages.flat() ?? [];

  /**
   * @tanstack/react-virtual을 사용한 가상 스크롤링
   * - 화면에 보이는 항목 + overscan(5개)만 DOM에 렌더링하여 대량 데이터 성능 확보
   * - 다음 페이지가 있으면 로딩 행을 위해 count + 1
   */
  const virtualizer = useVirtualizer({
    count: hasNextPage ? allTasks.length + 1 : allTasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 90,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;
    if (lastItem.index >= allTasks.length - 1 && hasNextPage && !isFetchingNextPage) {
      loadMore();
    }
  }, [virtualItems, allTasks.length, hasNextPage, isFetchingNextPage, loadMore]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>할 일 목록</h1>
      <div ref={parentRef} className={styles.scrollContainer}>
        <div
          className={styles.virtualContainer}
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          {virtualItems.map((virtualRow) => {
            const isLoaderRow = virtualRow.index >= allTasks.length;
            const task = allTasks[virtualRow.index];

            return (
              <div
                key={virtualRow.index}
                className={styles.virtualRow}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {isLoaderRow ? (
                  <div className={styles.loader}>불러오는 중...</div>
                ) : (
                  <TaskCard
                    title={task.title}
                    memo={task.memo}
                    onClick={() => navigate(`/task/${task.id}`)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
