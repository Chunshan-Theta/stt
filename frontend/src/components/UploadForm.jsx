import React, { useState } from "react";

function UploadForm({ type, onUpload }) {
  const [file, setFile] = useState(null);
  const [service, setService] = useState("gemini");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("請選擇檔案");
    setLoading(true);
    await onUpload(file, service);
    setLoading(false);
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files[0])} />
      <select value={service} onChange={(e) => setService(e.target.value)}>
        <option value="gemini">Gemini</option>
        <option value="gpt">OpenAI Whisper</option>
      </select>
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "轉錄中..." : `AI ${type}`}
      </button>
    </div>
  );
}

export default UploadForm;
