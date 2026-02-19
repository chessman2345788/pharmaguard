import { parseVCF } from '../utils/vcfParser.js';
import { analyzeRisk } from '../services/riskEngine.js';
import { getGeminiResponse } from '../services/geminiService.js';
import fs from 'fs';

export const handleAnalysis = async (req, res) => {
  const startTime = Date.now();
  let vcfParsingSuccess = false;
  let variantCount = 0;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No VCF file uploaded." });
    }

    const fileContent = fs.readFileSync(req.file.path, 'utf-8');
    
    // Feature 5: Invalid VCF Error Handling
    if (!fileContent.includes("INFO")) {
       return res.status(400).json({ error: "Invalid VCF format — required INFO tags missing." });
    }

    const variants = parseVCF(fileContent);
    variantCount = variants.length;
    vcfParsingSuccess = variantCount > 0;

    if (!vcfParsingSuccess) {
       return res.status(400).json({ error: "Invalid VCF format — no relevant pharmacogenomic variants (GENE/RS) detected in INFO field." });
    }

    // Handle multi-drug input from Feature 6
    let selectedDrugs = ['CODEINE', 'CLOPIDOGREL', 'SIMVASTATIN', 'WARFARIN'];
    if (req.body.selectedDrugs) {
       if (typeof req.body.selectedDrugs === 'string') {
          selectedDrugs = req.body.selectedDrugs.split(',').map(d => d.trim().toUpperCase());
       } else if (Array.isArray(req.body.selectedDrugs)) {
          selectedDrugs = req.body.selectedDrugs.map(d => d.trim().toUpperCase());
       }
    }

    const analysis = await analyzeRisk(variants, selectedDrugs);
    const runtime = (Date.now() - startTime) / 1000;

    // Feature 1: Exact JSON Output Structure (Step 3 Alignment)
    const enrichedAnalysis = analysis.map(result => ({
       ...result,
       quality_metrics: {
          vcf_parsing_success: vcfParsingSuccess,
          variant_count: result.pharmacogenomic_profile.detected_variants.length,
          missing_annotations: false
       }
    }));

    // Generate a global LLM summary
    let globalSummary = "Pharmacogenomic analysis complete. Multiple genetic markers detected.";
    try {
      const summaryPrompt = `Provide a very brief (2 sentence) clinical summary for a patient with these genetic risks: ${JSON.stringify(enrichedAnalysis.map(r => ({drug: r.drug, risk: r.risk_assessment.risk_label})))}`;
      globalSummary = await getGeminiResponse(summaryPrompt);
    } catch (aiError) {
      console.error("AI Summary generation failed:", aiError.message);
    }
    
    // Feature 7: Backend Schema Validation (Updated for Step 3)
    const requiredFields = ['patient_id', 'drug', 'timestamp', 'risk_assessment', 'pharmacogenomic_profile', 'clinical_recommendation', 'llm_generated_explanation', 'quality_metrics'];
    
    const isValid = enrichedAnalysis.every(res => 
       requiredFields.every(field => res[field] !== undefined && res[field] !== null)
    );

    if (!isValid) {
       return res.status(500).json({ error: "Schema validation failed" });
    }

    res.json(enrichedAnalysis);
  } catch (error) {
    console.error("CRITICAL Analysis Error:", error);
    res.status(500).json({ error: `Analysis Engine Error: ${error.message}` });
  } finally {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
};

export const getDemoData = async (req, res) => {
  const mockVariants = [
    { gene: 'CYP2D6', star: '*4', rs: 'rs3892097' },
    { gene: 'CYP2C19', star: '*2', rs: 'rs4244285' },
    { gene: 'SLCO1B1', star: '*5', rs: 'rs4149056' }
  ];
  const analysis = await analyzeRisk(mockVariants);
  const demoSummary = "Demo patient showing multiple genetic metabolic flags for cardiovascular and analgesic therapy. Poor conversion of prodrugs and decreased clearance rates detected.";
  
  const enrichedAnalysis = analysis.map(r => ({
     ...r,
     quality_metrics: {
        vcf_parsing_success: true,
        variant_count: r.pharmacogenomic_profile.detected_variants.length,
        missing_annotations: false
     }
  }));
  
  enrichedAnalysis.forEach(r => {
    r.llm_generated_explanation.summary = demoSummary;
  });
  
  res.json(enrichedAnalysis);
};

export const getAnalytics = (req, res) => {
  res.json({
    riskDistribution: [
      { name: 'High Risk', value: 45, color: '#ef4444' },
      { name: 'Moderate', value: 30, color: '#f59e0b' },
      { name: 'Normal', value: 25, color: '#10b981' }
    ],
    variantCounts: [
      { gene: 'CYP2D6', count: 120 },
      { gene: 'CYP2C19', count: 85 },
      { gene: 'CYP2C9', count: 64 },
      { gene: 'SLCO1B1', count: 92 }
    ],
    confidenceTrend: [
      { month: 'Jan', acc: 98.2 },
      { month: 'Feb', acc: 98.5 },
      { month: 'Mar', acc: 99.1 }
    ]
  });
};
