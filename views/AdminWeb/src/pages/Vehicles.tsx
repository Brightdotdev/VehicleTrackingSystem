import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { VehicleCard } from '../components/VehicleCard';
import type { VehicleData } from '../components/VehicleCard';
import { Header } from '../components/Header';
import { BottomNavBar } from '../components/BottomNavBar';
import { mockApiService, mockUserProfile } from '../lib/mockData';
import { NotificationDropdown } from '../components/NotificationDropdown';

export const Vehicles = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isVehicles = location.pathname.includes("vehicles");

  // TODO: Replace with actual API state management when backend is ready
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Replace this useEffect with actual API call when backend is ready
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        // TODO: Replace mockApiService.getVehicles() with actual API call
        const data = await mockApiService.getVehicles();
        setVehicles(data);
        setError(null);
      } catch (err) {
        setError('Failed to load vehicles');
        console.error('Error fetching vehicles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // TODO: Replace with actual user profile API call when backend is ready
  const [userProfile] = useState({
    avatarUrl: mockUserProfile.avatarUrl,
    deskName: mockUserProfile.deskName
  });

  if (loading) {
    return (
      <div style={{
        background: "#f4f4f4",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, Helvetica, Arial, sans-serif",
      }}>
        <div style={{ fontSize: 18, color: "#666" }}>Loading vehicles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: "#f4f4f4",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, Helvetica, Arial, sans-serif",
      }}>
        <div style={{ fontSize: 18, color: "#ff0000" }}>{error}</div>
      </div>
    );
  }

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
        {/* Top Bar with Header Component */}
        <div style={{ position: 'absolute', top: 32, right: 32, zIndex: 10 }}>
          <NotificationDropdown />
        </div>
        <Header
          avatarUrl={userProfile.avatarUrl}
          deskName={userProfile.deskName}
          showSegmentedNav={true}
          leftSegmentLabel="Requests"
          rightSegmentLabel="Vehicles"
          leftSegmentPath="/requests"
          rightSegmentPath="/vehicles"
        />

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
            flexWrap: "wrap",
          }}
        >
          {/* TODO: Replace this mapping with actual API data when backend is ready */}
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              showRequestedBy={false}
            />
          ))}
        </div>
      </div>
      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};
