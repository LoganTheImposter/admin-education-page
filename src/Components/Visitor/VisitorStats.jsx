// src/Components/VisitorStats.js
import React, { useEffect, useState } from 'react';
import './VisitorStats.css';

const VisitorStats = () => {
  const [stats, setStats] = useState({
    daily: 0,
    monthly: 0,
    yearly: 0,
  });

  const fetchVisitorStats = async () => {
    try {
      const response = await fetch('http://13.238.142.81/education-api/admin/counting/getVisitorStats.php');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching visitor stats:', error);
    }
  };

  useEffect(() => {
    // ดึงข้อมูลเมื่อ component ถูก mount
    fetchVisitorStats();

    // ตั้งค่า interval เพื่อตรวจสอบการเปลี่ยนแปลงของวัน เดือน ปี
    const intervalId = setInterval(() => {
      fetchVisitorStats();
    }, 60000); // ตรวจสอบทุกนาที

    // ล้าง interval เมื่อ component ถูก unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="visitor-stats-container">
      <h2>ข้อมูลจำนวนผู้เข้าใช้งาน</h2>
      <div className="visitor-stats">
        <div className="stat-box">
          <strong>รายวัน</strong>
          <div>{stats.daily}</div>
        </div>
        <div className="stat-box">
          <strong>รายเดือน</strong>
          <div>{stats.monthly}</div>
        </div>
        <div className="stat-box">
          <strong>รายปี</strong>
          <div>{stats.yearly}</div>
        </div>
      </div>
    </div>
  );
};

export default VisitorStats;
