import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RankForm from './RankForm'; // Import RankForm component
import './StaffForm.css'; // Import CSS file

function StaffForm() {
    const [staff, setStaff] = useState([]);
    const [form, setForm] = useState({ first_name: '', last_name: '', S_rank: '', imgSrc: '' });
    const [editing, setEditing] = useState(null);
    const [preview, setPreview] = useState(null); // For image preview
    const [ranks, setRanks] = useState([]); // To store existing ranks
    const [showRankForm, setShowRankForm] = useState(false); // State to show/hide RankForm

    useEffect(() => {
        fetchStaff();
        fetchRanks();
    }, []);

    const fetchStaff = async () => {
        try {
            const response = await axios.get('http://13.238.142.81/education-api/admin/staff/read.php');
            setStaff(response.data);
        } catch (error) {
            console.error("Error fetching staff data", error);
        }
    };

    const fetchRanks = async () => {
        try {
            const response = await axios.get('http://13.238.142.81/education-api/admin/staff/rank/read.php');
            setRanks(response.data);
        } catch (error) {
            console.error("Error fetching ranks", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        // Display image preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }

        try {
            const response = await axios.post('http://13.238.142.81/education-api/admin/staff/upload.php', formData);
            if (response.data.status === 'success') {
                setForm({ ...form, imgSrc: response.data.fileName });
            } else {
                alert('Failed to upload image');
            }
        } catch (error) {
            console.error("Error uploading image", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing !== null) {
                await axios.post('http://13.238.142.81/education-api/admin/staff/update.php', { ...form, id: editing });
            } else {
                await axios.post('http://13.238.142.81/education-api/admin/staff/create.php', form);
            }
            setForm({ first_name: '', last_name: '', S_rank: '', imgSrc: '' });
            setEditing(null);
            setPreview(null); // Reset image preview
            fetchStaff();
        } catch (error) {
            console.error("Error submitting form", error);
        }
    };

    const handleEdit = (id) => {
        const staffMember = staff.find((member) => member.id === id);
        setForm(staffMember);
        setEditing(id);
        setPreview(`http://13.238.142.81/education-api/uploads/${staffMember.imgSrc}`); // Show current image
    };

    const handleDelete = async (id) => {
        try {
            await axios.post('http://13.238.142.81/education-api/admin/staff/delete.php', { id });
            fetchStaff();
        } catch (error) {
            console.error("Error deleting staff member", error);
        }
    };

    // Handle opening and closing of rank form
    const toggleRankForm = () => {
        setShowRankForm(!showRankForm);
    };

    return (
        <div className="staff-form-wrapper">
            <div className={`staff-form-container ${showRankForm ? 'blur-background' : ''}`}>
                <h1>จัดการโครงสร้างบุคลากร</h1>
                <form onSubmit={handleSubmit} className="staff-form">
                    <input
                        type="text"
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                        placeholder="ชื่อ"
                        required
                    />
                    <input
                        type="text"
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        placeholder="นามสกุล"
                        required
                    />
                    <select
                        name="S_rank"
                        value={form.S_rank}
                        onChange={handleChange}
                        required
                    >
                        <option value="">เลือกตำแหน่ง</option>
                        {ranks.map((rank) => (
                            <option key={rank.id} value={rank.S_rank}>
                                {rank.S_rank}
                            </option>
                        ))}
                    </select>
                    <a href="#!" onClick={toggleRankForm} className="rank-link">เพิ่มตำแหน่ง</a>
                    <input
                        type="file"
                        onChange={handleFileChange} 
                    />
                    {preview && <img src={preview} alt="Preview" className="preview-image" />} {/* Show preview image */}
                    <button type="submit">{editing !== null ? 'ปรับปรุง' : 'สร้าง'}</button>
                </form>
                <ul className="staff-list">
                    {staff.map((member) => (
                        <li key={member.id} className="staff-list-item">
                            <img src={`http://13.238.142.81/education-api/uploads/${member.imgSrc}`} alt={member.first_name} className="staff-image" />
                            <div className="staff-info">
                                {member.first_name} {member.last_name} - {member.S_rank}
                            </div>
                            <div className="staff-actions">
                                <button onClick={() => handleEdit(member.id)}>แก้ไข</button>
                                <button onClick={() => handleDelete(member.id)}>ลบ</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {showRankForm && (
                <div className="overlay">
                    <RankForm onClose={toggleRankForm} />
                </div>
            )}
        </div>
    );
}

export default StaffForm;
