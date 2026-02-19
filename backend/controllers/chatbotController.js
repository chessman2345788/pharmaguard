import { getGeminiResponse } from '../services/geminiService.js';

export const handleChat = async (req, res) => {
  try {
    const { message, analysisContext, transparencyLevel, explanationMode } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = await getGeminiResponse(message, analysisContext, transparencyLevel, explanationMode);
    res.json({ reply });
  } catch (error) {
    console.error("Chatbot Controller Error:", error);
    res.status(500).json({ error: "AI Assistant is temporarily unavailable." });
  }
};
