import React, { useState, useEffect } from "react";
import { ArrowLeft, BellIcon, Clock, Info, MapPin, Shield, AlertTriangle, Cog, Car } from "lucide-react";
import { BottomNavBar } from "../components/BottomNavBar";
import { NotificationDropdown } from "../components/NotificationDropdown";
import { useNavigate, useParams } from 'react-router-dom';
import { mockApiService } from '../lib/mockData';
import type { VehicleData } from '../components/VehicleCard';
import type { DispatchHistoryItem } from '../lib/mockData';

const shrink = 0.7; // Adjust as needed for best fit
const baseW = 1440, baseH = 1024;

const VehicleInfo = () => {
  const navigate = useNavigate();
  const { vehicleId } = useParams<{ vehicleId: string }>();

  // TODO: Replace with actual API state management when backend is ready
  const [vehicle, setVehicle] = useState<VehicleData | null>(null);
  const [dispatchHistory, setDispatchHistory] = useState<DispatchHistoryItem[]>([]);
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
        // TODO: Replace mockApiService calls with actual API calls
        const [vehicleData, historyData] = await Promise.all([
          mockApiService.getVehicleById(vehicleId),
          mockApiService.getDispatchHistory()
        ]);

        if (!vehicleData) {
          setError('Vehicle not found');
          return;
        }

        setVehicle(vehicleData);
        setDispatchHistory(historyData);
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

  if (loading) {
    return (
      <div style={{
        background: "#f8f9fb",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{ fontSize: 18, color: "#666" }}>Loading vehicle information...</div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div style={{
        background: "#f8f9fb",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{ fontSize: 18, color: "#ff0000" }}>{error || 'Vehicle not found'}</div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f8f9fb",
        minHeight: "100vh",
        width: "100vw",
        overflow: "auto",
        position: "relative",
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "58%",
          transform: `translate(-50%, -50%) scale(${shrink})`,
          width: baseW,
          height: baseH,
          minWidth: baseW,
          minHeight: baseH,
          maxWidth: baseW,
          maxHeight: baseH,
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            width: 700,
            height: 56,
            background: "#fff",
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            borderBottom: "1px solid #E0E0E0",
            borderRadius: 13,
          }}
        >
          <span
            style={{
              fontWeight: 600,
              fontSize: 28,
              color: "#222",
              letterSpacing: 0.5,
            }}
          >
            {vehicle.name}
          </span>
        </div>

        {/* Car Image Section */}
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

        {/* Navigation and notification buttons */}
        <button
          onClick={() => navigate("/vehicles")}
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
            top: 236,
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
              {vehicle.dispatchable ? <polyline points="20 6 9 17 4 12" /> : <line x1="5" y1="12" x2="19" y2="12" />}
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
            left: 60,
            top: 236,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Clock size={20} color="#060060" style={{ marginRight: 8 }} />
          <span style={{ color: "#060060", fontWeight: 600, fontSize: 20 }}>CLASSIFIED</span>
        </div>

        {/* Vehicle Metadata Section */}
        <div
          style={{
            position: "absolute",
            top: 340,
            left: 60,
            width: 600,
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            padding: "32px 36px 32px 36px",
          }}
        >
          <div
            style={{
              fontWeight: 600,
              fontSize: 20,
              color: "#222",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Info size={24} style={{ marginRight: 8 }} />
            Vehicle metadata :
          </div>
          
          {vehicle.inTransit && (
            <div
              style={{
                fontWeight: 500,
                fontSize: 18,
                color: "#222",
                marginBottom: 18,
                display: "flex",
                alignItems: "center",
              }}
            >
              <MapPin size={20} style={{ marginRight: 8 }} />
              In Transit
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
            <Shield size={20} style={{ marginRight: 8 }} />
            <span style={{ fontWeight: 600, fontSize: 18, color: "#222" }}>Health Score </span>
            <span style={{ color: "#FFB800", fontWeight: 600, fontSize: 18, marginLeft: 6 }}>:</span>
            <span style={{ color: "#FFB800", fontWeight: 600, fontSize: 18, marginLeft: 6 }}>{vehicle.healthScore}%</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
            <AlertTriangle size={20} style={{ marginRight: 8 }} />
            <span style={{ fontWeight: 600, fontSize: 18, color: "#222" }}>Wild Cards </span>
            <span style={{ color: vehicle.wildCards === "NONE" ? "#00A82D" : "#9f0d00", fontWeight: 600, fontSize: 18, marginLeft: 6 }}>:</span>
            <span style={{ color: vehicle.wildCards === "NONE" ? "#00A82D" : "#9f0d00", fontWeight: 600, fontSize: 18, marginLeft: 6 }}>{vehicle.wildCards}</span>
          </div>

          {vehicle.engineType && (
            <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
              <Cog size={20} style={{ marginRight: 8 }} />
              <span style={{ fontWeight: 600, fontSize: 18, color: "#222" }}>Engine Type: {vehicle.engineType}</span>
            </div>
          )}

          {vehicle.vehicleType && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Car size={20} style={{ marginRight: 8 }} />
              <span style={{ fontWeight: 600, fontSize: 18, color: "#222" }}>Vehicle Type: {vehicle.vehicleType}</span>
            </div>
          )}
        </div>

        {/* Dispatch History Section */}
        <div
          style={{
            position: "absolute",
            top: 340,
            left: 800,
            width: 600,
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            padding: "32px 36px 32px 36px",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 24,
              color: "#222",
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            Dispatch History
          </div>
          
          {/* History Items */}
          {dispatchHistory.slice(0, 4).map((item, index) => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", marginBottom: index < 3 ? 18 : 0 }}>
              <img
                src={item.userImage}
                alt="user"
                style={{ width: 36, height: 36, borderRadius: "50%", marginRight: 16 }}
              />
              <span style={{ fontWeight: 500, fontSize: 16, color: "#222", flex: 1 }}>
                {item.vehicleName} dispatch request
              </span>
              <div style={{ 
                background: item.status === "Active" ? "#D2F5D8" : 
                           item.status === "Completed" ? "#F5F3D2" : "#F5D2D2", 
                color: item.status === "Active" ? "#166000" : 
                       item.status === "Completed" ? "#605400" : "#600000", 
                borderRadius: 12, 
                fontWeight: 600, 
                fontSize: 16, 
                padding: "2px 18px", 
                marginLeft: 12 
              }}>
                {item.status.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};

export default VehicleInfo;
