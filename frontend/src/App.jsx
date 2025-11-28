import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [records, setRecords] = useState([]);  // 統一存所有 type 的資料
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);  
  const [meetingNotesLoading, setMeetingNotesLoading] = useState(false);
  const [selectedService, setSelectedService] = useState("gemini");
  const [activeSidebar, setActiveSidebar] = useState("transcript"); //預設初始值是逐字稿


  const fixFilenameEncoding = (name) => {
    try {
      return new TextDecoder("utf-8").decode(new TextEncoder().encode(name));
    } catch {
      return name;
    }
  };

  // 根據 type 取得歷史資料
  const fetchRecords = async (type) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/records?type=${type}`);
      setRecords(res.data);
    } catch (err) {
      console.error("Failed to fetch records:", err);
      alert("取得資料失敗");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(activeSidebar);
    setSelectedRecord(null); // 切換 type 時清空右側選取
  }, [activeSidebar]);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleAITranscription = async () => {
    if (!selectedFile) return alert("請先選擇音訊檔案！");
    setTranscriptLoading(true);

    try {
      const formData = new FormData();
      formData.append("audio", selectedFile);
      formData.append("service", selectedService);

      const res = await axios.post(
        "/api/transcripts/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSelectedRecord(res.data);
      fetchRecords("transcript");
      alert("轉錄完成！");
    } catch (err) {
      console.error("Upload/Transcription error:", err.response || err.message);
      alert("上傳或轉錄失敗，請查看 console");
    } finally {
      setTranscriptLoading(false);
    }
  };

  const handleAISummary = async () => {
    if (!selectedFile) return alert("請先選擇音訊檔案！");
    setSummaryLoading(true);

    try {
      const formData = new FormData();
      formData.append("audio", selectedFile);
      formData.append("service", selectedService);

      const res = await axios.post(
        "/api/summaries/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSelectedRecord(res.data);
      fetchRecords("summary");
      alert("摘要完成！");
    } catch (err) {
      console.error("Upload/Summray error:", err.response || err.message);
      alert("上傳或摘要失敗，請查看 console");
    } finally {
      setSummaryLoading(false); 
    }
  };

  const handleAIMeetingNotes = async () => {
    if (!selectedFile) return alert("請先選擇音訊檔案！");
    setMeetingNotesLoading(true);

    try {
      const formData = new FormData();
      formData.append("audio", selectedFile);
      formData.append("service", selectedService);

      const res = await axios.post(
        "/api/meetingNotes/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSelectedRecord(res.data);
      fetchRecords("meetingNotes");
      alert("會議記錄生成完成！");
    } catch (err) {
      console.error("Upload/meetingNotes error:", err.response || err.message);
      alert("上傳或會議記錄生成失敗，請查看 console");
    } finally {
      setMeetingNotesLoading(false);
    }
  };

  const handleSelectRecord = (record) => {
    setSelectedRecord(record);
  };

  const handleDeleteRecord = async (id) => {
    if (!window.confirm("確定要刪除嗎？")) return;
    try {
      await axios.delete(`/api/records/${id}`);
      setRecords(records.filter((r) => r._id !== id));
      if (selectedRecord?._id === id) setSelectedRecord(null);
    } catch (err) {
      console.error("Delete record failed:", err);
      alert("刪除失敗");
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h3>歷史紀錄</h3>
        <ul>
          <li
            className={activeSidebar === "transcript" ? "active" : ""}
            onClick={() => setActiveSidebar("transcript")}
          >
            歷史逐字稿
          </li>
          <li
            className={activeSidebar === "summary" ? "active" : ""}
            onClick={() => setActiveSidebar("summary")}
          >
            歷史摘要
          </li>
          <li
            className={activeSidebar === "meetingNotes" ? "active" : ""}
            onClick={() => setActiveSidebar("meetingNotes")}
          >
            歷史會議記錄
          </li>
        </ul>

        <div className="history-section">
          <h4>
            {activeSidebar === "transcript"
              ? "逐字稿列表"
              : activeSidebar === "summary"
              ? "摘要列表"
              : "會議記錄列表"}
          </h4>

          {loading ? (
            <p>載入中...</p>
          ) : records.length === 0 ? (
            <p>沒有資料</p>
          ) : (
            <ul className="history-list">
              {records.map((r) => (
                <li
                  key={r._id}
                  className={`history-item ${
                    selectedRecord?._id === r._id ? "selected" : ""
                  }`}
                  onClick={() => handleSelectRecord(r)}
                >
                  {fixFilenameEncoding(r.filename || r._id)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>


      <div className="main">
        {activeSidebar === "transcript" && (
          <>
            <h2>歷史逐字稿</h2>
            <div className="upload-section">
              <input type="file" accept="audio/*" onChange={handleFileChange} />
              <select
                className="service-select"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
              >
                <option value="gemini">Gemini</option>
                <option value="gpt">GPT</option>
              </select>
            </div>

            <div className="buttons">
              <button
                className="action-btn"
                onClick={handleAITranscription}
                disabled={transcriptLoading}
              >
                {transcriptLoading ? "轉錄中..." : "AI逐字稿"} 
              </button>
              <button
                className="action-btn"
                onClick={handleAISummary}
                disabled={summaryLoading}
              >
                {summaryLoading ? "摘要中..." : "AI摘要"} 
              </button>
              <button
                className="action-btn"
                onClick={handleAIMeetingNotes}
                disabled={meetingNotesLoading}
              >
                {meetingNotesLoading ? "會議記錄中..." : "AI會議記錄"} 
              </button>
            </div>
          </>
        )}

        {selectedRecord && (
          <div className="result">
            <div className="result-header">
              <h3>{fixFilenameEncoding(selectedRecord.filename || selectedRecord._id)}</h3>
              <button
                className="delete-btn"
                onClick={() => handleDeleteRecord(selectedRecord._id)}
              >
                刪除
              </button>
            </div>
            <p>{selectedRecord.content}</p>
          </div>
        )}

        {activeSidebar !== "transcript" && !selectedRecord && (
          <h2>
            {activeSidebar === "summary" ? "歷史摘要" : "歷史會議記錄"}
          </h2>
        )}
      </div>
    </div>
  );
}

export default App;
