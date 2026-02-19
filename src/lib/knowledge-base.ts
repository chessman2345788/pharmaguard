// PharmaGuard Knowledge Base — CPIC Guidelines 2024
// Covers 6 genes: CYP2D6, CYP2C19, CYP2C9, SLCO1B1, TPMT, DPYD

export type Phenotype = 'PM' | 'IM' | 'NM' | 'RM' | 'URM' | 'Unknown';
export type ClinicalRisk = 'Safe' | 'Adjust Dosage' | 'Toxic' | 'Ineffective' | 'Unknown';
export type Severity = 'none' | 'low' | 'moderate' | 'high' | 'critical';

export interface PhenotypeRule {
  risk: ClinicalRisk;
  recommendation: string;
  severity: Severity;
  alternativeDrugs?: string[];
  monitoringParameters?: string[];
  cpicLevel?: 'A' | 'B' | 'C';
}

export interface DrugRule {
  drug: string;
  gene: string;
  mechanism: string;
  phenotype_rules: Record<Phenotype, PhenotypeRule>;
}

export const DRUG_RULES: Record<string, DrugRule> = {
  'CODEINE': {
    drug: 'Codeine',
    gene: 'CYP2D6',
    mechanism: 'CYP2D6 converts codeine to morphine (active). PM have no conversion; URM over-convert causing toxicity.',
    phenotype_rules: {
      'PM': {
        risk: 'Ineffective',
        recommendation: 'Avoid codeine. No conversion to morphine — drug will be ineffective.',
        severity: 'moderate',
        alternativeDrugs: ['Morphine', 'Hydromorphone', 'Oxycodone'],
        cpicLevel: 'A'
      },
      'IM': {
        risk: 'Adjust Dosage',
        recommendation: 'Use with caution. Reduced conversion to morphine. Monitor for inadequate analgesia.',
        severity: 'low',
        monitoringParameters: ['Pain score', 'Respiratory rate'],
        cpicLevel: 'A'
      },
      'NM': {
        risk: 'Safe',
        recommendation: 'Use label recommended dosage. Normal CYP2D6 activity expected.',
        severity: 'none',
        cpicLevel: 'A'
      },
      'RM': {
        risk: 'Toxic',
        recommendation: 'Avoid codeine. Increased morphine formation may cause respiratory depression.',
        severity: 'high',
        alternativeDrugs: ['Morphine (with dose adjustment)', 'Non-opioid analgesics'],
        cpicLevel: 'A'
      },
      'URM': {
        risk: 'Toxic',
        recommendation: 'CONTRAINDICATED. Ultra-rapid metabolism causes life-threatening morphine accumulation.',
        severity: 'critical',
        alternativeDrugs: ['Non-opioid analgesics', 'Tramadol (with caution)'],
        cpicLevel: 'A'
      },
      'Unknown': {
        risk: 'Unknown',
        recommendation: 'Insufficient genetic data. Consider CYP2D6 genotyping before prescribing.',
        severity: 'low',
        cpicLevel: 'B'
      }
    }
  },
  'WARFARIN': {
    drug: 'Warfarin',
    gene: 'CYP2C9',
    mechanism: 'CYP2C9 metabolizes S-warfarin (most potent enantiomer). Reduced activity increases warfarin exposure and bleeding risk.',
    phenotype_rules: {
      'PM': {
        risk: 'Toxic',
        recommendation: 'Initiate at ≤20% of standard dose. Intensive INR monitoring required weekly for ≥5 weeks.',
        severity: 'high',
        monitoringParameters: ['INR', 'Bleeding signs', 'Bruising'],
        cpicLevel: 'A'
      },
      'IM': {
        risk: 'Adjust Dosage',
        recommendation: 'Reduce starting dose by 25-50%. More frequent INR monitoring required.',
        severity: 'moderate',
        monitoringParameters: ['INR', 'Prothrombin time'],
        cpicLevel: 'A'
      },
      'NM': {
        risk: 'Safe',
        recommendation: 'Use standard dosing algorithm. Routine INR monitoring.',
        severity: 'none',
        cpicLevel: 'A'
      },
      'RM': {
        risk: 'Adjust Dosage',
        recommendation: 'Higher dose may be needed. Monitor INR closely.',
        severity: 'low',
        cpicLevel: 'B'
      },
      'URM': {
        risk: 'Adjust Dosage',
        recommendation: 'Higher dose likely required. Monitor INR closely.',
        severity: 'low',
        cpicLevel: 'B'
      },
      'Unknown': {
        risk: 'Unknown',
        recommendation: 'Standard monitoring required. Consider pharmacogenomic testing.',
        severity: 'none',
        cpicLevel: 'C'
      }
    }
  },
  'CLOPIDOGREL': {
    drug: 'Clopidogrel',
    gene: 'CYP2C19',
    mechanism: 'CYP2C19 activates clopidogrel (prodrug). PM cannot activate and have inadequate platelet inhibition.',
    phenotype_rules: {
      'PM': {
        risk: 'Ineffective',
        recommendation: 'Avoid clopidogrel. Inadequate platelet inhibition increases major cardiovascular event risk.',
        severity: 'high',
        alternativeDrugs: ['Prasugrel', 'Ticagrelor'],
        cpicLevel: 'A'
      },
      'IM': {
        risk: 'Ineffective',
        recommendation: 'Avoid if possible. Consider prasugrel or ticagrelor based on bleeding risk.',
        severity: 'moderate',
        alternativeDrugs: ['Prasugrel', 'Ticagrelor'],
        cpicLevel: 'A'
      },
      'NM': {
        risk: 'Safe',
        recommendation: 'Standard dosing (75mg daily). Expected normal platelet inhibition.',
        severity: 'none',
        cpicLevel: 'A'
      },
      'RM': {
        risk: 'Safe',
        recommendation: 'Standard dosing. Slightly better antiplatelet effect expected.',
        severity: 'none',
        cpicLevel: 'B'
      },
      'URM': {
        risk: 'Safe',
        recommendation: 'Standard dosing. Enhanced antiplatelet effect — monitor for bleeding.',
        severity: 'low',
        monitoringParameters: ['Bleeding time', 'Platelet aggregation'],
        cpicLevel: 'B'
      },
      'Unknown': {
        risk: 'Unknown',
        recommendation: 'Standard monitoring. CYP2C19 genotyping recommended for ACS patients.',
        severity: 'none',
        cpicLevel: 'C'
      }
    }
  },
  'SIMVASTATIN': {
    drug: 'Simvastatin',
    gene: 'SLCO1B1',
    mechanism: 'SLCO1B1 transports simvastatin into hepatocytes. Reduced function raises plasma levels, increasing myopathy risk.',
    phenotype_rules: {
      'PM': {
        risk: 'Toxic',
        recommendation: 'Limit simvastatin to ≤20mg/day or switch to alternative statin with lower myopathy risk.',
        severity: 'high',
        alternativeDrugs: ['Rosuvastatin', 'Pravastatin', 'Fluvastatin'],
        monitoringParameters: ['CK levels', 'Muscle pain/weakness'],
        cpicLevel: 'A'
      },
      'IM': {
        risk: 'Adjust Dosage',
        recommendation: 'Maximum dose 40mg/day. Monitor CK levels and for symptoms of myopathy.',
        severity: 'moderate',
        monitoringParameters: ['CK levels', 'Myalgia'],
        cpicLevel: 'A'
      },
      'NM': {
        risk: 'Safe',
        recommendation: 'Standard dosing per label. Routine monitoring.',
        severity: 'none',
        cpicLevel: 'A'
      },
      'RM': { risk: 'Safe', recommendation: 'Standard dosing.', severity: 'none', cpicLevel: 'C' },
      'URM': { risk: 'Safe', recommendation: 'Standard dosing.', severity: 'none', cpicLevel: 'C' },
      'Unknown': {
        risk: 'Unknown',
        recommendation: 'Use simvastatin with standard precautions.',
        severity: 'none',
        cpicLevel: 'C'
      }
    }
  },
  'AZATHIOPRINE': {
    drug: 'Azathioprine',
    gene: 'TPMT',
    mechanism: 'TPMT inactivates thiopurine metabolites. Low TPMT activity causes accumulation of toxic thioguanine nucleotides.',
    phenotype_rules: {
      'PM': {
        risk: 'Toxic',
        recommendation: 'Avoid azathioprine. Risk of life-threatening myelosuppression. Consider non-thiopurine alternatives.',
        severity: 'critical',
        alternativeDrugs: ['Mycophenolate', 'Methotrexate'],
        monitoringParameters: ['CBC', 'LFTs'],
        cpicLevel: 'A'
      },
      'IM': {
        risk: 'Adjust Dosage',
        recommendation: 'Reduce dose by 30–70% of standard dose. Weekly CBC for the first month.',
        severity: 'high',
        monitoringParameters: ['CBC weekly', 'Neutrophil count'],
        cpicLevel: 'A'
      },
      'NM': {
        risk: 'Safe',
        recommendation: 'Standard dosing. CBC monitoring per standard of care.',
        severity: 'none',
        cpicLevel: 'A'
      },
      'RM': { risk: 'Safe', recommendation: 'Standard dosing.', severity: 'none', cpicLevel: 'C' },
      'URM': { risk: 'Safe', recommendation: 'Standard dosing.', severity: 'none', cpicLevel: 'C' },
      'Unknown': {
        risk: 'Unknown',
        recommendation: 'TPMT phenotyping or genotyping recommended before starting azathioprine.',
        severity: 'low',
        cpicLevel: 'B'
      }
    }
  },
  'FLUOROURACIL': {
    drug: 'Fluorouracil',
    gene: 'DPYD',
    mechanism: 'DPYD catabolizes fluorouracil. Deficiency causes severe 5-FU accumulation and systemic toxicity.',
    phenotype_rules: {
      'PM': {
        risk: 'Toxic',
        recommendation: 'CONTRAINDICATED. Complete DPYD deficiency — severe life-threatening toxicity expected.',
        severity: 'critical',
        alternativeDrugs: ['Non-fluoropyrimidine chemotherapy regimen'],
        cpicLevel: 'A'
      },
      'IM': {
        risk: 'Adjust Dosage',
        recommendation: 'Reduce starting dose by 50%. Titrate based on tolerability with close monitoring.',
        severity: 'high',
        monitoringParameters: ['CBC', 'GI toxicity', 'Mucositis', 'Diarrhea'],
        cpicLevel: 'A'
      },
      'NM': {
        risk: 'Safe',
        recommendation: 'Standard dosing per oncology protocol.',
        severity: 'none',
        cpicLevel: 'A'
      },
      'RM': { risk: 'Safe', recommendation: 'Standard dosing.', severity: 'none', cpicLevel: 'C' },
      'URM': { risk: 'Safe', recommendation: 'Standard dosing.', severity: 'none', cpicLevel: 'C' },
      'Unknown': {
        risk: 'Unknown',
        recommendation: 'DPYD genotyping strongly recommended before initiating fluoropyrimidine therapy.',
        severity: 'moderate',
        cpicLevel: 'B'
      }
    }
  }
};

