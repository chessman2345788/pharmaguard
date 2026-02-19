/**
 * Risk Prediction Mock Engine
 */
export const predictRisk = (variants, drugs) => {
  const results = [];

  drugs.forEach(drugName => {
    const drug = drugName.toUpperCase();
    let risk = 'Safe';
    let phenotype = 'Normal Metabolizer';
    let gene = 'N/A';
    let recommendation = 'Standard dosing as per local guidelines.';
    let severity = 'Low';
    let confidence = 0.95;
    let summary = '';

    // Rule 1: Codeine + CYP2D6 Poor Metabolizer
    if (drug === 'CODEINE') {
      const v = variants.find(v => v.gene === 'CYP2D6');
      if (v && v.diplotype.includes('*4')) {
        risk = 'Toxic';
        gene = 'CYP2D6';
        phenotype = 'Poor Metabolizer';
        severity = 'High';
        recommendation = 'Avoid codeine due to lack of analgesic efficacy and risk of toxicity. Consider alternative analgesics such as morphine or non-opioid options.';
        summary = 'Genetic variation in CYP2D6 reduces the conversion of codeine to its active metabolite morphine, leading to therapeutic failure and potential adverse effects.';
      } else {
        summary = 'Normal CYP2D6 activity suggests standard codeine metabolism.';
      }
    }

    // Rule 2: Clopidogrel + CYP2C19 PM
    if (drug === 'CLOPIDOGREL') {
      const v = variants.find(v => v.gene === 'CYC2C19' || v.gene === 'CYP2C19');
      if (v && (v.diplotype.includes('*2') || v.diplotype.includes('*3'))) {
        risk = 'Ineffective';
        gene = 'CYP2C19';
        phenotype = 'Poor Metabolizer';
        severity = 'High';
        recommendation = 'Avoid clopidogrel. Use alternative antiplatelet therapy such as prasugrel or ticagrelor.';
        summary = 'CYP2C19 poor metabolizers have significantly reduced levels of the active metabolite of clopidogrel, increasing the risk of major adverse cardiovascular events.';
      } else {
        summary = 'Normal CYP2C19 activity indicates expected response to clopidogrel.';
      }
    }

    // Rule 3: Simvastatin + SLCO1B1
    if (drug === 'SIMVASTATIN') {
      const v = variants.find(v => v.gene === 'SLCO1B1');
      if (v) {
        risk = 'Toxic';
        gene = 'SLCO1B1';
        phenotype = 'Decreased Function';
        severity = 'Medium';
        recommendation = 'Prescribe a lower dose of simvastatin (20mg/day) or consider an alternative statin like rosuvastatin or pravastatin.';
        summary = 'Variations in the SLCO1B1 gene are associated with increased plasma concentrations of simvastatin, which can lead to myopathy (muscle pain and weakness).';
      } else {
        summary = 'No SLCO1B1 risk variants detected for simvastatin-induced myopathy.';
      }
    }

    // Rule 4: Warfarin + CYP2C9
    if (drug === 'WARFARIN') {
      const v = variants.find(v => v.gene === 'CYP2C9');
      if (v) {
        risk = 'Adjust Dosage';
        gene = 'CYP2C9';
        phenotype = 'Intermediate Metabolizer';
        severity = 'Medium';
        recommendation = 'Consider a 20-30% reduction in starting dose. Monitor INR closely during initiation.';
        summary = 'The CYP2C9 variant reduces warfarin clearance, requiring a lower maintenance dose to prevent over-anticoagulation.';
      }
    }

    results.push({
      patient_id: 'PG-001',
      drug_name: drug,
      timestamp: new Date().toISOString(),
      risk_assessment: {
        risk_label: risk,
        confidence_score: confidence,
        severity: severity
      },
      pharmacogenomic_profile: {
        primary_gene: gene,
        diplotype: variants[0]?.diplotype || 'N/A',
        phenotype: phenotype,
        detected_variants: variants.filter(v => v.gene === gene || gene === 'N/A')
      },
      clinical_recommendation: {
        dosing_advice: recommendation
      },
      llm_explanation: {
        summary: summary,
        mechanism: `Genetic variation in ${gene} alters the pathway for ${drug} metabolism, affecting either the prodrug activation or the clearance of the active compound.`,
        variant_citations: [`PharmGKB: ${gene}`, `CPIC: ${drug}`]
      },
      raw_data: {
        risk,
        gene,
        phenotype,
        severity,
        recommendation,
        confidence,
        summary
      }
    });
  });

  return results;
};
