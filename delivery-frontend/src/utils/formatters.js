import { ORDER_STATUS_CONFIG } from './constants';

export function formatDate(dateString) {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export function formatTime(dateString) {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function formatDateTime(dateString) {
    if (!dateString) return '—';
    return `${formatDate(dateString)}, ${formatTime(dateString)}`;
}

export function formatRelativeTime(dateString) {
    if (!dateString) return '—';
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
}

export function getStatusConfig(status) {
    return ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.PENDING;
}

export function truncateAddress(address, maxLen = 40) {
    if (!address) return '—';
    return address.length > maxLen ? address.substring(0, maxLen) + '...' : address;
}

export function parseTrackingLocation(locationString) {
    if (!locationString) return null;
    try {
        const parsed = JSON.parse(locationString);
        return { lat: parsed.lat, lng: parsed.lng };
    } catch {
        const parts = locationString.split(',');
        if (parts.length === 2) {
            return { lat: parseFloat(parts[0]), lng: parseFloat(parts[1]) };
        }
        return null;
    }
}
