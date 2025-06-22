import type { JSX } from "react";
import { BellIcon, ArrowLeft, MapPinIcon, ShieldIcon, AlertTriangleIcon, HistoryIcon, MapIcon, CarIcon } from "lucide-react";
import { BottomNavBar } from "../components/BottomNavBar";
import { NotificationDropdown } from "../components/NotificationDropdown";
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { mockApiService } from '../lib/mockData';
import type { VehicleData } from '../components/VehicleCard';

export interface IHandleDispatchPageProps {
  className?: string;
  style?: any;
}

export const HandleDispatchPage = ({
  className,
  style,
  ...props
}: IHandleDispatchPageProps): JSX.Element => {
  // Shrink factor for the card
  const shrink = 0.6;
  const baseW = 1440, baseH = 1059;
  const navigate = useNavigate();
  const { vehicleId } = useParams<{ vehicleId: string }>();

  // TODO: Replace with actual API state management when backend is ready
  const [vehicle, setVehicle] = useState<VehicleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Replace this useEffect with actual API call when backend is ready
  useEffect(() => {
    const fetchVehicleData = async () => {
      if (!vehicleId) {
        setError('Vehicle ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // TODO: Replace mockApiService.getVehicleById() with actual API call
        const vehicleData = await mockApiService.getVehicleById(vehicleId);

        if (!vehicleData) {
          setError('Vehicle not found');
          return;
        }

        setVehicle(vehicleData);
        setError(null);
      } catch (err) {
        setError('Failed to load vehicle data');
        console.error('Error fetching vehicle data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleData();
  }, [vehicleId]);

  const handleAcceptDispatch = async () => {
    if (!vehicle) return;
    
    try {
      // TODO: Replace with actual API call when backend is ready
      await mockApiService.handleDispatch(vehicle.id, 'approve');
      navigate('/requests');
    } catch (err) {
      console.error('Error accepting dispatch:', err);
    }
  };

  const handleRejectDispatch = async () => {
    if (!vehicle) return;
    
    try {
      // TODO: Replace with actual API call when backend is ready
      await mockApiService.handleDispatch(vehicle.id, 'reject');
      navigate('/requests');
    } catch (err) {
      console.error('Error rejecting dispatch:', err);
    }
  };

  if (loading) {
    return (
      <div style={{
        background: "#f0f0f0",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, Helvetica, Arial, sans-serif",
      }}>
        <div style={{ fontSize: 18, color: "#666" }}>Loading vehicle information...</div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div style={{
        background: "#f0f0f0",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, Helvetica, Arial, sans-serif",
      }}>
        <div style={{ fontSize: 18, color: "#ff0000" }}>{error || 'Vehicle not found'}</div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f0f0f0",
        minHeight: "100vh",
        width: "100vw",
        overflow: "auto",
        position: "relative",
        fontFamily: "Inter, Helvetica, Arial, sans-serif",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${shrink})`,
          width: baseW,
          height: baseH,
          minWidth: baseW,
          minHeight: baseH,
          maxWidth: baseW,
          maxHeight: baseH,
        }}
      >
        {/* Main white card background */}
        <div
          style={{
            background: "#fff",
            borderRadius: "10px",
            width: 1344,
            height: 951,
            position: "absolute",
            left: 48,
            top: 52,
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.18)",
          }}
        />
        {/* Top gray image area */}
        <div
          style={{
            background: "#adadad",
            borderRadius: "10px 10px 0 0",
            width: 1344,
            height: 256,
            position: "absolute",
            left: 48,
            top: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={vehicle.imageUrl}
            alt={`${vehicle.name} image`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        {/* Notification and back buttons */}
        <button
          onClick={() => navigate("/requests")}
          style={{
            background: "#484848",
            border: "none",
            borderRadius: "50%",
            width: 71,
            height: 71,
            position: "absolute",
            left: 33,
            top: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 2,
          }}
          aria-label="Back"
        >
          <ArrowLeft size={36} color="#fff" />
        </button>
        <div
          style={{
            background: "#484848",
            border: "none",
            borderRadius: "50%",
            width: 71,
            height: 71,
            position: "absolute",
            left: 1338,
            top: 33,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          <NotificationDropdown />
        </div>
        {/* Dispatchable badge */}
        <div
          style={{
            background: vehicle.dispatchable ? "rgba(0, 148, 22, 0.13)" : "rgba(148, 0, 0, 0.13)",
            borderRadius: 1000,
            padding: "0 32px",
            height: 46,
            position: "absolute",
            right: 48,
            top: "calc(256px - 20px)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ 
            color: vehicle.dispatchable ? "#005d00" : "#5d0000", 
            fontWeight: 600, 
            fontSize: 24, 
            marginRight: 8 
          }}>
            {vehicle.dispatchable ? "Dispatchable" : "NOT Dispatchable"}
          </span>
          <span style={{ 
            background: vehicle.dispatchable ? "rgba(0, 132, 35, 0.35)" : "rgba(132, 0, 0, 0.35)", 
            borderRadius: "50%", 
            width: 39, 
            height: 39, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center" 
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={vehicle.dispatchable ? "#005d00" : "#5d0000"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {vehicle.dispatchable ? <polyline points="20 6 9 17 4 12" /> : <line x1="18" y1="6" x2="6" y2="18" />}
            </svg>
          </span>
        </div>
        {/* Classified badge */}
        <div
          style={{
            background: "rgba(26, 0, 255, 0.16)",
            borderRadius: 1000,
            border: "1px solid rgba(0, 18, 109, 0.45)",
            padding: "0 32px",
            height: 39,
            position: "absolute",
            right: 48,
            top: "calc(256px + 70px)",
            display: "flex",
            alignItems: "center",
            
          }}
        >
          <span style={{ color: "#060060", fontWeight: 600, fontSize: 20 }}>CLASSIFIED</span>
        </div>
        {/* Car Name */}
        <div
          style={{
            color: "#000",
            fontWeight: 700,
            fontSize: 48,
            position: "absolute",
            left: 63,
            top: 326,
          }}
        >
          {vehicle.name}
        </div>
        {/* Info List */}
        <div style={{ position: "absolute", left: 77, top: 441 }}>
          {/* In Transit */}
          {vehicle.inTransit && (
            <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
              <MapPinIcon size={32} color="#484848" style={{ marginRight: 16 }} />
              <span style={{ fontWeight: 600, fontSize: 24, color: "#000" }}>In Transit</span>
            </div>
          )}
          {/* Health Score */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
            <ShieldIcon size={32} color="#484848" style={{ marginRight: 16 }} />
            <span style={{ fontWeight: 600, fontSize: 24, color: "#000" }}>
              Health Score : <span style={{ 
                color: vehicle.healthScore >= 75 ? "#00cb00" : 
                       vehicle.healthScore >= 50 ? "#cb8b00" : "#ff0000" 
              }}>
                {vehicle.healthScore}%
              </span>
            </span>
          </div>
          {/* Wild Cards */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
            <AlertTriangleIcon size={32} color="#484848" style={{ marginRight: 16 }} />
            <span style={{ fontWeight: 600, fontSize: 24, color: "#000" }}>
              Wild Cards : <span style={{ 
                color: vehicle.wildCards === "NONE" ? "#079f00" : "#9f0d00" 
              }}>
                {vehicle.wildCards}
              </span>
            </span>
          </div>
          {/* Dispatch Reason */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
            <span style={{ fontWeight: 600, fontSize: 24, color: "#000" }}>Dispatch Reason : Transport</span>
          </div>
          {/* Dispatch End time */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
            <span style={{ fontWeight: 600, fontSize: 24, color: "#000" }}>Dispatch End time : (theTime)</span>
          </div>
        </div>
        {/* Accept/Reject Buttons */}
        <button
          onClick={handleAcceptDispatch}
          disabled={!vehicle.dispatchable}
          style={{
            background: vehicle.dispatchable ? "#5852ff" : "#cccccc",
            color: "#fff",
            fontWeight: 600,
            fontSize: 22,
            border: "none",
            borderRadius: 12,
            width: 375,
            height: 57,
            position: "absolute",
            left: 118,
            top: 888,
            cursor: vehicle.dispatchable ? "pointer" : "not-allowed",
            boxShadow: "0 1.5px 6px #0001",
            transition: "background 0.18s",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: 10,
          }}
        >
          Accept Dispatch
        </button>
        <button
          onClick={handleRejectDispatch}
          style={{
            background: "#ff5252",
            color: "#fff",
            fontWeight: 600,
            fontSize: 22,
            border: "none",
            borderRadius: 12,
            width: 375,
            height: 57,
            position: "absolute",
            left: 942,
            top: 888,
            cursor: "pointer",
            boxShadow: "0 1.5px 6px #0001",
            transition: "background 0.18s",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: 10,
          }}
        >
          Reject Dispatch
        </button>
      </div>
      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};
