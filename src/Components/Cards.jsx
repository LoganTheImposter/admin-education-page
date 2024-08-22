import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Cards.css';

const Cards = () => {
  const [cards, setCards] = useState([]);
  const [formData, setFormData] = useState({ title: '', detail: '' });
  const [file, setFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState('smileys');

  const detailRef = useRef(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await axios.get('http://13.238.142.81/education-api/cardread.php');
      setCards(response.data);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูลการ์ด!', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    formDataObj.append('title', formData.title);
    formDataObj.append('detail', formData.detail);

    if (file) {
      formDataObj.append('file', file);
    }

    if (editId !== null) {
      formDataObj.append('id', editId);
      await axios.post('http://13.238.142.81/education-api/cardupdate.php', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      await axios.post('http://13.238.142.81/education-api/cardcreate.php', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }

    fetchCards();
    setFormData({ title: '', detail: '' });
    setFile(null);
    setEditId(null);
    setShowForm(false); // ซ่อนฟอร์มหลังจากเพิ่มหรือแก้ไขการ์ด
  };

  const handleEdit = (card) => {
    setFormData({ title: card.title, detail: card.detail });
    setEditId(card.id);
    setShowForm(true); // แสดงฟอร์มเมื่อแก้ไข
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบการ์ดนี้?');
    if (confirmDelete) {
      await axios.post('http://13.238.142.81/education-api/carddelete.php', { id });
      fetchCards();
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setFormData({ title: '', detail: '' });
    setFile(null);
    setEditId(null);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/png')) {
      setFile(selectedFile);
    } else {
      alert('กรุณาเลือกไฟล์รูปภาพที่เป็น .jpg หรือ .png เท่านั้น');
    }
  };

  const insertText = (tag) => {
    const { detail } = formData;
    let updatedDetail;
    switch (tag) {
      case 'link':
        const linkText = prompt('ใส่ข้อความที่ต้องการแสดงเป็นลิงก์:');
        const url = prompt('ใส่ URL ที่ต้องการลิงก์:');
        if (linkText && url) {
          updatedDetail = `${detail}<a href="${url}" target="_blank">${linkText}</a>`;
        } else {
          alert('กรุณาใส่ข้อความและ URL');
          return;
        }
        break;
      case 'emoji':
        setShowEmojiPicker(!showEmojiPicker);
        return;
      case 'bold':
        const boldText = prompt('ใส่ข้อความที่ต้องการทำให้หนา:');
        if (boldText) {
          updatedDetail = `${detail}<b>${boldText}</b>`;
        } else {
          alert('กรุณาใส่ข้อความ');
          return;
        }
        break;
      case 'italic':
        const italicText = prompt('ใส่ข้อความที่ต้องการทำให้เอียง:');
        if (italicText) {
          updatedDetail = `${detail}<i>${italicText}</i>`;
        } else {
          alert('กรุณาใส่ข้อความ');
          return;
        }
        break;
      default:
        updatedDetail = detail;
    }
    setFormData({ ...formData, detail: updatedDetail });
  };

  const addEmoji = (emoji) => {
    const textarea = detailRef.current;
    const { selectionStart, selectionEnd } = textarea;
    const newText =
      formData.detail.slice(0, selectionStart) +
      emoji +
      formData.detail.slice(selectionEnd);

    setFormData({ ...formData, detail: newText });

    // Set cursor position after the emoji
    setTimeout(() => {
      textarea.setSelectionRange(selectionStart + emoji.length, selectionStart + emoji.length);
      textarea.focus();
    }, 0);
  };

  const emojiCategories = {
    smileys: ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '😗'],
    office: ['🎥','📸','📺','📣','📢','🎤','🎧','💼', '📎', '📊', '📈', '📉', '📅', '📆', '🗂️', '🗃️', '🖊️', '🎹', '🖌️', '🖍️', '📝', '📌', '🕑', '🕒','📥','📤','📧'],
    highlightemoji: ['🎓', '💯', '🎪', '🎡', '🎇', '🎁', '🎀', '🎗', '🎔', '🎉', '🔅', '🔽', '🔼', '🌟', '🌞'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'],
    foods: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🥝', '🍑', '🥭', '🍍', '🥥'],
    activities: ['⚽️', '🏀', '🏈', '⚾️', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥅', '🏒', '🏏', '🏑', '🥍'],
    travel: ['🚗', '✈️', '🚢', '🚌', '🚲', '🏍️', '🚁', '🛶', '🚀', '🚡', '🚠', '🚞', '🚝', '🚅', '🚄'],
    nature: ['🌳', '🌴', '🌵', '🌾', '🌿', '🍀', '🌼', '🌻', '🌺', '🌷', '🌹', '🌱', '🌲', '🍃', '🍂'],   
  };

  const handleCategoryChange = (category) => {
    setSelectedEmojiCategory(category);
  };

  return (
    <div className="container">
      <div className="header">
        <h2>การ์ด</h2>
        <button className="add-card-btn" onClick={toggleForm}>
          {showForm ? 'ยกเลิก' : 'เพิ่มการ์ด'}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <label>รูปภาพ</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
          <label>หัวข้อ</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <div className="detail-label-toolbar">
            <label>รายละเอียด</label>
            <div className="button-toolbar">
              <button type="button" onClick={() => insertText('link')} title="ใส่ลิงค์">🔗</button>
              <button type="button" onClick={() => insertText('emoji')} title="ใส่อิโมจิ">😊</button>
              <button type="button" onClick={() => insertText('bold')} title="ใส่อักษรหนา">𝗕</button>
              <button type="button" onClick={() => insertText('italic')} title="ใส่อักษรเอียง">𝘐</button>
            </div>
          </div>
          {showEmojiPicker && (
            <div className="emoji-picker">
              <div className="emoji-categories">
                {Object.keys(emojiCategories).map((category) => (
                  <button
                    type="button" // ป้องกันการส่งฟอร์ม
                    key={category}
                    className={`emoji-category-button ${selectedEmojiCategory === category ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault(); // ป้องกันการส่งฟอร์มเมื่อกดปุ่ม
                      handleCategoryChange(category);
                    }}
                  >
                    {emojiCategories[category][0]}
                  </button>
                ))}
              </div>
              <div className="emoji-list">
                {emojiCategories[selectedEmojiCategory].map((emoji, index) => (
                  <button 
                    type="button" // ป้องกันการส่งฟอร์ม
                    key={index} 
                    onClick={(e) => {
                      e.preventDefault(); // ป้องกันการส่งฟอร์มเมื่อกดปุ่ม
                      addEmoji(emoji);
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
          <textarea
            ref={detailRef}
            placeholder="รายละเอียด"
            value={formData.detail}
            onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
            style={{ flexGrow: 1 }} // Make textarea expand to fill space
          />
          <button type="submit">{editId ? 'อัปเดต' : 'สร้าง'}</button>
        </form>
      )}
      <ul>
        {cards.map((card) => (
          <li className="card" key={card.id}>
            <img src={`http://13.238.142.81/education-api/uploads/${card.imgSrc}`} alt={card.title} />
            <div className="card-content"> {/* ใช้ class ใหม่สำหรับจัดการเนื้อหา */}
              <h3>{card.title}</h3>
              <div dangerouslySetInnerHTML={{ __html: card.detail }} />
            </div>
            <div className="button-group">
              <button onClick={() => handleEdit(card)}>แก้ไข</button>
              <button onClick={() => handleDelete(card.id)}>ลบ</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cards;
