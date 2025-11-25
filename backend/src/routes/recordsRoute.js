import express from "express";
import { getRecordsByType, deleteRecord } from "../controllers/recordsController.js";

const router = express.Router();

// 取得指定 type 的資料
router.get("/", getRecordsByType);

// 刪除指定資料
router.delete("/:id", deleteRecord);

export default router;
