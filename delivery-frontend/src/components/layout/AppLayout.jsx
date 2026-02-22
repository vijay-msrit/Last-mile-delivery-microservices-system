import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import useWebSocket from '../../hooks/useWebSocket';

const pageTitles = {
    '/': 'Dashboard',
    '/order/new': 'Place New Order',
    '/orders': 'My Orders',
    '/driver': 'Driver Dashboard',
    '/driver/orders': 'My Deliveries',
};

export default function AppLayout() {
    const location = useLocation();
    useWebSocket(); // Connect WebSocket globally

    const title = pageTitles[location.pathname] || 'SwiftDeliver';

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <div
                style={{
                    flex: 1,
                    marginLeft: 'var(--sidebar-width)',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Navbar title={title} />
                <main
                    style={{
                        flex: 1,
                        padding: 'var(--space-8)',
                        paddingTop: 'calc(var(--navbar-height) + var(--space-8))',
                        maxWidth: '100%',
                        overflow: 'auto',
                    }}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
