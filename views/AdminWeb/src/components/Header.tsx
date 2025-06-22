import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BellIcon } from 'lucide-react';
import { mockUserProfile } from '../lib/mockData';

// TODO: Replace this interface with actual API response type when backend is ready
export interface HeaderProps {
  avatarUrl?: string;
  deskName?: string;
  showSegmentedNav?: boolean;
  leftSegmentLabel?: string;
  rightSegmentLabel?: string;
  leftSegmentPath?: string;
  rightSegmentPath?: string;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  avatarUrl = mockUserProfile.avatarUrl,
  deskName = mockUserProfile.deskName,
  showSegmentedNav = false,
  leftSegmentLabel = "Requests",
  rightSegmentLabel = "Vehicles",
  leftSegmentPath = "/requests",
  rightSegmentPath = "/vehicles",
  className = ""
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // TODO: Replace this logic with actual API-based navigation state when backend is ready
  const isLeftSegment = location.pathname.includes(leftSegmentPath.replace('/', ''));
  const isRightSegment = location.pathname.includes(rightSegmentPath.replace('/', ''));

  return (
    <div
      className={`header ${className}`}
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
      {/* Avatar */}
      <div
        onClick={() => navigate('/profile')}
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
          cursor: 'pointer',
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

      {/* Segmented Button - only show if requested */}
      {showSegmentedNav && (
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
            onClick={() => navigate(leftSegmentPath)}
            style={{
              width: "50%",
              height: "100%",
              border: "none",
              outline: "none",
              borderRadius: "14px 0 0 14px",
              background: isLeftSegment ? "#4f5eff" : "#484848",
              color: "#f8f8f8",
              fontWeight: 600,
              fontSize: 22,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            {leftSegmentLabel}
          </button>
          <button
            onClick={() => navigate(rightSegmentPath)}
            style={{
              width: "50%",
              height: "100%",
              border: "none",
              outline: "none",
              borderRadius: "0 14px 14px 0",
              background: isRightSegment ? "#4f5eff" : "#484848",
              color: "#f8f8f8",
              fontWeight: 600,
              fontSize: 22,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            {rightSegmentLabel}
          </button>
        </div>
      )}

      {/* Notification Button */}
      {/* Removed static notification bell icon to avoid duplicate bells */}
    </div>
  );
}; 