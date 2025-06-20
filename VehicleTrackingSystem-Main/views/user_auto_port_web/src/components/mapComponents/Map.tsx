'use client'; // or use dynamic import in Pages Router

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const position: LatLngExpression = [6.5244, 3.3792]; // Lagos, Nigeria

export default function MapView() {
  return (
    <MapContainer center={position} zoom={16} style={{ height: '100vh', width: '100%' }}>
      {/* OpenStreetMap tile layer */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          You are here! 🎯
        </Popup>
      </Marker>
    </MapContainer>
  );
}
