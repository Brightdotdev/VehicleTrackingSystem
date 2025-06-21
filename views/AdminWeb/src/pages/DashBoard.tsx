import React, { useState, useEffect } from 'react';
import { Notification } from "iconsax-react";
import { useNavigate } from 'react-router-dom';
import { BottomNavBar } from '../components/BottomNavBar';
import { NotificationDropdown } from '../components/NotificationDropdown';
import { mockApiService } from '../lib/mockData';
import type { UserProfile } from '../lib/mockData';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  // TODO: Replace with actual API state management when backend is ready
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Replace this useEffect with actual API call when backend is ready
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        // TODO: Replace mockApiService.getUserProfile() with actual API call
        const data = await mockApiService.getUserProfile();
        setUserProfile(data);
        setError(null);
      } catch (err) {
        setError('Failed to load user profile');
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#fff',
        margin: 0,
        padding: 0,
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
        width: '100vw',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ fontSize: 18, color: "#666" }}>Loading dashboard...</div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#fff',
        margin: 0,
        padding: 0,
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
        width: '100vw',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ fontSize: 18, color: "#ff0000" }}>{error || 'Failed to load user profile'}</div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fff',
        margin: 0,
        padding: 0,
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      {/* Top left: Avatar and Desk Name */}
      <div
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          onClick={() => navigate('/profile')}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundImage: `url(${userProfile.avatarUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginRight: 10,
            border: 'none',
            boxShadow: 'none',
            cursor: 'pointer',
          }}
        />
        <div
          style={{
            background: '#484848',
            color: '#fff',
            fontWeight: 600,
            fontSize: 15,
            borderRadius: 6,
            padding: '6px 12px 6px 12px',
            lineHeight: 1,
            letterSpacing: 0,
            boxShadow: 'none',
          }}
        >
          {userProfile.deskName}
        </div>
      </div>
      {/* Top right: Notification icon */}
      <div
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 40,
        }}
      >
        <NotificationDropdown />
      </div>
      {/* Center: Map placeholder */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'calc(100vw - 64px)',
          height: 'calc(100vh - 120px)',
          maxWidth: 1200,
          maxHeight: 600,
          background: '#e5e5e5',
          borderRadius: 18,
          boxShadow: '0 2px 12px #0001',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* TODO: Replace with actual map component when backend is ready */}
        <div style={{ fontSize: 18, color: "#666" }}>
          Map will be integrated here when backend is ready
        </div>
      </div>
      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};
