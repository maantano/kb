import styles from './TaskCard.module.css';

interface TaskCardProps {
  title: string;
  memo: string;
  onClick?: () => void;
}

export default function TaskCard({ title, memo, onClick }: TaskCardProps) {
  return (
    <div className={styles.card} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.memo}>{memo}</p>
    </div>
  );
}
