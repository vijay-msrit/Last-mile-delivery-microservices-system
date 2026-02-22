import { useEffect, useState, useRef, useCallback } from 'react';
import { trackingApi } from '../api/trackingApi';
import { parseTrackingLocation } from '../utils/formatters';
import { TRACKING_POLL_INTERVAL } from '../utils/constants';

export default function useDriverLocation(driverId) {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const intervalRef = useRef(null);

    const fetchLocation = useCallback(async () => {
        if (!driverId) return;
        try {
            const res = await trackingApi.getDriverLocation(driverId);
            const loc = parseTrackingLocation(res.data);
            if (loc) {
                setLocation(loc);
                setError(null);
            }
        } catch (err) {
            setError('Unable to fetch location');
        } finally {
            setLoading(false);
        }
    }, [driverId]);

    useEffect(() => {
        if (!driverId) return;

        fetchLocation();
        intervalRef.current = setInterval(fetchLocation, TRACKING_POLL_INTERVAL);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [driverId, fetchLocation]);

    return { location, loading, error };
}
