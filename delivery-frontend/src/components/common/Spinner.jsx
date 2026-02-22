export default function Spinner({ size = 32, color = 'var(--primary-500)' }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8)' }}>
            <div
                style={{
                    width: size,
                    height: size,
                    border: `3px solid var(--surface-border)`,
                    borderTopColor: color,
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                }}
            />
        </div>
    );
}
