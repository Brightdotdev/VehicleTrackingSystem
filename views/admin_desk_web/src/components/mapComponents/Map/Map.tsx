'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for marker icon 404s in Next.js
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { Info } from 'lucide-react';
import Link from 'next/link';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src ?? markerIcon2x,
  iconUrl: markerIcon.src ?? markerIcon,
  shadowUrl: markerShadow.src ?? markerShadow,
});

type LatLng = [number, number];

const Map = () => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const [mapFailed, setMapFailed] = useState(false);
  const [locations, setLocations] = useState<LatLng[] | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulated API fetch
  useEffect(() => {
    setLoading(true);
    const fetchLocations = async () => {
      try {
        // Simulated network delay
        await new Promise(res => setTimeout(res, 1500));

        // Replace with your real API call
        const apiData = [
          [51.505, -0.09],
          [51.51, -0.1],
          [51.52, -0.12],
          [51.5, -0.08],
          [51.515, -0.11],
        ];

        // Validate and cast
        const validLocations: LatLng[] = apiData.filter(
          (coords): coords is LatLng => Array.isArray(coords) && coords.length === 2
        );

        setLocations(validLocations);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
        setLocations(null);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  // Map initialization
  useEffect(() => {
    if (!locations || locations.length === 0) return;

    try {
      const map = L.map('map', { zoomControl: false }).setView(locations[0], 13);
      mapRef.current = map;

      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      });

      tileLayer.on('tileerror', () => {
        console.error('Tile failed to load — possible rate limit.');
        setMapFailed(true);
      });

      tileLayer.addTo(map);

      markersRef.current = locations.map((loc, idx) => {
        const marker = L.marker(loc).addTo(map);
        marker.bindPopup(`Marker #${idx + 1}<br>Lat: ${loc[0]}, Lng: ${loc[1]}`);
        return marker;
      });

      map.fitBounds(L.latLngBounds(locations), { padding: [30, 30] });

      return () => {
        markersRef.current.forEach(marker => map.removeLayer(marker));
        map.remove();
      };
    } catch (err) {
      console.error('Map failed to initialize:', err);
      setMapFailed(true);
    }
  }, [locations]);

  // Loading Skeleton
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background2  to-background animate-shimmer" />
        <p className="z-10 font-medium">Loading map...</p>
      </div>
    );
  }

  // Fallbacks
  if (mapFailed || locations === null) {
    return (
      <section className="flex flex-col gap-4 items-center justify-center h-full w-md">
        <Info/>

   <p className="subtitleText2 font-semibold">

              {locations === null
            ? 'Looks like the vehicle Locations are unavalable'
            : "Hm...we can't acces the map right now"}
        </p>
  
      <Link href="vehicles?tab=vehicles" className='mutedText underline hover:underline-offset-4 underline-offset-3'>
              {locations === null
            ? 'Get the veehicles manually'
            : 'Just check the vehicle page'}
  
      </Link>      
   
      </section>
    );
  }

  return <div id="map" style={{ height: '98%', width: '99%', borderRadius: '1rem' }} />;
};

export default Map;
