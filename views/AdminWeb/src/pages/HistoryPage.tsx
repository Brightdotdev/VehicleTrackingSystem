import React, { useState, useEffect } from "react";
import { BellIcon } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { BottomNavBar } from '../components/BottomNavBar';
import { NotificationDropdown } from '../components/NotificationDropdown';
import { mockApiService, mockUserProfile } from '../lib/mockData';
import type { DispatchHistoryItem } from '../lib/mockData';

// New StatusBadge component
const StatusBadge = ({ status }: { status: 'Active' | 'Completed' | 'Rejected' }) => {
  const statusStyles = {
    'Active': { backgroundColor: '#28a745', color: 'white', text: 'Ongoing' }, // Green for Active/Ongoing
    'Completed': { backgroundColor: '#6c757d', color: 'white', text: 'Ended' }, // Gray for Ended/Completed
    'Rejected': { backgroundColor: '#dc3545', color: 'white', text: 'Ended' },   // Red for Ended/Rejected
  };

  const currentStatus = status === 'Active' ? 'Active' : (status === 'Completed' ? 'Completed' : 'Rejected');
  const { backgroundColor, color, text } = statusStyles[currentStatus];

  const icon = status === 'Active' ? '✅' : '⛔';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 12px',
      borderRadius: '16px',
      backgroundColor,
      color,
      fontWeight: 600,
      fontSize: '14px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      textTransform: 'capitalize',
    }}>
      {icon} <span style={{ marginLeft: '6px' }}>{text}</span>
    </span>
  );
};

export const HistoryPage = () => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // TODO: Replace with actual API state management when backend is ready
  const [dispatchHistory, setDispatchHistory] = useState<DispatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Replace this useEffect with actual API call when backend is ready
  useEffect(() => {
    const fetchDispatchHistory = async () => {
      try {
        setLoading(true);
        // TODO: Replace mockApiService.getDispatchHistory() with actual API call
        const data = await mockApiService.getDispatchHistory();
        setDispatchHistory(data);
        setError(null);
      } catch (err) {
        setError('Failed to load dispatch history');
        console.error('Error fetching dispatch history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDispatchHistory();
  }, []);

  const handleCardClick = (dispatchItem: DispatchHistoryItem) => {
    // Following user request to only navigate for 'ongoing' dispatches
    if (dispatchItem.status === 'Active') {
      // TODO: Add logic to check dispatch.status === 'ongoing' before navigation
      navigate('/dispatch-view', { state: { dispatch: dispatchItem } });
    } else {
      // TODO: Handle ended dispatch (e.g. modal, disabled interaction)
      console.log(`Dispatch ${dispatchItem.id} is ended. No action taken.`);
    }
  };

  if (loading) {
    return (
      <div style={{
        background: "#fff",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
      }}>
        <div style={{ fontSize: 18, color: "#666" }}>Loading dispatch history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: "#fff",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
      }}>
        <div style={{ fontSize: 18, color: "#ff0000" }}>{error}</div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          maxWidth: 1440,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 24,
          marginBottom: 48,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/profile')}
          aria-label={`${mockUserProfile.deskName}`}
          style={{
            background: "#484848",
            borderRadius: 8,
            width: 180,
            height: 40,
            display: "flex",
            alignItems: "center",
            padding: 0,
            border: "none",
            boxShadow: "none",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              marginLeft: 8,
              marginRight: 8,
              overflow: "hidden",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={mockUserProfile.avatarUrl}
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <span
            style={{
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              lineHeight: "24px",
              fontFamily: "inherit",
              letterSpacing: 0,
            }}
          >
            {mockUserProfile.deskName}
          </span>
        </button>
        <NotificationDropdown />
      </div>

      {/* Dispatch Table */}
      <div
        style={{
          width: "100%",
          maxWidth: 1100,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          margin: 0,
          padding: 0,
        }}
      >
        {/* Table Header */}
        <div
          style={{
            background: "#e2e2e2",
            borderRadius: 8,
            border: "none",
            boxShadow: "none",
            height: 64,
            width: "100%",
            display: "flex",
            alignItems: "center",
            margin: 0,
            padding: 0,
            borderBottom: "1px solid #bdbdbd",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr 1.2fr 1.2fr",
              height: "100%",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontWeight: 500,
                color: "#111",
                fontSize: 18,
                lineHeight: "24px",
                textAlign: "center",
                fontFamily: "inherit",
              }}
            >
              Dispatch Requester
            </div>
            <div
              style={{
                fontWeight: 600,
                color: "#111",
                fontSize: 18,
                lineHeight: "24px",
                textAlign: "center",
                fontFamily: "inherit",
              }}
            >
              Car name
            </div>
            <div
              style={{
                fontWeight: 700,
                color: "#111",
                fontSize: 18,
                lineHeight: "24px",
                textAlign: "center",
                fontFamily: "inherit",
              }}
            >
              Dispatch Score
            </div>
            <div
              style={{
                fontWeight: 600,
                color: "#111",
                fontSize: 18,
                lineHeight: "24px",
                textAlign: "center",
                fontFamily: "inherit",
              }}
            >
              Dispatch Status
            </div>
          </div>
        </div>

        {/* Table Rows */}
        {dispatchHistory.map((item) => {
          const isHovered = item.id === hoveredId;
          const cardStyle = {
            background: isHovered ? "#d8d8d8" : "#e2e2e2",
            borderRadius: 8,
            border: "none",
            boxShadow: isHovered ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
            height: 64,
            width: "100%",
            display: "flex",
            alignItems: "center",
            margin: 0,
            padding: 0,
            borderBottom: "1px solid #bdbdbd",
            cursor: item.status === 'Active' ? 'pointer' : 'default',
            transform: isHovered ? "scale(1.01)" : "scale(1)",
            transition: "transform 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          };

          return (
            <div
              key={item.id}
              style={cardStyle}
              onClick={() => handleCardClick(item)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                style={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1fr 1.2fr 1.2fr",
                  height: "100%",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontWeight: 500,
                    color: "#111",
                    fontSize: 18,
                    lineHeight: "24px",
                    textAlign: "center",
                    fontFamily: "inherit",
                  }}
                >
                  User {item.userId}
                </div>
                <div
                  style={{
                    fontWeight: 600,
                    color: "#111",
                    fontSize: 18,
                    lineHeight: "24px",
                    textAlign: "center",
                    fontFamily: "inherit",
                  }}
                >
                  {item.vehicleName}
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#111",
                    fontSize: 18,
                    lineHeight: "24px",
                    textAlign: "center",
                    fontFamily: "inherit",
                  }}
                >
                  {item.dispatchScore || 'N/A'}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <StatusBadge status={item.status} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};
