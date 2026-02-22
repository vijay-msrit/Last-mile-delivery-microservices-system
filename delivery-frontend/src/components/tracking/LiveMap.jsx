import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import { MAP_TILE_URL, DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../../utils/constants';
import 'leaflet/dist/leaflet.css';

// Fix default icon path issue in Leaflet + Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom driver marker icon
const driverIcon = new L.DivIcon({
    html: `<div style="
    width:36px;height:36px;border-radius:50%;
    background:linear-gradient(135deg,#FF5200,#FF7A33);
    display:flex;align-items:center;justify-content:center;
    font-size:18px;box-shadow:0 0 12px rgba(255,82,0,0.5);
    border:3px solid white;
    animation:markerPulse 2s ease infinite;
  ">🚗</div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
});

const pickupIcon = new L.DivIcon({
    html: `<div style="
    width:32px;height:32px;border-radius:50%;
    background:#34D399;display:flex;align-items:center;justify-content:center;
    font-size:16px;border:2px solid white;box-shadow:0 2px 8px rgba(52,211,153,0.3);
  ">📦</div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

const deliveryIcon = new L.DivIcon({
    html: `<div style="
    width:32px;height:32px;border-radius:50%;
    background:#60A5FA;display:flex;align-items:center;justify-content:center;
    font-size:16px;border:2px solid white;box-shadow:0 2px 8px rgba(96,165,250,0.3);
  ">🏠</div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

// Auto-pan to driver position
function FlyToDriver({ position }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo([position.lat, position.lng], map.getZoom(), { duration: 1 });
        }
    }, [position, map]);
    return null;
}

export default function LiveMap({
    driverLocation,
    pickupLocation,
    deliveryLocation,
    height = 400,
    autoFly = true,
}) {
    const center = driverLocation
        ? [driverLocation.lat, driverLocation.lng]
        : pickupLocation
            ? [pickupLocation.lat, pickupLocation.lng]
            : DEFAULT_MAP_CENTER;

    return (
        <div
            style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--surface-border)',
            }}
        >
            <MapContainer
                center={center}
                zoom={DEFAULT_MAP_ZOOM}
                style={{ height, width: '100%' }}
                zoomControl={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                    url={MAP_TILE_URL}
                />

                {autoFly && driverLocation && <FlyToDriver position={driverLocation} />}

                {/* Driver Marker */}
                {driverLocation && (
                    <Marker position={[driverLocation.lat, driverLocation.lng]} icon={driverIcon}>
                        <Popup>
                            <strong>Driver Location</strong>
                            <br />
                            Lat: {driverLocation.lat.toFixed(4)}, Lng: {driverLocation.lng.toFixed(4)}
                        </Popup>
                    </Marker>
                )}

                {/* Pickup Marker */}
                {pickupLocation && (
                    <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={pickupIcon}>
                        <Popup>📦 Pickup Point</Popup>
                    </Marker>
                )}

                {/* Delivery Marker */}
                {deliveryLocation && (
                    <Marker position={[deliveryLocation.lat, deliveryLocation.lng]} icon={deliveryIcon}>
                        <Popup>🏠 Delivery Point</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}
