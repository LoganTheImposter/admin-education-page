import React, { useState, useEffect } from "react";
import axios from "axios";
import './Activity.css'; // import CSS

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState({
    id: null,
    imgSrc: [], // อาร์เรย์เพื่อรองรับหลายภาพ
    title: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });
  const [editing, setEditing] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get("http://13.238.142.81/education-api/admin/activity/getActivity.php");
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, imgSrc: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('id', form.id);
    formData.append('title', form.title);
    formData.append('date', form.date);
    formData.append('description', form.description);

    form.imgSrc.forEach((file, index) => {
      formData.append(`imgSrc[]`, file);
    });

    console.log("Submitting form with data:", formData); // ตรวจสอบข้อมูลที่ถูกส่ง

    if (editing) {
      await axios.post("http://13.238.142.81/education-api/admin/activity/updateActivity.php", formData);
    } else {
      await axios.post("http://13.238.142.81/education-api/admin/activity/addActivity.php", formData);
    }
    
    setForm({
      id: null,
      imgSrc: [],
      title: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    });
    setEditing(false);
    setFormVisible(false);
    fetchActivities();
  };

  const handleEdit = (activity) => {
    console.log("Editing activity:", activity); // ตรวจสอบข้อมูลกิจกรรมที่กำลังถูกแก้ไข
    setForm({ 
      ...activity, 
      imgSrc: [] // Reset imgSrc to empty array on edit 
    });
    setEditing(true);
    setFormVisible(true);
  };

  const handleDeleteActivity = async (id) => {
    console.log("Deleting activity with ID:", id); // ตรวจสอบ ID ของกิจกรรมที่กำลังถูกลบ
    await axios.post("http://13.238.142.81/education-api/admin/activity/deleteActivity.php", { id });
    fetchActivities();
  };

  const handleDeleteImage = async (activityId, imageName) => {
    console.log("Deleting image with ID:", activityId, "and imageName:", imageName);

    try {
        const response = await axios.post("http://13.238.142.81/education-api/admin/activity/deleteImage.php", {
            id: activityId,
            imageName: imageName
        }, {
            headers: {
                "Content-Type": "application/json" // ตั้งค่า headers สำหรับ JSON
            }
        });

        console.log("Response from server:", response.data);
        if (response.data.success) {
            console.log("Image deleted successfully.");
        } else {
            console.error("Failed to delete image:", response.data.message);
        }
    } catch (error) {
        console.error('Error deleting image:', error);
    }

    fetchActivities(); // อัปเดตกิจกรรมหลังการลบภาพ
  };

  const toggleForm = () => {
    setFormVisible(!formVisible);
    if (!formVisible) {
      setEditing(false);
      setForm({
        id: null,
        imgSrc: [],
        title: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>จัดการกิจกรรม</h1>
        <button onClick={toggleForm} className="add-button">
          {formVisible ? "ปิดฟอร์ม" : "เพิ่มกิจกรรม"}
        </button>
      </div>

      {formVisible && (
        <form onSubmit={handleSubmit} className="form">
          <label>รูปภาพ:</label>
          <input
            type="file"
            name="imgSrc"
            onChange={handleFileChange}
            className="input"
            multiple // เพิ่ม multiple attribute เพื่อรองรับหลายภาพ
          />
          <label>หัวข้อกิจกรรม:</label>
          <input
            type="text"
            name="title"
            placeholder="หัวข้อกิจกรรม"
            value={form.title}
            onChange={handleInputChange}
            className="input"
          />
          <label>วัน/เดือน/ปี:</label>
          <input
            type="date"
            name="date"
            placeholder="วัน/เดือน/ปี"
            value={form.date}
            onChange={handleInputChange}
            className="input"
          />
          <label>รายละเอียด:</label>
          <textarea
            name="description"
            placeholder="รายละเอียด"
            value={form.description}
            onChange={handleInputChange}
            className="textarea"
          />
          <button type="submit" className="button">
            {editing ? "อัปเดทกิจกรรม" : "เพิ่มกิจกรรม"}
          </button>
        </form>
      )}

      <ul className="activity-list">
        {activities.map((activity) => {
          const images = activity.imgSrc ? activity.imgSrc.split(',') : [];
          return (
            <li key={activity.id} className="activity-item">
              <div className="activity-content">
                {images.length > 0 && (
                  <img
                    src={`http://13.238.142.81/education-api/uploads/${images[0]}`}
                    alt={activity.title}
                    className="activity-image"
                  />
                )}
                <div className="activity-details">
                  <h3>{activity.title}</h3>
                  <p>{activity.date}</p>
                  <p>{activity.description}</p>
                </div>
              </div>
              <div className="thumbnail-container">
                {images.map((img, index) => (
                  <div key={index} className="thumbnail-item">
                    <img
                      src={`http://13.238.142.81/education-api/uploads/${img}`}
                      alt={`${activity.title} thumbnail ${index + 1}`}
                      className="thumbnail-image"
                    />
                    <button
                      onClick={() => handleDeleteImage(activity.id, img)}
                      className="delete-thumbnail-button"
                    >
                      ลบ
                    </button>
                  </div>
                ))}
              </div>
              <div className="activity-buttons">
                <button onClick={() => handleEdit(activity)} className="edit-button">แก้ไข</button>
                <button onClick={() => handleDeleteActivity(activity.id)} className="delete-button">ลบ</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Activity;
