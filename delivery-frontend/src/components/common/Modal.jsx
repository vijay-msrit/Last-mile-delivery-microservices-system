import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 'var(--z-modal-backdrop)',
                        }}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'var(--surface-elevated)',
                            border: '1px solid var(--surface-border)',
                            borderRadius: 'var(--radius-xl)',
                            padding: 'var(--space-8)',
                            minWidth: 400,
                            maxWidth: '90vw',
                            maxHeight: '85vh',
                            overflow: 'auto',
                            zIndex: 'var(--z-modal)',
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 'var(--space-6)',
                        }}>
                            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)' }}>{title}</h3>
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'var(--glass-bg)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: 'var(--space-2)',
                                    cursor: 'pointer',
                                    color: 'var(--text-secondary)',
                                    transition: 'all var(--transition-fast)',
                                }}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
