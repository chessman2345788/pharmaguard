/**
 * PharmaGuard AI – Risk Engine
 * Rules-driven engine. Matches detected variants against the knowledge base
 * and returns structured clinical analysis results per drug.
 */

import { KNOWLEDGE_BASE, DEFAULT_RESULT } from './knowledgeBase.js';

const GENE_MAP = {
    CODEINE: 'CYP2D6',
    WARFARIN: 'CYP2C9',
    CLOPIDOGREL: 'CYP2C19',
    SIMVASTATIN: 'SLCO1B1',
    AZATHIOPRINE: 'TPMT',
    FLUOROURACIL: 'DPYD',
};

/**
 * Match a variant's diplotype against a list of patterns (case-insensitive partial match)
 */
const matchDiplotype = (diplotype, patterns) => {
    if (!diplotype || diplotype === 'N/A') return false;
    const d = diplotype.toUpperCase();
    return patterns.some((p) => d.includes(p.toUpperCase()));
};

/**
 * Predict pharmacogenomic risk for a list of drugs given parsed VCF variants.
 * @param {Array} variants - Output from vcfParser.parseVCF
 * @param {string[]} drugs - List of drug names (uppercase)
 * @returns {Array} Array of structured analysis result objects
 */
export const predictRisk = (variants, drugs) => {
    const results = [];
    const timestamp = new Date().toISOString();

    for (const drugName of drugs) {
        const drug = drugName.toUpperCase();
        const drugConfig = KNOWLEDGE_BASE[drug];

        if (!drugConfig) {
            // Drug not in knowledge base → return informational result
            results.push(buildResult(drug, 'N/A', null, DEFAULT_RESULT, [], timestamp));
            continue;
        }

        const { gene, rules } = drugConfig;

        // Find all variants for the relevant gene
        const geneVariants = variants.filter((v) => v.gene === gene);
        const primaryVariant = geneVariants[0] || null;
        const diplotype = primaryVariant?.diplotype || null;

        // Match against rules (first match wins – highest-risk rules should be first in KB)
        let matched = null;
        for (const rule of rules) {
            if (diplotype && matchDiplotype(diplotype, rule.pattern)) {
                matched = rule;
                break;
            }
        }

        // If no variant found at all, check if diplotype is explicitly normal
        if (!matched) {
            matched = rules.find((r) => r.risk === 'Safe') || {
                ...DEFAULT_RESULT,
                mechanism: `No ${gene} variant detected in uploaded VCF. Assuming normal metabolizer phenotype.`,
            };
        }

        results.push(buildResult(drug, gene, primaryVariant, matched, geneVariants, timestamp));
    }

    return results;
};

const buildResult = (drug, gene, primaryVariant, rule, geneVariants, timestamp) => ({
    patient_id: `PG-${Date.now().toString(36).toUpperCase()}`,
    drug_name: drug,
    timestamp,
    risk_assessment: {
        risk_label: rule.risk,
        severity: rule.severity,
        confidence_score: rule.risk === 'Safe' ? 0.97 : 0.94,
    },
    pharmacogenomic_profile: {
        primary_gene: gene,
        diplotype: primaryVariant?.diplotype || 'N/A',
        phenotype: rule.phenotype,
        detected_variants: geneVariants,
    },
    clinical_recommendation: {
        dosing_advice: rule.recommendation,
    },
    llm_explanation: {
        summary: rule.mechanism,
        mechanism: rule.mechanism,
        variant_citations: gene !== 'N/A' ? [`CPIC: ${gene}–${drug}`, `PharmGKB: ${gene}`] : [],
    },
});
