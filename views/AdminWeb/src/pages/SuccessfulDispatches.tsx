import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { BottomNavBar } from '../components/BottomNavBar';
import { mockApiService } from '../lib/mockData';
import type { DispatchHistoryItem } from '../lib/mockData';

const SuccessfulDispatches = () => {
  const navigate = useNavigate();
  const [dispatchHistory, setDispatchHistory] = useState<DispatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDispatchHistory = async () => {
      try {
        setLoading(true);
        // TODO: Replace mock dispatch data with filtered API calls once backend supports it
        const data = await mockApiService.getDispatchHistory();
        setDispatchHistory(data.filter(d => d.status === 'Completed'));
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

  if (loading) {
    return <div style={{ background: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}><div style={{ fontSize: 18, color: "#666" }}>Loading successful dispatches...</div></div>;
  }
  if (error) {
    return <div style={{ background: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}><div style={{ fontSize: 18, color: "#ff0000" }}>{error}</div></div>;
  }

  return (
    <div style={{ background: "#fff", minHeight: "100vh", width: "100vw", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", margin: 0, padding: 0, boxSizing: "border-box", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ width: "100%", maxWidth: 1440, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 24, marginBottom: 32, paddingLeft: 16, paddingRight: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <CheckCircle size={32} color="#10b981" />
          <span style={{ color: '#10b981', fontWeight: 700, fontSize: 22 }}>Successful Dispatches</span>
        </div>
      </div>
      {/* Table */}
      <div style={{ width: "100%", maxWidth: 1100, display: "flex", flexDirection: "column", gap: 16, margin: 0, padding: 0 }}>
        <div style={{ background: "#e2e2e2", borderRadius: 8, height: 64, width: "100%", display: "flex", alignItems: "center", borderBottom: "1px solid #bdbdbd" }}>
          <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1.2fr 1fr 1.2fr 1.2fr", height: "100%", alignItems: "center" }}>
            <div style={{ fontWeight: 500, color: "#111", fontSize: 18, textAlign: "center" }}>Dispatch Requester</div>
            <div style={{ fontWeight: 600, color: "#111", fontSize: 18, textAlign: "center" }}>Car name</div>
            <div style={{ fontWeight: 700, color: "#111", fontSize: 18, textAlign: "center" }}>Dispatch Score</div>
            <div style={{ fontWeight: 600, color: "#111", fontSize: 18, textAlign: "center" }}>Status</div>
          </div>
        </div>
        {dispatchHistory.map((item) => (
          <div key={item.id} style={{ width: "100%", display: "grid", gridTemplateColumns: "1.2fr 1fr 1.2fr 1.2fr", alignItems: "center", background: '#f6fffa', borderRadius: 8, boxShadow: '0 1px 4px #10b98122', marginBottom: 8, padding: '16px 0' }}>
            <div style={{ textAlign: "center" }}><img src={item.userImage} alt="User" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', marginRight: 8, verticalAlign: 'middle' }} /> {item.userId}</div>
            <div style={{ textAlign: "center" }}>{item.vehicleName}</div>
            <div style={{ textAlign: "center" }}>{item.dispatchScore ?? '-'}</div>
            <div style={{ textAlign: "center", color: '#10b981', fontWeight: 600 }}>Completed</div>
          </div>
        ))}
      </div>
      <BottomNavBar />
    </div>
  );
};

export default SuccessfulDispatches; 