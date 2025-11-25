import {geminiAI, createUserContent, createPartFromUri} from "../../config/Gemini.js";

export const geminiMeetingNotes = async (filePath, mimeType) => {
  const myfile = await geminiAI.files.upload({
    file: filePath,
    config: { mimeType },
  });

  const prompt = `
    請根據這段錄音內容，生成一個會議記錄。
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
