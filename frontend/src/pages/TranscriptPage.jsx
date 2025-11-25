import React, { useState, useEffect } from "react";
import axios from "axios";
import UploadForm from "../components/UploadForm.jsx";
import HistoryList from "../components/HistroyList.jsx";

function TranscriptPage() {
  const [history, setHistory] = useState([]);
  const [selectedContent, setSelectedContent] = useState("");

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/records?type=transcript");
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleUpload = async (file, service) => {
    try {
      const formData = new FormData();
      formData.append("audio", file);

      const res = await axios.post(
        `http://localhost:5001/api/records/upload?type=transcript&service=${service}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSelectedContent(res.data.content);
      fetchHistory();
    } catch (err) {
      console.error(err);
      alert("轉錄失敗");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/records/${id}`);
      fetchHistory();
      setSelectedContent("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>逐字稿</h2>
      <UploadForm type="逐字稿" onUpload={handleUpload} />
      {selectedContent && <pre>{selectedContent}</pre>}
      <h3>歷史紀錄</h3>
      <HistoryList
        items={history}
        onView={(item) => setSelectedContent(item.content)}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default TranscriptPage;
