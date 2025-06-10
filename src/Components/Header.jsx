import React from 'react';
import './Header.css';
import { FaRegBell } from "react-icons/fa";
import { CgLogOut } from "react-icons/cg";

const Header = () => (
  <header className="header">
    <button className="logout"><CgLogOut /> Log Out</button>
    <div className="notification"><FaRegBell className='bell' /></div>
  </header>
);

export default Header;
