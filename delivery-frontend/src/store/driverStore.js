import { create } from 'zustand';
import { driverApi } from '../api/driverApi';
import toast from 'react-hot-toast';

const useDriverStore = create((set, get) => ({
    driverProfile: JSON.parse(localStorage.getItem('driverProfile') || 'null'),
    isOnline: false,
    assignedOrders: [],
    currentLocation: null,
    loading: false,
    gpsInterval: null,

    registerDriver: async (name, vehicleNumber) => {
        set({ loading: true });
        try {
            const res = await driverApi.register(name, vehicleNumber);
            localStorage.setItem('driverProfile', JSON.stringify(res.data));
            set({ driverProfile: res.data, loading: false });
            toast.success('Driver registered!');
            return { success: true };
        } catch (err) {
            set({ loading: false });
            toast.error('Registration failed');
            return { success: false };
        }
    },

    toggleOnline: async () => {
        const { driverProfile } = get();
        if (!driverProfile) return;
        try {
            const res = await driverApi.toggleStatus(driverProfile.id);
            const isOnline = res.data.available;
            set({ isOnline, driverProfile: res.data });

            if (isOnline) {
                toast.success('You are now online! 🟢');
                get().startGpsBroadcast();
            } else {
                toast('You are offline', { icon: '🔴' });
                get().stopGpsBroadcast();
            }
        } catch (err) {
            toast.error('Failed to update status');
        }
    },

    startGpsBroadcast: () => {
        const { driverProfile, gpsInterval } = get();
        if (gpsInterval) clearInterval(gpsInterval);

        const id = setInterval(() => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const { latitude: lat, longitude: lng } = pos.coords;
                        set({ currentLocation: { lat, lng } });
                        driverApi.sendGps(driverProfile.id, lat, lng).catch(() => { });
                    },
                    () => { },
                    { enableHighAccuracy: true }
                );
            }
        }, 5000);
        set({ gpsInterval: id });
    },

    stopGpsBroadcast: () => {
        const { gpsInterval } = get();
        if (gpsInterval) {
            clearInterval(gpsInterval);
            set({ gpsInterval: null });
        }
    },

    markPickup: async (orderId) => {
        const { driverProfile } = get();
        if (!driverProfile) return;
        try {
            await driverApi.markPickup(driverProfile.id, orderId);
            toast.success('Order picked up! 📦');
        } catch (err) {
            toast.error('Failed to mark pickup');
        }
    },

    markDelivered: async (orderId) => {
        const { driverProfile } = get();
        if (!driverProfile) return;
        try {
            await driverApi.markDelivered(driverProfile.id, orderId);
            toast.success('Order delivered! ✅');
        } catch (err) {
            toast.error('Failed to mark delivered');
        }
    },

    setDriverProfile: (profile) => {
        localStorage.setItem('driverProfile', JSON.stringify(profile));
        set({ driverProfile: profile });
    },
}));

export default useDriverStore;
