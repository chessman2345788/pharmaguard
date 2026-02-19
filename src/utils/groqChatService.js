import Groq from "groq-sdk";

const SYSTEM_INSTRUCTION = `
You are PharmaGuard AI, an advanced Clinical Pharmacogenomics Assistant. 

Your goal is to be helpful, intelligent, and informative. Your core expertise is in genes, variants, drug metabolism (pharmacogenomics), and CPIC guidelines.

Format your response using these sections where possible:
- Summary: [A quick, direct answer]
- Mechanism/Background: [Technical explanation of the gene, drug, or topic]
- Clinical Insight: [Why this matters for health/therapy]
- Safety Note: "This information is educational and not medical advice."
`;

export const groqChatService = async (userQuestion, analysisContext = null) => {
  const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

  if (!API_KEY || API_KEY === "" || API_KEY.includes("your_groq_api_key")) {
    return "PharmaGuard AI is ready, but it needs a **Groq API Key**. \n\n1. Get a key at console.groq.com \n2. Add `VITE_GROQ_API_KEY=your_key` to .env";
  }

  const groq = new Groq({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true
  });

  try {
    let contextString = "";
    if (analysisContext && analysisContext.length > 0) {
      contextString = "PATIENT DATA:\n" + analysisContext.map(r => 
        `- Drug: ${r.drug}, Gene: ${r.gene}, Phenotype: ${r.phenotype}, Risk: ${r.risk_label || r.risk}`
      ).join("\n");
    } else {
      contextString = "General health education session.";
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "user", content: `CONTEXT: ${contextString}\n\nQUESTION: ${userQuestion}` }
      ],
      model: "llama-3.3-70b-versatile",
    });

    return completion.choices[0]?.message?.content || "No response generated.";
  } catch (error) {
    console.error("Groq API Error:", error);
    return "The clinical engine is temporarily unavailable. Please verify your Groq API key.";
  }
};
