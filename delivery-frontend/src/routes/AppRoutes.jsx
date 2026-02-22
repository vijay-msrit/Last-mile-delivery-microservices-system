import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import AppLayout from '../components/layout/AppLayout';
import ProtectedRoute from './ProtectedRoute';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Customer pages
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import PlaceOrderPage from '../pages/customer/PlaceOrderPage';
import MyOrdersPage from '../pages/customer/MyOrdersPage';
import TrackOrderPage from '../pages/customer/TrackOrderPage';

// Driver pages
import DriverDashboard from '../pages/driver/DriverDashboard';
import DriverOrdersPage from '../pages/driver/DriverOrdersPage';

// Other
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public — Auth */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Customer routes */}
            <Route element={<ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']} />}>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<CustomerDashboard />} />
                    <Route path="/order/new" element={<PlaceOrderPage />} />
                    <Route path="/orders" element={<MyOrdersPage />} />
                    <Route path="/track/:orderId" element={<TrackOrderPage />} />
                </Route>
            </Route>

            {/* Driver routes */}
            <Route element={<ProtectedRoute allowedRoles={['DRIVER']} />}>
                <Route element={<AppLayout />}>
                    <Route path="/driver" element={<DriverDashboard />} />
                    <Route path="/driver/orders" element={<DriverOrdersPage />} />
                </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
