import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export function FitBounds({ vehicles } : { vehicles: { lat: number, lng: number }[] }) {
  const map = useMap();

  useEffect(() => {
    if (vehicles.length > 0) {
      const bounds = L.latLngBounds(vehicles.map(v => [v.lat, v.lng]));
      map.fitBounds(bounds, { padding: [100, 100] });
    }
  }, [vehicles, map]);

  return null; 
}
