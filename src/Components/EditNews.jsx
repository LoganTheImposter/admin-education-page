import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './EditNews.css';

function EditNews({ newsId, handleBackToNews, handleUpdateNews }) {
  const [newsData, setNewsData] = useState({
    id: '',
    title: '',
    detail: '',
    description: '',
    imgSrc: '',
    date: '',
    newskind: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newImgFiles, setNewImgFiles] = useState([]);
  const [newDescription, setNewDescription] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState(null);
  const descriptionRef = useRef();

  useEffect(() => {
    axios.get(`http://13.238.142.81/education-api/fetchNews.php?id=${newsId}`)
      .then(response => {
        setNewsData(response.data);
        setNewDescription(response.data.description);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [newsId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewsData({ ...newsData, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewImgFiles([...newImgFiles, ...Array.from(e.target.files)]);
};


  const handleRemoveImage = (imageName) => {
    setNewsData({
      ...newsData,
      imgSrc: newsData.imgSrc.split(',').filter(img => img !== imageName).join(',')
    });
  };

  const handleDescriptionAction = (action) => {
    let updatedDescription = newDescription;
    switch (action) {
      case 'link':
        const linkText = prompt('ใส่ข้อความที่ต้องการแสดงเป็นลิงก์:');
        const url = prompt('ใส่ URL ที่ต้องการลิงก์:');
        if (linkText && url) {
          updatedDescription += ` <a href="${url}" target="_blank">${linkText}</a>`;
        } else {
          alert('กรุณาใส่ข้อความและ URL');
          return;
        }
        break;
      case 'bold':
        const boldText = prompt('ใส่ข้อความที่ต้องการทำให้หนา:');
        if (boldText) {
          updatedDescription += ` <b>${boldText}</b>`;
        } else {
          alert('กรุณาใส่ข้อความ');
          return;
        }
        break;
      case 'italic':
        const italicText = prompt('ใส่ข้อความที่ต้องการทำให้เอียง:');
        if (italicText) {
          updatedDescription += ` <i>${italicText}</i>`;
        } else {
          alert('กรุณาใส่ข้อความ');
          return;
        }
        break;
      case 'emoji':
        setShowEmojiPicker(!showEmojiPicker);
        return;
      default:
        updatedDescription = newDescription;
    }
    setNewDescription(updatedDescription);
  };

  const addEmoji = (emoji) => {
    const textarea = descriptionRef.current;
    const { selectionStart, selectionEnd } = textarea;
    const newText =
      newDescription.slice(0, selectionStart) +
      emoji +
      newDescription.slice(selectionEnd);

    setNewDescription(newText);

    setTimeout(() => {
      textarea.setSelectionRange(selectionStart + emoji.length, selectionStart + emoji.length);
      textarea.focus();
    }, 0);
  };

  const emojiCategories = {
    smileys: ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '😗'],
    office: ['🎥', '📸', '📺', '📣', '📢', '🎤', '🎧', '💼', '📎', '📊', '📈', '📉', '📅', '📆', '🗂️', '🗃️', '🖊️', '🎹', '🖌️', '🖍️', '📝', '📌', '🕑', '🕒', '📥', '📤', '📧'],
    highlightemoji: ['🎓', '💯', '🎪', '🎡', '🎇', '🎁', '🎀', '🎗', '🎔', '🎉', '🔅', '🔽', '🔼', '🌟', '🌞'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'],
    foods: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🥝', '🍑', '🥭', '🍍', '🥥'],
    activities: ['⚽️', '🏀', '🏈', '⚾️', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥅', '🏒', '🏏', '🏑', '🥍'],
    travel: ['🚗', '✈️', '🚢', '🚌', '🚲', '🏍️', '🚁', '🛶', '🚀', '🚡', '🚠', '🚞', '🚝', '🚅', '🚄'],
    nature: ['🌳', '🌴', '🌵', '🌾', '🌿', '🍀', '🌼', '🌻', '🌺', '🌷', '🌹', '🌱', '🌲', '🍃', '🍂'],
  };

  const handleCategoryClick = (category) => {
    setSelectedEmojiCategory(category);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('id', newsData.id);
    formData.append('title', newsData.title);
    formData.append('detail', newsData.detail);
    formData.append('description', newDescription);
    formData.append('date', newsData.date);
    formData.append('newskind', newsData.newskind);
    formData.append('imgChanged', newImgFiles.length > 0 ? 1 : 0);
    formData.append('oldImgSrc', newsData.imgSrc); // ส่งชื่อรูปภาพเก่าไปด้วย

    newImgFiles.forEach((file, index) => {
        formData.append(`imgFile${index}`, file);
    });

    axios.post('http://13.238.142.81/education-api/updateNews.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
        if (response.data.success) {
            handleUpdateNews(response.data.updatedNews);
        } else {
            setError(response.data.error || 'Error updating news.');
        }
    })
    .catch(error => {
        console.error('Error updating news:', error.message);
        setError('Error updating news: ' + error.message);
    });
};


  if (loading) return <p>กำลังโหลด...</p>;
  if (error) return <p>เกิดข้อผิดพลาด: {error}</p>;

  return (
    <form onSubmit={handleSubmit} className="edit-news-form">
  <button type="button" className="close-button" onClick={handleBackToNews}>×</button>
  <div>
    <label>หัวข้อข่าว:</label>
    <input type="text" name="title" value={newsData.title} onChange={handleChange} />
  </div>
  <div>
    <label>รายละเอียด:</label>
    <input type="text" name="detail" value={newsData.detail} onChange={handleChange} />
  </div>
  <div>
    <label>คำอธิบาย:</label>
    <div className="description-actions">
      <button type="button" onClick={() => handleDescriptionAction('bold')}>B</button>
      <button type="button" onClick={() => handleDescriptionAction('italic')}>I</button>
      <button type="button" onClick={() => handleDescriptionAction('link')}>🔗</button>
      <button type="button" onClick={() => handleDescriptionAction('emoji')}>😊</button>
    </div>
    {showEmojiPicker && (
      <div className="emoji-picker">
        <div className="emoji-categories">
          {Object.keys(emojiCategories).map(category => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={selectedEmojiCategory === category ? 'active' : ''}
              type="button"  // Ensure this is type="button"
            >
              {emojiCategories[category][0]}
            </button>
          ))}
        </div>
        {selectedEmojiCategory && (
          <div className="emoji-list">
            {emojiCategories[selectedEmojiCategory].map(emoji => (
              <span key={emoji} onClick={() => addEmoji(emoji)}>{emoji}</span>
            ))}
          </div>
        )}
      </div>
    )}
    <textarea
      name="description"
      value={newDescription}
      onChange={(e) => setNewDescription(e.target.value)}
      ref={descriptionRef}
    />
  </div>
  <div>
    <label>วันที่:</label>
    <input type="date" name="date" value={newsData.date} onChange={handleChange} />
  </div>
  <div>
    <label>ประเภทข่าว:</label>
    <select name="newskind" value={newsData.newskind} onChange={handleChange}>
      <option value="1">ข่าวประชาสัมพันธ์</option>
      <option value="2">ข่าวกิจกรรมสัมนา</option>
      <option value="3">ข่าวรับสมัครงาน</option> 
      <option value="4">ข่าวจัดซื้อจัดจ้าง</option>
    </select>
  </div>
  <div>
    <label>เปลี่ยนรูปภาพ:</label>
    <input type="file" multiple onChange={handleFileChange} />
    <div className="current-images">
      {newsData.imgSrc.split(',').map((src, index) => (
        <div key={index} className="image-container">
          <img
            src={`http://13.238.142.81/education-api/uploads/${src.trim()}`}
            alt={`${newsData.title}-${index}`}
            className="edit-news-image"
          />
          <button type="button" onClick={() => handleRemoveImage(src)}>ลบ</button>
        </div>
      ))}
    </div>
  </div>
  <button type="submit">บันทึก</button>
</form>

  );
}

export default EditNews;
