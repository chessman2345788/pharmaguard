/**
 * PharmaGuard AI - Clinical Pharmacogenomics Assistant Service
 * This service handles structured prompts for clinical genomic insights.
 */

const SYSTEM_PROMPT = `
You are a pharmacogenomics clinical assistant inside PharmaGuard AI.
Provide clear, evidence-based explanations related to genetic variants,
drug metabolism, CPIC-style recommendations, and pharmacogenomic risk.

Rules:
- Stay within pharmacogenomics domain.
- Do not invent medical data.
- If unsure, state uncertainty clearly.
- Prefer structured explanations (Summary, Clinical Insight, Risk Interpretation, Note).
- Keep tone professional and clinical.
- Detected genomic context will be provided to you. Use it to tailor answers.
`;

/**
 * Simulates a clinical AI API call with high-fidelity pharmacogenomic logic.
 * In a production environment, this would call OpenAI/Anthropic/Google AI.
 */
export const getClinicalResponse = async (userQuestion, context) => {
  console.log("AI REQUEST:", { userQuestion, context });

  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1500));

  const { analysisResults, selectedDrugs } = context;
  
  // Logic to find relevant info in analysis
  const relevantResult = analysisResults?.find(r => 
    userQuestion.toLowerCase().includes(r.drug.toLowerCase()) || 
    userQuestion.toLowerCase().includes(r.gene.toLowerCase())
  );

  // Fallback for "Why is Codeine risky?"
  if (userQuestion.includes("Codeine") && !relevantResult) {
    return formatResponse(
      "Codeine risk is primarily driven by CYP2D6 metabolism polymorphism.",
      "Codeine is a prodrug that must be converted to morphine by the CYP2D6 enzyme. Variants like *1xN (Ultrarapid) or *3/*4 (Poor) significantly alter this conversion rate.",
      "Ultrarapid metabolizers risk opioid toxicity due to rapid conversion, while Poor Metabolizers may experience no analgesic effect.",
      "Generic CPIC guidelines suggest alternative analgesics for both extremes."
    );
  }

  // Fallback for CYP2C19
  if (userQuestion.includes("CYP2C19")) {
    return formatResponse(
      "CYP2C19 is a critical enzyme influencing the metabolism of antidepressants, antiplatelets (Clopidogrel), and PPIs.",
      "Loss-of-function alleles (e.g., *2, *3) lead to reduced enzyme activity. A 'Poor Metabolizer' (PM) typically carries two no-function alleles.",
      "For Clopidogrel, PMs have a significantly higher risk of major adverse cardiovascular events (MACE).",
      "Recommendations often involve alternative therapies like Ticagrelor or Prasugrel."
    );
  }

  if (relevantResult) {
    return formatResponse(
      `Analysis for ${relevantResult.drug} shows a ${relevantResult.risk} status based on ${relevantResult.gene} profile.`,
      `The patient's ${relevantResult.gene} ${relevantResult.diplotype} diplotype results in a ${relevantResult.phenotype} phenotype.`,
      `This profile indicates ${relevantResult.impact_summary}. Clinical action recommended: ${relevantResult.recommendation}.`,
      "Information derived from PharmaGuard Clinical Knowledge Engine."
    );
  }

  // General Unknown
  return "Information not available in current analysis data. Please ensure a VCF file is uploaded or specify a gene/drug from the current session.";
};

const formatResponse = (summary, insight, risk, note) => {
  return `**Summary:**\n${summary}\n\n**Clinical Insight:**\n${insight}\n\n**Risk Interpretation:**\n${risk}\n\n**Note:**\n${note}\n\r\n*(Educational pharmacogenomic insight only; not medical advice.)*`;
};
