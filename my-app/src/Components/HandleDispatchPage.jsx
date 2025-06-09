import React, { useState, useEffect } from "react";
import carImage from "../assets/car_image.png";

const HandleDispatchPage = () => {
  const [bellActive, setBellActive] = useState(false);

  useEffect(() => {
    // Request notification permission when component mounts
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission !== "granted") {
          console.warn("Notification permission not granted.");
        }
      });
    }
  }, []);

  const handleBellClick = () => {
    setBellActive(!bellActive);
  };

  const notify = (title, body) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body });
    } else {
      console.warn("Notification not supported or permission denied.");
    }
  };

  const handleAccept = () => {
    notify("Dispatch Update", "✅ Dispatch has been accepted");
  };

  const handleReject = () => {
    notify("Dispatch Update", "❌ Dispatch has been rejected");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f8f8f8",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
        margin: "0 auto",
        maxWidth: "1200px",
        padding: "0 20px",
        fontSize: "15px",
      }}
    >
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />

      {/* Header */}
      <div
        style={{
          height: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#e5e5e5",
          padding: "0 10px",
        }}
      >
        <span className="material-icons" style={{ cursor: "pointer" }}>
          arrow_back
        </span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="https://i.pravatar.cc/20"
            alt="avatar"
            style={{ borderRadius: "50%", marginRight: "5px" }}
          />
          Dave's Dispatch request
        </div>
        <span
          className="material-icons"
          onClick={handleBellClick}
          style={{ cursor: "pointer", color: bellActive ? "#4C5FFF" : "black" }}
        >
          notifications
        </span>
      </div>

      {/* Car Image */}
      <div
        style={{
          backgroundColor: "#aaa",
          height: "300px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          borderRadius: "8px",
        }}
      >
        <img
          src={carImage}
          alt="Car"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "#c4f0c5",
            padding: "5px 20px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          Dispatchable ✅
        </div>
      </div>

      {/* Active Tag */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#c3bdff",
            fontWeight: "bold",
            padding: "3px 30px",
            borderRadius: "20px",
            fontSize: "15px",
          }}
        >
          Active
        </div>
      </div>

      {/* Car Name */}
      <h2 style={{ fontSize: "28px", marginTop: "20px" }}>Toyota Camry</h2>

      {/* Status Info */}
      <div style={{ fontSize: "15px", margin: "20px 0" }}>
        <span className="material-icons" style={{ marginRight: "8px" }}>
          location_on
        </span>
        <strong>Status:</strong> In Transit
      </div>
      <div style={{ fontSize: "15px", margin: "20px 0" }}>
        <span className="material-icons" style={{ marginRight: "8px" }}>
          shield
        </span>
        <strong>Health Score:</strong>{" "}
        <span style={{ color: "orange" }}>64%</span>
      </div>
      <div style={{ fontSize: "15px", margin: "20px 0" }}>
        <span className="material-icons" style={{ marginRight: "8px" }}>
          warning
        </span>
        <strong>Wild Cards:</strong> <span style={{ color: "green" }}>NONE</span>
      </div>
      <div style={{ fontSize: "15px", margin: "20px 0" }}>
        <span className="material-icons" style={{ marginRight: "8px" }}>
          help_outline
        </span>
        <strong>Dispatch Reason:</strong> Transport
      </div>
      <div style={{ fontSize: "15px", margin: "20px 0 30px" }}>
        <span className="material-icons" style={{ marginRight: "8px" }}>
          hourglass_bottom
        </span>
        <strong>Dispatch End time:</strong> 2:00
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={handleAccept}
          style={{
            backgroundColor: "#4C5FFF",
            color: "white",
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "15px",
            fontFamily: "Arial, sans-serif",
            cursor: "pointer", // Hand cursor
          }}
        >
          Accept Dispatch
        </button>
        <button
          onClick={handleReject}
          style={{
            backgroundColor: "#FF4C4C",
            color: "white",
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "15px",
            fontFamily: "Arial, sans-serif",
            cursor: "pointer", // Hand cursor
          }}
        >
          Reject Dispatch
        </button>
      </div>

      {/* Footer Icons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "40px",
          padding: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            backgroundColor: "#2e2e2e",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <span className="material-icons" style={footerIconStyle}>
            refresh
          </span>
          <span className="material-icons" style={footerIconStyle}>
            menu_book
          </span>
          <span
            className="material-icons"
            style={{
              ...footerIconStyle,
              backgroundColor: "#4C5FFF",
            }}
          >
            directions_car
          </span>
        </div>
      </div>
    </div>
  );
};

const footerIconStyle = {
  padding: "10px 20px",
  color: "white",
  fontSize: "20px",
  cursor: "pointer",
};

export default HandleDispatchPage;
