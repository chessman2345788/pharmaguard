export async function generateExplanation(riskProfile: any, drug: string) {
  // Mock implementation for now
  // In a real implementation, this would call Gemini/OpenAI API
  return {
    summary: `The patient is a ${riskProfile.phenotype} metabolizer for ${riskProfile.gene}.`,
    mechanism: `Genetic variants in ${riskProfile.gene} affect the metabolism of ${drug}.`,
    citation: "CPIC Guidelines 2024",
  };
}
