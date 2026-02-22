import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLayout() {
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--surface-bg)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Gradient orbs */}
            <div
                style={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: 500,
                    height: 500,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,82,0,0.15), transparent 70%)',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: '-15%',
                    left: '-5%',
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,122,51,0.1), transparent 70%)',
                    filter: 'blur(40px)',
                    pointerEvents: 'none',
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{
                    width: '100%',
                    maxWidth: 440,
                    padding: 'var(--space-8)',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
                    <div
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 'var(--radius-lg)',
                            background: 'var(--primary-gradient)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 28,
                            marginBottom: 'var(--space-4)',
                            boxShadow: 'var(--shadow-glow)',
                        }}
                    >
                        🚀
                    </div>
                    <h1
                        style={{
                            fontSize: 'var(--text-3xl)',
                            fontWeight: 'var(--font-bold)',
                            background: 'var(--primary-gradient)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        SwiftDeliver
                    </h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                        Last-mile delivery, lightning fast
                    </p>
                </div>

                <div
                    style={{
                        background: 'var(--surface-card)',
                        border: '1px solid var(--surface-border)',
                        borderRadius: 'var(--radius-xl)',
                        padding: 'var(--space-8)',
                    }}
                >
                    <Outlet />
                </div>
            </motion.div>
        </div>
    );
}
