import { useState, useRef, useEffect } from 'react';
import { Bell, LogOut } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useNotificationStore from '../../store/notificationStore';
import { formatRelativeTime } from '../../utils/formatters';
import styles from './Navbar.module.css';

export default function Navbar({ title }) {
    const { user, role, logout } = useAuthStore();
    const { notifications, unreadCount, markAllRead } = useNotificationStore();
    const [showNotifs, setShowNotifs] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowNotifs(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleBellClick = () => {
        setShowNotifs(!showNotifs);
        if (!showNotifs && unreadCount > 0) markAllRead();
    };

    const initials = user?.email?.charAt(0)?.toUpperCase() || '?';

    return (
        <nav className={styles.navbar}>
            <h2 className={styles.pageTitle}>{title}</h2>

            <div className={styles.actions}>
                {/* Notification Bell */}
                <div className={styles.bellWrapper} onClick={handleBellClick} ref={dropdownRef}>
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
                    )}

                    {showNotifs && (
                        <div className={styles.notifDropdown}>
                            <div className={styles.notifHeader}>
                                <span style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' }}>
                                    Notifications
                                </span>
                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                                    {notifications.length} total
                                </span>
                            </div>
                            {notifications.length === 0 ? (
                                <div className={styles.empty}>No notifications yet</div>
                            ) : (
                                notifications.slice(0, 10).map((n) => (
                                    <div key={n.id} className={`${styles.notifItem} ${!n.read ? styles.unread : ''}`}>
                                        <span style={{ fontSize: '18px' }}>{n.icon}</span>
                                        <div>
                                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', margin: 0 }}>
                                                {n.type?.replace(/_/g, ' ')}
                                            </p>
                                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>
                                                {formatRelativeTime(n.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* User info */}
                <div className={styles.userInfo}>
                    <div className={styles.userAvatar}>{initials}</div>
                    <div>
                        <div className={styles.userName}>{user?.email || 'User'}</div>
                        <div className={styles.userRole}>{role}</div>
                    </div>
                </div>

                {/* Logout */}
                <div className={styles.bellWrapper} onClick={logout} title="Logout">
                    <LogOut size={18} />
                </div>
            </div>
        </nav>
    );
}
