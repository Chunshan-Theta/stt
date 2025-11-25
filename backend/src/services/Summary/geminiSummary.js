import {geminiAI, createUserContent, createPartFromUri} from "../../config/Gemini.js";

export const geminiSummary = async (filePath, mimeType) => {
  const myfile = await geminiAI.files.upload({
    file: filePath,
    config: { mimeType },
  });

  const prompt = `
    請根據這段錄音內容，生成一個詳細的重點摘要。
    摘要必須包含時間戳記，格式必須嚴格如下所示：
    [起始時間 - 結束時間] 談論的重點摘要
    請將錄音內容分成多個有意義的部分進行摘要。例如：
    [00:00 - 01:30] 開場與主題介紹
    [01:30 - 04:55] 關於 A 專案的進度與挑戰
    [04:55 - 06:10] 結論與下一步行動
    時間請以分鐘和秒數 (mm:ss) 表示。
  `;

  const response = await geminiAI.models.generateContent({
    model: "gemini-2.5-pro",
    contents: createUserContent([
      createPartFromUri(myfile.uri, myfile.mimeType),
      prompt,
    ]),
  });

  return response.text;
}
