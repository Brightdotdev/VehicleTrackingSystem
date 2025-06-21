import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BottomNavBar } from '../components/BottomNavBar';
import { BellIcon, ArrowLeft } from 'lucide-react';
import { NotificationDropdown } from '../components/NotificationDropdown';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';

// Combined interface for more detailed dispatch view
// TODO: This should be a unified type from a central types file
interface DispatchViewDetails {
  id: string;
  vehicleName: string;
  status: "Active" | "Completed" | "Rejected";
  requestDate: string;
  reason: string;
  endTime?: string;
  rating?: number;
  // Other properties from DispatchHistoryItem can be added if needed
}

// TODO: Replace mock dispatch data with real dispatch passed from HistoryPage or API
const mockDispatchDetails: DispatchViewDetails = {
    id: "D-204",
    vehicleName: "Fallback Vehicle",
    reason: "Transport",
    requestDate: "2025-06-20T10:30:00Z",
    endTime: "2025-06-20T11:00:00Z",
    status: "Active",
    rating: 4.5
};

const DetailRow = ({ label, value, valueStyle }: { label: string; value: React.ReactNode; valueStyle?: React.CSSProperties }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '12px 0' }}>
        <span style={{ color: '#E0E0E0', fontSize: '16px' }}>{label}</span>
        <div style={valueStyle}>{value}</div>
    </div>
);

const StatusBadge = ({ status }: { status: "Active" | "Completed" | "Rejected" }) => {
    const isOngoing = status === 'Active';
    const text = isOngoing ? 'Ongoing' : 'Completed';
    // Style the "Completed" badge in green, and "Ongoing" in blue
    const backgroundColor = isOngoing ? '#007AFF' : '#34C759';
    const color = 'white';
    
    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px 14px',
            borderRadius: '16px',
            backgroundColor,
            color,
            fontWeight: 600,
            fontSize: '14px',
            transition: 'background-color 0.3s ease',
        }}>
            <motion.span 
                layout 
                style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, marginRight: '8px' }}
            />
            {text}
        </span>
    );
};

// TODO: Replace static coordinates with live vehicle location from backend when available
const vehiclePosition = {
  lat: 6.5244,
  lng: 3.3792
};

