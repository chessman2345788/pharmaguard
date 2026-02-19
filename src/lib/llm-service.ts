import { RiskResult } from './risk-engine';

interface LlmExplanation {
  summary: string;
  mechanism: string;
  variant_citations: string[];
  clinical_significance: string;
  citation: string;
}

/**
 * Generates clinically-accurate pharmacogenomic explanations.
 * Uses Gemini API if GEMINI_API_KEY is set; falls back to
 * a rich rule-based engine for hackathon reliability.
 */
export async function generateExplanation(
  riskProfile: RiskResult,
  drug: string
): Promise<LlmExplanation> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'your_gemini_api_key_here') {
    try {
      return await callGeminiApi(riskProfile, drug, apiKey);
    } catch (e) {
      console.error('Gemini API failed, falling back to rule-based:', e);
    }
  }

  return generateRuleBasedExplanation(riskProfile, drug);
}

async function callGeminiApi(
  riskProfile: RiskResult,
  drug: string,
  apiKey: string
): Promise<LlmExplanation> {
  const variantList = riskProfile.detectedVariants
    .map(v => `${v.rsid} (${v.starAllele}, ${v.zygosity})`)
    .join(', ') || 'no pathogenic variants detected';

  const prompt = `You are a clinical pharmacogenomics expert. Generate a concise clinical explanation for the following patient profile:

Drug: ${drug}
Gene: ${riskProfile.gene}
Diplotype: ${riskProfile.diplotype}
Phenotype: ${riskProfile.phenotype} Metabolizer
Risk Assessment: ${riskProfile.risk}
Detected Variants: ${variantList}

Provide:
1. A 2-sentence clinical summary
2. The molecular mechanism (1-2 sentences)
3. Clinical significance for the prescriber

Format as JSON: { "summary": "...", "mechanism": "...", "clinical_significance": "..." }`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 512, temperature: 0.3 }
      }),
    }
  );

  if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  // Parse JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      summary: parsed.summary || '',
      mechanism: parsed.mechanism || '',
      variant_citations: riskProfile.detectedVariants.map(v => v.rsid),
      clinical_significance: parsed.clinical_significance || '',
      citation: 'CPIC Guidelines 2024 + Gemini AI Analysis'
    };
  }

  throw new Error('Could not parse Gemini response');
}

function generateRuleBasedExplanation(
  riskProfile: RiskResult,
  drug: string
): LlmExplanation {
  const { gene, phenotype, diplotype, detectedVariants, risk } = riskProfile;

  const variantCitations = detectedVariants.map(v => v.rsid);
  const variantDesc = detectedVariants.length > 0
    ? detectedVariants.map(v => `${v.rsid} (${v.starAllele}, ${v.zygosity})`).join('; ')
    : 'no relevant pharmacogenomic variants';

  // Phenotype label
  const phenotypeLabels: Record<string, string> = {
    PM:  'Poor Metabolizer (PM)',
    IM:  'Intermediate Metabolizer (IM)',
    NM:  'Normal Metabolizer (NM)',
    RM:  'Rapid Metabolizer (RM)',
    URM: 'Ultra-Rapid Metabolizer (URM)',
    Unknown: 'Undetermined Metabolizer'
  };

  const phenoLabel = phenotypeLabels[phenotype] || phenotype;

  // Risk-specific summaries
  const summaries: Record<string, string> = {
    'Safe': `This patient's ${gene} diplotype (${diplotype}) predicts ${phenoLabel} status, indicating normal ${drug} metabolism. Standard dosing is expected to be safe and effective.`,
    'Adjust Dosage': `This patient carries the ${gene} diplotype ${diplotype} (${variantDesc}), predicting ${phenoLabel} status. ${drug} dose adjustment is recommended to ensure therapeutic efficacy while minimizing adverse effects.`,
    'Toxic': `Genetic analysis reveals ${gene} diplotype ${diplotype} (${variantDesc}), conferring ${phenoLabel} status. This significantly alters ${drug} metabolism, creating a high risk of drug accumulation and toxicity at standard doses.`,
    'Ineffective': `The patient's ${gene} diplotype (${diplotype}, ${variantDesc}) indicates ${phenoLabel} status. ${drug} (a prodrug requiring ${gene} activation) is predicted to be therapeutically ineffective in this patient.`,
    'Unknown': `Insufficient pharmacogenomic data available for ${drug} in this patient. ${gene} genotype could not be fully determined from the provided VCF data.`
  };

  const summary = summaries[risk] || summaries['Unknown'];

  // Gene-specific mechanisms
  const mechanisms: Record<string, string> = {
    'CYP2D6': `CYP2D6 is a hepatic enzyme responsible for metabolizing ~25% of all clinically used drugs. The ${diplotype} diplotype results in ${phenoLabel} activity, directly impacting ${drug} conversion kinetics and plasma exposure.`,
    'CYP2C19': `CYP2C19 is a highly polymorphic cytochrome P450 enzyme critical for activating prodrugs like ${drug}. The detected ${diplotype} genotype alters enzyme expression, affecting bioavailability and clinical response.`,
    'CYP2C9': `CYP2C9 primarily metabolizes the pharmacologically active S-enantiomer of warfarin. The ${diplotype} allelic combination (${variantDesc}) reduces enzyme activity, causing elevated plasma warfarin levels and prolonged anticoagulation.`,
    'SLCO1B1': `SLCO1B1 encodes the hepatic uptake transporter OATP1B1, which governs statin entry into liver cells. The ${diplotype} genotype (variant: ${variantDesc}) impairs transporter function, increasing systemic statin exposure by 2-4x and the myopathy risk.`,
    'TPMT': `TPMT (thiopurine S-methyltransferase) inactivates thiopurine drugs. The ${diplotype} genotype (${variantDesc}) causes reduced enzyme activity, leading to accumulation of cytotoxic thioguanine nucleotides and severe myelosuppression risk.`,
    'DPYD': `DPYD (dihydropyrimidine dehydrogenase) catabolizes >80% of administered fluorouracil. Variants in ${diplotype} (${variantDesc}) reduce enzyme activity, causing toxic 5-FU accumulation in plasma and tissues.`
  };

  const mechanism = mechanisms[gene] || `${gene} genetic variants affect ${drug} metabolism, altering drug exposure and clinical outcomes.`;

  const significance =
    risk === 'Safe'
      ? `No dose adjustment required. Patient is expected to respond normally to standard ${drug} therapy per CPIC guidelines.`
      : risk === 'Unknown'
      ? 'Consider pharmacogenomic testing or clinical monitoring to guide therapy.'
      : `Prescriber action required: ${riskProfile.recommendation} This recommendation is based on CPIC Level ${riskProfile.cpicLevel ?? 'B'} evidence.`;

  return {
    summary,
    mechanism,
    variant_citations: variantCitations,
    clinical_significance: significance,
    citation: 'CPIC Clinical Pharmacogenetics Implementation Consortium Guidelines (2024); PharmGKB'
  };
}
