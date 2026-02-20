/**
 * [개발 환경 전용] MSW 핸들러
 *
 * 프로덕션에서는 실제 API 서버가 이 역할을 대신합니다.
 * - JWT 토큰은 btoa 기반 시뮬레이션이며, 프로덕션에서는 서버가 암호화 서명된 JWT를 발급합니다.
 * - refresh 토큰은 프로덕션에서 httpOnly 쿠키로 관리되지만,
 *   MSW의 서비스 워커 환경에서는 document.cookie 기반 쿠키 전달이 불안정하여
 *   X-Refresh-Token 헤더와 in-memory 저장소를 fallback으로 사용합니다.
 */
import { http, HttpResponse, delay } from 'msw';
import { MOCK_USER, getDashboardData, getTaskPage, getTaskById } from './data';

// MSW 환경에서 cookie 전달이 불안정하여 in-memory로 refresh token을 보관합니다.
// 프로덕션에서는 httpOnly 쿠키만 사용하므로 이 변수는 불필요합니다.
// globalThis를 사용하여 Vite HMR 시에도 토큰이 유지되도록 합니다.
const getRefreshToken = () => (globalThis as Record<string, unknown>).__MSW_REFRESH_TOKEN__ as string | null ?? null;
const setRefreshToken = (token: string | null) => {
  (globalThis as Record<string, unknown>).__MSW_REFRESH_TOKEN__ = token;
};

// 프로덕션에서는 서버가 암호화 서명된 JWT를 발급합니다.
const createToken = (payload: { id: string; exp: number }): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa('mock-signature');
  return `${header}.${body}.${signature}`;
};

const decodeToken = (token: string): { id: string; exp: number } | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
};

const isTokenValid = (token: string): boolean => {
  const payload = decodeToken(token);
  if (!payload) return false;
  return payload.exp > Date.now() / 1000;
};

const generateTokens = () => {
  const now = Math.floor(Date.now() / 1000);
  const tokens = {
    accessToken: createToken({ id: 'user-1', exp: now + 3600 }), // 1 hour
    refreshToken: createToken({ id: 'user-1', exp: now + 86400 }), // 24 hours
  };
  setRefreshToken(tokens.refreshToken);
  return tokens;
};

const extractBearerToken = (request: Request): string | null => {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  return auth.slice(7);
};

const requireAuth = (request: Request) => {
  const token = extractBearerToken(request);
  if (!token || !isTokenValid(token)) {
    return HttpResponse.json({ errorMessage: '인증이 필요합니다.' }, { status: 401 });
  }
  return null;
};

export const handlers = [
  // POST /api/sign-in
  http.post('/api/sign-in', async ({ request }) => {
    await delay(300);
    let body: { email: string; password: string };
    try {
      body = (await request.json()) as { email: string; password: string };
    } catch {
      return HttpResponse.json(
        { errorMessage: '잘못된 요청 형식입니다.' },
        { status: 400 },
      );
    }

    if (body.email !== MOCK_USER.email || body.password !== MOCK_USER.password) {
      return HttpResponse.json(
        { errorMessage: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 400 },
      );
    }

    return HttpResponse.json(generateTokens(), { status: 200 });
  }),

  // POST /api/refresh
  http.post('/api/refresh', async ({ request, cookies }) => {
    await delay(200);
    // Try cookie first, then X-Refresh-Token header, then in-memory stored token
    const refreshToken =
      cookies.token ||
      request.headers.get('X-Refresh-Token') ||
      getRefreshToken();

    if (!refreshToken || !isTokenValid(refreshToken)) {
      return HttpResponse.json(
        { errorMessage: '리프레시 토큰이 만료되었습니다.' },
        { status: 400 },
      );
    }

    return HttpResponse.json(generateTokens(), { status: 200 });
  }),

  // GET /api/user
  http.get('/api/user', async ({ request }) => {
    await delay(200);
    const authError = requireAuth(request);
    if (authError) return authError;

    return HttpResponse.json({
      name: MOCK_USER.name,
      memo: MOCK_USER.memo,
    });
  }),

  // GET /api/dashboard
  http.get('/api/dashboard', async ({ request }) => {
    await delay(200);
    const authError = requireAuth(request);
    if (authError) return authError;

    return HttpResponse.json(getDashboardData());
  }),

  // GET /api/task
  http.get('/api/task', async ({ request }) => {
    await delay(300);
    const authError = requireAuth(request);
    if (authError) return authError;

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const tasks = getTaskPage(page);

    return HttpResponse.json(tasks);
  }),

  // GET /api/task/:id
  http.get('/api/task/:id', async ({ request, params }) => {
    await delay(200);
    const authError = requireAuth(request);
    if (authError) return authError;

    const task = getTaskById(params.id as string);
    if (!task) {
      return HttpResponse.json(
        { errorMessage: '해당 할 일을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    return HttpResponse.json(task);
  }),
];
