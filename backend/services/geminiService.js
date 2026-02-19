import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY || API_KEY === "" || API_KEY.includes("your_")) {
  console.warn("WARNING: GEMINI_API_KEY is missing or invalid in backend/.env");
}

const genAI = new GoogleGenerativeAI(API_KEY || "dummy_key");

const SYSTEM_PROMPT = `
You are PharmaGuard AI, an advanced clinical pharmacogenomics assistant.
Your goal is to provide evidence-based insights on drug-gene interactions.
Always divide your response into:
Summary: [Brief answer]
Mechanism: [Scientific explanation]
Clinical Insight: [Relevance to patient therapy]
Safety Note: [Educational notice]

Guidelines:
1. Stay within the pharmacogenomics domain.
2. Avoid specific medical diagnosis.
3. Use a professional, clinical tone.
4. If no patient data is provided, use general PGx knowledge.
5. Personalization: If analysis context is provided, refer specifically to the genes and genotypes detected (e.g., "In this patient, we see...") to make it feel deeply context-aware.
`;

export const getGeminiResponse = async (userMessage, analysisContext = null, transparency = 'detailed', mode = 'patient') => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let contextString = "";
    if (analysisContext) {
      contextString = "Patient Genomic Context:\n" + JSON.stringify(analysisContext, null, 2);
    }

    const modeInstruction = mode === 'clinical' 
      ? "Language: Clinical and technical. Target audience: Healthcare professionals. Use medical terminology."
      : "Language: Simple and empathetic. Target audience: Patients. Avoid jargon where possible.";
    
    const transparencyInstruction = transparency === 'simple'
      ? "Detail Level: Low. Focus only on key takeaways."
      : transparency === 'research'
      ? "Detail Level: High. Include specific rsIDs, star alleles, and clinical mechanism details."
      : "Detail Level: Standard. Balance clarity and technical detail.";

    const citationInstruction = "Required: You MUST use variant citations (e.g., CPIC, PharmGKB, or specific rsIDs from the context) in your explanation to ensure biological mechanism transparency.";

    const fullPrompt = `${SYSTEM_PROMPT}\n\n${modeInstruction}\n${transparencyInstruction}\n${citationInstruction}\n\n${contextString}\n\nUser Question: ${userMessage}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw new Error("Failed to get response from AI engine.");
  }
};
