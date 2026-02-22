import { getStatusConfig } from '../../utils/formatters';

export default function Badge({ status, className = '' }) {
    const config = getStatusConfig(status);
    return (
        <span
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-semibold)',
                color: config.color,
                background: config.bg,
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
            }}
        >
            <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: config.color,
                boxShadow: `0 0 6px ${config.color}`,
            }} />
            {config.label}
        </span>
    );
}
