/**
 * PharmaGuard AI – Gemini AI Service
 * Wraps @google/generative-ai to provide:
 *  - generateExplanation(): enriches a risk result with an AI narrative
 *  - chatWithContext(): powers the clinical AI chatbot
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;

const getClient = () => {
    if (!genAI) {
        const key = process.env.GEMINI_API_KEY;
        if (!key || key === 'your_gemini_api_key_here') {
            return null; // graceful fallback – AI disabled
        }
        genAI = new GoogleGenerativeAI(key);
    }
    return genAI;
};

const SYSTEM_PROMPT = `You are PharmaGuard AI, a pharmacogenomics clinical assistant embedded in a medical decision-support tool.

Rules:
- Provide evidence-based, CPIC-aligned information.
- Never invent patient-specific genomic data not provided in context.
- Tailor answers using the patient context when it is available.
- Keep responses concise, structured, and professional.
- If a patient analysis context is given, reference it explicitly.
- End every response with: "⚠️ This information is for educational purposes only and does not constitute medical advice."

Response format (use markdown headings):
### Summary
### Mechanism
### Clinical Insight
### Safety Note`;

/**
 * Generate a Gemini AI explanation for a single drug-gene risk result.
 * Falls back to the rule-based mechanism text if AI is unavailable.
 */
export const generateExplanation = async (drug, gene, phenotype, risk, mechanism) => {
    const client = getClient();
    if (!client) return mechanism; // graceful fallback

    try {
        const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `${SYSTEM_PROMPT}

Patient context:
- Drug: ${drug}
- Gene: ${gene}
- Phenotype: ${phenotype}
- Risk Level: ${risk}
- Rule-based mechanism: ${mechanism}

Please provide a structured clinical explanation for why this genetic variant creates this risk for this drug.`;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (err) {
        console.error('[Gemini] generateExplanation error:', err.message);
        return mechanism; // fallback to rule text
    }
};

/**
 * Chat endpoint – answer a clinical question with optional patient analysis context.
 */
export const chatWithContext = async (userMessage, analysisContext = []) => {
    const client = getClient();
    if (!client) {
        return buildFallbackResponse(userMessage);
    }

    try {
        const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

        let contextBlock = 'No patient analysis data available. Provide a general educational response.';
        if (analysisContext && analysisContext.length > 0) {
            contextBlock =
                'Current Patient Analysis Results:\n' +
                analysisContext
                    .map(
                        (r) =>
                            `- Drug: ${r.drug_name}, Gene: ${r.pharmacogenomic_profile?.primary_gene}, ` +
                            `Diplotype: ${r.pharmacogenomic_profile?.diplotype}, ` +
                            `Phenotype: ${r.pharmacogenomic_profile?.phenotype}, ` +
                            `Risk: ${r.risk_assessment?.risk_label}`
                    )
                    .join('\n');
        }

        const prompt = `${SYSTEM_PROMPT}

Patient Context:
${contextBlock}

User Question: ${userMessage}`;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (err) {
        console.error('[Gemini] chatWithContext error:', err.message);
        throw new Error('AI assistant temporarily unavailable. Please try again.');
    }
};

/**
 * Static fallback responses when Gemini API key is not configured.
 */
const buildFallbackResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    if (msg.includes('cyp2d6')) {
        return `### Summary\nCYP2D6 is the most polymorphic enzyme in the CYP450 family, responsible for metabolizing ~25% of clinically used drugs.\n\n### Mechanism\nVariants like *4 (loss-of-function) or *1xN (gene duplication) dramatically alter drug metabolism rates.\n\n### Clinical Insight\nPoor Metabolizers (PM) fail to convert prodrugs like codeine to active morphine. Ultrarapid Metabolizers (UM) convert too fast, risking toxicity.\n\n### Safety Note\n⚠️ This information is for educational purposes only and does not constitute medical advice.`;
    }
    if (msg.includes('cyp2c19') || msg.includes('clopidogrel')) {
        return `### Summary\nCYP2C19 variants significantly impact clopidogrel (Plavix) efficacy.\n\n### Mechanism\nClopidogrel is a prodrug requiring CYP2C19 activation. Poor Metabolizers (*2/*2) cannot generate the active thiol metabolite.\n\n### Clinical Insight\nCPIC recommends prasugrel or ticagrelor as alternatives for CYP2C19 Poor Metabolizers at high cardiovascular risk.\n\n### Safety Note\n⚠️ This information is for educational purposes only and does not constitute medical advice.`;
    }
    return `### Summary\nI'm PharmaGuard AI, your pharmacogenomics assistant.\n\n### Clinical Insight\nTo enable real AI responses, please add your Gemini API key to \`backend/.env\` (GEMINI_API_KEY). I can answer questions about CYP2D6, CYP2C19, CYP2C9, SLCO1B1, TPMT, DPYD, and their associated drugs.\n\n### Safety Note\n⚠️ This information is for educational purposes only and does not constitute medical advice.`;
};
