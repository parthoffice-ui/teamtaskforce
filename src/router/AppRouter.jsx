import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Layout } from '../components/layout/Layout.jsx';

// Lazy-loaded pages for code splitting
const LoginPage    = lazy(() => import('../pages/Login.jsx'));
const DashboardPage = lazy(() => import('../pages/Dashboard.jsx'));

// Non-lazy (grouped file)
import { TasksPage, CreateTaskPage }            from '../pages/Tasks.jsx';
import { LeavePage, AttendancePage, ReportsPage, TeamPage } from '../pages/Leave.jsx';

/** Loading fallback */
function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh' }}>
      <div style={{ color: 'var(--muted)', fontSize: 24 }}>⚡</div>
    </div>
  );
}

/** Wrapper that redirects to /login if not authenticated */
function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? (
    <Layout>
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </Layout>
  ) : (
    <Navigate to="/login" replace />
  );
}

/** Wrapper that redirects to dashboard if already authenticated */
function PublicRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser
    ? <Navigate to="/" replace />
    : <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

/** Admin-only guard */
function AdminRoute({ children }) {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/" replace />;
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

      {/* Private */}
      <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/tasks" element={<PrivateRoute><TasksPage /></PrivateRoute>} />
      <Route path="/createtask" element={<PrivateRoute><CreateTaskPage /></PrivateRoute>} />
      <Route path="/leave" element={<PrivateRoute><LeavePage /></PrivateRoute>} />
      <Route path="/attendance" element={<PrivateRoute><AttendancePage /></PrivateRoute>} />

      {/* Admin only */}
      <Route path="/reports" element={<PrivateRoute><AdminRoute><ReportsPage /></AdminRoute></PrivateRoute>} />
      <Route path="/team" element={<PrivateRoute><AdminRoute><TeamPage /></AdminRoute></PrivateRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
