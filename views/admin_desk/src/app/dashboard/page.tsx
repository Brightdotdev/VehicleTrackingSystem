// MapView.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import { FitBounds } from '@/components/mapComponents/FitBounds ';
import { CarMarkerIcon } from '@/components/mapComponents/CarMarker';

// Fix default icon missing bug
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Vehicle type definition
interface Vehicle {
  id: string;
  name: string;
  lat: number;
  lng: number;
  trail: { lat: number; lng: number }[]; // past locations
}

export default function MapView() {
  // Initialize vehicle state
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: 'v1', name: 'Truck #1', lat: 6.5244, lng: 3.3792, trail: [] },
    { id: 'v2', name: 'Van #2', lat: 6.5300, lng: 3.3900, trail: [] }
  ]);

  // Simulate vehicle movements
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prevVehicles =>
        prevVehicles.map(vehicle => {
          // Small random movement
          const randomLatMove = (Math.random() - 0.5) * 0.001;
          const randomLngMove = (Math.random() - 0.5) * 0.001;

          const newLat = vehicle.lat + randomLatMove;
          const newLng = vehicle.lng + randomLngMove;

          return {
            ...vehicle,
            lat: newLat,
            lng: newLng,
            trail: [...vehicle.trail, { lat: vehicle.lat, lng: vehicle.lng }] // save old position
          };
        })
      );
    }, 3000); // every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <MapContainer center={[6.5244, 3.3792]} zoom={15} 
    zoomControl={false}
    style={{ height: '100vh', width: '100%' }}>
      {/* Background map tiles */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Loop through each vehicle */}
      {vehicles.map((vehicle) => (
        <div key={vehicle.id}>
          {/* Vehicle marker */}
          <Marker 
            position={[vehicle.lat, vehicle.lng]} 
            // If you want to use a custom icon, uncomment below
            // icon={CarMarkerIcon} 
          >
            <Popup>
              <div>
                <h2>{vehicle.name}</h2>
                <p>ID: {vehicle.id}</p>
              </div>
            </Popup>
          </Marker>

          {/* Fading trail */}
          {vehicle.trail.map((point, index) => {
            if (index === vehicle.trail.length - 1) return null; // skip last point

            const colorHue = Math.floor(Math.random() *  255)
            const opacity = (index + 1) / vehicle.trail.length;
            const color = `rgba(0, 0, ${colorHue}, ${opacity})`; // blue with variable opacity

            return (
              <Polyline
                key={index}
                positions={[
                  [vehicle.trail[index].lat, vehicle.trail[index].lng],
                  [vehicle.trail[index + 1].lat, vehicle.trail[index + 1].lng],
                ]}
                pathOptions={{ color: color, weight: 4 }}
              />
            );
          })}
        </div>
      ))}
    </MapContainer>
  );
}
