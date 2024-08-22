import React, { useState, useEffect } from 'react';
import './Downloads.css';

function Downloads() {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [message, setMessage] = useState('');
  const [downloads, setDownloads] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false); // State to control form visibility

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      const response = await fetch('http://13.238.142.81/education-api/getDownloads.php');
      const data = await response.json();
      if (data.success) {
        setDownloads(data.downloads);
      }
    } catch (error) {
      console.error('Error fetching downloads:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId
      ? `http://13.238.142.81/education-api/editDownload.php?id=${editingId}`
      : 'http://13.238.142.81/education-api/downloadlink.php';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, link }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('ข้อมูลถูกบันทึกเรียบร้อยแล้ว');
        fetchDownloads(); // Refresh the list
        setTitle('');
        setLink('');
        setEditingId(null);
        setShowForm(false); // Hide the form after submitting
      } else {
        setMessage('เกิดข้อผิดพลาด: ' + data.message);
      }
    } catch (error) {
      setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
    }
  };

  const handleEdit = (id, title, link) => {
    setEditingId(id);
    setTitle(title);
    setLink(link);
    setShowForm(true); // Show form for editing
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://13.238.142.81/education-api/deleteDownload.php?id=${id}`, {
        method: 'POST',
      });
      const data = await response.json();

      if (data.success) {
        setMessage('ลบข้อมูลเรียบร้อยแล้ว');
        fetchDownloads(); // Refresh the list
      } else {
        setMessage('เกิดข้อผิดพลาด: ' + data.message);
      }
    } catch (error) {
      setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
    }
  };

  return (
    <div className="containerDownload">
      <div className="headerDownload">
        <h2>เอกสารเผยแพร่</h2>
        <button
          className="add-cardDownloads-btn"
          onClick={() => {
            if (showForm) {
              // If form is open, set it to close
              setShowForm(false);
              setTitle('');
              setLink('');
              setEditingId(null);
            } else {
              // If form is closed, prepare it for adding new document
              setEditingId(null);
              setTitle('');
              setLink('');
              setShowForm(true);
            }
          }}
        >
          {showForm ? 'ยกเลิก' : 'เพิ่มเอกสาร'}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label htmlFor="link">Link:</label>
          <input
            type="url"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
          <button type="submit">{editingId ? 'บันทึกการแก้ไข' : 'บันทึก'}</button>
        </form>
      )}
      {message && <p>{message}</p>}
      <ul>
        {downloads.map((download) => (
          <li className="cardDownloads" key={download.id}>
            <div className="cardDownloads-content">
              <h3>{download.title}</h3>
              <div>{download.link}</div>
            </div>
            <div className="button-group">
              <button onClick={() => handleEdit(download.id, download.title, download.link)}>แก้ไข</button>
              <button onClick={() => handleDelete(download.id)}>ลบ</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Downloads;
