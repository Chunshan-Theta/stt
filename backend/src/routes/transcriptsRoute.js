import express from "express";
import upload from "../middleware/upload.js";
import { uploadAndTranscribe } from "../controllers/transcriptController.js";

const router = express.Router();

// 上傳音訊並轉錄
router.post("/upload", upload.single("audio"), uploadAndTranscribe);

export default router;
