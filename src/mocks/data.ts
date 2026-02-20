import type { TaskItem, TaskDetail } from '../types';

// [개발 환경 전용] 테스트용 사용자 정보입니다. 프로덕션에서는 실제 DB의 사용자 데이터를 사용합니다.
export const MOCK_USER = {
  email: 'test@example.com',
  password: 'Password1234',
  name: '홍길동',
  memo: 'KB손해보험 프론트엔드 개발자',
};

// Generate mock tasks
const generateTasks = (count: number): (TaskItem & { registerDatetime: string })[] => {
  const titles = [
    '프로젝트 기획서 작성',
    '디자인 시스템 구축',
    'API 문서 검토',
    '코드 리뷰 진행',
    '버그 수정 및 테스트',
    '스프린트 회고 준비',
    '고객 피드백 분석',
    '보안 점검 실시',
    '성능 최적화 작업',
    '배포 파이프라인 설정',
    '데이터베이스 마이그레이션',
    '사용자 인터뷰 정리',
    '경쟁사 분석 보고서',
    '신규 기능 프로토타입',
    '접근성 개선 작업',
    'CI/CD 파이프라인 구축',
    '모니터링 대시보드 설정',
    '문서화 작업',
    '팀 온보딩 자료 준비',
    '기술 부채 정리',
  ];

  const memos = [
    '이번 주까지 완료해야 합니다.',
    '우선순위 높은 작업입니다.',
    '팀원들과 협의 후 진행합니다.',
    '관련 문서를 참고해주세요.',
    '고객 요청 사항입니다.',
    '다음 스프린트에 반영될 예정입니다.',
    '추가 검토가 필요합니다.',
    '담당자 확인 후 진행합니다.',
    '기한 내 완료 필수입니다.',
    '테스트 완료 후 배포합니다.',
  ];

  return Array.from({ length: count }, (_, i) => {
    const date = new Date(2025, 0, 1);
    date.setDate(date.getDate() + i);

    return {
      id: String(i + 1),
      title: titles[i % titles.length],
      memo: memos[i % memos.length],
      status: i % 3 === 0 ? 'DONE' as const : 'TODO' as const,
      registerDatetime: date.toISOString(),
    };
  });
};

export const MOCK_TASKS = generateTasks(150);

export const getDashboardData = () => {
  const numOfTask = MOCK_TASKS.length;
  const numOfDoneTask = MOCK_TASKS.filter((t) => t.status === 'DONE').length;
  const numOfRestTask = numOfTask - numOfDoneTask;
  return { numOfTask, numOfRestTask, numOfDoneTask };
};

export const getTaskPage = (page: number, pageSize = 20): TaskItem[] => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return MOCK_TASKS.slice(start, end).map(({ registerDatetime: _, ...rest }) => rest);
};

export const getTaskById = (id: string): TaskDetail | null => {
  const task = MOCK_TASKS.find((t) => t.id === id);
  if (!task) return null;
  return {
    id: task.id,
    title: task.title,
    memo: task.memo,
    registerDatetime: task.registerDatetime,
  };
};
