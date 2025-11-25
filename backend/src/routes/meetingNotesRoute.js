import express from "express";
import upload from "../middleware/upload.js";
import { uploadAndmeetingNotes } from "../controllers/meetingNotesController.js";

const router = express.Router();

// 上傳音訊並轉錄
router.post("/upload", upload.single("audio"), uploadAndmeetingNotes);

export default router;
