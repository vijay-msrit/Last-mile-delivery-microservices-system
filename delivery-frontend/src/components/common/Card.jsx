import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true, onClick, style = {} }) {
    return (
        <motion.div
            whileHover={hover ? { y: -2, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' } : {}}
            transition={{ duration: 0.2 }}
            onClick={onClick}
            style={{
                background: 'var(--surface-card)',
                border: '1px solid var(--surface-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-6)',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'border-color var(--transition-base)',
                ...style,
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
