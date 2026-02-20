import { useUser } from '../../hooks/useUser';
import { MdPerson } from 'react-icons/md';
import LoadingSpinner from '../../components/feedback/LoadingSpinner';
import ErrorFallback from '../../components/feedback/ErrorFallback';
import styles from './User.module.css';

export default function User() {
  const { data, isLoading, isError } = useUser();

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) return <ErrorFallback />;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>회원정보</h1>
      <div className={styles.card}>
        <div className={styles.avatar}>
          <MdPerson />
        </div>
        <div className={styles.info}>
          <div className={styles.field}>
            <span className={styles.label}>이름</span>
            <span className={styles.value}>{data.name}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.field}>
            <span className={styles.label}>메모</span>
            <span className={styles.value}>{data.memo}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
