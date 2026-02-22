import { useEffect, useRef, useCallback } from 'react';
import { WS_NOTIFICATION_URL } from '../utils/constants';
import useOrderStore from '../store/orderStore';
import useNotificationStore from '../store/notificationStore';
import toast from 'react-hot-toast';

const EVENT_ICONS = {
    ORDER_CREATED: '📦',
    DRIVER_ASSIGNED: '🚗',
    ORDER_PICKED_UP: '📬',
    ORDER_DELIVERED: '✅',
};

export default function useWebSocket() {
    const wsRef = useRef(null);
    const reconnectTimeout = useRef(null);
    const reconnectAttempts = useRef(0);

    const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);
    const updateOrderFromWS = useOrderStore((s) => s.updateOrderFromWS);
    const addNotification = useNotificationStore((s) => s.addNotification);

    const handleMessage = useCallback((event) => {
        const raw = event.data;
        const colonIdx = raw.indexOf(': ');
        if (colonIdx === -1) return;

        const type = raw.substring(0, colonIdx);
        const dataStr = raw.substring(colonIdx + 2);
        const icon = EVENT_ICONS[type] || '🔔';

        let data;
        try {
            data = JSON.parse(dataStr);
        } catch {
            data = { message: dataStr };
        }

        // Add to notification store
        addNotification({ type, data, icon });

        // Update order store based on event type
        switch (type) {
            case 'ORDER_CREATED':
                toast(`${icon} New order created`, { icon });
                break;
            case 'DRIVER_ASSIGNED':
                if (data.orderId) updateOrderStatus(data.orderId, 'ASSIGNED');
                toast(`${icon} Driver assigned to order`, { icon });
                break;
            case 'ORDER_PICKED_UP':
                if (data.orderId) updateOrderStatus(data.orderId, 'PICKED_UP');
                toast(`${icon} Order picked up`, { icon });
                break;
            case 'ORDER_DELIVERED':
                if (data.orderId) updateOrderStatus(data.orderId, 'DELIVERED');
                toast(`${icon} Order delivered!`, { icon });
                break;
            default:
                break;
        }
    }, [updateOrderStatus, updateOrderFromWS, addNotification]);

    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) return;

        const ws = new WebSocket(WS_NOTIFICATION_URL);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('[WS] Connected to notification service');
            reconnectAttempts.current = 0;
        };

        ws.onmessage = handleMessage;

        ws.onclose = () => {
            console.log('[WS] Disconnected, scheduling reconnect...');
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
            reconnectTimeout.current = setTimeout(() => {
                reconnectAttempts.current += 1;
                connect();
            }, delay);
        };

        ws.onerror = (err) => {
            console.error('[WS] Error:', err);
            ws.close();
        };
    }, [handleMessage]);

    useEffect(() => {
        connect();
        return () => {
            if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
            if (wsRef.current) wsRef.current.close();
        };
    }, [connect]);

    return wsRef;
}
