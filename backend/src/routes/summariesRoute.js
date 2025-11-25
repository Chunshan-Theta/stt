import express from "express";
import upload from "../middleware/upload.js";
import { uploadAndSummary } from "../controllers/summaryController.js";

const router = express.Router();

// 上傳音訊並轉錄
router.post("/upload", upload.single("audio"), uploadAndSummary);

export default router;
