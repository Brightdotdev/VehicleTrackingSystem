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

interface Location {
  longitude: number;
  latitude: number;
}

interface MapProps {
  location?: Location; // Single location object
  zoom?: number;       // Optional zoom level
  markerText?: string; // Optional text for the marker popup
}

const Map = ({ location, zoom = 13, markerText = 'Location' }: MapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Convert location object to Leaflet's expected format [lat, lng]
  const latLng = location ? [location.latitude, location.longitude] as [number, number] : undefined;

  useEffect(() => {
    // Initialize map only on client side
    const map = L.map('map', { zoomControl: false }).setView(
      latLng || [51.505, -0.09], 
      zoom
    );
    mapRef.current = map;

    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, [zoom]);

  useEffect(() => {
    if (!mapRef.current || !latLng) return;

    // Clear previous marker
    if (markerRef.current) {
      mapRef.current.removeLayer(markerRef.current);
    }

    // Add new marker if location is provided
    markerRef.current = L.marker(latLng).addTo(mapRef.current);
    markerRef.current.bindPopup(markerText);
    mapRef.current.setView(latLng, zoom);

  }, [latLng, zoom, markerText]);

  return <div id="map" style={{ height: '98%', width: '99%', borderRadius: '1rem' }} />;
};

export default Map;