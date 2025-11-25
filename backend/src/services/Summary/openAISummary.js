/*
import fs from "fs";
import { openai } from "../../config/OpenAI.js";

export const openAISummary = async (filePath) => {
  try {
    //Step1: 將音訊轉錄成文字
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1", 
    });

    const transcriptText = transcription.text;
    console.log("=== Transcription ===");
    console.log(transcriptText);

    //Step2: 使用 GPT-5 生成分段摘要
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

    const summary = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes meeting transcripts with timestamps.",
        },
        { role: "user", content: prompt },
      ],
    });

    console.log("=== Summary ===");
    console.log(summary.choices[0].message.content);

    return summary.choices[0].message.content;
  } catch (err) {
    console.error("Error generating summary:", err);
  }
};
*/
/*import fs from "fs";
import { openai } from "../../config/OpenAI.js";

export const openAISummary = async (filePath) => {
  try {
    // Step1: 將音訊轉錄成文字
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
    });

    const transcriptText = transcription.text;
    console.log("=== Transcription ===");
    console.log(transcriptText);

    // Step2: 使用 GPT-5-mini 生成摘要
    const prompt = `
    請根據以下錄音逐字稿內容，分析對話內容照時間順序生成詳細重點摘要。
    摘要格式必須嚴格如下：段落摘要內容（繁體中文）
    以下是逐字稿內容：
    ${transcriptText}
    `;

    const summary = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes meeting transcripts with timestamps.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    console.log("=== Summary ===");
    console.log(summary.choices[0].message.content);

    return summary.choices[0].message.content;
  } catch (err) {
    console.error("Error generating summary:", err);
  }
};
*/
import fs from "fs";
import { openai } from "../../config/OpenAI.js";

export const openAISummary = async (filePath) => {
  try {
    console.log("FILE EXISTS:", fs.existsSync(filePath));
    console.log("FILE SIZE:", fs.statSync(filePath).size);

    // Step1: 將音訊轉錄成文字
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
    });

    console.log("=== TRANSCRIPTION RAW ===");
    console.log(transcription);

    const transcriptText = transcription.text;
    console.log("=== TRANSCRIPTION TEXT ===");
    console.log(JSON.stringify(transcriptText));

    if (!transcriptText || transcriptText.trim() === "") {
      console.error("❌ ERROR: transcriptText is empty. Whisper returned no text.");
      return "❌ Whisper 沒有成功產生逐字稿（可能是檔案格式不支援 / 音訊為空）";
    }

    // Step2: 使用 GPT-5-mini 生成摘要
    const prompt = `請根據以下錄音逐字稿內容，分析對話內容並照時間順序生成詳細重點摘要（繁體中文）。
摘要格式必須嚴格如下：段落摘要內容。

以下是逐字稿內容：
${transcriptText}
`;

    const summary = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes meeting transcripts with timestamps.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    console.log("=== Summary ===");
    console.log(summary.choices[0].message.content);

    return summary.choices[0].message.content;
  } catch (err) {
    console.error("Error generating summary:", err);
  }
};
