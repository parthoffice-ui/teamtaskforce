import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import { Layout } from '../components/layout/Layout.jsx';
import Loader from '../components/common/Loader.jsx';

const LoginPage    = lazy(() => import('../pages/Login.jsx'));
const RegisterPage = lazy(() => import('../pages/Register.jsx'));
const DashboardPage = lazy(() => import('../pages/Dashboard.jsx'));

import { TasksPage, CreateTaskPage }                        from '../pages/Tasks.jsx';
import { LeavePage, AttendancePage, ReportsPage, TeamPage } from '../pages/Leave.jsx';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  const { state }       = useAppContext();

  if (state.loading) return <Loader />;

  return currentUser ? (
    <Layout>
      <Suspense fallback={<Loader />}>{children}</Suspense>
    </Layout>
  ) : (
    <Navigate to="/login" replace />
  );
}

function PublicRoute({ children }) {
  const { currentUser } = useAuth();
  const { state }       = useAppContext();

  if (state.loading) return <Loader />;

  return currentUser
    ? <Navigate to="/" replace />
    : <Suspense fallback={<Loader />}>{children}</Suspense>;
}

function AdminRoute({ children }) {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/" replace />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      <Route path="/"           element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/tasks"      element={<PrivateRoute><TasksPage /></PrivateRoute>} />
      <Route path="/createtask" element={<PrivateRoute><CreateTaskPage /></PrivateRoute>} />
      <Route path="/leave"      element={<PrivateRoute><LeavePage /></PrivateRoute>} />
      <Route path="/attendance" element={<PrivateRoute><AttendancePage /></PrivateRoute>} />
      <Route path="/reports"    element={<PrivateRoute><AdminRoute><ReportsPage /></AdminRoute></PrivateRoute>} />
      <Route path="/team"       element={<PrivateRoute><AdminRoute><TeamPage /></AdminRoute></PrivateRoute>} />
      <Route path="*"           element={<Navigate to="/" replace />} />
    </Routes>
  );
}