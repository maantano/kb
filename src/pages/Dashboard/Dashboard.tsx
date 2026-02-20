import { useDashboard } from '../../hooks/useDashboard';
import { MdAssignment, MdPendingActions, MdCheckCircle } from 'react-icons/md';
import LoadingSpinner from '../../components/feedback/LoadingSpinner';
import ErrorFallback from '../../components/feedback/ErrorFallback';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) return <ErrorFallback />;

  const stats = [
    {
      label: '일',
      value: data.numOfTask,
      icon: <MdAssignment />,
      color: 'var(--color-secondary)',
    },
    {
      label: '해야할 일',
      value: data.numOfRestTask,
      icon: <MdPendingActions />,
      color: 'var(--color-warning)',
    },
    {
      label: '한 일',
      value: data.numOfDoneTask,
      icon: <MdCheckCircle />,
      color: 'var(--color-success)',
    },
  ];

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>대시보드</h1>
      <div className={styles.grid}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.card}>
            <div className={styles.cardIcon} style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className={styles.cardInfo}>
              <p className={styles.cardLabel}>{stat.label}</p>
              <p className={styles.cardValue}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
