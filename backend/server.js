import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import transcriptRoutes from "./src/routes/transcriptsRoute.js";
import summariesRoutes from "./src/routes/summariesRoute.js";
import meetingNotesRoutes from "./src/routes/meetingNotesRoute.js";
import recordRoutes from "./src/routes/recordsRoute.js"; 
import path from "path";
import fs from "fs";

dotenv.config();

const app = express();

// 自動建立 uploads 資料夾
const uploadDir = path.join(path.resolve(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("Created uploads directory at:", uploadDir);
}

// CORS
app.use(cors());

// JSON
app.use(express.json());

// 靜態檔案 (可下載uploads裡檔案)
app.use("/uploads", express.static(uploadDir));

// Route
app.use("/api/transcripts", transcriptRoutes);
app.use("/api/summaries", summariesRoutes);
app.use("/api/meetingNotes", meetingNotesRoutes);
app.use("/api/records", recordRoutes);

// PORT
const PORT = process.env.PORT || 5001;

// DB 連線並啟動 server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
