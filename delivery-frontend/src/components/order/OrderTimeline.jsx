import { motion } from 'framer-motion';
import { Clock, UserCheck, Package, CheckCircle, XCircle } from 'lucide-react';

const steps = [
    { status: 'PENDING', label: 'Order Placed', icon: Clock, color: 'var(--status-pending)' },
    { status: 'ASSIGNED', label: 'Driver Assigned', icon: UserCheck, color: 'var(--status-assigned)' },
    { status: 'PICKED_UP', label: 'Picked Up', icon: Package, color: 'var(--status-picked-up)' },
    { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle, color: 'var(--status-delivered)' },
];

const statusOrder = ['PENDING', 'ASSIGNED', 'PICKED_UP', 'DELIVERED'];

export default function OrderTimeline({ currentStatus }) {
    if (currentStatus === 'CANCELLED') {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4)' }}>
                <XCircle size={20} color="var(--status-cancelled)" />
                <span style={{ color: 'var(--status-cancelled)', fontWeight: 'var(--font-semibold)' }}>Order Cancelled</span>
            </div>
        );
    }

    const currentIdx = statusOrder.indexOf(currentStatus);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: 'var(--space-2) 0' }}>
            {steps.map((step, idx) => {
                const isCompleted = idx <= currentIdx;
                const isCurrent = idx === currentIdx;
                const Icon = step.icon;

                return (
                    <motion.div
                        key={step.status}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)', position: 'relative' }}
                    >
                        {/* Line + Circle */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 32 }}>
                            <div
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: '50%',
                                    background: isCompleted ? step.color : 'var(--surface-elevated)',
                                    border: `2px solid ${isCompleted ? step.color : 'var(--surface-border-light)'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease',
                                    boxShadow: isCurrent ? `0 0 12px ${step.color}` : 'none',
                                }}
                            >
                                <Icon size={14} color={isCompleted ? 'white' : 'var(--text-muted)'} />
                            </div>
                            {idx < steps.length - 1 && (
                                <div
                                    style={{
                                        width: 2,
                                        height: 24,
                                        background: idx < currentIdx ? 'var(--primary-500)' : 'var(--surface-border)',
                                        transition: 'background 0.3s ease',
                                    }}
                                />
                            )}
                        </div>

                        {/* Label */}
                        <div style={{ paddingTop: 3, paddingBottom: idx < steps.length - 1 ? 8 : 0 }}>
                            <p
                                style={{
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: isCompleted ? 'var(--font-semibold)' : 'var(--font-normal)',
                                    color: isCompleted ? 'var(--text-primary)' : 'var(--text-muted)',
                                    margin: 0,
                                }}
                            >
                                {step.label}
                            </p>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
