import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Submenu.css';
import SubmenuForm from './SubmenuForm';

const SubmenuList = () => {
  const [submenus, setSubmenus] = useState([]);
  const [selectedSubmenu, setSelectedSubmenu] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // State สำหรับจัดการหน้าปัจจุบัน
  const itemsPerPage = 6; // จำนวนรายการต่อหน้า

  useEffect(() => {
    refreshSubmenus();
  }, []);

  const refreshSubmenus = () => {
    axios.get(`http://13.238.142.81/education-api/admin/submenu/submenu_read.php`)
      .then(response => setSubmenus(response.data))
      .catch(error => console.error('Error fetching submenus:', error));
  };

  const handleEdit = (submenu) => {
    setSelectedSubmenu(submenu);
    setShowForm(true); // แสดงฟอร์มเมื่อคลิกแก้ไข
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this submenu?')) {
      axios.delete(`http://13.238.142.81/education-api/admin/submenu/submenu_delete.php`, { data: { id } })
        .then(response => refreshSubmenus())
        .catch(error => console.error('Error deleting submenu:', error));
    }
  };

  const handleToggleForm = () => {
    setShowForm(!showForm); // สลับการแสดงฟอร์มเมื่อคลิกปุ่ม
    setSelectedSubmenu(null); // รีเซ็ตฟอร์มเมื่อเพิ่มใหม่
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // คำนวณรายการที่จะแสดงในหน้าปัจจุบัน
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = submenus.slice(indexOfFirstItem, indexOfLastItem);

  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(submenus.length / itemsPerPage);

  return (
    <div className="submenu-list-container">
      <div className="header-section">
        <h1>เมนูที่มีอยู่</h1>
        <button onClick={handleToggleForm} className="toggle-form-btn">
          {showForm ? 'X' : 'เพิ่มเมนู'}
        </button>
      </div>
      {showForm && (
        <SubmenuForm
          selectedSubmenu={selectedSubmenu}
          refreshSubmenus={refreshSubmenus}
        />
      )}     
      <ul className="submenu-list">
        {currentItems.map(submenu => (
          <li key={submenu.id} className="submenu-item">
            <h3>{submenu.name}</h3>
            <p>อยู่ในหน้า: {submenu.parent}</p>
            <button onClick={() => handleEdit(submenu)}>แก้ไข</button>
            <button onClick={() => handleDelete(submenu.id)}>ลบ</button>
          </li>
        ))}
      </ul>
      {/* ปุ่มสำหรับเปลี่ยนหน้า */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={index + 1 === currentPage ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmenuList;
