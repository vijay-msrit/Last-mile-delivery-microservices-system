import { useRef } from 'react';
import styles from './Button.module.css';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    icon: Icon,
    onClick,
    type = 'button',
    disabled,
    className = '',
    ...props
}) {
    const btnRef = useRef(null);

    const handleClick = (e) => {
        if (loading || disabled) return;

        // Ripple effect
        const btn = btnRef.current;
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        ripple.className = styles.ripple;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);

        onClick?.(e);
    };

    return (
        <button
            ref={btnRef}
            type={type}
            className={`${styles.btn} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.full : ''} ${className}`}
            onClick={handleClick}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span className={styles.spinner} />
            ) : Icon ? (
                <Icon size={16} />
            ) : null}
            {children}
        </button>
    );
}
