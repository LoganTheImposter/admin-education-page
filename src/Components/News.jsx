import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './News.css';
import AddNews from './AddNews';
import EditNews from './EditNews';

function News() {
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddNews, setShowAddNews] = useState(false);
  const [editNewsId, setEditNewsId] = useState(null);

  const itemsPerPage = 6;

  useEffect(() => {
    if (!showAddNews && !editNewsId) {
      axios.get('http://13.238.142.81/education-api/fetchNews.php')
        .then(response => {
          const sortedNews = response.data.sort((a, b) => b.id - a.id);
          setNews(sortedNews);
          setLoading(false);
        })
        .catch(error => {
          setError(error);
          setLoading(false);
        });
    }
  }, [showAddNews, editNewsId]);

  const handleEdit = (id) => {
    setEditNewsId(id);
  };

  const handleDelete = (id) => {
    if (window.confirm('คุณต้องการลบข่าวนี้ใช่หรือไม่?')) {
      axios.post('http://13.238.142.81/education-api/deleteNews.php', { id })
        .then(response => {
          if (response.data.success) {
            setNews(news.filter(item => item.id !== id));
          } else {
            console.error('Error deleting news: ', response.data.error);
          }
        })
        .catch(error => {
          console.error('Error deleting news: ', error.message);
        });
    }
  };

  const handleAddNews = () => {
    setShowAddNews(true);
  };

  const handleBackToNews = () => {
    setShowAddNews(false);
    setEditNewsId(null);
  };

  const handleUpdateNews = (updatedNews) => {
    setNews(news.map(item => (item.id === updatedNews.id ? updatedNews : item)));
    handleBackToNews();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = news.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  if (loading) return <p>กำลังโหลด...</p>;
  if (error) return <p>เกิดข้อผิดพลาด: {error.message}</p>;

  return (
    <div className="news-container">
      {showAddNews ? (
        <div className="modal">
          <div className="modal-content">
            <AddNews handleBackToNews={handleBackToNews} />
          </div>
        </div>
      ) : editNewsId ? (
        <div className="modal">
          <div className="modal-content">
            <EditNews newsId={editNewsId} handleBackToNews={handleBackToNews} handleUpdateNews={handleUpdateNews} />
          </div>
        </div>
      ) : (
        <>
          <div className="news-header">
            <h1>ข่าวล่าสุด</h1>
            <button onClick={handleAddNews} className="add-news-button">เพิ่มข่าว</button>
          </div>
          <ul className="news-list">
            {currentItems.map(item => (
              <li key={item.id} className="news-item">
                <h2>{item.title}</h2>
                <p className="news-date">{formatDate(item.date)}</p>
                <p>{item.detail}</p>
                {/* Display description with HTML */}
                <div className="news-description" dangerouslySetInnerHTML={{ __html: item.description }}></div>
                <ImageCarousel images={item.imgSrc.split(',')} title={item.title} />
                <div className="news-actions">
                  <button onClick={() => handleEdit(item.id)} className="edit-button">แก้ไข</button>
                  <button onClick={() => handleDelete(item.id)} className="delete-button">ลบ</button>
                </div>
              </li>
            ))}
          </ul>
          <Pagination itemsPerPage={itemsPerPage} totalItems={news.length} paginate={paginate} currentPage={currentPage} />
        </>
      )}
    </div>
  );
}

function ImageCarousel({ images, title }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="carousel-container">
      {images.length > 3 && (
        <button className="carousel-button left" onClick={prevImage}>
          ◀
        </button>
      )}
      <div className="carousel-images">
        {images.slice(currentImageIndex, currentImageIndex + 3).map((src, index) => (
          <img
            key={index}
            src={`http://13.238.142.81/education-api/uploads/${src.trim()}`}
            alt={`${title}-${index}`}
            className="carousel-image"
          />
        ))}
      </div>
      {images.length > 3 && (
        <button className="carousel-button right" onClick={nextImage}>
          ▶
        </button>
      )}
    </div> 
  );
}

function Pagination({ itemsPerPage, totalItems, paginate, currentPage }) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
            <a onClick={() => paginate(number)} href="#!" className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default News;
