import React, { useState, useRef } from 'react';
import axios from 'axios';
import './AddNews.css';

const AddNews = ({ handleBackToNews }) => {
  const [newsData, setNewsData] = useState([]);
  const [newImgFiles, setNewImgFiles] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newKind, setNewKind] = useState('1');
  const [errorMessage, setErrorMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState('smileys');
  const descriptionRef = useRef(null);

  const handleFormat = (formatType) => {
    let updatedDescription = newDescription;
    
    switch (formatType) {
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
    office: ['🎥','📸','📺','📣','📢','🎤','🎧','💼', '📎', '📊', '📈', '📉', '📅', '📆', '🗂️', '🗃️', '🖊️', '🎹', '🖌️', '🖍️', '📝', '📌', '🕑', '🕒','📥','📤','📧'],
    highlightemoji: ['🎓', '💯', '🎪', '🎡', '🎇', '🎁', '🎀', '🎗', '🎔', '🎉', '🔅', '🔽', '🔼', '🌟', '🌞'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'],
    foods: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🥝', '🍑', '🥭', '🍍', '🥥'],
    activities: ['⚽️', '🏀', '🏈', '⚾️', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥅', '🏒', '🏏', '🏑', '🥍'],
    travel: ['🚗', '✈️', '🚢', '🚌', '🚲', '🏍️', '🚁', '🛶', '🚀', '🚡', '🚠', '🚞', '🚝', '🚅', '🚄'],
    nature: ['🌳', '🌴', '🌵', '🌾', '🌿', '🍀', '🌼', '🌻', '🌺', '🌷', '🌹', '🌱', '🌲', '🍃', '🍂'],   
  };

  const addNews = async () => {
    if (newImgFiles.length === 0 || !newTitle || !newDetail || !newDescription) {
      alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    const formData = new FormData();
    Array.from(newImgFiles).forEach((file, index) => {
      formData.append(`imgFile[]`, file);
    });
    formData.append('title', newTitle);
    formData.append('detail', newDetail);
    formData.append('description', newDescription);
    formData.append('newskind', newKind);

    try {
      const response = await axios.post('http://13.238.142.81/education-api/admin/add_news.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data.success) {
        setNewsData([...newsData, {
          imgSrc: response.data.imgSrc, 
          title: newTitle,
          detail: newDetail,
          description: newDescription,
          kind: newKind
        }]);
        setNewImgFiles([]);
        setNewTitle('');
        setNewDetail('');
        setNewDescription('');
        setNewKind('1'); 
        setErrorMessage('');
        handleBackToNews();
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error adding news: ', error);
      setErrorMessage('An error occurred while adding the news.');
    }
  };

  return (
    <div className="app">
      <button className="close-button" onClick={handleBackToNews}>×</button>
      <h1>เพิ่มข่าว</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={e => { e.preventDefault(); addNews(); }}>
        <div>
          <label>รูปภาพ:</label>
          <input
            type="file"
            multiple
            onChange={e => setNewImgFiles(e.target.files)}
          />
        </div>
        <div>
          <label>ประเภทข่าว:</label>
          <select
            value={newKind}
            onChange={e => setNewKind(e.target.value)}
          >
            <option value="1">ข่าวประชาสัมพันธ์</option>
            <option value="2">ข่าวกิจกรรมสัมนา</option>
            <option value="3">ข่าวรับสมัครงาน</option>
            <option value="4">ข่าวจัดซื้อจัดจ้าง</option>
          </select>
        </div>
        <div>
          <label>หัวข้อข่าว:</label>
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
        </div>
        <div>
          <label>รายละเอียด:</label>
          <input
            type="text" 
            value={newDetail}
            onChange={e => setNewDetail(e.target.value)}
          />
        </div>
        <div className="editor-buttons">
          <button type="button" onClick={() => handleFormat('bold')} title="Bold"><b>B</b></button>
          <button type="button" onClick={() => handleFormat('italic')} title="Italic"><i>I</i></button>
          <button type="button" onClick={() => handleFormat('link')} title="Link">🔗</button>
          <button type="button" onClick={() => handleFormat('emoji')} title="Emoji">😊</button>
        </div>
        {showEmojiPicker && (
          <div>
            <label>เลือกหมวดหมู่ Emoji:</label>
            <div className="emoji-category-buttons">
              {Object.keys(emojiCategories).map(category => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedEmojiCategory(category)}
                  className={selectedEmojiCategory === category ? 'active' : ''}
                  title={category.charAt(0).toUpperCase() + category.slice(1)}
                >
                  {emojiCategories[category][0]}
                </button>
              ))}
            </div>
            <div className="emoji-picker">
              {emojiCategories[selectedEmojiCategory].map(emoji => (
                <span key={emoji} className="emoji" onClick={() => addEmoji(emoji)}>
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        )}
        <div>
          <label>คำอธิบาย:</label>
          <textarea
            ref={descriptionRef}
            value={newDescription}
            onChange={e => setNewDescription(e.target.value)}
          ></textarea>
        </div>
        <button type="submit">เพิ่มข่าว</button>
      </form>
    </div>
  );
};

export default AddNews;
