import {geminiAI, createUserContent, createPartFromUri} from "../../config/Gemini.js";

export const geminiTranscribe = async (filePath, mimeType) => {
  const myfile = await geminiAI.files.upload({
    file: filePath,
    config: { mimeType },
  });

  const response = await geminiAI.models.generateContent({
    model: "gemini-2.5-pro",
    contents: createUserContent([
      createPartFromUri(myfile.uri, myfile.mimeType),
      "Transcript this audio clip. If there are multiple speakers, identify them.",
    ]),
  });

  return response.text;
};
