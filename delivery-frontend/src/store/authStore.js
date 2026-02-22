import { create } from 'zustand';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';

// Decode JWT payload (base64)
function decodeToken(token) {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch {
        return null;
    }
}

const useAuthStore = create((set, get) => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    role: localStorage.getItem('role') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const res = await authApi.login(email, password);
            const token = res.data;
            const decoded = decodeToken(token);
            const role = decoded?.role || localStorage.getItem('role') || 'CUSTOMER';
            const user = { email: decoded?.sub || email, role };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('role', role);

            set({ token, user, role, isAuthenticated: true, loading: false });
            toast.success(`Welcome back!`);
            return { success: true, role };
        } catch (err) {
            const msg = err.response?.data || 'Login failed';
            set({ error: msg, loading: false });
            toast.error(typeof msg === 'string' ? msg : 'Invalid credentials');
            return { success: false };
        }
    },

    register: async (email, password, role) => {
        set({ loading: true, error: null });
        try {
            await authApi.register(email, password, role);
            localStorage.setItem('role', role);
            set({ loading: false });
            toast.success('Account created! Please login.');
            return { success: true };
        } catch (err) {
            const msg = err.response?.data || 'Registration failed';
            set({ error: msg, loading: false });
            toast.error(typeof msg === 'string' ? msg : 'Registration failed');
            return { success: false };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        set({ token: null, user: null, role: null, isAuthenticated: false });
        toast.success('Logged out');
    },

    setRole: (role) => {
        localStorage.setItem('role', role);
        set({ role });
    },
}));

export default useAuthStore;
