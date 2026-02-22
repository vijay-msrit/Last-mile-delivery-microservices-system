import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Power, MapPin, Navigation, Truck, Package, CheckCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import LiveMap from '../../components/tracking/LiveMap';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import useDriverStore from '../../store/driverStore';
import useOrderStore from '../../store/orderStore';
import useGeoLocation from '../../hooks/useGeoLocation';

export default function DriverDashboard() {
    const {
        driverProfile, isOnline, toggleOnline,
        registerDriver, markPickup, markDelivered, loading,
    } = useDriverStore();
    const { orders, fetchOrders } = useOrderStore();
    const { position } = useGeoLocation();
    const [showRegister, setShowRegister] = useState(false);
    const [name, setName] = useState('');
    const [vehicle, setVehicle] = useState('');

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const assignedOrders = orders.filter(
        (o) => o.driverId === driverProfile?.id && ['ASSIGNED', 'PICKED_UP'].includes(o.status)
    );
    const completedOrders = orders.filter(
        (o) => o.driverId === driverProfile?.id && o.status === 'DELIVERED'
    );

    const handleRegister = async (e) => {
        e.preventDefault();
        const res = await registerDriver(name, vehicle);
        if (res.success) setShowRegister(false);
    };

    // If no driver profile, show registration
    if (!driverProfile) {
        return (
            <div style={{ maxWidth: 480, margin: '0 auto', padding: 'var(--space-8)' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                        <div style={{ fontSize: 56, marginBottom: 'var(--space-4)' }}>🚗</div>
                        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>Driver Registration</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                            Complete your profile to start accepting deliveries
                        </p>
                    </div>
                    <Card hover={false}>
                        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                            <Input label="Vehicle Number" value={vehicle} onChange={(e) => setVehicle(e.target.value)} required />
                            <Button type="submit" fullWidth loading={loading}>Register as Driver</Button>
                        </form>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 'var(--max-content-width)', margin: '0 auto' }}>
            {/* Header with toggle */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: 'var(--space-8)',
                }}
            >
                <div>
                    <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)' }}>
                        Hey, {driverProfile.name} 👋
                    </h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
                        Vehicle: {driverProfile.vehicleNumber}
                    </p>
                </div>

                {/* Online/Offline Toggle */}
                <button
                    onClick={toggleOnline}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                        padding: 'var(--space-3) var(--space-6)',
                        borderRadius: 'var(--radius-full)',
                        border: `2px solid ${isOnline ? 'var(--success)' : 'var(--surface-border-light)'}`,
                        background: isOnline ? 'var(--success-bg)' : 'var(--surface-elevated)',
                        color: isOnline ? 'var(--success)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-family)',
                        fontWeight: 'var(--font-semibold)',
                        fontSize: 'var(--text-sm)',
                        transition: 'all var(--transition-base)',
                    }}
                >
                    <div style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: isOnline ? 'var(--success)' : 'var(--text-muted)',
                        boxShadow: isOnline ? '0 0 8px var(--success)' : 'none',
                        transition: 'all var(--transition-base)',
                    }} />
                    {isOnline ? 'Online' : 'Offline'}
                </button>
            </motion.div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-5)', marginBottom: 'var(--space-8)' }}>
                {[
                    { icon: Truck, label: 'Active', value: assignedOrders.length, color: '#60A5FA' },
                    { icon: CheckCircle, label: 'Completed', value: completedOrders.length, color: '#34D399' },
                    { icon: Power, label: 'Status', value: isOnline ? 'Online' : 'Offline', color: isOnline ? '#34D399' : '#71717A' },
                ].map((stat, idx) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                        <Card>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 'var(--radius-md)',
                                    background: `${stat.color}15`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <stat.icon size={20} color={stat.color} />
                                </div>
                                <div>
                                    <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', margin: 0, color: 'var(--text-primary)' }}>
                                        {stat.value}
                                    </p>
                                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 0 }}>{stat.label}</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Map + Active deliveries */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                {/* Map */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    <h3 style={{ marginBottom: 'var(--space-4)', fontWeight: 'var(--font-semibold)' }}>Your Location</h3>
                    <LiveMap driverLocation={position} height={350} autoFly={false} />
                </motion.div>

                {/* Active orders */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                    <h3 style={{ marginBottom: 'var(--space-4)', fontWeight: 'var(--font-semibold)' }}>Active Deliveries</h3>
                    {assignedOrders.length === 0 ? (
                        <Card hover={false}>
                            <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                                <p style={{ fontSize: '40px' }}>☕</p>
                                <p style={{ color: 'var(--text-muted)', marginTop: 'var(--space-3)' }}>
                                    {isOnline ? 'Waiting for orders...' : 'Go online to receive orders'}
                                </p>
                            </div>
                        </Card>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            {assignedOrders.map((order) => (
                                <Card key={order.id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                                        <h4 style={{ margin: 0, fontSize: 'var(--text-base)' }}>Order #{order.id}</h4>
                                        <Badge status={order.status} />
                                    </div>
                                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                            <MapPin size={14} color="var(--success)" />
                                            <span>{order.pickupAddress}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <Navigation size={14} color="var(--primary-500)" />
                                            <span>{order.deliveryAddress}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                        {order.status === 'ASSIGNED' && (
                                            <Button size="sm" variant="primary" icon={Package} onClick={() => markPickup(order.id)}>
                                                Mark Picked Up
                                            </Button>
                                        )}
                                        {order.status === 'PICKED_UP' && (
                                            <Button size="sm" variant="success" icon={CheckCircle} onClick={() => markDelivered(order.id)}>
                                                Mark Delivered
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
