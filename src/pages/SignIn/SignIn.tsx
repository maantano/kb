import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from '../../api/auth';
import { useAuthStore } from '../../stores/authStore';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { isAxiosError } from 'axios';
import styles from './SignIn.module.css';

/** 로그인 폼 유효성 검증 스키마 (Zod)
 * - email: 이메일 규약에 맞는 문자열, 필수
 * - password: 영문/한글/숫자로 구성된 8~24자, 필수
 */
const signInSchema = z.object({
  email: z.email('올바른 이메일 형식이 아닙니다.').min(1, '이메일을 입력해주세요.'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요.')
    .min(8, '비밀번호는 8글자 이상이어야 합니다.')
    .max(24, '비밀번호는 24글자 이하여야 합니다.')
    .regex(/^[a-zA-Z가-힣0-9]+$/, '비밀번호는 영문, 한글, 숫자로만 구성되어야 합니다.'),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignIn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setTokens = useAuthStore((s) => s.setTokens);

  const [errorModal, setErrorModal] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: SignInForm) => {
    try {
      const tokens = await signIn(data);
      setTokens(tokens.accessToken, tokens.refreshToken);
      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect, { replace: true });
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.errorMessage) {
        setErrorModal(error.response.data.errorMessage);
      } else {
        setErrorModal('로그인 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>로그인</h1>
        <p className={styles.subtitle}>KB Task Manager에 로그인하세요</p>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="이메일"
            type="email"
            placeholder="example@email.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="비밀번호"
            type="password"
            placeholder="8~24자 영문, 한글, 숫자"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" fullWidth disabled={!isValid || isSubmitting}>
            {isSubmitting ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      </div>

      <Modal isOpen={!!errorModal} onClose={() => setErrorModal(null)} title="로그인 실패">
        <p className={styles.errorText}>{errorModal}</p>
        <div className={styles.modalActions}>
          <Button variant="ghost" onClick={() => setErrorModal(null)}>
            확인
          </Button>
        </div>
      </Modal>
    </div>
  );
}
