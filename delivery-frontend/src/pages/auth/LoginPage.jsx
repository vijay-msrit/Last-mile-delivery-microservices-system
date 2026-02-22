import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import useAuthStore from '../../store/authStore';
import { ROLES } from '../../utils/constants';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            navigate(result.role === ROLES.DRIVER ? '/driver' : '/');
        }
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
                <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', margin: 0 }}>Welcome back</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>
                    Sign in to your account
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

            <Button type="submit" fullWidth loading={loading}>
                Sign In
            </Button>

            <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: 'var(--primary-500)', fontWeight: 'var(--font-semibold)' }}>
                    Sign up
                </Link>
            </p>
        </motion.form>
    );
}
