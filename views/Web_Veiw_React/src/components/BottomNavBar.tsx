import { HistoryIcon, MapIcon, CarIcon } from "lucide-react";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const BottomNavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHistory = location.pathname.includes("requestdispatchpage");
  const isMap = location.pathname.includes("dashboard");
  const isCar = location.pathname.includes("vehicles");

  return (
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
        boxShadow: "0 2px 8px #0002",
      }}
    >
      <button
        style={{
          width: "33.33%",
          height: "100%",
          background: isHistory ? "#4f5eff" : "none",
          border: "none",
          borderRadius: "14px 0 0 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#fff",
          fontSize: 28,
          transition: "background 0.18s",
        }}
        aria-label="History"
        onClick={() => navigate("/requestdispatchpage")}
      >
        <HistoryIcon size={28} color="#fff" />
      </button>
      <button
        style={{
          width: "33.33%",
          height: "100%",
          background: isMap ? "#4f5eff" : "none",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#fff",
          fontSize: 36,
          transition: "background 0.18s",
        }}
        aria-label="Map"
        onClick={() => navigate("/dashboard")}
      >
        <MapIcon size={36} color="#fff" />
      </button>
      <button
        style={{
          width: "33.33%",
          height: "100%",
          background: isCar ? "#4f5eff" : "none",
          border: "none",
          borderRadius: "0 14px 14px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#fff",
          fontSize: 40,
          transition: "background 0.18s",
        }}
        aria-label="Car"
        onClick={() => navigate("/vehicles")}
      >
        <CarIcon size={40} color="#fff" />
      </button>
    </div>
  );
}; 