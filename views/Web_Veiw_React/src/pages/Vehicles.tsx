import React from "react";
import {
  BellIcon,
  CarIcon,
  HistoryIcon,
  MapIcon,
  MapPinIcon,
  ShieldIcon,
  AlertTriangleIcon,
  CheckCheckIcon,
  MinusIcon,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import VehicleInfo from "./VehicleInfo";
const avatarUrl =
  "https://c.animaapp.com/mbbg27lfJFnztb/img/rectangle-2.png";

const vehicles = [
  {
    name: "Car Name",
    dispatchable: true,
    status: "Active",
    healthScore: "64%",
    healthScoreColor: "#cb8b00",
    wildCards: "NONE",
    wildCardsColor: "#079f00",
    imageUrl:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=facearea&w=400&h=200",
    unhealthy: false,
  },
  {
    name: "Car Name",
    dispatchable: false,
    status: "Active",
    healthScore: "80%",
    healthScoreColor: "#00cb00",
    wildCards: "BAD GPS",
    wildCardsColor: "#9f0d00",
    imageUrl:
      "https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=facearea&w=400&h=200",
    unhealthy: false,
  },
  {
    name: "Car Name",
    dispatchable: false,
    status: "UNHEALTHY",
    healthScore: "34%",
    healthScoreColor: "#ff0000",
    wildCards: "BAD GPS",
    wildCardsColor: "#9f0d00",
    imageUrl:
      "https://images.unsplash.com/photo-1461632830798-3adb3034e4c8?auto=format&fit=facearea&w=400&h=200",
    unhealthy: true,
  },
];

export const Vehicles = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isVehicles = location.pathname.includes("vehicles");

  return (
    <div
      style={{
        background: "#f4f4f4",
        minHeight: "100vh",
        width: "100vw",
        fontFamily: "Inter, Helvetica, Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          maxWidth: 1300,
          margin: "0 auto",
          padding: "32px 0 0 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            width: "100%",
            maxWidth: 1100,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 40,
            padding: "0 28px",
            position: "relative",
          }}
        >
          {/* Avatar - move further left */}
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: "50%",
              overflow: "hidden",
              background: "#e0e0e0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              left: -30,
              top: 0,
            }}
          >
            <img
              src={avatarUrl}
              alt="avatar"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Segmented Button */}
          <div
            style={{
              width: 380,
              height: 54,
              background: "#484848",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              position: "relative",
              boxShadow: "0 1.5px 6px #0001",
              margin: "0 auto",
            }}
          >
            <button
              onClick={() => navigate("/requests")}
              style={{
                width: "50%",
                height: "100%",
                border: "none",
                outline: "none",
                borderRadius: "14px 0 0 14px",
                background: isVehicles ? "#484848" : "#4f5eff",
                color: "#f8f8f8",
                fontWeight: 600,
                fontSize: 22,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              Requests
            </button>
            <button
              onClick={() => navigate("/vehicles")}
              style={{
                width: "50%",
                height: "100%",
                border: "none",
                outline: "none",
                borderRadius: "0 14px 14px 0",
                background: isVehicles ? "#4f5eff" : "#484848",
                color: "#f8f8f8",
                fontWeight: 600,
                fontSize: 22,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              Vehicles
            </button>
          </div>

          {/* Notification Button - move further right and make semantic button */}
          <button
            style={{
              width: 62,
              height: 62,
              background: "#484848",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "absolute",
              right: -30,
              top: 0,
              border: "none",
              outline: "none",
            }}
            aria-label="Notifications"
          >
            <BellIcon size={32} color="#fff" />
          </button>
        </div>

        {/* Cards */}
        <div
          style={{
            width: "100%",
            maxWidth: 1100,
            display: "flex",
            gap: 44,
            justifyContent: "center",
            alignItems: "flex-start",
            marginBottom: 32,
          }}
        >
          {vehicles.map((vehicle, idx) => (
            <div
              key={idx}
              onClick={() => navigate("/vehicle-info/:name")}
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
              className="hover:scale-[1.035]"
            >
              {/* Image - make card longer */}
              <div
                style={{
                  width: "100%",
                  height: 160,
                  background: "#acacac",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={vehicle.imageUrl}
                  alt="Car"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              {/* Dispatchable badge */}
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
                      {vehicle.dispatchable
                        ? "Dispatchable"
                        : "NOT Dispatchable"}
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
                {/* Car Name and Status */}
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
                      background: vehicle.unhealthy ? "#ff000042" : "#1dff0042",
                      border: `1.5px solid ${vehicle.unhealthy ? "#6d000073" : "#006d0773"}`,
                      color: vehicle.unhealthy ? "#5f0000" : "#165f00",
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
                {/* In Transit */}
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
                    <span style={{ color: vehicle.healthScoreColor }}>
                      {vehicle.healthScore}
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
                    <span style={{ color: vehicle.wildCardsColor }}>
                      {vehicle.wildCards}
                    </span>
                  </span>
                </div>
                {/* Vehicle Info Button */}
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
                  onClick={e => {
                    e.stopPropagation();
                    navigate("/vehicleinfo");
                  }}
                >
                  vehicle Info
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Bottom Navigation */}
      <div
        style={{
          position: "fixed",
          left: "50%",
          bottom: 22,
          transform: "translateX(-50%)",
          width: 290,
          height: 54,
          background: "#484848",
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 100,
        }}
      >
        <button
          style={{
            width: "33.33%",
            height: "100%",
            background: "none",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "14px 0 0 14px",
            cursor: "pointer",
          }}
        >
          <HistoryIcon size={28} color="#fff" />
        </button>
        <button
        onClick={() => navigate("/dashboard")}
          style={{
            
            width: "33.33%",
            height: "100%",
            background: "none",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <MapIcon size={36} color="#fff" />
        </button>
        <button
          style={{
            width: "33.33%",
            height: "100%",
            background: "#4f5eff",
            border: "none",
            borderRadius: "0 14px 14px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <CarIcon size={40} color="#fff" />
        </button>
      </div>
    </div>
  );
};
