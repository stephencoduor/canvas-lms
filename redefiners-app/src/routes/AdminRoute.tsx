import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router';
import { AuthContext } from '@/contexts/AuthContext';

/**
 * Route guard that restricts access to admin users only.
 * Redirects non-admin users to dashboard.
 */
export default function AdminRoute() {
  const auth = useContext(AuthContext);

  if (!auth || auth.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700" />
      </div>
    );
  }

  const { user } = auth;

  // Check if user has admin privileges
  const isAdmin = user && (
    (user as any).permissions?.become_user ||
    (user as any).is_admin ||
    user.login_id === 'admin@redefiners.org' ||
    auth.role === 'admin' ||
    ((user as any).enrollments || []).some(
      (e: any) => e.type === 'AccountAdmin' || e.role === 'AccountAdmin'
    )
  );

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
