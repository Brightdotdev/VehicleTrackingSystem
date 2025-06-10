import React from 'react';
import './UserProfile.css';
import { FaCar } from "react-icons/fa6";

const UserProfile = () => (
  <div className="user-profile">
    <img src="https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Profile" className="avatar" />
    <h2 className="username">username</h2>
    <div className="dispatch-info">
      <span className='caricon'><FaCar /></span><span className='tdispatches'>Total Dispatches</span>
    </div>
  </div>
);

export default UserProfile;
