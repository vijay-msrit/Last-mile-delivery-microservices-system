import api from './axiosClient';

export const authApi = {
    register: (email, password, role) =>
        api.post('/api/auth/register', { email, password, role }),

    login: (email, password) =>
        api.post('/api/auth/login', null, {
            params: { email, password },
        }),
};
