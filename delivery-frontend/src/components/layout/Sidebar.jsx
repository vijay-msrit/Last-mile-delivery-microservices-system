import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    MapPin,
    Plus,
    Truck,
    Navigation,
    ClipboardList,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { ROLES } from '../../utils/constants';
import styles from './Sidebar.module.css';

const customerLinks = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/order/new', icon: Plus, label: 'Place Order' },
    { to: '/orders', icon: ShoppingBag, label: 'My Orders' },
];

const driverLinks = [
    { to: '/driver', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/driver/orders', icon: ClipboardList, label: 'My Deliveries' },
];

export default function Sidebar() {
    const role = useAuthStore((s) => s.role);
    const links = role === ROLES.DRIVER ? driverLinks : customerLinks;

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <div className={styles.logoIcon}>🚀</div>
                <span className={styles.logoText}>SwiftDeliver</span>
            </div>

            <nav className={styles.nav}>
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === '/' || link.to === '/driver'}
                        className={({ isActive }) =>
                            `${styles.navItem} ${isActive ? styles.active : ''}`
                        }
                    >
                        <link.icon size={18} />
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            <div className={styles.footer}>
                <p className={styles.version}>SwiftDeliver v1.0</p>
            </div>
        </aside>
    );
}
