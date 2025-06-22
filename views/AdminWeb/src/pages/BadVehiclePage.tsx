import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Bell,
  Clock,
  Info,
  MapPin,
  Shield,
  AlertTriangle,
  Cog,
  Car,
  Minus,
} from "lucide-react";
import { BottomNavBar } from "../components/BottomNavBar";
import { NotificationDropdown } from "../components/NotificationDropdown";
import { useNavigate, useParams } from 'react-router-dom';
import { mockApiService } from '../lib/mockData';
import type { VehicleData } from '../components/VehicleCard';
import type { DispatchHistoryItem } from '../lib/mockData';

const shrink = 0.65;
const baseW = 1440, baseH = 1024;

export const BadVehiclePage = () => {
  const navigate = useNavigate();
  const { vehicleId } = useParams<{ vehicleId: string }>();

  // TODO: Replace with actual API state management when backend is ready
  const [vehicle, setVehicle] = useState<VehicleData | null>(null);
  const [dispatchHistory, setDispatchHistory] = useState<DispatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);

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

  // TODO: Replace with actual API call when backend is ready
  const handleMarkForMaintenance = async () => {
    if (!vehicle) return;

    try {
      setMaintenanceLoading(true);
      // TODO: Replace mockApiService.markVehicleForMaintenance() with actual API call
      await mockApiService.markVehicleForMaintenance(vehicle.id);
      alert('Vehicle marked for maintenance successfully');
    } catch (err) {
      console.error('Error marking vehicle for maintenance:', err);
      alert('Failed to mark vehicle for maintenance');
    } finally {
      setMaintenanceLoading(false);
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
        fontFamily: "'Inter', sans-serif",
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
        fontFamily: "'Inter', sans-serif",
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
        fontFamily: "'Inter', sans-serif",
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
        }}
      >
        {/* Header */}
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
        >
          <ArrowLeft size={36} color="white" />
        </button>
        <div
          style={{
            textAlign: "center",
            background: "#dfdfdf",
            padding: "8px 40px",
            borderRadius: 8,
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
          }}
        >
          <span style={{ fontSize: 40, fontWeight: 600, color: "#000" }}>
            {vehicle.name}
          </span>
        </div>
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

        {/* Car Image */}
        <div
          style={{
            background: "#adadad",
            width: 1344,
            height: 256,
            position: "absolute",
            left: 48,
            top: 110,
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={vehicle.imageUrl}
            alt={`${vehicle.name} image`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 16,
              right: 16,
              background: "rgba(148, 0, 0, 0.13)",
              borderRadius: 1000,
              display: "flex",
              alignItems: "center",
              padding: "5px 15px",
            }}
          >
            <span
              style={{
                color: "#5d0000",
                fontSize: 20,
                fontWeight: 600,
                marginRight: 8,
              }}
            >
              NOT Dispatchable
            </span>
            <div
              style={{
                background: "rgba(132, 0, 0, 0.35)",
                borderRadius: "50%",
                width: 39,
                height: 39,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Minus size={24} color="#5d0000" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            position: "absolute",
            top: 380,
            left: 48,
            width: 1344,
            background: "white",
            borderRadius: "10px",
            padding: "20px",
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Left Panel */}
          <div style={{ width: "48%" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(26, 0, 255, 0.26)",
                border: "1px solid rgba(0, 18, 109, 0.45)",
                borderRadius: 1000,
                padding: "4px 20px",
                width: "fit-content",
                marginBottom: 20,
              }}
            >
              <Clock size={20} color="#060060" style={{ marginRight: 8 }} />
              <span style={{ color: "#060060", fontSize: 20, fontWeight: 600 }}>
                CLASSIFIED
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: 24, fontWeight: 600, marginBottom: 25 }}>
                <Info size={43} style={{ marginRight: 15 }} /> Vehicle metadata :
              </div>
              
              {vehicle.inTransit && (
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 24, fontWeight: 600, marginBottom: 25, paddingLeft: 4 }}>
                  <MapPin size={43} style={{ marginRight: 15 }} /> In Transit
                </div>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', fontSize: 24, fontWeight: 600, marginBottom: 25 }}>
                <Shield size={47} style={{ marginRight: 15 }} /> Health Score : <span style={{ color: "#900" }}>{vehicle.healthScore}%</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', fontSize: 24, fontWeight: 600, marginBottom: 25 }}>
                <AlertTriangle size={41} style={{ marginRight: 15 }} /> Wild Cards : <span style={{ color: "#900" }}>{vehicle.wildCards}</span>
              </div>
              
              {vehicle.engineType && (
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 24, fontWeight: 600, marginBottom: 25 }}>
                  <Cog size={43} style={{ marginRight: 15 }} /> Engine Type: {vehicle.engineType}
                </div>
              )}
              
              {vehicle.vehicleType && (
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 24, fontWeight: 600 }}>
                  <Car size={48} style={{ marginRight: 15 }} /> Vehicle Type: {vehicle.vehicleType}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div style={{ width: "48%", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <button
              onClick={handleMarkForMaintenance}
              disabled={maintenanceLoading}
              style={{
                background: maintenanceLoading ? "#ccc" : "#ff5252",
                color: "#f2f2f2",
                fontSize: 32,
                fontWeight: 600,
                padding: "8px 30px",
                borderRadius: 12,
                cursor: maintenanceLoading ? "not-allowed" : "pointer",
                border: "none",
                marginBottom: 20,
              }}
            >
              {maintenanceLoading ? "Processing..." : "Mark For Maintenance"}
            </button>

            <div
              style={{
                background: "#eeeeee",
                borderRadius: 12,
                width: "100%",
                padding: "20px",
              }}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: 12,
                  textAlign: "center",
                  padding: "10px",
                }}
              >
                <span
                  style={{ fontSize: 32, fontWeight: 600, color: "#202020" }}
                >
                  Dispatch History
                </span>
              </div>
              <div style={{ marginTop: 20 }}>
                {dispatchHistory.slice(0, 4).map((item) => (
                  <DispatchItem 
                    key={item.id}
                    userImage={item.userImage} 
                    status={item.status} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNavBar />
    </div>
  );
};

const DispatchItem = ({
  userImage,
  status,
}: {
  userImage: string;
  status: "Active" | "Completed" | "Rejected";
}) => {
  const statusConfig = {
    Active: {
      bgColor: "rgba(30, 255, 0, 0.26)",
      borderColor: "rgba(0, 109, 7, 0.45)",
      textColor: "#166000",
    },
    Completed: {
      bgColor: "rgba(166, 255, 0, 0.26)",
      borderColor: "rgba(93, 109, 0, 0.45)",
      textColor: "#605400",
    },
    Rejected: {
      bgColor: "rgba(255, 0, 0, 0.26)",
      borderColor: "rgba(109, 0, 0, 0.45)",
      textColor: "#600000",
    },
  };
  const config = statusConfig[status];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 25,
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={userImage}
          alt="user"
          style={{ width: 36, height: 36, borderRadius: "50%" }}
        />
        <span
          style={{
            marginLeft: 15,
            fontSize: 16,
            fontWeight: 600,
            color: "#000",
          }}
        >
          {"{user}'s Dispatch request"}
        </span>
      </div>
      <div
        style={{
          background: config.bgColor,
          border: `1px solid ${config.borderColor}`,
          borderRadius: 1000,
          padding: "4px 15px",
          display: "flex",
          alignItems: "center",
          width: 140,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.31)",
            border: `1px solid ${config.borderColor}`,
            marginRight: 8,
          }}
        ></div>
        <span style={{ color: config.textColor, fontSize: 16, fontWeight: 600 }}>
          {status.toUpperCase()}
        </span>
      </div>
    </div>
  );
};
