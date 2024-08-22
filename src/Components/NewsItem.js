import React from 'react';

const NewsItem = ({ id, imgSrc, title, detail, date, description, newskind }) => {
  return (
    <tr>
      <td>{id}</td>
      <td><img src={imgSrc} alt="News" style={{ width: '100px' }} /></td>
      <td>{title}</td>
      <td>{detail}</td>
      <td>{date}</td>
      <td>{description}</td>
      <td>{newskind}</td>
    </tr>
  );
};

export default NewsItem;
