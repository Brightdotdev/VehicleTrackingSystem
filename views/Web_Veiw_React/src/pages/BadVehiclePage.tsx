import React from 'react';
import { BottomNavBar } from '../components/BottomNavBar';

const dispatchHistory = [
  { user: 'user1', status: 'Active' },
  { user: 'user2', status: 'Completed' },
  { user: 'user3', status: 'Rejected' },
  { user: 'user4', status: 'Completed' },
];

const statusColors: Record<string, string> = {
  Active: '#6FCF97',
  Completed: '#EBF9F1',
  Rejected: '#FFBDBD',
};

const BadVehiclePage: React.FC = () => {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 24, maxWidth: 900, margin: '32px auto', boxShadow: '0 2px 8px #eee' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <button style={{ background: 'none', border: 'none', fontSize: 24, marginRight: 16, cursor: 'pointer' }}>{'<'} </button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 600, fontSize: 22 }}>Car Name</div>
        <div style={{ width: 32 }} />
      </div>
      {/* Car Image & Status */}
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <div style={{ background: '#eee', height: 140, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#888' }}>
            Car Image
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ background: '#F2B5B5', color: '#7A2E2E', borderRadius: 8, padding: '4px 12px', fontSize: 13 }}>NOT Dispatchable</span>
            <span style={{ background: '#E0E0E0', color: '#333', borderRadius: 8, padding: '4px 12px', fontSize: 13 }}>CLASSIFIED</span>
          </div>
          <button style={{ marginTop: 16, background: '#FF6B6B', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
            Mark For Maintenance
          </button>
        </div>
        {/* Metadata & Dispatch History */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fafafa', borderRadius: 8, padding: 16, marginBottom: 8 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Vehicle metadata :</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#222', fontSize: 15 }}>
              <li style={{ marginBottom: 6 }}>• In Transit</li>
              <li style={{ marginBottom: 6 }}>
                • Health Score : <span style={{ color: '#FF3B3B', fontWeight: 600 }}>90%</span>
              </li>
              <li style={{ marginBottom: 6 }}>
                • Wild Cards : <span style={{ color: '#D32F2F', fontWeight: 600 }}>GPS BAD</span>
              </li>
              <li style={{ marginBottom: 6 }}>• Engine Type: Diesel</li>
              <li>• Vehicle Type: Sedan</li>
            </ul>
          </div>
          <div style={{ background: '#F7F7F7', borderRadius: 8, padding: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Dispatch History</div>
            <div>
              {dispatchHistory.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                  <img src={`https://i.pravatar.cc/32?img=${idx + 1}`} alt="avatar" style={{ width: 28, height: 28, borderRadius: '50%', marginRight: 10 }} />
                  <span style={{ flex: 1 }}>{item.user}'s Dispatch request</span>
                  <span style={{
                    background: item.status === 'Active' ? '#6FCF97' : item.status === 'Completed' ? '#EBF9F1' : '#FFBDBD',
                    color: item.status === 'Rejected' ? '#D32F2F' : '#222',
                    borderRadius: 8,
                    padding: '4px 14px',
                    fontWeight: 600,
                    fontSize: 13,
                    marginLeft: 8,
                  }}>
                    {item.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};

export default BadVehiclePage;