const mapContainerStyle = {
    height: "100%",
    width: "100%",
    borderRadius: '16px',
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    styles: [ // Light theme from Google Maps docs
        { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
        { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
        { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
        { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
        { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
        { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
        { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
        { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
        { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
        { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
        { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
        { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
        { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
        { featureType: "transit.station", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
        { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
    ]
};

export const DispatchView = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    });

    // Initialize dispatch data from location state or use mock data as fallback
    // TODO: Replace mock dispatch data with real dispatch passed from HistoryPage or API
    const [dispatchDetails, setDispatchDetails] = useState<DispatchViewDetails>(() => {
        const initialState = location.state?.dispatch;
        return initialState ? {
            ...initialState,
            reason: initialState.reason || "Transport",
            rating: initialState.rating,
            endTime: initialState.endTime,
        } : mockDispatchDetails;
    });

    const [infoWindowVisible, setInfoWindowVisible] = useState(false);

    // TODO: Replace with real PATCH request when backend is ready
    const handleTerminate = () => {
        setDispatchDetails(prevDetails => ({
            ...prevDetails,
            status: "Completed",
            endTime: new Date().toISOString(),
        }));
    };

    const isTerminated = dispatchDetails.status === 'Completed' || dispatchDetails.status === 'Rejected';
    const vehicleName = dispatchDetails?.vehicleName || "Vehicle";
    
    // Updated styles for responsive viewport fitting
    const pageStyle: React.CSSProperties = {
        background: '#121212',
        height: '100vh', // Use fixed viewport height
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"Inter", sans-serif',
        color: 'white',
        padding: '0 2vw', // Use viewport width for padding
        boxSizing: 'border-box',
        overflow: 'hidden', // Prevent scrolling on the main page
    };

    const headerStyle: React.CSSProperties = {
        width: '100%',
        maxWidth: '1440px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '2vh 0', // Use viewport height for padding
        flexShrink: 0, // Prevent header from shrinking
    };

    const mainContentStyle: React.CSSProperties = {
        flex: 1, // Allow main content to grow and fill available space
        width: '100%',
        maxWidth: '1440px',
        display: 'flex',
        gap: '2vw',
        paddingBottom: '2vh',
        overflow: 'hidden', // Prevent overflow within the main content area
    };

    const mapWrapperStyle: React.CSSProperties = {
        flex: 1, // Map takes up the majority of the space
        height: '100%',
        minWidth: 0, // Prevent flexbox from overflowing
    };

    const cardStyle: React.CSSProperties = {
        width: '380px',
        minWidth: '340px', // Prevent card from becoming too narrow
        background: '#2C2C2E',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        overflowY: 'auto', // Allow card to scroll if content overflows
    };

    if (loadError) return <div>Error loading maps</div>;

    return (
        <div style={pageStyle}>
            <header style={headerStyle}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    <ArrowLeft size={28} />
                </button>
                <h1 style={{ fontSize: '22px', fontWeight: 600 }}>Your Dispatch</h1>
                <div style={{ position: 'relative' }}>
                     <BellIcon size={28} />
                </div>
            </header>

            <main style={mainContentStyle}>
                 {/* Map container */}
                <motion.div 
                    style={mapWrapperStyle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {isLoaded ? (
                        <GoogleMap mapContainerStyle={mapContainerStyle} center={vehiclePosition} zoom={14} options={mapOptions}>
                           <Marker 
                                position={vehiclePosition} 
                                onMouseOver={() => setInfoWindowVisible(true)}
                                onMouseOut={() => setInfoWindowVisible(false)}
                                icon={{
                                    path: "M17.402 2.047a2.222 2.222 0 0 0-1.782-1.042H8.38a2.222 2.222 0 0 0-1.782 1.042L3 8.333v7.111C3 16.362 3.638 17 4.444 17h1.112c.805 0 1.444-.638 1.444-1.444v-1.112c0-.805.639-1.444 1.444-1.444h5.112c.805 0 1.444.639 1.444 1.444v1.112c0 .805.638 1.444 1.444 1.444h1.112c.805 0 1.444-.638 1.444-1.444V8.333L17.402 2.047zM6.667 11.278c-.736 0-1.333-.597-1.333-1.334 0-.736.597-1.333 1.333-1.333s1.333.597 1.333 1.333c0 .737-.597 1.334-1.333 1.334zm10.666 0c-.736 0-1.333-.597-1.333-1.334 0-.736.597-1.333 1.333-1.333s1.333.597 1.333 1.333c0 .737-.597 1.334-1.333 1.334z",
                                    fillColor: '#007AFF',
                                    fillOpacity: 1.0,
                                    strokeWeight: 0,
                                    rotation: 0,
                                    scale: 1.5,
                                    anchor: new window.google.maps.Point(12, 12),
                                }}
                            >
                                {infoWindowVisible && (
                                    <InfoWindow position={vehiclePosition}>
                                        <div style={{color: 'black'}}>
                                            <h4 style={{fontWeight: 'bold'}}>{vehicleName}</h4>
                                            <p>Status: On-route</p>
                                        </div>
                                    </InfoWindow>
                                )}
                            </Marker>
                        </GoogleMap>
                    ) : (
                         <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>Loading Map...</div>
                    )}
                </motion.div>
                
                {/* Details Card */}
                <motion.div 
                    layout 
                    style={cardStyle}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 style={{ fontSize: '20px', fontWeight: 700, textAlign: 'center', marginBottom: '16px', flexShrink: 0 }}>
                        {`${vehicleName}'s Dispatch`}
                    </h2>
                    
                    <DetailRow label="Dispatch Status" value={<StatusBadge status={dispatchDetails.status} />} />
                    <DetailRow label="Dispatch Reason" value={<span>{dispatchDetails.reason}</span>} />
                    <DetailRow label="Dispatch Request Time" value={<span>{new Date(dispatchDetails.requestDate).toLocaleString()}</span>} />
                    <DetailRow 
                        label="End Time" 
                        value={<span>{isTerminated && dispatchDetails.endTime ? new Date(dispatchDetails.endTime).toLocaleString() : 'N/A'}</span>} 
                    />
                    <DetailRow label="Dispatch Rating" value={<span>{dispatchDetails.rating || 'N/A'}</span>} />

                    <div style={{marginTop: 'auto', paddingTop: '20px'}}>
                        <button 
                            onClick={handleTerminate}
                            disabled={isTerminated}
                            style={{
                                width: '100%',
                                background: isTerminated ? '#555' : '#FF3B30',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '16px',
                                fontSize: '18px',
                                fontWeight: 700,
                                cursor: isTerminated ? 'not-allowed' : 'pointer',
                                boxShadow: isTerminated ? 'none' : '0 4px 12px rgba(255, 59, 48, 0.3)',
                                transition: 'background-color 0.3s ease',
                        }}>
                            {isTerminated ? 'Dispatch Terminated' : 'Terminate Dispatch'}
                        </button>
                    </div>
                </motion.div>
            </main>
            
            <div style={{flexShrink: 0}}>
                <BottomNavBar />
            </div>
        </div>
    );
};
