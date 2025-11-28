# 任務清單：將硬編碼的 localhost 連結改為使用 Docker 內部網路

## 概述
此專案使用 Docker Compose 部署，前後端中有多處硬編碼的 localhost 連結。需要將這些連結改為使用 Docker 內部網路，以確保容器間通信正確。同時修復配置問題。

## 任務列表

### 1. 修改後端資料庫配置
- **文件**: `backend/src/config/db.js`
- **任務**: 將硬編碼的 `mongodb://127.0.0.1:27017/stt-database` 改為 `mongodb://mongo:27017/stt-database`，使用 Docker Compose 中的 mongo 服務名稱。
- **原因**: 後端容器需要連接到 mongo 容器，而不是主機的 localhost。

### 2. 修改前端 API 調用
- **文件**:
  - `frontend/src/App.jsx`
  - `frontend/src/pages/TranscriptPage.jsx`
  - `frontend/src/components/HistroyList.jsx`
- **任務**: 將所有 `http://localhost:5001` 替換為相對路徑 `/api` 和 `/uploads`，因為前端將通過 nginx 代理。
- **具體更改**:
  - `axios.get("http://localhost:5001/api/records?type=transcript")` → `axios.get("/api/records?type=transcript")`
  - `http://localhost:5001/api/records/upload?type=transcript&service=${service}` → `/api/records/upload?type=transcript&service=${service}`
  - `axios.delete(\`http://localhost:5001/api/records/${id}\`)` → `axios.delete(\`/api/records/${id}\`)`
  - `axios.get(\`http://localhost:5001/api/records?type=${type}\`)` → `axios.get(\`/api/records?type=${type}\`)`
  - `"http://localhost:5001/api/transcripts/upload"` → `"/api/transcripts/upload"`
  - `"http://localhost:5001/api/summaries/upload"` → `"/api/summaries/upload"`
  - `"http://localhost:5001/api/meetingNotes/upload"` → `"/api/meetingNotes/upload"`
  - `axios.delete(\`http://localhost:5001/api/records/${id}\`)` → `axios.delete(\`/api/records/${id}\`)`
  - `<a href={\`http://localhost:5001/uploads/${item.filename}\`} download>下載</a>` → `<a href={\`/uploads/${item.filename}\`} download>下載</a>`

### 3. 配置前端 nginx 作為單獨服務
- **任務**: 創建 `frontend/nginx.conf` 文件，配置 nginx 將 `/api` 和 `/uploads` 請求代理到 `backend:5001`。
- **原因**: 前端是靜態文件，從瀏覽器訪問，不能直接使用 Docker 內部網路名稱。通過 nginx 代理實現。
- **額外配置**: 設置 `client_max_body_size 100M` 以支援大文件上傳。

### 4. 更新前端 Dockerfile
- **文件**: `frontend/Dockerfile`
- **任務**: 移除 nginx 階段，只保留 build 階段，輸出靜態文件。
- **更改**: 從 multi-stage build 改為單一 build 階段。

### 5. 更新 Docker Compose 配置
- **文件**: `docker-compose.yml`
- **任務**: 添加 nginx 服務作為單獨容器，掛載前端 dist 和 nginx.conf。
- **更改**:
  - 前端服務：移除 ports，添加 command 運行 build，並掛載 dist 到宿主機。
  - 添加 nginx 服務：使用 nginx:stable-alpine，掛載 `./frontend/dist` 和 `./frontend/nginx.conf`。

### 6. 修復後端依賴安裝
- **文件**: `backend/Dockerfile`
- **任務**: 取消註釋 `RUN npm install --omit=dev` 以安裝生產依賴。
- **原因**: 後端容器需要 express 等依賴。

### 7. 修復 Gemini API 配置
- **文件**: `backend/src/config/Gemini.js`
- **任務**: 在 `GoogleGenAI` 初始化時傳遞 API 金鑰 `apiKey: process.env.GEMINIAI`。
- **原因**: Google Gemini API 需要 API 金鑰進行認證。

### 8. 測試部署
- **任務**: 運行 `docker-compose up --build` 並驗證前後端通信正常，API 調用和文件下載工作，轉錄功能正常。

## 注意事項
- 確保所有更改後重新構建鏡像 (`docker-compose build`)。
- 如果有環境變數文件 (.env)，檢查是否需要更新。
- 前端程式碼更改為相對路徑後，nginx 代理將處理路由到 backend。
- Gemini API 金鑰已在 .env 中配置為 `GEMINIAI`。