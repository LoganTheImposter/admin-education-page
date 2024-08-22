import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContactForm.css'; // Import CSS file for styling

function ContactForm() {
    const [contact, setContact] = useState({ map_iframe: '', details: '' });
    const [showEmojiPicker2, setShowEmojiPicker2] = useState(false);
    const emojis = ['📞', '✉️', '📘', '▶️', '💬', '🔗'];

    useEffect(() => {
        fetchContact();
    }, []);

    const fetchContact = async () => {
        try {
            const response = await axios.get('http://13.238.142.81/education-api/admin/contact/read.php');
            if (response.data) {
                setContact(response.data);
            }
        } catch (error) {
            console.error("Error fetching contact data", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContact({ ...contact, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://13.238.142.81/education-api/admin/contact/update.php', contact);
            alert('Contact information updated successfully.');
        } catch (error) {
            console.error("Error updating contact information", error);
        }
    };

    const formatText = (tag) => {
        if (tag === 'link') {
            const url = window.prompt('Enter the URL:');
            const text = window.prompt('Enter the display text:');
            if (url && text) {
                const formattedText = `<a href="${url}">${text}</a>`;
                insertAtCursor(formattedText);
            }
        } else {
            const text = window.prompt(`Enter text for ${tag}:`);
            if (text) {
                const formattedText = `<${tag}>${text}</${tag}>`;
                insertAtCursor(formattedText);
            }
        }
    };

    const insertAtCursor = (text) => {
        const textarea = document.getElementById('details');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;

        textarea.value = value.substring(0, start) + text + value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + text.length;

        setContact({ ...contact, details: textarea.value });
    };

    return (
        <div className="contact-form-container">
            <h1>แก้ไขข้อมูลการติดต่อ</h1>
            <form onSubmit={handleSubmit} className="contact-form">
                <div className="main-section">
                    <div className="map-section">
                        <div className="map-display">
                            {contact.map_iframe && (
                                <div
                                    className="map-frame"
                                    dangerouslySetInnerHTML={{ __html: contact.map_iframe }}
                                />
                            )}
                        </div>
                        <div className="map-input">
                            <label htmlFor="map_iframe">Google Map Iframe:</label>
                            <textarea
                                id="map_iframe"
                                name="map_iframe"
                                value={contact.map_iframe}
                                onChange={handleInputChange}
                                placeholder="ใส่โค้ด Google Map iframe ที่นี่"
                                required
                            />
                        </div>
                    </div>
                    <div className="details-section">
                        <div className="tools">
                            <button type="button" onClick={() => formatText('link')} title="Add Link">🔗</button>
                            <button type="button" onClick={() => formatText('b')} title="Bold"><b>B</b></button>
                            <button type="button" onClick={() => formatText('i')} title="Italic"><i>I</i></button>
                            <button type="button" onClick={() => setShowEmojiPicker2(!showEmojiPicker2)} title="Emoji Picker">😀</button>
                        </div>
                        {showEmojiPicker2 && (
                            <div className="emoji-picker">
                                {emojis.map((emoji, index) => (
                                    <button key={index} type="button" onClick={() => insertAtCursor(emoji)}>
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}
                        <textarea
                            id="details"
                            name="details"
                            value={contact.details}
                            onChange={handleInputChange}
                            placeholder="ใส่รายละเอียดการติดต่อ"
                            required
                        />
                    </div>
                </div>
                <button type="submit">บันทึกการเปลี่ยนแปลง</button>
            </form>
        </div>
    );
}

export default ContactForm;
