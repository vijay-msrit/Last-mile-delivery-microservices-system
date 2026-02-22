import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Truck, Clock, TrendingUp } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import OrderCard from '../../components/order/OrderCard';
import Spinner from '../../components/common/Spinner';
import useOrderStore from '../../store/orderStore';

function StatCard({ icon: Icon, label, value, color, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 'var(--radius-md)',
                            background: `${color}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Icon size={22} color={color} />
                    </div>
                    <div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: delay + 0.2 }}
                            style={{
                                fontSize: 'var(--text-2xl)',
                                fontWeight: 'var(--font-bold)',
                                color: 'var(--text-primary)',
                                margin: 0,
                            }}
                        >
                            {value}
                        </motion.p>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 0 }}>{label}</p>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

export default function CustomerDashboard() {
    const { orders, loading, fetchOrders } = useOrderStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const totalOrders = orders.length;
    const activeOrders = orders.filter((o) => ['PENDING', 'ASSIGNED', 'PICKED_UP'].includes(o.status)).length;
    const delivered = orders.filter((o) => o.status === 'DELIVERED').length;
    const recentOrders = orders.slice(0, 4);

    if (loading && orders.length === 0) return <Spinner />;

    return (
        <div style={{ maxWidth: 'var(--max-content-width)', margin: '0 auto' }}>
            {/* Welcome */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: 'var(--space-8)' }}
            >
                <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)' }}>
                    Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'} 👋
                </h1>
                <p style={{ color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
                    Here's what's happening with your deliveries
                </p>
            </motion.div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-5)', marginBottom: 'var(--space-8)' }}>
                <StatCard icon={ShoppingBag} label="Total Orders" value={totalOrders} color="#FF5200" delay={0.1} />
                <StatCard icon={Truck} label="Active" value={activeOrders} color="#60A5FA" delay={0.2} />
                <StatCard icon={Clock} label="Delivered" value={delivered} color="#34D399" delay={0.3} />
                <StatCard icon={TrendingUp} label="Success Rate" value={totalOrders > 0 ? `${Math.round((delivered / totalOrders) * 100)}%` : '—'} color="#A78BFA" delay={0.4} />
            </div>

            {/* Quick Action */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{
                    background: 'var(--primary-gradient)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-8)',
                    marginBottom: 'var(--space-8)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: 'var(--shadow-glow)',
                }}
            >
                <div>
                    <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'white', margin: 0 }}>
                        Send a package? 📦
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)', margin: 0, marginTop: 'var(--space-1)' }}>
                        Fast, reliable last-mile delivery at your fingertips
                    </p>
                </div>
                <Button variant="secondary" onClick={() => navigate('/order/new')}>
                    Place Order
                </Button>
            </motion.div>

            {/* Recent Orders */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
                    <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)' }}>Recent Orders</h3>
                    {orders.length > 4 && (
                        <Button variant="ghost" size="sm" onClick={() => navigate('/orders')}>
                            View all →
                        </Button>
                    )}
                </div>

                {recentOrders.length === 0 ? (
                    <Card>
                        <div style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                            <p style={{ fontSize: '48px', marginBottom: 'var(--space-4)' }}>📭</p>
                            <p style={{ color: 'var(--text-muted)' }}>No orders yet. Place your first order!</p>
                        </div>
                    </Card>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
                        {recentOrders.map((order, idx) => (
                            <OrderCard key={order.id} order={order} index={idx} />
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
