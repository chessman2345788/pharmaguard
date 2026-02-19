import { VcfVariant } from './vcf-parser';
import { DRUG_RULES, VARIANT_MAP, Phenotype, DrugRule } from './knowledge-base';

interface RiskInput {
  variants: VcfVariant[];
  drugs: string[];
}

interface RiskResult {
  drug: string;
  gene: string;
  phenotype: Phenotype;
  risk: string;
  recommendation: string;
  severity: string;
  variants: string[];
}

function determinePhenotype(gene: string, detectedVariants: string[]): Phenotype {
  // Simplified logic for hackathon
  // In reality, this requires star-allele mapping tables (*1/*2, etc.)

  if (detectedVariants.length === 0) return 'NM'; // Assume *1/*1 (Normal) if no variants found

  // Check for loss of function variants
  const lossVariants = detectedVariants.filter(v => 
    Object.values(VARIANT_MAP).find(m => m.variant === v && (m.impact === 'loss' || m.impact === 'no_function'))
  );

  const gainVariants = detectedVariants.filter(v =>
    Object.values(VARIANT_MAP).find(m => m.variant === v && m.impact === 'gain')
  );

  if (lossVariants.length >= 2) return 'PM';
  if (lossVariants.length === 1) return 'IM';
  if (gainVariants.length >= 1) return 'URM'; // or RM

  return 'NM'; 
}

export function assessRisk(input: RiskInput): RiskResult[] {
  const results: RiskResult[] = [];

  for (const drugName of input.drugs) {
    const normalizedDrug = drugName.toUpperCase().trim();
    const rule = DRUG_RULES[normalizedDrug];

    if (!rule) {
      results.push({
        drug: drugName,
        gene: 'Unknown',
        phenotype: 'Unknown',
        risk: 'Unknown',
        recommendation: 'No data available for this drug.',
        severity: 'none',
        variants: []
      });
      continue;
    }

    const { gene } = rule;
    
    // Find variants in VCF that match this gene
    const geneVariants = input.variants
      .map(v => VARIANT_MAP[v.id]) // Look up in our map
      .filter(m => m && m.gene === gene)
      .map(m => m.variant);

    const phenotype = determinePhenotype(gene, geneVariants);
    const prediction = rule.phenotype_rules[phenotype] || rule.phenotype_rules['Unknown'];

    results.push({
      drug: drugName,
      gene,
      phenotype,
      risk: prediction.risk,
      recommendation: prediction.recommendation,
      severity: prediction.severity,
      variants: geneVariants
    });
  }

  return results;
}
