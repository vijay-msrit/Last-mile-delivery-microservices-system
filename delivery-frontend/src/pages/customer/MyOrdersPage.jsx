import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OrderCard from '../../components/order/OrderCard';
import Spinner from '../../components/common/Spinner';
import useOrderStore from '../../store/orderStore';
import { ORDER_STATUSES } from '../../utils/constants';

const filters = [
    { label: 'All', value: 'ALL' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Delivered', value: ORDER_STATUSES.DELIVERED },
    { label: 'Cancelled', value: ORDER_STATUSES.CANCELLED },
];

export default function MyOrdersPage() {
    const { orders, loading, fetchOrders } = useOrderStore();
    const [activeFilter, setActiveFilter] = useState('ALL');

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const filtered = orders.filter((o) => {
        if (activeFilter === 'ALL') return true;
        if (activeFilter === 'ACTIVE') return ['PENDING', 'ASSIGNED', 'PICKED_UP'].includes(o.status);
        return o.status === activeFilter;
    });

    if (loading && orders.length === 0) return <Spinner />;

    return (
        <div style={{ maxWidth: 'var(--max-content-width)', margin: '0 auto' }}>
            {/* Filter tabs */}
            <div style={{
                display: 'flex',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-6)',
                background: 'var(--surface-card)',
                border: '1px solid var(--surface-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-1)',
            }}>
                {filters.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setActiveFilter(f.value)}
                        style={{
                            flex: 1,
                            padding: 'var(--space-3)',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            background: activeFilter === f.value ? 'var(--primary-500)' : 'transparent',
                            color: activeFilter === f.value ? 'white' : 'var(--text-secondary)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-medium)',
                            cursor: 'pointer',
                            transition: 'all var(--transition-base)',
                            fontFamily: 'var(--font-family)',
                        }}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Results count */}
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                {filtered.length} order{filtered.length !== 1 ? 's' : ''} found
            </p>

            {/* Orders grid */}
            <AnimatePresence mode="popLayout">
                {filtered.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            textAlign: 'center',
                            padding: 'var(--space-16)',
                            background: 'var(--surface-card)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--surface-border)',
                        }}
                    >
                        <p style={{ fontSize: '48px' }}>📭</p>
                        <p style={{ color: 'var(--text-muted)', marginTop: 'var(--space-4)' }}>
                            No orders match this filter
                        </p>
                    </motion.div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-4)' }}>
                        {filtered.map((order, idx) => (
                            <OrderCard key={order.id} order={order} index={idx} />
                        ))}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
