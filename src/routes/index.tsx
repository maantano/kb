import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import ProtectedRoute from './ProtectedRoute';
import LoadingSpinner from '../components/feedback/LoadingSpinner';

/** React.lazy를 통한 코드 스플리팅 — 각 페이지가 별도 chunk로 분리되어 초기 번들 크기 최소화 */
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const SignIn = lazy(() => import('../pages/SignIn/SignIn'));
const TaskList = lazy(() => import('../pages/TaskList/TaskList'));
const TaskDetail = lazy(() => import('../pages/TaskDetail/TaskDetail'));
const User = lazy(() => import('../pages/User/User'));

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/sign-in',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SignIn />
          </Suspense>
        ),
      },
      {
        path: '/task',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <TaskList />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/task/:id',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <TaskDetail />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/user',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <User />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
