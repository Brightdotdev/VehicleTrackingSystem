import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Notification, Map, Bus, Clock } from "iconsax-react"
import { BottomNavBar } from '../components/BottomNavBar';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#f5f5f5] pb-32 font-sans relative"
    >
      {/* Top left avatar */}
      <div className="fixed top-6 left-6 z-40 flex items-center">
        <div className="w-10 h-10 rounded-full bg-cover bg-center mr-3 border-2 border-white shadow" style={{backgroundImage: 'url(https://randomuser.me/api/portraits/men/1.jpg)'}} />
      </div>
      {/* Top center tab bar */}
      <div className="flex justify-center mt-6 mb-8 z-30 relative">
        <div className="flex rounded-lg overflow-hidden shadow">
          <button
            className={`px-8 py-2 font-semibold text-2xl focus:outline-none transition-colors duration-200 ${
              location.pathname === '/requests'
                ? 'bg-[#5852ff] text-white'
                : 'bg-[#484848] text-white'
            }`}
            style={{ borderTopLeftRadius: '0.5rem', borderBottomLeftRadius: '0.5rem' }}
            onClick={() => navigate('/requests')}
          >
            Requests
          </button>
          <button
            className={`px-8 py-2 font-semibold text-2xl focus:outline-none transition-colors duration-200 ${
              location.pathname === '/vehicles'
                ? 'bg-[#5852ff] text-white'
                : 'bg-[#484848] text-white'
            }`}
            style={{ borderTopRightRadius: '0.5rem', borderBottomRightRadius: '0.5rem' }}
            onClick={() => navigate('/vehicles')}
          >
            Vehicles
          </button>
        </div>
      </div>
      {/* Top right notification button */}
      <div className="fixed top-6 right-6 z-40">
        <button className="w-12 h-12 bg-[#484848] rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 relative">
          <span className="text-white text-2xl"><Notification size={32} color="#FF8A65" /></span>
        </button>
      </div>
      {/* Map placeholder */}
      <div className="flex flex-row justify-center gap-8 max-w-7xl mx-auto pt-2 pb-8">
        <div className="w-full h-[520px] bg-gray-300 rounded-xl flex items-center justify-center">
          <span className="text-2xl text-black font-semibold">Map Placeholder</span>
        </div>
      </div>
      {/* Bottom Navigation Bar */}
      <BottomNavBar />
    </motion.div>
  );
};
