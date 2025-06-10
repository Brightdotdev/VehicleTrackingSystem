import React, { useState } from 'react';
import './FooterNav.css';
import { FaCar } from "react-icons/fa6";
import { CiLocationArrow1 } from "react-icons/ci";
import { IoPerson } from "react-icons/io5";

function BottomNav() {
    const [activeTab, setActiveTab] = useState('map');

    const handleNavClick = (tab) => {
        setActiveTab(tab);
    }
    
  return (
    <div className="bottom-nav">
      <div
        className={`nav-item ${activeTab === 'car' ? 'active' : ''}`}
        onClick={() => handleNavClick('car')}
      >
        <FaCar className='icon' />
      </div>
      <div
        className={`nav-item ${activeTab === 'map' ? 'active' : ''}`}
        onClick={() => handleNavClick('map')}
      >
        <CiLocationArrow1 className='icon'/>
      </div>
      <div
        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => handleNavClick('profile')}
      >
        <IoPerson className='icon' />
      </div>
    </div>
  );
}

export default BottomNav;

