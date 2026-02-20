# KB Task Manager

KB헬스케어 프론트엔드 개발자 과제 - 할 일 관리 애플리케이션

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | React 19 + TypeScript |
| 빌드 | Vite 7 |
| 상태 관리 | Zustand (인증), React Query (서버 상태) |
| 폼 | react-hook-form + Zod |
| 라우팅 | React Router v7 |
| HTTP | Axios (인터셉터 기반 토큰 관리) |
| 가상 스크롤 | @tanstack/react-virtual |
| API 모킹 | MSW (Mock Service Worker) |
| 스타일 | CSS Modules + CSS Custom Properties (디자인 토큰) |
| 폰트 | Pretendard |

## 실행 방법

```bash
npm install
npm run dev
```

개발 서버가 실행되면 MSW가 자동으로 활성화되어 별도 API 서버 없이 동작합니다.

**테스트 계정**: `test@example.com` / `Password1234`

## 프로젝트 구조

```
src/
├── api/              # API 호출 함수 및 Axios 클라이언트 (인터셉터)
├── components/       # 공통 UI 컴포넌트
│   ├── Button/
│   ├── Input/
│   ├── Modal/
│   ├── TaskCard/
│   ├── Layout/       # GNB, LNB, Layout
│   └── feedback/     # LoadingSpinner, ErrorFallback
├── constants/        # 쿼리 키 등 상수
├── hooks/            # 커스텀 훅 (useDashboard, useTasks, useTask, useUser)
├── mocks/            # MSW 핸들러 및 Mock 데이터
├── pages/            # 페이지 컴포넌트
│   ├── Dashboard/    # 대시보드 (/)
│   ├── SignIn/       # 로그인 (/sign-in)
│   ├── TaskList/     # 할 일 목록 (/task)
│   ├── TaskDetail/   # 할 일 상세 (/task/:id)
│   └── User/         # 회원정보 (/user)
├── routes/           # 라우트 설정 및 ProtectedRoute
├── stores/           # Zustand 스토어 (인증)
├── styles/           # 글로벌 스타일 및 디자인 토큰
└── types/            # TypeScript 타입 정의
```

## 주요 구현 사항

### 인증
- 로그인 성공 시 Access Token / Refresh Token 발급
- 401 응답 시 자동으로 토큰 갱신 후 원래 요청 재시도
- 갱신 실패 시 자동 로그아웃 후 로그인 페이지 이동 (이전 경로 보존)
- 동시 다발 401 발생 시 큐 기반으로 갱신 완료 후 일괄 재시도

### 로그인
- Zod 스키마 기반 실시간 유효성 검증 (이메일 형식, 비밀번호 8~24자 영문/한글/숫자)
- 유효성 미충족 시 제출 버튼 비활성화
- API 에러 시 errorMessage 모달 표시

### 할 일 목록
- `@tanstack/react-virtual`을 사용한 가상 스크롤링 (화면에 보이는 항목만 렌더링)
- `useInfiniteQuery` 기반 무한 스크롤 (목록 끝 도달 시 다음 페이지 자동 로드)

### 할 일 상세
- 404 응답 시 목록 복귀 버튼 포함 에러 화면
- 삭제 모달: 해당 ID 입력 확인 후 제출 활성화, 제출 시 목록으로 리다이렉트

### 코드 스플리팅
- `React.lazy`를 통해 페이지별 별도 chunk 분리로 초기 번들 크기 최소화

## 프로덕션 환경과의 차이점

코드 내 `[개발 환경 전용]` 주석으로 표시된 부분들은 MSW 개발 환경의 제약으로 인한 구현입니다.

| 항목 | 현재 (개발) | 프로덕션 |
|------|------------|----------|
| API 서버 | MSW (서비스 워커) | 실제 API 서버 |
| JWT 토큰 | btoa 기반 시뮬레이션 | 서버에서 암호화 서명된 JWT 발급 |
| Refresh Token 저장 | localStorage + document.cookie | 서버가 Set-Cookie로 httpOnly 쿠키 설정 |
| Refresh 요청 | X-Refresh-Token 헤더 fallback 사용 | withCredentials로 httpOnly 쿠키만 전송 |
| Mock 데이터 | 하드코딩된 사용자/할 일 데이터 | 실제 DB 데이터 |
