import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

export const geminiAI = new GoogleGenAI({ apiKey: process.env.GEMINIAI });
export { createUserContent, createPartFromUri };