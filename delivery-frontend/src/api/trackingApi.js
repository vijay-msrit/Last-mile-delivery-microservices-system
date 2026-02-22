import api from './axiosClient';

export const trackingApi = {
    getDriverLocation: (driverId) =>
        api.get(`/tracking/${driverId}`),
};
