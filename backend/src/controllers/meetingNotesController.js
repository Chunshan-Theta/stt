import fs from "fs";
import path from "path";
import Record from "../models/Record.js";
import { geminiMeetingNotes } from "../services/meetingNotes/geminiMeetingNotes.js";
//import { openAIMeetingNotes } from "../services/meetingNotes/openAIMeetingNotes.js";

export const uploadAndmeetingNotes = async (req, res) => {
  const service = req.body.service || "gemini";

  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    //清理檔案路徑，避免空格或特殊字元問題
    const safeFileName = path.basename(req.file.originalname).replace(/\s+/g, "_");
    const uploadDir = path.dirname(req.file.path);
    const filePath = path.join(uploadDir, safeFileName);

    if (req.file.originalname !== safeFileName) {
      fs.renameSync(req.file.path, filePath);
    }

    console.log("Step 1: File uploaded to server:", filePath);

    //確認檔案存在且大小正常
    if (!fs.existsSync(filePath)) throw new Error("Uploaded file not found");
    const stats = fs.statSync(filePath);
    if (stats.size === 0) throw new Error("Uploaded file is empty");

    //會議記錄
    let meetingnoteText;
    console.log("Step 2: Start generating meetingnote using", service);

    if (service === "gemini") {
      meetingnoteText = await geminiMeetingNotes(filePath);
//   } else if (service === "gpt") {
//   summaryText = await openAISummary(filePath);
    } else {
      return res.status(400).json({ message: "Invalid service selected" });
    }

    console.log("Step 3: Generating meeting note done, saving to DB...");

    const record = await Record.create({
      filename: safeFileName,
      content: meetingnoteText,
      type: "meetingNotes",
    });

    console.log("Step 4: Saved to DB:", record._id);

    //刪除暫存檔
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
      else console.log("Temp file deleted:", filePath);
    });

    res.status(200).json(record);
  } catch (err) {
    console.error("meetingNotes service failed:", err);
    res.status(500).json({ message: "meetingNotes service failed", error: err.message });
  }
};

export const getAllMeetingNotes = async (req, res) => {
  try {
    const meetingNotes = await Record.find({ type: "meetingNotes" }).sort({ createdAt: -1 });
    res.status(200).json(meetingNotes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get meeting notes", error: err.message });
  }
};