import { create } from 'zustand';
import { orderApi } from '../api/orderApi';
import toast from 'react-hot-toast';

const useOrderStore = create((set, get) => ({
    orders: [],
    activeOrder: null,
    loading: false,
    error: null,

    fetchOrders: async () => {
        set({ loading: true });
        try {
            const res = await orderApi.getAllOrders();
            set({ orders: res.data, loading: false });
        } catch (err) {
            set({ error: 'Failed to fetch orders', loading: false });
            toast.error('Failed to load orders');
        }
    },

    placeOrder: async (userId, pickupAddress, deliveryAddress) => {
        set({ loading: true });
        try {
            const res = await orderApi.placeOrder(userId, pickupAddress, deliveryAddress);
            set((state) => ({
                orders: [res.data, ...state.orders],
                loading: false,
            }));
            toast.success('Order placed successfully! 🎉');
            return { success: true, order: res.data };
        } catch (err) {
            set({ loading: false });
            toast.error('Failed to place order');
            return { success: false };
        }
    },

    setActiveOrder: (order) => set({ activeOrder: order }),

    updateOrderFromWS: (updatedOrder) => {
        set((state) => ({
            orders: state.orders.map((o) =>
                o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o
            ),
            activeOrder:
                state.activeOrder?.id === updatedOrder.id
                    ? { ...state.activeOrder, ...updatedOrder }
                    : state.activeOrder,
        }));
    },

    updateOrderStatus: (orderId, status) => {
        set((state) => ({
            orders: state.orders.map((o) =>
                o.id === orderId ? { ...o, status } : o
            ),
            activeOrder:
                state.activeOrder?.id === orderId
                    ? { ...state.activeOrder, status }
                    : state.activeOrder,
        }));
    },
}));

export default useOrderStore;
