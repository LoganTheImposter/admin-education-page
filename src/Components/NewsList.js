import React from 'react';

const NewsList = ({ newsData }) => {
  return (
    <div className="news-list">
      {newsData.map((news, index) => (
        <div key={index} className="news-item">
          <img src={news.imgSrc} alt={news.title} />
          <h2>{news.title}</h2>
          <p>{news.detail}</p>
          <p>{news.description}</p>
        </div>
      ))}
    </div>
  );
};

export default NewsList;
