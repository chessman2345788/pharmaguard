import { VcfVariant } from './vcf-parser';
import { DRUG_RULES, VARIANT_MAP, Phenotype, VariantInfo } from './knowledge-base';

interface RiskInput {
  variants: VcfVariant[];
  drugs: string[];
}

export interface DetectedVariant {
  rsid: string;
  gene: string;
  starAllele: string;
  impact: string;
  zygosity: 'homozygous' | 'heterozygous' | 'unknown';
}

export interface RiskResult {
  drug: string;
  gene: string;
  diplotype: string;
  phenotype: Phenotype;
  risk: string;
  recommendation: string;
  severity: string;
  confidenceScore: number;
  detectedVariants: DetectedVariant[];
  alternativeDrugs?: string[];
  monitoringParameters?: string[];
  cpicLevel?: string;
}

/**
 * Calculates activity score from detected variants for a gene.
 * Mirrors CPIC's Activity Score (AS) system:
 * - Normal allele (*1) = 1 point
 * - Decreased function = 0.5 points
 * - No function = 0 points
 * - Increased function = 2 points (for RM/URM)
 */
function calculateActivityScore(
  geneVariantInfos: Array<{ info: VariantInfo; zygosity: 'homozygous' | 'heterozygous' | 'unknown' }>
): number {
  if (geneVariantInfos.length === 0) {
    // No variants found — assume *1/*1 = activity score 2.0
    return 2.0;
  }

  // Each person has 2 alleles. Start with 2 normal alleles (AS = 2.0)
  // Then subtract/adjust based on detected variants
  let baseScore = 2.0;
  const processed = new Set<string>();

  for (const { info, zygosity } of geneVariantInfos) {
    const key = info.starAllele;
    if (processed.has(key)) continue;
    processed.add(key);

    const adjustment = info.activityValue - 1.0; // 0 = -1, 0.5 = -0.5, 1 = 0, 2 = +1

    if (zygosity === 'homozygous') {
      // Both alleles affected
      baseScore += (adjustment * 2);
    } else {
      // Only one allele affected (het or unknown)
      baseScore += adjustment;
    }
  }

  return Math.max(0, Math.min(baseScore, 4.0));
}

/**
 * Determine diplotype string from detected variants for display
 */
function buildDiplotype(
  gene: string,
  geneVariants: Array<{ info: VariantInfo; zygosity: string }>
): string {
  if (geneVariants.length === 0) return '*1/*1';

  const alleles = geneVariants.map(v => v.info.starAllele);
  const unique = [...new Set(alleles)];

  if (geneVariants[0]?.zygosity === 'homozygous' && unique.length === 1) {
    return `${unique[0]}/${unique[0]}`;
  }

  if (unique.length === 1) return `*1/${unique[0]}`;
  return `${unique[0]}/${unique[1]}`;
}

/**
 * Map Activity Score to Phenotype per CPIC guidelines
 */
function activityScoreToPhenotype(gene: string, score: number): Phenotype {
  // CYP2D6 and CYP2C19 use AS system
  if (gene === 'CYP2D6' || gene === 'CYP2C19') {
    if (score === 0)         return 'PM';
    if (score <= 1.0)        return 'IM';
    if (score <= 2.0)        return 'NM';
    if (score <= 2.5)        return 'RM';
    return 'URM';
  }

  // CYP2C9 — simplified mapping
  if (gene === 'CYP2C9') {
    if (score === 0)         return 'PM';
    if (score < 2.0)         return 'IM';
    return 'NM';
  }

  // SLCO1B1, TPMT, DPYD — loss of function focused
  if (score === 0)           return 'PM';
  if (score < 2.0)           return 'IM';
  return 'NM';
}

/**
 * Calculate confidence score based on evidence quality
 */
function calculateConfidence(
  detectedVariants: DetectedVariant[],
  phenotype: Phenotype,
  vcfVariantCount: number
): number {
  let score = 0.5; // Base confidence

  // More variants detected → more confident
  if (detectedVariants.length > 0) score += 0.2;
  if (detectedVariants.length > 2) score += 0.1;

  // Known phenotype increases confidence
  if (phenotype !== 'Unknown') score += 0.1;

  // Good VCF data (many variants parsed)
  if (vcfVariantCount > 5) score += 0.1;

  return Math.min(0.98, score);
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
        diplotype: 'Unknown',
        phenotype: 'Unknown',
        risk: 'Unknown',
        recommendation: `No pharmacogenomic data available for ${drugName}. Consult standard prescribing information.`,
        severity: 'none',
        confidenceScore: 0.1,
        detectedVariants: [],
      });
      continue;
    }

    const { gene } = rule;

    // Find all VCF variants that map to known variants for this gene
    const geneVariantMatches: Array<{ vcfVariant: VcfVariant; info: VariantInfo; zygosity: 'homozygous' | 'heterozygous' | 'unknown' }> = [];

    for (const vcfVar of input.variants) {
      const known = VARIANT_MAP[vcfVar.id];
      if (known && known.gene === gene) {
        const zygosity = vcfVar.isHomozygous
          ? 'homozygous'
          : vcfVar.isHeterozygous
          ? 'heterozygous'
          : 'unknown';
        geneVariantMatches.push({ vcfVariant: vcfVar, info: known, zygosity });
      }
    }

    // Build detected variants list for output schema
    const detectedVariants: DetectedVariant[] = geneVariantMatches.map(({ vcfVariant, info, zygosity }) => ({
      rsid: vcfVariant.id,
      gene,
      starAllele: info.starAllele,
      impact: info.impact,
      zygosity,
    }));

    // Calculate activity score and determine phenotype
    const activityScore = calculateActivityScore(
      geneVariantMatches.map(m => ({ info: m.info, zygosity: m.zygosity }))
    );
    const phenotype = activityScoreToPhenotype(gene, activityScore);

    // Get CPIC rule for phenotype
    const prediction = rule.phenotype_rules[phenotype] ?? rule.phenotype_rules['Unknown'];

    // Build diplotype string
    const diplotype = buildDiplotype(gene, geneVariantMatches.map(m => ({ info: m.info, zygosity: m.zygosity })));

    // Confidence score
    const confidence = calculateConfidence(detectedVariants, phenotype, input.variants.length);

    results.push({
      drug: drugName,
      gene,
      diplotype,
      phenotype,
      risk: prediction.risk,
      recommendation: prediction.recommendation,
      severity: prediction.severity,
      confidenceScore: confidence,
      detectedVariants,
      alternativeDrugs: prediction.alternativeDrugs,
      monitoringParameters: prediction.monitoringParameters,
      cpicLevel: prediction.cpicLevel,
    });
  }

  return results;
}
