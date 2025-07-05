'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngTuple, map as createLeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect } from 'react';

interface MapViewProps {
  position: LatLngTuple;
}

export default function MapView({ position }: MapViewProps) {
  useEffect(() => {
    // Cleanup existing map instance if it exists
    const existing = document.querySelector('.leaflet-container');
    if (existing) {
      existing.remove();
    }
  }, []);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={position}
        zoom={16}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={position}>
          <Popup>Vehicle Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
