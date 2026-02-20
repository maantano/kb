import styles from './ErrorFallback.module.css';

interface ErrorFallbackProps {
  message?: string;
  action?: React.ReactNode;
}

export default function ErrorFallback({
  message = '데이터를 불러올 수 없습니다.',
  action,
}: ErrorFallbackProps) {
  return (
    <div className={styles.error}>
      <p className={styles.message}>{message}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
