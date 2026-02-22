import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';

export default function NotFoundPage() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            padding: 'var(--space-8)',
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 20 }}
            >
                <p style={{ fontSize: '80px', marginBottom: 'var(--space-4)' }}>🗺️</p>
                <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)' }}>
                    404
                </h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-8)', fontSize: 'var(--text-lg)' }}>
                    Looks like this page took a wrong turn
                </p>
                <Link to="/">
                    <Button>Back to Dashboard</Button>
                </Link>
            </motion.div>
        </div>
    );
}
