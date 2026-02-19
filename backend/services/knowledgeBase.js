/**
 * PharmaGuard AI - Knowledge Base
 * Rules data derived from CPIC Guidelines
 * Maps: drug → gene → allele patterns → { risk, phenotype, severity, recommendation, mechanism }
 */

export const KNOWLEDGE_BASE = {
    CODEINE: {
        gene: 'CYP2D6',
        rules: [
            {
                pattern: ['*3/*4', '*4/*4', '*3/*3', '*5/*5', '*4/*5', '*3/*5'],
                phenotype: 'Poor Metabolizer (PM)',
                risk: 'Ineffective & Toxic',
                severity: 'High',
                recommendation:
                    'AVOID codeine. Lack of analgesic efficacy due to impaired conversion to morphine. Risk of accumulation of parent compound. Use an alternative non-opioid analgesic (e.g., NSAIDs, acetaminophen) or an opioid not affected by CYP2D6 (e.g., morphine, oxymorphone).',
                mechanism:
                    'CYP2D6 poor metabolizers cannot efficiently O-demethylate codeine to morphine (active metabolite), resulting in therapeutic failure.',
            },
            {
                pattern: ['*1xN', '*2xN', '*35xN'],
                phenotype: 'Ultrarapid Metabolizer (UM)',
                risk: 'Toxic',
                severity: 'High',
                recommendation:
                    'AVOID codeine. Risk of life-threatening opioid toxicity due to rapid/extensive conversion of codeine to morphine. Select a non-opioid analgesic or an opioid not metabolized by CYP2D6.',
                mechanism:
                    'Gene duplication leads to excess CYP2D6 enzyme activity, causing rapid conversion of codeine to morphine resulting in opioid toxicity (respiratory depression, overdose).',
            },
            {
                pattern: ['*1/*4', '*1/*5', '*2/*5', '*1/*41', '*2/*41'],
                phenotype: 'Intermediate Metabolizer (IM)',
                risk: 'Caution',
                severity: 'Medium',
                recommendation:
                    'Use codeine with caution and at the lowest effective dose. Monitor closely for both inadequate pain relief and opioid side effects.',
                mechanism:
                    'Reduced CYP2D6 activity results in lower-than-expected morphine production, potentially reducing efficacy.',
            },
            {
                pattern: ['*1/*1', '*1/*2', '*2/*2'],
                phenotype: 'Normal Metabolizer (NM)',
                risk: 'Safe',
                severity: 'Low',
                recommendation: 'Standard dosing as recommended by guidelines.',
                mechanism: 'Normal CYP2D6 activity ensures standard codeine-to-morphine conversion.',
            },
        ],
    },

    WARFARIN: {
        gene: 'CYP2C9',
        rules: [
            {
                pattern: ['*2/*3', '*3/*3'],
                phenotype: 'Poor Metabolizer (PM)',
                risk: 'Adjust Dosage',
                severity: 'High',
                recommendation:
                    'Reduce warfarin dose significantly (40–60% reduction from standard). Use more frequent INR monitoring. Consider an alternative anticoagulant (e.g., direct oral anticoagulants).',
                mechanism:
                    'Severely reduced CYP2C9 activity impairs warfarin (S-warfarin) clearance, greatly increasing bleeding risk.',
            },
            {
                pattern: ['*1/*2', '*1/*3', '*2/*2'],
                phenotype: 'Intermediate Metabolizer (IM)',
                risk: 'Adjust Dosage',
                severity: 'Medium',
                recommendation:
                    'Reduce warfarin starting dose by 20–40%. Monitor INR more frequently during initiation and titration phase.',
                mechanism:
                    'Reduced CYP2C9 enzymatic activity slows warfarin metabolism, leading to elevated plasma levels and increased anticoagulant effect.',
            },
            {
                pattern: ['*1/*1'],
                phenotype: 'Normal Metabolizer (NM)',
                risk: 'Safe',
                severity: 'Low',
                recommendation: 'Initiate warfarin at standard doses per clinical guidelines. Routine INR monitoring.',
                mechanism: 'Normal CYP2C9 activity ensures expected warfarin metabolism and clearance.',
            },
        ],
    },

    CLOPIDOGREL: {
        gene: 'CYP2C19',
        rules: [
            {
                pattern: ['*2/*2', '*3/*3', '*2/*3'],
                phenotype: 'Poor Metabolizer (PM)',
                risk: 'Ineffective',
                severity: 'High',
                recommendation:
                    'AVOID clopidogrel. Select an alternative antiplatelet therapy not dependent on CYP2C19 activation, such as prasugrel or ticagrelor (per CPIC guideline).',
                mechanism:
                    'Loss of CYP2C19 function prevents conversion of clopidogrel to its active thiol metabolite, resulting in loss of platelet inhibition and increased risk of major adverse cardiovascular events (MACE).',
            },
            {
                pattern: ['*1/*2', '*1/*3', '*2/*17'],
                phenotype: 'Intermediate Metabolizer (IM)',
                risk: 'Caution',
                severity: 'Medium',
                recommendation:
                    'Consider alternative antiplatelet therapy (prasugrel or ticagrelor) especially in high-risk patients (ACS, PCI). If clopidogrel is used, increased monitoring is warranted.',
                mechanism:
                    'One non-functional allele reduces active metabolite generation, decreasing antiplatelet efficacy to an intermediate degree.',
            },
            {
                pattern: ['*1/*17', '*17/*17'],
                phenotype: 'Rapid/Ultrarapid Metabolizer (RM/UM)',
                risk: 'Monitor',
                severity: 'Low',
                recommendation:
                    'Standard clopidogrel dosing is appropriate. Slight increase in active metabolite generation; monitor for bleeding risk.',
                mechanism: 'Increased CYP2C19 activity enhances clopidogrel activation; generally favourable but consider bleeding.',
            },
            {
                pattern: ['*1/*1'],
                phenotype: 'Normal Metabolizer (NM)',
                risk: 'Safe',
                severity: 'Low',
                recommendation: 'Standard clopidogrel dosing per guidelines.',
                mechanism: 'Normal CYP2C19 activity ensures expected clopidogrel activation and antiplatelet effect.',
            },
        ],
    },

    SIMVASTATIN: {
        gene: 'SLCO1B1',
        rules: [
            {
                pattern: ['*5/*5', '*15/*15', '*5/*15'],
                phenotype: 'Poor Function (Homozygous)',
                risk: 'Toxic',
                severity: 'High',
                recommendation:
                    'AVOID simvastatin. Significantly elevated risk of statin-induced myopathy and rhabdomyolysis. Use an alternative statin with lower SLCO1B1 sensitivity (e.g., rosuvastatin at reduced dose, pravastatin, or fluvastatin).',
                mechanism:
                    'Homozygous SLCO1B1 loss-of-function severely impairs hepatic uptake of simvastatin acid, leading to dramatically elevated plasma concentrations and myopathy.',
            },
            {
                pattern: ['*1/*5', '*1/*15'],
                phenotype: 'Decreased Function (Heterozygous)',
                risk: 'Adjust Dosage',
                severity: 'Medium',
                recommendation:
                    'Prescribe simvastatin at ≤20mg/day OR switch to a less SLCO1B1-sensitive statin. Educate patient on myalgia/weakness symptoms.',
                mechanism:
                    'One non-functional SLCO1B1 allele reduces hepatic simvastatin uptake, increasing plasma AUC ~2-fold and myopathy risk.',
            },
            {
                pattern: ['*1/*1', '*1a/*1a', '*1b/*1b'],
                phenotype: 'Normal Function',
                risk: 'Safe',
                severity: 'Low',
                recommendation: 'Standard simvastatin dosing is appropriate. Routine monitoring.',
                mechanism: 'Normal SLCO1B1 transporter function ensures adequate hepatic statin uptake and expected plasma levels.',
            },
        ],
    },

    AZATHIOPRINE: {
        gene: 'TPMT',
        rules: [
            {
                pattern: ['*2/*3A', '*3A/*3A', '*3C/*3A', '*2/*3C'],
                phenotype: 'Poor Metabolizer (PM)',
                risk: 'Toxic',
                severity: 'High',
                recommendation:
                    'AVOID azathioprine/6-MP/thioguanine. Severe myelosuppression risk. Consider non-thiopurine alternatives.',
                mechanism:
                    'Complete loss of TPMT activity leads to accumulation of cytotoxic thioguanine nucleotides (TGNs), causing severe bone marrow suppression.',
            },
            {
                pattern: ['*1/*2', '*1/*3A', '*1/*3B', '*1/*3C'],
                phenotype: 'Intermediate Metabolizer (IM)',
                risk: 'Adjust Dosage',
                severity: 'Medium',
                recommendation:
                    'Reduce azathioprine dose by 30–70% of standard. Begin with a lower dose and titrate based on toxicity and therapeutic response. More frequent CBC monitoring required.',
                mechanism: 'Reduced TPMT activity increases TGN accumulation; lower doses prevent myelotoxicity while maintaining efficacy.',
            },
            {
                pattern: ['*1/*1'],
                phenotype: 'Normal Metabolizer (NM)',
                risk: 'Safe',
                severity: 'Low',
                recommendation: 'Standard azathioprine dosing per disease indication.',
                mechanism: 'Normal TPMT activity ensures expected thiopurine metabolism and TGN levels.',
            },
        ],
    },

    FLUOROURACIL: {
        gene: 'DPYD',
        rules: [
            {
                pattern: ['*2A/*2A', 'c.2846AA', 'HapB3/HapB3'],
                phenotype: 'Poor Metabolizer (PM)',
                risk: 'Toxic',
                severity: 'High',
                recommendation:
                    'AVOID fluorouracil (5-FU) and capecitabine. Risk of life-threatening or fatal toxicity (mucositis, neutropenia, neurotoxicity). Alternative chemotherapy agents should be considered.',
                mechanism:
                    'Complete DPYD deficiency prevents catabolism of 5-FU, leading to extreme accumulation of active fluoronucleotide metabolites causing multi-organ toxicity.',
            },
            {
                pattern: ['*1/*2A', '*1/HapB3', '*1/c.2846A'],
                phenotype: 'Intermediate Metabolizer (IM)',
                risk: 'Adjust Dosage',
                severity: 'High',
                recommendation:
                    'Reduce fluorouracil starting dose by 50%. Perform therapeutic drug monitoring (TDM) when available. Escalate doses only if tolerated in subsequent cycles.',
                mechanism:
                    'Partial DPYD loss leads to reduced 5-FU catabolism, increasing exposure and risk of Grade 3–4 toxicities.',
            },
            {
                pattern: ['*1/*1'],
                phenotype: 'Normal Metabolizer (NM)',
                risk: 'Safe',
                severity: 'Low',
                recommendation: 'Standard fluorouracil dosing per oncology protocol.',
                mechanism: 'Normal DPYD activity ensures standard 5-FU catabolism and drug clearance.',
            },
        ],
    },
};

export const DEFAULT_RESULT = {
    phenotype: 'Normal Metabolizer (NM)',
    risk: 'Safe',
    severity: 'Low',
    recommendation: 'Standard dosing as per local clinical guidelines. No pharmacogenomic contraindication identified.',
    mechanism: 'No clinically actionable pharmacogenomic variant detected for this drug-gene pair.',
};
