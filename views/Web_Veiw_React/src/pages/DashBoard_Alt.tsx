// // This is a backup of the modern dashboard design. To use it, uncomment the code below.
// /*
// // NOTE: To enable the map, install dependencies with:
// // npm install react-leaflet leaflet
// import React, { useEffect, useState, useRef } from "react";
// import { MapContainer, TileLayer, Marker, Polygon, useMap, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import type { JSX } from "react/jsx-runtime";
// import type { LatLngExpression } from "leaflet";
// import { useNavigate } from 'react-router-dom';
// import L from 'leaflet';

// // Fix for default marker icon
// // ... (rest of the file content, as in DashBoard.tsx) ...
// */
// // NOTE: To enable the map, install dependencies with:
// // npm install react-leaflet leaflet
// import React, { useEffect, useState, useRef } from "react";
// import { MapContainer, TileLayer, Marker, Polygon, useMap, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import type { JSX } from "react/jsx-runtime";
// import type { LatLngExpression } from "leaflet";
// import { useNavigate } from 'react-router-dom';
// import L from 'leaflet';

// // Fix for default marker icon
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// // Custom vehicle marker icon
// const vehicleIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41]
// });

// interface Vehicle {
//   id: string;
//   name: string;
//   status: 'active' | 'idle' | 'maintenance';
//   location: [number, number];
//   driver: string;
//   lastUpdate: string;
//   speed: number;
//   destination: string;
//   image: string;
// }

// // Mock data for vehicles
// const mockVehicles: Vehicle[] = [
//   {
//     id: "VH001",
//     name: "Delivery Van 1",
//     status: "active",
//     location: [40.732, -74.06],
//     driver: "John Smith",
//     lastUpdate: "2 mins ago",
//     speed: 45,
//     destination: "Central Park",
//     image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
//   },
//   {
//     id: "VH002",
//     name: "Truck 1",
//     status: "idle",
//     location: [40.74, -74.05],
//     driver: "Mike Johnson",
//     lastUpdate: "5 mins ago",
//     speed: 0,
//     destination: "Docklands",
//     image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
//   },
//   {
//     id: "VH003",
//     name: "Van 2",
//     status: "maintenance",
//     location: [40.73, -74.08],
//     driver: "Sarah Williams",
//     lastUpdate: "1 hour ago",
//     speed: 0,
//     destination: "Service Center",
//     image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"
//   }
// ];

// const areaPolygon: LatLngExpression[] = [
//   [40.735, -74.09],
//   [40.74, -74.07],
//   [40.74, -74.04],
//   [40.73, -74.03],
//   [40.72, -74.05],
//   [40.72, -74.08],
//   [40.735, -74.09]
// ];

// // Helper to update map center
// function SetViewOnLocation({ position }: { position: LatLngExpression }) {
//   const map = useMap();
//   useEffect(() => {
//     if (position) map.setView(position, 13);
//   }, [map, position]);
//   return null;
// }

// export const Dashboard = (): JSX.Element => {
//   const [position, setPosition] = useState<LatLngExpression>([40.73, -74.06]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(mockVehicles[0]);
//   const [vehicles] = useState<Vehicle[]>(mockVehicles);
//   const notifications: string[] = [];
//   const notifRef = useRef<HTMLDivElement>(null);
//   const navigate = useNavigate();
//   const [showVehiclesPanel, setShowVehiclesPanel] = useState(true);

//   // Close notification popup when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
//         setShowNotifications(false);
//       }
//     }
//     if (showNotifications) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [showNotifications]);

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
//         () => setPosition([40.73, -74.06])
//       );
//     } else {
//       setPosition([40.73, -74.06]);
//     }
//   }, []);

//   const handleRefresh = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
//         () => setPosition([40.73, -74.06])
//       );
//     } else {
//       setPosition([40.73, -74.06]);
//     }
//   };

//   const getStatusColor = (status: Vehicle['status']) => {
//     switch (status) {
//       case 'active': return 'bg-green-500';
//       case 'idle': return 'bg-yellow-500';
//       case 'maintenance': return 'bg-red-500';
//       default: return 'bg-gray-500';
//     }
//   };

