export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
export const WS_NOTIFICATION_URL = import.meta.env.VITE_WS_NOTIFICATION_URL || 'ws://localhost:8086/ws/notify';
export const TRACKING_POLL_INTERVAL = Number(import.meta.env.VITE_TRACKING_POLL_INTERVAL) || 3000;
export const MAP_TILE_URL = import.meta.env.VITE_MAP_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

export const ORDER_STATUSES = {
  PENDING: 'PENDING',
  ASSIGNED: 'ASSIGNED',
  PICKED_UP: 'PICKED_UP',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export const ORDER_STATUS_CONFIG = {
  PENDING: { label: 'Pending', color: 'var(--status-pending)', bg: 'var(--status-pending-bg)', icon: 'Clock' },
  ASSIGNED: { label: 'Driver Assigned', color: 'var(--status-assigned)', bg: 'var(--status-assigned-bg)', icon: 'UserCheck' },
  PICKED_UP: { label: 'Picked Up', color: 'var(--status-picked-up)', bg: 'var(--status-picked-up-bg)', icon: 'Package' },
  DELIVERED: { label: 'Delivered', color: 'var(--status-delivered)', bg: 'var(--status-delivered-bg)', icon: 'CheckCircle' },
  CANCELLED: { label: 'Cancelled', color: 'var(--status-cancelled)', bg: 'var(--status-cancelled-bg)', icon: 'XCircle' },
};

export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  DRIVER: 'DRIVER',
  ADMIN: 'ADMIN',
};

export const DEFAULT_MAP_CENTER = [12.9716, 77.5946]; // Bangalore
export const DEFAULT_MAP_ZOOM = 13;
