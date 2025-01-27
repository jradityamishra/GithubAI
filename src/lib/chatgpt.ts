
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const openai = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-1.5-flash",
  maxOutputTokens: 2048,
    });
export default openai;