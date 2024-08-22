import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Submenu.css';

const SubmenuForm = ({ selectedSubmenu, refreshSubmenus }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parent, setParent] = useState(''); 
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (selectedSubmenu) {
      setName(selectedSubmenu.name);
      setDescription(selectedSubmenu.description);
      setParent(selectedSubmenu.parent); 
    } else {
      resetForm();
    }
  }, [selectedSubmenu]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setParent(''); 
    setImageFile(null);
    setIsSubmitted(false);
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('id', selectedSubmenu?.id); // ส่ง ID ไปกับฟอร์มในกรณีที่กำลังแก้ไข
    formData.append('name', name);
    formData.append('description', description);
    formData.append('parent', parent); 
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const url = selectedSubmenu
      ? 'http://13.238.142.81/education-api/admin/submenu/submenu_update.php'
      : 'http://13.238.142.81/education-api/admin/submenu/submenu_create.php';

    axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        console.log(response.data);
        refreshSubmenus();
        resetForm();
        setIsSubmitted(true);
      })
      .catch(error => console.error('Error submitting submenu:', error));
  };

  const insertAtCursor = (text) => {
    const textarea = document.getElementById('description');
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const beforeText = textarea.value.substring(0, startPos);
    const afterText = textarea.value.substring(endPos, textarea.value.length);
    setDescription(beforeText + text + afterText);
  };

  const handleBoldClick = () => {
    const boldText = prompt("Enter the text you want to make bold:");
    if (boldText) {
      insertAtCursor(`<b>${boldText}</b>`);
    }
  };

  const handleItalicClick = () => {
    const italicText = prompt("Enter the text you want to make italic:");
    if (italicText) {
      insertAtCursor(`<i>${italicText}</i>`);
    }
  };

  const handleLinkClick = () => {
    const url = prompt("Enter the URL for the link:");
    const linkText = prompt("Enter the text for the link:");
    if (url && linkText) {
      insertAtCursor(`<a href="${url}" target="_blank">${linkText}</a>`);
    }
  };

  if (isSubmitted) {
    return <p>Submenu successfully submitted!</p>;
  }

  return (
    <form className="submenu-form" onSubmit={handleSubmit}>
      <h2>{selectedSubmenu ? 'Edit Submenu' : 'Add Submenu'}</h2>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <div className="controls">
            <button type="button" onClick={handleLinkClick}>🔗</button>
            <button type="button" onClick={handleBoldClick}><b>B</b></button>
            <button type="button" onClick={handleItalicClick}><i>I</i></button>
          </div>
        <div className="description-container">
          <textarea
            id="description"            
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="parent">Category:</label>
        <select
          id="parent"
          value={parent}
          onChange={(e) => setParent(e.target.value)}
          required
        >
          <option value="">-- Please choose an option --</option>
          <option value="เกี่ยวกับเรา">เกี่ยวกับเรา</option>
          <option value="กิจกรรมต่างๆ">กิจกรรมต่างๆ</option>
          <option value="เอกสารเผยแพร่">เอกสารเผยแพร่</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="image">Upload Image:</label>
        <input
          type="file"
          id="image"
          accept=".jpg,.png"
          onChange={handleImageChange}
        />
      </div>
      <button type="submit">{selectedSubmenu ? 'Update' : 'Add'}</button>
    </form>
  );
};

export default SubmenuForm;
