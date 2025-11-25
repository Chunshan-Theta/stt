import multer from "multer";
import fs from "fs";
import path from "path";

// 設定 uploads 資料夾
const uploadDir = path.join(path.resolve(), "uploads");

// 如果資料夾不存在就建立
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("Created uploads directory at:", uploadDir);
}

// 設定儲存策略
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// 暫時關掉 fileFilter 方便 debug
const upload = multer({ storage });

export default upload;
