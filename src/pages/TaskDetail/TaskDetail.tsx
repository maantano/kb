import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTask } from '../../hooks/useTask';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import Input from '../../components/Input/Input';
import LoadingSpinner from '../../components/feedback/LoadingSpinner';
import ErrorFallback from '../../components/feedback/ErrorFallback';
import { isAxiosError } from 'axios';
import styles from './TaskDetail.module.css';

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');

  const { data: task, isLoading, error } = useTask(id);

  const is404 = isAxiosError(error) && error.response?.status === 404;

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setDeleteInput('');
  }, []);

  /** 삭제 확인 후 목록으로 리다이렉트 (과제 요구사항: id 일치 시 제출 → 목록 redirect) */
  const handleDelete = () => {
    navigate('/task', { replace: true });
  };

  const formatDate = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) return <LoadingSpinner />;

  if (is404 || !task) {
    return (
      <ErrorFallback
        message="요청하신 할 일이 존재하지 않습니다."
        action={
          <Button variant="ghost" onClick={() => navigate('/task')}>
            목록으로 돌아가기
          </Button>
        }
      />
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Button variant="ghost" onClick={() => navigate('/task')}>
          &larr; 목록으로
        </Button>
      </div>

      <div className={styles.card}>
        <h1 className={styles.title}>{task.title}</h1>
        <p className={styles.date}>{formatDate(task.registerDatetime)}</p>
        <div className={styles.divider} />
        <p className={styles.memo}>{task.memo}</p>

        <div className={styles.actions}>
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            삭제
          </Button>
        </div>
      </div>

      <Modal isOpen={showDeleteModal} onClose={closeDeleteModal} title="할 일 삭제">
        <p className={styles.deleteText}>
          삭제를 확인하려면 아래에 <strong>{id}</strong>을(를) 입력해주세요.
        </p>
        <Input
          label="할 일 ID"
          value={deleteInput}
          onChange={(e) => setDeleteInput(e.target.value)}
          placeholder={id}
        />
        <div className={styles.modalActions}>
          <Button variant="ghost" onClick={closeDeleteModal}>
            취소
          </Button>
          <Button variant="danger" disabled={deleteInput !== id} onClick={handleDelete}>
            제출
          </Button>
        </div>
      </Modal>
    </div>
  );
}
