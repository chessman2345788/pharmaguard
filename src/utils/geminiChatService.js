import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_INSTRUCTION = `
You are PharmaGuard AI, a pharmacogenomics clinical assistant.
Provide clear, evidence-based explanations about genes, variants,
drug metabolism, and CPIC-style pharmacogenomic insights.

Rules:
- Stay within pharmacogenomics and medical explanation domain.
- If specific patient data is available (provided in context), use it to tailor the answer.
- If no patient data exists, provide a general educational explanation using your broad medical knowledge.
- Never invent specific genetic results for the patient if they aren't in the context.
- Keep answers professional, structured, and clinical.
- Format your response into these sections:
  Summary: [Short explanation]
  Mechanism: [Explain gene or drug metabolism]
  Clinical Insight: [Why it matters for pharmacogenomics]
  Safety Note: "This information is educational and not medical advice."
`;

export const geminiChatService = async (userQuestion, analysisContext = null) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let contextString = "";
    if (analysisContext && analysisContext.length > 0) {
      contextString = "Patient Analysis Results:\n" + analysisContext.map(r => 
        `- Drug: ${r.drug}, Gene: ${r.gene}, Diplotype: ${r.diplotype}, Phenotype: ${r.phenotype}, Risk: ${r.risk_label || r.risk}`
      ).join("\n");
    } else {
      contextString = "No specific patient analysis data is currently available. Provide a general educational response.";
    }

    const prompt = `
System Instruction: ${SYSTEM_INSTRUCTION}

Context: ${contextString}

User Question: ${userQuestion}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("AI assistant temporarily unavailable.");
  }
};
