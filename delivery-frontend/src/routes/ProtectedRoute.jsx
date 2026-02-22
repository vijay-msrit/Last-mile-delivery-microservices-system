import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function ProtectedRoute({ allowedRoles }) {
    const { isAuthenticated, role } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // Redirect to appropriate dashboard based on role
        if (role === 'DRIVER') return <Navigate to="/driver" replace />;
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
