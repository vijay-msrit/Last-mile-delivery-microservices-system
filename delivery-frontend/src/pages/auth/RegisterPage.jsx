import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import useAuthStore from '../../store/authStore';
import { ROLES } from '../../utils/constants';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(ROLES.CUSTOMER);
    const { register, loading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(email, password, role);
        if (result.success) navigate('/login');
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}
        >
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
                <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', margin: 0 }}>Create account</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>
                    Join SwiftDeliver today
                </p>
            </div>

            <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                required
            />

            <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                required
            />

            {/* Role Selector */}
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                {[ROLES.CUSTOMER, ROLES.DRIVER].map((r) => (
                    <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        style={{
                            flex: 1,
                            padding: 'var(--space-4)',
                            border: `2px solid ${role === r ? 'var(--primary-500)' : 'var(--surface-border)'}`,
                            borderRadius: 'var(--radius-md)',
                            background: role === r ? 'rgba(255,82,0,0.08)' : 'var(--surface-elevated)',
                            color: role === r ? 'var(--primary-500)' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            transition: 'all var(--transition-base)',
                            fontFamily: 'var(--font-family)',
                            fontWeight: 'var(--font-semibold)',
                            fontSize: 'var(--text-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'var(--space-2)',
                        }}
                    >
                        {r === ROLES.CUSTOMER ? '🛒' : '🚗'}
                        {r === ROLES.CUSTOMER ? 'Customer' : 'Driver'}
                    </button>
                ))}
            </div>

            <Button type="submit" fullWidth loading={loading}>
                Create Account
            </Button>

            <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--primary-500)', fontWeight: 'var(--font-semibold)' }}>
                    Sign in
                </Link>
            </p>
        </motion.form>
    );
}
