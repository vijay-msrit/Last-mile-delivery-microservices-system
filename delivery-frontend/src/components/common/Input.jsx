import styles from './Input.module.css';

export default function Input({
    label,
    type = 'text',
    value,
    onChange,
    error,
    icon: Icon,
    className = '',
    ...props
}) {
    return (
        <div className={`${styles.inputWrapper} ${error ? styles.error : ''} ${className}`}>
            <input
                type={type}
                value={value}
                onChange={onChange}
                className={styles.input}
                placeholder={label}
                {...props}
            />
            <label className={styles.label}>{label}</label>
            {Icon && <span className={styles.icon}><Icon size={18} /></span>}
            {error && <p className={styles.errorText}>{error}</p>}
        </div>
    );
}
