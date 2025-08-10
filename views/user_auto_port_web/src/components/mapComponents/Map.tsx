'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Info } from 'lucide-react';

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
  if (mapFailed || !latLng) {
    return (
      <section className="flex flex-col gap-4 items-center justify-center h-full w-md">
        <Info/>

   <p className="subtitleText2 font-semibold">

              {!latLng === null
            ? 'Looks like the vehicle Locations are unavalable'
            : "Hm...we can't acces the map right now"}
        </p>
  
      <p  className='mutedText'>
              {latLng === null
            ? 'Your dispatch Location is not Avaliable right now'
            : 'Apologies the map is not avaliable right now'}
  
      </p>      
   
      </section>
    );
  }


  return <div id="map" style={{ height: '98%', width: '99%', borderRadius: '1rem' }} />;
};

export default Map;
