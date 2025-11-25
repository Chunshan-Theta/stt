/* ---沒有將語音分離的效果呈現出來--- */
import { openai } from "../../config/OpenAI.js";
import fs from "fs";

export const openAITranscribe = async (filePath) => {
  const fileStream = fs.createReadStream(filePath);
  const response = await openai.audio.transcriptions.create({
    file: fileStream,
    model: "gpt-4o-transcribe-diarize",
  });
  return response.text;
};