import api from './axiosClient';

export const driverApi = {
    register: (name, vehicleNumber) =>
        api.post('/api/drivers/register', { name, vehicleNumber }),

    toggleStatus: (driverId) =>
        api.patch(`/api/drivers/${driverId}/status`),

    updateLocation: (driverId, lat, lng) =>
        api.patch(`/api/drivers/${driverId}/location`, null, {
            params: { lat, lng },
        }),

    sendGps: (driverId, lat, lng) =>
        api.post(`/api/drivers/${driverId}/gps`, null, {
            params: { lat, lng },
        }),

    getAvailable: () =>
        api.get('/api/drivers/available'),

    markPickup: (driverId, orderId) =>
        api.post(`/api/drivers/${driverId}/orders/${orderId}/pickup`),

    markDelivered: (driverId, orderId) =>
        api.post(`/api/drivers/${driverId}/orders/${orderId}/delivered`),
};
