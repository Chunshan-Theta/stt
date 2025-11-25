import React from "react";

function HistoryList({ items, onView, onDelete }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item._id}>
          <strong>{item.filename}</strong>
          <button onClick={() => onView(item)}>查看</button>
          <button onClick={() => onDelete(item._id)}>刪除</button>
          <a href={`http://localhost:5001/uploads/${item.filename}`} download>下載</a>
        </li>
      ))}
    </ul>
  );
}

export default HistoryList;
