import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, CheckCircle, XCircle, Clock } from 'lucide-react';
import { mockApiService } from '../lib/mockData';
import type { DispatchHistoryItem, UserProfile as UserProfileType } from '../lib/mockData';
import { VehicleCard, type VehicleData } from '../components/VehicleCard';
import { BottomNavBar } from '../components/BottomNavBar';
import { useNavigate } from 'react-router-dom';

// A simple component to render a progress ring
const ProgressRing: React.FC<{
  percentage: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}> = ({ percentage, color, size = 80, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        stroke="#e6e6e6"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <motion.circle
        stroke={color}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </svg>
  );
};


const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfileType | null>(null);
  const [history, setHistory] = useState<DispatchHistoryItem[]>([]);
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API calls when backend is ready
        const [userData, historyData, vehiclesData] = await Promise.all([
          mockApiService.getUserProfile(),
          mockApiService.getDispatchHistory(),
          mockApiService.getVehicles()
        ]);
        setUser(userData);
        setHistory(historyData);
        setVehicles(vehiclesData);
      } catch (error) {
        console.error("Failed to fetch user profile data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getVehicleById = (id: string): VehicleData | undefined => {
      return vehicles.find(v => v.id === id);
  }

  // Calculate dispatch stats
  const totalDispatches = history.length;
  const successfulDispatches = history.filter(h => h.status === 'Completed').length;
  const failedDispatches = history.filter(h => h.status === 'Rejected').length;
  const activeDispatches = history.filter(h => h.status === 'Active');

  // Chart values
  const percentSuccess = totalDispatches ? Math.round((successfulDispatches / totalDispatches) * 100) : 0;
  const percentFailed = totalDispatches ? Math.round((failedDispatches / totalDispatches) * 100) : 0;
  const completionRate = totalDispatches ? Math.round(((successfulDispatches + failedDispatches) / totalDispatches) * 100) : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  if (loading || !user) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Profile...</div>;
  }
  
  return (
    <div style={{ position: 'relative', backgroundColor: '#f4f7fa', minHeight: '100vh', fontFamily: `'Inter', sans-serif`, padding: '20px', paddingBottom: '100px', overflow: 'hidden' }}>
      {/* Animated Background */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
        animate={{
          background: [
            'linear-gradient(135deg, #f4f7fa 0%, #e8f1f8 100%)',
            'linear-gradient(135deg, #e8f1f8 0%, #f4f7fa 100%)',
            'linear-gradient(135deg, #f4f7fa 0%, #e8f1f8 100%)',
          ],
        }}
        transition={{
          duration: 10,
          ease: 'linear',
          repeat: Infinity,
        }}
      />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}
      >
        {/* Header */}
        <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <img 
            src={user.avatarUrl} 
            alt="User" 
            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} 
          />
          <div style={{ marginLeft: '20px' }}>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 600, color: '#1a202c' }}>{user.name}</h1>
            <span style={{ 
              backgroundColor: '#e2e8f0', 
              color: '#4a5568', 
              padding: '4px 12px', 
              borderRadius: '12px', 
              fontSize: '14px', 
              fontWeight: 500
            }}>
              {user.role}
            </span>
          </div>
        </motion.div>

        {/* Dispatch Summary */}
        <motion.h2 variants={itemVariants} style={{ fontSize: '22px', fontWeight: 600, color: '#1a202c', marginBottom: '20px' }}>Dispatch Summary</motion.h2>
        <motion.div variants={containerVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <motion.button onClick={() => navigate('/historypage')} variants={itemVariants} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', border: 'none', cursor: 'pointer', width: '100%' }}>
            <Clock size={40} color="#3b82f6" />
            <div style={{ marginLeft: '15px', textAlign: 'left' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#4a5568' }}>Total Dispatches</h3>
              <p style={{ margin: '5px 0 0', fontSize: '24px', fontWeight: 700, color: '#1a202c' }}>{totalDispatches}</p>
            </div>
          </motion.button>
          <motion.button onClick={() => navigate('/successful-dispatches')} variants={itemVariants} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', border: 'none', cursor: 'pointer', width: '100%' }}>
            <CheckCircle size={40} color="#10b981" />
            <div style={{ marginLeft: '15px', textAlign: 'left' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#4a5568' }}>Successful</h3>
              <p style={{ margin: '5px 0 0', fontSize: '24px', fontWeight: 700, color: '#1a202c' }}>{successfulDispatches}</p>
            </div>
          </motion.button>
          <motion.button onClick={() => navigate('/failed-dispatches')} variants={itemVariants} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', border: 'none', cursor: 'pointer', width: '100%' }}>
            <XCircle size={40} color="#ef4444" />
            <div style={{ marginLeft: '15px', textAlign: 'left' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#4a5568' }}>Failed / Canceled</h3>
              <p style={{ margin: '5px 0 0', fontSize: '24px', fontWeight: 700, color: '#1a202c' }}>{failedDispatches}</p>
            </div>
          </motion.button>
        </motion.div>
        {/* Animated Circular Charts Section */}
        <motion.div variants={containerVariants} style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center', marginBottom: '40px' }}>
          <motion.div variants={itemVariants} style={{ background: 'white', borderRadius: 16, padding: 24, minWidth: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <ProgressRing percentage={percentSuccess} color="#10b981" />
            <div style={{ marginTop: 12, fontWeight: 600, color: '#10b981', fontSize: 18 }}>{percentSuccess}%</div>
            <div style={{ color: '#4a5568', fontSize: 14 }}>Successful</div>
          </motion.div>
          <motion.div variants={itemVariants} style={{ background: 'white', borderRadius: 16, padding: 24, minWidth: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <ProgressRing percentage={percentFailed} color="#ef4444" />
            <div style={{ marginTop: 12, fontWeight: 600, color: '#ef4444', fontSize: 18 }}>{percentFailed}%</div>
            <div style={{ color: '#4a5568', fontSize: 14 }}>Failed/Canceled</div>
          </motion.div>
          <motion.div variants={itemVariants} style={{ background: 'white', borderRadius: 16, padding: 24, minWidth: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <ProgressRing percentage={completionRate} color="#3b82f6" />
            <div style={{ marginTop: 12, fontWeight: 600, color: '#3b82f6', fontSize: 18 }}>{completionRate}%</div>
            <div style={{ color: '#4a5568', fontSize: 14 }}>Completion Rate</div>
          </motion.div>
        </motion.div>

        {/* Recent Activity */}
        <motion.h2 variants={itemVariants} style={{ fontSize: '22px', fontWeight: 600, color: '#1a202c', marginBottom: '20px' }}>Recent Activity</motion.h2>
        <motion.div variants={containerVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '20px' }}>
          {activeDispatches.length > 0 ? (
            activeDispatches.map(dispatch => {
              // TODO: Replace with actual vehicle data from dispatch when backend supports it
              const vehicleData = getVehicleById(dispatch.vehicleId);
              return vehicleData ? (
                <motion.div key={dispatch.id} variants={itemVariants}>
                  <VehicleCard vehicle={vehicleData} />
                </motion.div>
              ) : null;
            })
          ) : (
            <motion.p variants={itemVariants} style={{ color: '#4a5568' }}>No active dispatches.</motion.p>
          )}
        </motion.div>

      </motion.div>
      <BottomNavBar />
    </div>
  );
};

export default UserProfile;
