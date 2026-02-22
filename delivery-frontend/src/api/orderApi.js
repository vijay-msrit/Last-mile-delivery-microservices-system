import api from './axiosClient';

export const orderApi = {
    placeOrder: (userId, pickupAddress, deliveryAddress) =>
        api.post('/api/orders', { userId, pickupAddress, deliveryAddress }),

    getAllOrders: () =>
        api.get('/api/orders'),

    assignDriver: (orderId, driverId) =>
        api.patch(`/api/orders/${orderId}/assign`, null, {
            params: { driverId },
        }),

    updateStatus: (orderId, status) =>
        api.patch(`/api/orders/${orderId}/status`, null, {
            params: { status },
        }),
};
