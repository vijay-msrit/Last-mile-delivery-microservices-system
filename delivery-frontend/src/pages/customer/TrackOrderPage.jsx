import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Navigation, User, Phone } from 'lucide-react';
import LiveMap from '../../components/tracking/LiveMap';
import OrderTimeline from '../../components/order/OrderTimeline';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import useOrderStore from '../../store/orderStore';
import useDriverLocation from '../../hooks/useDriverLocation';

export default function TrackOrderPage() {
    const { orderId } = useParams();
    const { orders, fetchOrders } = useOrderStore();
    const order = orders.find((o) => o.id === Number(orderId));

    useEffect(() => {
        if (!order) fetchOrders();
    }, [order, fetchOrders]);

    const { location: driverLocation, loading: locLoading } = useDriverLocation(order?.driverId);

    if (!order) return <Spinner />;

    return (
        <div style={{ maxWidth: 'var(--max-content-width)', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-6)', alignItems: 'start' }}>
                {/* Left — Map */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div style={{ marginBottom: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', margin: 0 }}>
                            Track Order #{orderId}
                        </h2>
                        <Badge status={order.status} />
                    </div>

                    <LiveMap
                        driverLocation={driverLocation}
                        height={450}
                    />

                    {driverLocation && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                                marginTop: 'var(--space-3)',
                                padding: 'var(--space-3) var(--space-4)',
                                background: 'var(--glass-bg)',
                                border: '1px solid var(--surface-border)',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-3)',
                                fontSize: 'var(--text-sm)',
                            }}
                        >
                            <div style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: 'var(--success)',
                                boxShadow: '0 0 8px var(--success)',
                                animation: 'pulse 2s ease infinite',
                            }} />
                            <span style={{ color: 'var(--text-muted)' }}>Live tracking active</span>
                            <span style={{ color: 'var(--text-muted)', marginLeft: 'auto', fontFamily: 'var(--font-mono)' }}>
                                {driverLocation.lat.toFixed(4)}, {driverLocation.lng.toFixed(4)}
                            </span>
                        </motion.div>
                    )}
                </motion.div>

                {/* Right — Order Details */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
                >
                    {/* Status Timeline */}
                    <Card hover={false}>
                        <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-4)' }}>
                            Delivery Status
                        </h4>
                        <OrderTimeline currentStatus={order.status} />
                    </Card>

                    {/* Addresses */}
                    <Card hover={false}>
                        <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-4)' }}>
                            Delivery Details
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                                    background: 'var(--success-bg)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <MapPin size={14} color="var(--success)" />
                                </div>
                                <div>
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>Pickup</p>
                                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', margin: 0 }}>{order.pickupAddress}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                                    background: 'rgba(255,82,0,0.1)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <Navigation size={14} color="var(--primary-500)" />
                                </div>
                                <div>
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>Delivery</p>
                                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', margin: 0 }}>{order.deliveryAddress}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Driver info */}
                    {order.driverId && (
                        <Card hover={false}>
                            <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-4)' }}>
                                Your Driver
                            </h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: '50%',
                                    background: 'var(--primary-gradient)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '18px',
                                }}>
                                    🚗
                                </div>
                                <div>
                                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', margin: 0, color: 'var(--text-primary)' }}>
                                        Driver #{order.driverId}
                                    </p>
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>
                                        En route to {order.status === 'PICKED_UP' ? 'delivery' : 'pickup'}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
