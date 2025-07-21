'use client'; // Mark as Client Component in Next.js 13+

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for marker icon 404s
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Set default icon paths
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src ?? markerIcon2x,
  iconUrl: markerIcon.src ?? markerIcon,
  shadowUrl: markerShadow.src ?? markerShadow,
});

type LatLng = [number, number];

interface MapProps {
  locations?: LatLng[]; // Optional array of locations to mark
}

const Map = ({ locations = [] }: MapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    // Initialize map only on client side
    const map = L.map('map', { zoomControl: false }).setView([51.505, -0.09], 13);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add markers for each location with a popup
    if (locations.length > 0) {
      markersRef.current = locations.map((loc, idx) => {
        const marker = L.marker(loc).addTo(map);
        marker.bindPopup(`Marker #${idx + 1}<br>Lat: ${loc[0]}, Lng: ${loc[1]}`);
        return marker;
      });
      // Fit map to markers
      const bounds = L.latLngBounds(locations);
      map.fitBounds(bounds, { padding: [30, 30] });
    }

    return () => {
      markersRef.current.forEach(marker => map.removeLayer(marker));
      map.remove();
    };
    // Only run on mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations]);

  return <div id="map" style={{ height: '98%', width: '99%', borderRadius: '1rem' }} />;
};

export default Map;