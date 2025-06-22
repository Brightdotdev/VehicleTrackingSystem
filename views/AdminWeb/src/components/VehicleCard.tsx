import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPinIcon, ShieldIcon, AlertTriangleIcon, CheckCheckIcon, MinusIcon } from 'lucide-react';

// TODO: Replace this interface with actual API response type when backend is ready
export interface VehicleData {
  id: string;
  name: string;
  status: 'Active' | 'UNHEALTHY' | 'bad';
  inTransit: boolean;
  healthScore: number;
  dispatchable: boolean;
  wildCards: string;
  imageUrl: string;
  requestedBy?: string; // Optional for request cards
  engineType?: string;
  vehicleType?: string;
}

interface VehicleCardProps {
  vehicle: VehicleData;
  showRequestedBy?: boolean; // For request cards
  className?: string;
}

const getHealthColor = (score: number) => {
  if (score >= 75) return '#00cb00';
  if (score >= 50) return '#cb8b00';
  return '#ff0000';
};

export const VehicleCard: React.FC<VehicleCardProps> = ({ 
  vehicle, 
  showRequestedBy = false,
  className = ""
}) => {
  const navigate = useNavigate();

  // TODO: Replace this routing logic with actual API-based status when backend is ready
  const handleCardClick = () => {
    if (vehicle.status === 'bad') {
      navigate(`/bad-vehicle/${encodeURIComponent(vehicle.id)}`);
    } else {
      navigate(`/vehicle-info/${encodeURIComponent(vehicle.id)}`);
    }
  };

  const handleVehicleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/vehicle-info/${encodeURIComponent(vehicle.id)}`);
  };

  return (
    <div
      className={`vehicle-card hover:scale-[1.035] ${className}`}
      style={{
        width: 310,
        background: "#fff",
        borderRadius: 11,
        boxShadow: "0 2.5px 12px 0 #00000014",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        border: "none",
        cursor: "pointer",
        transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
        willChange: "transform",
      }}
      onClick={handleCardClick}
    >
      {/* Requested by section - only show for request cards */}
      {showRequestedBy && vehicle.requestedBy && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 16px 0 16px",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              overflow: "hidden",
              background: "#e0e0e0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="https://c.animaapp.com/mbbg27lfJFnztb/img/rectangle-2.png"
              alt="avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <span
            style={{
              background: "#ececec",
              color: "#444",
              borderRadius: 1000,
              fontWeight: 600,
              fontSize: 13,
              padding: "4px 14px",
            }}
          >
            Requested by : {vehicle.requestedBy}
          </span>
        </div>
      )}

      {/* Vehicle Image */}
      <div
        style={{
          width: "100%",
          height: showRequestedBy ? 120 : 160,
          background: "#acacac",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: showRequestedBy ? 10 : 0,
        }}
      >
        <img
          src={vehicle.imageUrl}
          alt={`${vehicle.name} image`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Dispatchable Badge */}
      <div style={{ position: "relative", width: "100%", minHeight: 0 }}>
        <div
          style={{
            position: "absolute",
            right: 14,
            top: -22,
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 14px",
              height: 28,
              borderRadius: 1000,
              background: vehicle.dispatchable
                ? "#00941621"
                : "#94000021",
              color: vehicle.dispatchable ? "#005d00" : "#5d0000",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            <span style={{ marginRight: 8 }}>
              {vehicle.dispatchable ? "Dispatchable" : "NOT Dispatchable"}
            </span>
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: vehicle.dispatchable
                  ? "#00842359"
                  : "#84000059",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {vehicle.dispatchable ? (
                <CheckCheckIcon size={15} color="#005d00" />
              ) : (
                <MinusIcon size={13} color="#5d0000" />
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div
        style={{
          padding: "18px 16px 24px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {/* Vehicle Name and Status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: 18,
              color: "#181818",
              fontFamily: "Inter, Helvetica, Arial, sans-serif",
            }}
          >
            {vehicle.name}
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: 22,
              padding: "0 10px",
              borderRadius: 1000,
              background: vehicle.status === "UNHEALTHY" || vehicle.status === "bad" ? "#ff000042" : "#1dff0042",
              border: `1.5px solid ${vehicle.status === "UNHEALTHY" || vehicle.status === "bad" ? "#6d000073" : "#006d0773"}`,
              color: vehicle.status === "UNHEALTHY" || vehicle.status === "bad" ? "#5f0000" : "#165f00",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            <span
              style={{
                width: 9,
                height: 9,
                background: "#fff",
                borderRadius: 9,
                border: `1.5px solid #108a0063`,
                marginRight: 5,
                display: "inline-block",
              }}
            />
            <span>
              {vehicle.status}
            </span>
          </div>
        </div>

        {/* In Transit Status */}
        {vehicle.inTransit && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontWeight: 500,
              fontSize: 13,
              color: "#222",
              marginBottom: 1,
            }}
          >
            <MapPinIcon size={15} style={{ marginRight: 6 }} />
            <span>In Transit</span>
          </div>
        )}

        {/* Health Score */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontWeight: 500,
            fontSize: 13,
            color: "#222",
            marginBottom: 1,
          }}
        >
          <ShieldIcon size={15} style={{ marginRight: 6 }} />
          <span>
            Health Score :{' '}
            <span style={{ color: getHealthColor(vehicle.healthScore) }}>
              {vehicle.healthScore}%
            </span>
          </span>
        </div>

        {/* Wild Cards */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontWeight: 500,
            fontSize: 13,
            color: "#222",
            marginBottom: 1,
          }}
        >
          <AlertTriangleIcon size={13} style={{ marginRight: 6 }} />
          <span>
            Wild Cards :{' '}
            <span style={{ color: vehicle.wildCards === "NONE" ? "#079f00" : "#9f0d00" }}>
              {vehicle.wildCards}
            </span>
          </span>
        </div>

        {/* Action Button */}
        <button
          style={{
            width: "75%",
            alignSelf: "center",
            height: 34,
            background: "#5752ff",
            border: "none",
            borderRadius: 11,
            color: "#f1f1f1",
            fontWeight: 600,
            fontSize: 15,
            marginTop: 10,
            cursor: "pointer",
            transition: "background 0.18s",
          }}
          onClick={showRequestedBy ? 
            (e) => {
              e.stopPropagation();
              navigate(`/handle-dispatch/${encodeURIComponent(vehicle.id)}`);
            } : 
            handleVehicleInfoClick
          }
        >
          {showRequestedBy ? "Handle Dispatch" : "Vehicle Info"}
        </button>
      </div>
    </div>
  );
}; 