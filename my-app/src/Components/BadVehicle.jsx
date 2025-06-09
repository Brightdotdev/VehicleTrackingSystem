import React, { useState } from "react";
import carImage from "../assets/car_image(2).png"


const BadVehicle = () => {
  const [markedForMaintenance, setMarkedForMaintenance] = useState(false);
  const [bellActive, setBellActive] = useState(false);

  const handleMaintenance = () => {
    setMarkedForMaintenance(true);
    alert("Vehicle marked for maintenance.");
  };

  const handleBellClick = () => {
    setBellActive(!bellActive);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f8f8f8",
        fontFamily: "Arial",
        boxSizing: "border-box",
        margin: "0 auto",
        maxWidth: "1200px",
        padding: "0 20px",
      }}
    >
      {/* Load Google Icons */}
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />

      {/* Header */}
      <div
        style={{
          height: "60px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span className="material-icons" style={{ cursor: "pointer" }}>
          arrow_back
        </span>
        <h2 style={{ margin: 0 }}>Lexus 2018</h2>
        <span
          className="material-icons"
          onClick={handleBellClick}
          style={{ cursor: "pointer", color: bellActive ? "orange" : "black" }}
        >
          notifications
        </span>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Car Image */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              position: "relative",
              backgroundColor: "#ccc",
              width: "100%",
              height: "300px",
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src= {carImage}
              alt="Toyota Camry"
              style={{
                width: "auto",
                height: "90%",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
            <span
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "#f56565",
                color: "white",
                padding: "4px 10px",
                borderRadius: "10px",
                fontSize: "12px",
              }}
            >
              NOT Dispatchable ⛔
            </span>
          </div>
        </div>

        {/* Tags & Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <span
            style={{
              backgroundColor: "#e0d4fc",
              padding: "5px 10px",
              borderRadius: "10px",
              fontSize: "12px",
            }}
          >
            CLASSIFIED
          </span>
          <button
            onClick={handleMaintenance}
            style={{
              backgroundColor: "red",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "6px",
            }}
          >
            Mark For Maintenance
          </button>
        </div>

        {/* Metadata and History */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            overflow: "hidden",
          }}
        >
          {/* Vehicle Info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              fontSize: "14px",
              overflow: "hidden",
            }}
          >
            <p>
              <span className="material-icons" style={{ verticalAlign: "middle" }}>
                info
              </span>{" "}
              <strong>Vehicle metadata:</strong>
            </p>
            <p>
              <span className="material-icons" style={{ verticalAlign: "middle" }}>
                location_on
              </span>{" "}
              <strong>Status:</strong> In Transit
            </p>
            <p>
              <span className="material-icons" style={{ verticalAlign: "middle" }}>
                health_and_safety
              </span>{" "}
              <strong>Health Score:</strong>{" "}
              <span style={{ color: "red" }}>90%</span>
            </p>
            <p>
              <span className="material-icons" style={{ verticalAlign: "middle" }}>
                warning
              </span>{" "}
              <strong>Wild Cards:</strong>{" "}
              <span style={{ color: "red" }}>GPS BAD</span>
            </p>
            <p>
              <span className="material-icons" style={{ verticalAlign: "middle" }}>
                settings
              </span>{" "}
              <strong>Engine Type:</strong> Diesel
            </p>
            <p>
              <span className="material-icons" style={{ verticalAlign: "middle" }}>
                directions_car
              </span>{" "}
              <strong>Vehicle Type:</strong> Toyota
            </p>
          </div>

          {/* Dispatch History */}
          <div
            style={{
              backgroundColor: "#f3f4f6",
              padding: "10px",
              borderRadius: "12px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              Dispatch History
            </h2>

            <div style={{ overflow: "auto", flex: 1 }}>
              {[
                { name: "Dave", status: "Active", color: "#4ade80" },
                { name: "Sandra", status: "Completed", color: "#d9f99d" },
                { name: "Micheal", status: "Rejected", color: "#fca5a5" },
                { name: "Chidi", status: "Completed", color: "#d9f99d" },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "white",
                    padding: "10px",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={`https://i.pravatar.cc/150?u=${item.name}`}
                      alt="avatar"
                      style={{
                        borderRadius: "9999px",
                        width: "30px",
                        height: "30px",
                        marginRight: "10px",
                      }}
                    />
                    <span style={{ fontSize: "14px" }}>
                      {item.name}'s Dispatch request
                    </span>
                  </div>
                  <span
                    style={{
                      backgroundColor: item.color,
                      borderRadius: "9999px",
                      padding: "4px 10px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color:
                        item.status === "Rejected" ? "#991b1b" : "#065f46",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "16px 0",
          backgroundColor: "#f1f1f1",
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
          <span
            className="material-icons"
            style={{
              padding: "10px 20px",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            refresh
          </span>
          <span
            className="material-icons"
            style={{
              padding: "10px 20px",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            menu_book
          </span>
          <span
            className="material-icons"
            style={{
              padding: "10px 20px",
              backgroundColor: "#4C5FFF",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            directions_car
          </span>
        </div>
      </div>
    </div>
  );
};

export default BadVehicle;
