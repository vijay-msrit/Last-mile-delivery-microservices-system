import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock } from 'lucide-react';
import Badge from '../common/Badge';
import { formatRelativeTime, truncateAddress } from '../../utils/formatters';

export default function OrderCard({ order, index = 0 }) {
    const navigate = useNavigate();

    const canTrack = order.status === 'ASSIGNED' || order.status === 'PICKED_UP';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -2, borderColor: 'rgba(255,82,0,0.3)' }}
            onClick={() => canTrack && navigate(`/track/${order.id}`)}
            style={{
                background: 'var(--surface-card)',
                border: '1px solid var(--surface-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5)',
                cursor: canTrack ? 'pointer' : 'default',
                transition: 'border-color var(--transition-base)',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                <div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Order</span>
                    <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', margin: 0 }}>#{order.id}</h4>
                </div>
                <Badge status={order.status} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: 'var(--radius-sm)',
                        background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <MapPin size={14} color="var(--success)" />
                    </div>
                    <div>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>Pickup</p>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', margin: 0 }}>
                            {truncateAddress(order.pickupAddress)}
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255,82,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Navigation size={14} color="var(--primary-500)" />
                    </div>
                    <div>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>Delivery</p>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', margin: 0 }}>
                            {truncateAddress(order.deliveryAddress)}
                        </p>
                    </div>
                </div>
            </div>

            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)',
                borderTop: '1px solid var(--surface-border)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                    <Clock size={12} />
                    {formatRelativeTime(order.createdAt)}
                </div>
                {canTrack && (
                    <span style={{
                        fontSize: 'var(--text-xs)', color: 'var(--primary-500)', fontWeight: 'var(--font-semibold)',
                        display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                        Track Live →
                    </span>
                )}
            </div>
        </motion.div>
    );
}