//   // Helper to get a mock address for a vehicle
//   const getVehicleAddress = (vehicle: Vehicle) => {
//     // You can replace this with real geocoding if needed
//     if (!vehicle) return '';
//     if (vehicle.id === 'VH001') return '123 Main St, New York, NY';
//     if (vehicle.id === 'VH002') return '456 Docklands Ave, New York, NY';
//     if (vehicle.id === 'VH003') return '789 Service Rd, New York, NY';
//     return 'Unknown Location';
//   };

//   return (
//     <div className="relative min-h-screen bg-[#f7fafd] flex flex-col items-center justify-center">
//       {/* Top Bar: Only show when a vehicle is selected */}
//       {selectedVehicle && (
//         <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[90vw] max-w-3xl z-30">
//           <div className="flex flex-wrap items-center justify-between bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg px-6 py-4 border border-gray-100 gap-4">
//             <div className="flex-1 flex flex-wrap items-center gap-4 min-w-0">
//               <span className="text-blue-700 font-bold text-lg truncate">{selectedVehicle.name}</span>
//               <span className="text-gray-700 font-medium truncate">{getVehicleAddress(selectedVehicle)}</span>
//               <span className={`font-semibold px-3 py-1 rounded-lg text-sm ${selectedVehicle.status === 'active' ? 'bg-green-100 text-green-600' : selectedVehicle.status === 'idle' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>{selectedVehicle.status}</span>
//               <span className="text-gray-500 font-medium">Speed: {selectedVehicle.speed} km/h</span>
//               <span className="text-gray-500 font-medium">Last update: {selectedVehicle.lastUpdate}</span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Map and Card Layout */}
//       <div className="flex w-full h-[80vh] max-w-7xl mt-32 relative z-10">
//         {/* Map */}
//         <div className="flex-1 rounded-3xl overflow-hidden shadow-xl bg-white">
//           <MapContainer
//             center={position}
//             zoom={13}
//             scrollWheelZoom={true}
//             className="w-full h-full min-h-[500px]"
//             style={{ height: "100%", width: "100%" }}
//           >
//             <TileLayer
//               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />
//             <Polygon positions={areaPolygon} pathOptions={{ color: '#3b82f6', fillOpacity: 0.1, weight: 2 }} />
//             {vehicles.map((vehicle, idx) => (
//               <Marker
//                 key={vehicle.id}
//                 position={vehicle.location}
//                 icon={vehicleIcon}
//                 eventHandlers={{
//                   click: () => setSelectedVehicle(vehicle)
//                 }}
//               >
//                 <Popup>
//                   <div className="p-2">
//                     <h3 className="font-semibold">{vehicle.name}</h3>
//                     <p className="text-sm">Driver: {vehicle.driver}</p>
//                     <p className="text-sm">Status: {vehicle.status}</p>
//                     <p className="text-sm">Speed: {vehicle.speed} km/h</p>
//                   </div>
//                 </Popup>
//               </Marker>
//             ))}
//             <SetViewOnLocation position={position} />
//           </MapContainer>
//         </div>
//         {/* Right Card */}
//         <div className="w-[370px] max-w-full flex flex-col justify-center ml-6">
//           {selectedVehicle && (
//             <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 flex flex-col gap-4 border border-gray-100">
//               <div className="rounded-xl overflow-hidden h-40 w-full mb-2">
//                 <img src={selectedVehicle.image} alt={selectedVehicle.name} className="object-cover w-full h-full" />
//               </div>
//               <div className="flex flex-col gap-1">
//                 <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700 w-fit mb-1 capitalize">{selectedVehicle.status}</span>
//                 <h2 className="text-xl font-bold text-gray-800">{selectedVehicle.name}</h2>
//                 <p className="text-gray-500 text-sm">{selectedVehicle.destination}</p>
//                 <div className="flex gap-2 mt-2">
//                   <span className="text-gray-700 text-sm font-medium">Driver:</span>
//                   <span className="text-gray-800 text-sm">{selectedVehicle.driver}</span>
//                 </div>
//                 <div className="flex gap-2">
//                   <span className="text-gray-700 text-sm font-medium">Speed:</span>
//                   <span className="text-gray-800 text-sm">{selectedVehicle.speed} km/h</span>
//                 </div>
//                 <div className="flex gap-2">
//                   <span className="text-gray-700 text-sm font-medium">Last Update:</span>
//                   <span className="text-gray-800 text-sm">{selectedVehicle.lastUpdate}</span>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 mt-4">
//                 <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Agent" className="w-10 h-10 rounded-full object-cover" />
//                 <div>
//                   <div className="text-gray-800 font-semibold text-sm">Agent</div>
//                   <div className="text-gray-600 text-xs">Lisa Richards</div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//       {/* Notification Button: Fixed and always visible */}
//       <div className="fixed top-6 right-6 z-40" ref={notifRef}>
//         <button
//           className="w-[54px] h-[54px] bg-[#484848] rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 relative"
//           onClick={() => setShowNotifications((prev) => !prev)}
//           aria-label="Show notifications"
//         >
//           <span className="text-white text-2xl">🔔</span>
//         </button>
//         {/* Notification Popup */}
//         {showNotifications && (
//           <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
//             <div className="font-semibold text-lg mb-2 text-gray-800">Notifications</div>
//             {notifications.length === 0 ? (
//               <div className="text-gray-500 text-sm">No notifications</div>
//             ) : (
//               <ul className="space-y-2">
//                 {notifications.map((note, idx) => (
//                   <li key={idx} className="text-gray-700 text-sm">{note}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         )}
//       </div>
//       {/* Vehicle List Panel */}
//       <div className={`fixed bottom-6 left-6 z-40 w-[400px] bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-300 ${showVehiclesPanel ? '' : 'max-h-16 overflow-hidden'}`}>
//         <div className="p-4 border-b border-gray-200 flex items-center justify-between">
//           <h2 className="text-xl font-semibold text-gray-800">Active Vehicles</h2>
//           <button
//             className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors text-lg w-7 h-7 flex items-center justify-center"
//             onClick={() => setShowVehiclesPanel(v => !v)}
//             aria-label={showVehiclesPanel ? 'Collapse' : 'Expand'}
//           >
//             <span>{showVehiclesPanel ? '▲' : '▼'}</span>
//           </button>
//         </div>
//         {showVehiclesPanel && (
//           <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
//             {vehicles.map((vehicle) => (
//               <div
//                 key={vehicle.id}
//                 className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
//                   selectedVehicle?.id === vehicle.id ? 'bg-blue-50' : ''
//                 }`}
//                 onClick={() => setSelectedVehicle(vehicle)}
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="font-medium text-gray-900">{vehicle.name}</h3>
//                     <p className="text-sm text-gray-500">{vehicle.driver}</p>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div className={`w-3 h-3 rounded-full ${getStatusColor(vehicle.status)}`} />
//                     <span className="text-sm text-gray-600">{vehicle.status}</span>
//                   </div>
//                 </div>
//                 <div className="mt-2 text-sm text-gray-600">
//                   <p>Speed: {vehicle.speed} km/h</p>
//                   <p>Last Update: {vehicle.lastUpdate}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       {/* Bottom Center Navigation Buttons: Fixed and always visible */}
//       <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-6 bg-white rounded-2xl shadow-lg px-8 py-3 z-50 border border-gray-200">
//         <button
//           className="w-14 h-14 flex items-center justify-center rounded-xl bg-gray-200 shadow-md border border-gray-300 hover:scale-105 hover:brightness-105 transition-transform duration-200 text-2xl"
//           aria-label="Refresh"
//           onClick={handleRefresh}
//         >
//           ↻
//         </button>
//         <button
//           className="w-14 h-14 flex items-center justify-center rounded-xl bg-blue-600 text-white shadow-md border border-blue-400 hover:scale-105 hover:brightness-105 transition-transform duration-200 text-2xl"
//           aria-label="Map"
//           disabled
//         >
//           🗺️
//         </button>
//         <button
//           className="w-14 h-14 flex items-center justify-center rounded-xl bg-gray-200 shadow-md border border-gray-300 hover:scale-105 hover:brightness-105 transition-transform duration-200 text-2xl"
//           aria-label="Vehicles"
//           onClick={() => navigate('/vehicles')}
//         >
//           🚐
//         </button>
//       </div>
//     </div>
//   );
// };

// // End of backup
// /* 