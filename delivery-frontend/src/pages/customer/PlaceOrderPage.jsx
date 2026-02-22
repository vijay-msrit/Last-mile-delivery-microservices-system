import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Send } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import useOrderStore from '../../store/orderStore';
import useAuthStore from '../../store/authStore';

export default function PlaceOrderPage() {
    const [pickup, setPickup] = useState('');
    const [delivery, setDelivery] = useState('');
    const { placeOrder, loading } = useOrderStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Use a mock userId (1) if none available from user object
        const userId = user?.id || 1;
        const result = await placeOrder(userId, pickup, delivery);
        if (result.success) {
            navigate('/orders');
        }
    };

    return (
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: 'var(--radius-xl)',
                        background: 'rgba(255,82,0,0.1)', display: 'inline-flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: 32,
                        marginBottom: 'var(--space-4)',
                    }}>
                        📦
                    </div>
                    <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', margin: 0 }}>
                        New Delivery
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>
                        Enter pickup and delivery addresses to get started
                    </p>
                </div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    style={{
                        background: 'var(--surface-card)',
                        border: '1px solid var(--surface-border)',
                        borderRadius: 'var(--radius-xl)',
                        padding: 'var(--space-8)',
                    }}
                >
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                        {/* Pickup */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                                <div style={{
                                    width: 24, height: 24, borderRadius: '50%',
                                    background: 'var(--success-bg)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <MapPin size={12} color="var(--success)" />
                                </div>
                                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-secondary)' }}>
                                    Pickup Location
                                </label>
                            </div>
                            <Input
                                label="Enter pickup address"
                                value={pickup}
                                onChange={(e) => setPickup(e.target.value)}
                                required
                            />
                        </div>

                        {/* Dotted line connector */}
                        <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: 11 }}>
                            <div style={{
                                width: 2, height: 24,
                                background: 'repeating-linear-gradient(to bottom, var(--surface-border-light) 0px, var(--surface-border-light) 4px, transparent 4px, transparent 8px)',
                            }} />
                        </div>

                        {/* Delivery */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                                <div style={{
                                    width: 24, height: 24, borderRadius: '50%',
                                    background: 'rgba(255,82,0,0.1)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Navigation size={12} color="var(--primary-500)" />
                                </div>
                                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-secondary)' }}>
                                    Delivery Location
                                </label>
                            </div>
                            <Input
                                label="Enter delivery address"
                                value={delivery}
                                onChange={(e) => setDelivery(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" fullWidth loading={loading} icon={Send}>
                            Place Order
                        </Button>
                    </form>
                </motion.div>

                {/* Info cards */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 'var(--space-3)',
                        marginTop: 'var(--space-6)',
                    }}
                >
                    {[
                        { icon: '⚡', text: 'Fast Pickup' },
                        { icon: '📍', text: 'Live Tracking' },
                        { icon: '🔒', text: 'Secure Delivery' },
                    ].map((item) => (
                        <div
                            key={item.text}
                            style={{
                                background: 'var(--glass-bg)',
                                border: '1px solid var(--surface-border)',
                                borderRadius: 'var(--radius-md)',
                                padding: 'var(--space-4)',
                                textAlign: 'center',
                            }}
                        >
                            <p style={{ fontSize: '20px', margin: 0 }}>{item.icon}</p>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0, marginTop: 'var(--space-1)' }}>{item.text}</p>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}
