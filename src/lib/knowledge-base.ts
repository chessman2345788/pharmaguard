// Simplified Knowledge Base based on CPIC guidelines

export type Phenotype = 'PM' | 'IM' | 'NM' | 'RM' | 'URM' | 'Unknown';
export type ClinicalRisk = 'Safe' | 'Adjust Dosage' | 'Toxic' | 'Ineffective' | 'Unknown';
export type Severity = 'none' | 'low' | 'moderate' | 'high' | 'critical';

export interface DrugRule {
  drug: string;
  gene: string;
  phenotype_rules: Record<Phenotype, {
    risk: ClinicalRisk;
    recommendation: string;
    severity: Severity;
  }>;
}

export const DRUG_RULES: Record<string, DrugRule> = {
  'CODEINE': {
    drug: 'Codeine',
    gene: 'CYP2D6',
    phenotype_rules: {
      'PM': { // Poor Metabolizer
        risk: 'Ineffective',
        recommendation: 'Avoid codeine due to lack of efficacy. Consider alternative analgesics like morphine or non-opioid.',
        severity: 'moderate'
      },
      'IM': { // Intermediate Metabolizer
        risk: 'Adjust Dosage',
        recommendation: 'Monitor for efficacy. If no response, consider alternative.',
        severity: 'low'
      },
      'NM': { // Normal Metabolizer
        risk: 'Safe',
        recommendation: 'Use label recommended dosage.',
        severity: 'none'
      },
      'RM': { // Rapid Metabolizer
        risk: 'Toxic',
        recommendation: 'Avoid codeine. Potential for toxicity (respiratory depression).',
        severity: 'high'
      },
      'URM': { // Ultra-rapid Metabolizer
        risk: 'Toxic',
        recommendation: 'Avoid codeine. High risk of toxicity.',
        severity: 'critical'
      },
      'Unknown': {
        risk: 'Unknown',
        recommendation: 'Genetic data insufficient for recommendation.',
        severity: 'low'
      }
    }
  },
  'WARFARIN': {
    drug: 'Warfarin',
    gene: 'CYP2C9',
    phenotype_rules: {
      'PM': {
        risk: 'Toxic',
        recommendation: 'Consider lower starting dose. Increased risk of bleeding.',
        severity: 'high'
      },
      'IM': {
        risk: 'Adjust Dosage',
        recommendation: 'Consider lower starting dose.',
        severity: 'moderate'
      },
      'NM': {
        risk: 'Safe',
        recommendation: 'Use label recommended dosage.',
        severity: 'none'
      },
      'RM': { // CYP2C9 doesn't really have URM in same way, simplified
        risk: 'Adjust Dosage',
        recommendation: 'Higher dose may be required.',
        severity: 'low'
      },
      'URM': {
         risk: 'Adjust Dosage',
         recommendation: 'Higher dose may be required.',
         severity: 'low'
      },
      'Unknown': {
        risk: 'Unknown',
        recommendation: 'Standard monitoring required.',
        severity: 'none'
      }
    }
  },
   'CLOPIDOGREL': {
    drug: 'Clopidogrel',
    gene: 'CYP2C19',
    phenotype_rules: {
      'PM': {
        risk: 'Ineffective',
        recommendation: 'Avoid clopidogrel. Consider prasugrel or ticagrelor.',
        severity: 'high'
      },
      'IM': {
        risk: 'Ineffective',
        recommendation: 'Avoid clopidogrel. Consider prasugrel or ticagrelor.',
        severity: 'moderate'
      },
      'NM': {
        risk: 'Safe',
        recommendation: 'Standard dosing.',
        severity: 'none'
      },
      'RM': {
        risk: 'Safe',
        recommendation: 'Standard dosing.',
        severity: 'none'
      },
      'URM': {
        risk: 'Safe',
        recommendation: 'Standard dosing.',
        severity: 'none'
      },
      'Unknown': {
        risk: 'Unknown',
        recommendation: 'Standard monitoring.',
        severity: 'none'
      }
    }
  },
  // Simplified placeholders for others
  'SIMVASTATIN': {
     drug: 'Simvastatin',
     gene: 'SLCO1B1',
     phenotype_rules: {
        'PM': { // function decreases
             risk: 'Toxic',
             recommendation: 'limit dose to 20mg daily or consider alternative statin.',
             severity: 'high'
        },
        'IM': {
             risk: 'Adjust Dosage',
             recommendation: 'Monitor for myopathy.',
             severity: 'moderate'
        },
        'NM': {
             risk: 'Safe',
             recommendation: 'Standard dosing.',
             severity: 'none'
        },
        'RM': { risk: 'Safe', recommendation: 'Standard dosing.', severity: 'none' }, // Not standard
        'URM': { risk: 'Safe', recommendation: 'Standard dosing.', severity: 'none' },
        'Unknown': { risk: 'Unknown', recommendation: 'Standard dosing.', severity: 'none' }
     }
  },
   'AZATHIOPRINE': {
     drug: 'Azathioprine',
     gene: 'TPMT',
     phenotype_rules: {
        'PM': {
             risk: 'Toxic',
             recommendation: 'Drastically reduce dose or avoid.',
             severity: 'critical'
        },
        'IM': {
             risk: 'Adjust Dosage',
             recommendation: 'Start with reduced dose (30-70%).',
             severity: 'high'
        },
        'NM': {
             risk: 'Safe',
             recommendation: 'Standard dosing.',
             severity: 'none'
        },
        'RM': { risk: 'Safe', recommendation: 'Standard dosing.', severity: 'none' },
        'URM': { risk: 'Safe', recommendation: 'Standard dosing.', severity: 'none' }, // N/A
        'Unknown': { risk: 'Unknown', recommendation: 'Standard dosing.', severity: 'none' }
     }
  },
   'FLUOROURACIL': {
     drug: 'Fluorouracil',
     gene: 'DPYD',
     phenotype_rules: {
        'PM': {
             risk: 'Toxic',
             recommendation: 'Avoid use. High risk of severe toxicity.',
             severity: 'critical'
        },
        'IM': {
             risk: 'Adjust Dosage',
             recommendation: 'Reduce starting dose by 50%.',
             severity: 'high'
        },
        'NM': {
             risk: 'Safe',
             recommendation: 'Standard dosing.',
             severity: 'none'
        },
        'RM': { risk: 'Safe', recommendation: 'Standard dosing.', severity: 'none' },
        'URM': { risk: 'Safe', recommendation: 'Standard dosing.', severity: 'none' },
        'Unknown': { risk: 'Unknown', recommendation: 'Standard dosing.', severity: 'none' }
     }
  }

};

// Simplified variant map (rsID to allele/function)
// Real implementation would be much larger
export const VARIANT_MAP: Record<string, { gene: string; variant: string; impact: 'loss' | 'gain' | 'no_function' }> = {
    // CYP2D6
    'rs3892097': { gene: 'CYP2D6', variant: '*4', impact: 'no_function' },
    'rs1065852': { gene: 'CYP2D6', variant: '*10', impact: 'loss' },
    // CYP2C9
    'rs1799853': { gene: 'CYP2C9', variant: '*2', impact: 'loss' },
    'rs1057910': { gene: 'CYP2C9', variant: '*3', impact: 'loss' },
    // CYP2C19
    'rs4244285': { gene: 'CYP2C19', variant: '*2', impact: 'no_function' },
    'rs4986893': { gene: 'CYP2C19', variant: '*3', impact: 'no_function' },
    'rs12248560': { gene: 'CYP2C19', variant: '*17', impact: 'gain' },
    // SLCO1B1
    'rs4149056': { gene: 'SLCO1B1', variant: '*5', impact: 'loss' },
};
