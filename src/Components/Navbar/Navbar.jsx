import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { MdOutlineTravelExplore } from 'react-icons/md';
import { AiFillCloseCircle } from 'react-icons/ai';
import { TbGridDots } from 'react-icons/tb';
import './Navbar.css';  // Ensure this CSS file exists

const Navbar = ({ setIsAuthenticated }) => {
  const [active, setActive] = useState('navBar');
  const navigate = useNavigate(); // Initialize navigate

  const showNav = () => {
    setActive('navBar activeNavbar');
  };

  const removeNav = () => {
    setActive('navBar');
  };

  const top = () => {
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setIsAuthenticated(false); // Update the authentication state
    navigate('/'); // Redirect to the login page or home
  };

  return (
    <section className='navBarSection'>
      <header className="header flex">
        <div className="logoDiv">
          <Link to="/" className="logo flex" onClick={top}>
            <h1><MdOutlineTravelExplore className='icon' /> ระบบจัดการเว็บไซต์สมัชชาศึกษา</h1>
          </Link>
        </div>

        <div className={active}>
          <ul onClick={removeNav} className="navLists flex">
            <li className="navItem" onClick={top}>
              <Link to="/ข่าวสาร" className="navLink">ข่าวสาร</Link>
            </li>
            <li className="navItem" onClick={top}>
              <Link to="/กิจกรรม" className="navLink">กิจกรรม</Link>
            </li>
            <li className="navItem" onClick={top}>
              <Link to="/การ์ด" className="navLink">การ์ด</Link>
            </li>
            <li className="navItem" onClick={top}>
              <Link to="/เอกสารเผยแพร่" className="navLink">เอกสารเผยแพร่</Link>
            </li>
            <li className="navItem" onClick={top}>
              <Link to="/โครงสร้างบุคลากร" className="navLink">โครงสร้างบุคลากร</Link>
            </li>
            <li className="navItem" onClick={top}>
              <Link to="/ติดต่อ" className="navLink">ติดต่อ</Link>
            </li>
            <button className="btn" onClick={handleLogout}>
              ออกจากระบบ
            </button>
          </ul>
          <div onClick={removeNav} className="closeNavbar">
            <AiFillCloseCircle className='icon' />
          </div>
        </div>

        <div onClick={showNav} className="toggleNavbar">
          <TbGridDots className='icon' />
        </div>
      </header>
    </section>
  );
};

export default Navbar;
