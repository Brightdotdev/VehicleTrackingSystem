'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

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
  // You'll pass location from your API request
  location?: Location;
  zoom?: number;
  markerText?: string;
}

const Map = ({ location, zoom = 13, markerText = 'Location' }: MapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [loading, setLoading] = useState(true);
  const [mapFailed, setMapFailed] = useState(false);

  // Convert location object to Leaflet's expected format [lat, lng]
  const latLng = location
    ? ([location.latitude, location.longitude] as [number, number])
    : undefined;

  // Simulate loading state for fetching location
  useEffect(() => {
    if (location) {
      setTimeout(() => setLoading(false), 500); // Slight delay for effect
    } else {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    if (loading || !latLng) return;

    try {
      const map = L.map('map', { zoomControl: false }).setView(latLng, zoom);
      mapRef.current = map;

      const tileLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      );

      // Catch tile load errors (rate limit, offline, etc.)
      tileLayer.on('tileerror', () => {
        console.error('Tile failed to load — possible rate limit.');
        setMapFailed(true);
      });

      tileLayer.addTo(map);

      // Add marker
      markerRef.current = L.marker(latLng).addTo(map);
      markerRef.current.bindPopup(markerText);

      return () => {
        if (markerRef.current) map.removeLayer(markerRef.current);
        map.remove();
      };
    } catch (err) {
      console.error('Map failed to initialize:', err);
      setMapFailed(true);
    }
  }, [latLng, zoom, markerText, loading]);

  // Loading shimmer
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer" />
        <p className="z-10 text-gray-500 font-medium">Loading map...</p>
      </div>
    );
  }

  // Fallback for failures or missing data
  if (mapFailed || !latLng) {
    return (
      <div className="flex items-center justify-center h-full bg-red-50 rounded-lg">
        <p className="text-red-600 font-semibold">
          {!latLng
            ? 'No location data available.'
            : 'Map failed to load. Please try again later.'}
        </p>
      </div>
    );
  }

  return <div id="map" style={{ height: '98%', width: '99%', borderRadius: '1rem' }} />;
};

export default Map;