// ── Variant Map ──────────────────────────────────────────────────
// Maps rsID → { gene, star allele, activity impact }
// Sources: CPIC 2024, PharmGKB

export type VariantImpact = 'no_function' | 'decreased' | 'normal' | 'increased';

export interface VariantInfo {
  gene: string;
  starAllele: string;
  impact: VariantImpact;
  activityValue: number; // 0 = no function, 0.5 = decreased, 1 = normal, 2 = increased
  description: string;
}

export const VARIANT_MAP: Record<string, VariantInfo> = {
  // ── CYP2D6 ──────────────────────────────────────────────────────
  'rs3892097':  { gene: 'CYP2D6', starAllele: '*4',  impact: 'no_function', activityValue: 0,   description: 'Most common non-functional CYP2D6 allele in Europeans' },
  'rs1065852':  { gene: 'CYP2D6', starAllele: '*10', impact: 'decreased',   activityValue: 0.5, description: 'Common in East Asians; reduced but not absent activity' },
  'rs5030655':  { gene: 'CYP2D6', starAllele: '*6',  impact: 'no_function', activityValue: 0,   description: 'Frameshift mutation causing null allele' },
  'rs35742686': { gene: 'CYP2D6', starAllele: '*3',  impact: 'no_function', activityValue: 0,   description: 'Frameshift in exon 5; prevalent in Europeans' },
  'rs1135840':  { gene: 'CYP2D6', starAllele: '*41', impact: 'decreased',   activityValue: 0.5, description: 'Splicing defect; reduced activity' },
  'rs1080985':  { gene: 'CYP2D6', starAllele: '*41', impact: 'decreased',   activityValue: 0.5, description: 'Associated with decreased phenotype' },
  'rs28371725': { gene: 'CYP2D6', starAllele: '*41', impact: 'decreased',   activityValue: 0.5, description: 'Splicing defect associated variant' },

  // ── CYP2C9 ──────────────────────────────────────────────────────
  'rs1799853':  { gene: 'CYP2C9', starAllele: '*2',  impact: 'decreased',   activityValue: 0.5, description: 'Arg144Cys — common in Caucasians; ~70% activity' },
  'rs1057910':  { gene: 'CYP2C9', starAllele: '*3',  impact: 'no_function', activityValue: 0,   description: 'Ile359Leu — severely reduced Warfarin metabolism' },
  'rs28371686': { gene: 'CYP2C9', starAllele: '*5',  impact: 'decreased',   activityValue: 0.5, description: 'Common in African Americans' },
  'rs9332131':  { gene: 'CYP2C9', starAllele: '*6',  impact: 'no_function', activityValue: 0,   description: 'Null allele found in African Americans' },

  // ── CYP2C19 ─────────────────────────────────────────────────────
  'rs4244285':  { gene: 'CYP2C19', starAllele: '*2',  impact: 'no_function', activityValue: 0,   description: 'Most common loss-of-function; splicing defect' },
  'rs4986893':  { gene: 'CYP2C19', starAllele: '*3',  impact: 'no_function', activityValue: 0,   description: 'Common in East Asians; premature stop codon' },
  'rs12248560': { gene: 'CYP2C19', starAllele: '*17', impact: 'increased',   activityValue: 2,   description: 'Gain-of-function; promoter variant increasing expression' },
  'rs28399504': { gene: 'CYP2C19', starAllele: '*4',  impact: 'no_function', activityValue: 0,   description: 'Splicing/missense loss-of-function allele' },

  // ── SLCO1B1 ─────────────────────────────────────────────────────
  'rs4149056':  { gene: 'SLCO1B1', starAllele: '*5',  impact: 'decreased',   activityValue: 0.5, description: 'Val174Ala — strongly associated with simvastatin myopathy' },
  'rs2306283':  { gene: 'SLCO1B1', starAllele: '*1b', impact: 'increased',   activityValue: 2,   description: 'Slightly increased hepatic uptake transporter activity' },

  // ── TPMT ────────────────────────────────────────────────────────
  'rs1800460':  { gene: 'TPMT', starAllele: '*3B', impact: 'no_function', activityValue: 0,   description: 'Ala154Thr — causes protein instability and rapid degradation' },
  'rs1142345':  { gene: 'TPMT', starAllele: '*3C', impact: 'no_function', activityValue: 0,   description: 'Tyr240Cys — most common TPMT non-functional allele in Africans/Asians' },
  'rs1800584':  { gene: 'TPMT', starAllele: '*3A', impact: 'no_function', activityValue: 0,   description: 'Combined *3A has both *3B and *3C — most common in Caucasians' },

  // ── DPYD ────────────────────────────────────────────────────────
  'rs3918290':  { gene: 'DPYD', starAllele: '*2A',   impact: 'no_function', activityValue: 0,   description: 'IVS14+1G>A splice site mutation — most common DPYD null allele' },
  'rs67376798': { gene: 'DPYD', starAllele: 'HapB3', impact: 'decreased',   activityValue: 0.5, description: 'p.Ile560Ser — Haplotype B3; reduced activity' },
  'rs55886062': { gene: 'DPYD', starAllele: '*13',   impact: 'no_function', activityValue: 0,   description: 'Ile543Val — severe enzyme deficiency' },
  'rs75017182': { gene: 'DPYD', starAllele: 'HapB3', impact: 'decreased',   activityValue: 0.5, description: 'HapB3 tagging SNP' },
};
