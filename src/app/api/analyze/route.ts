import { NextRequest, NextResponse } from 'next/server';
import { parseVCF } from '@/lib/vcf-parser';
import { assessRisk } from '@/lib/risk-engine';
import { generateExplanation } from '@/lib/llm-service';

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const drugString = formData.get('drugs') as string;

    if (!file) {
      return NextResponse.json({ error: 'No VCF file provided' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.vcf')) {
      return NextResponse.json({ error: 'File must be a .vcf file' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const vcfContent = buffer.toString('utf-8');

    // ── 1. Parse VCF ──────────────────────────────────────────────
    const { variants, patientId, parseErrors, totalLines } = parseVCF(vcfContent);

    // ── 2. Parse drug list ─────────────────────────────────────────
    const drugs = drugString
      ? drugString.split(',').map(d => d.trim()).filter(Boolean)
      : [];

    if (drugs.length === 0) {
      return NextResponse.json({ error: 'No drugs provided for analysis' }, { status: 400 });
    }

    // ── 3. Assess Risk ─────────────────────────────────────────────
    const riskResults = assessRisk({ variants, drugs });

    // ── 4. Generate LLM Explanations ──────────────────────────────
    const processedResults = await Promise.all(
      riskResults.map(async (result) => {
        const explanation = await generateExplanation(result, result.drug);
        return {
          drug: result.drug,
          gene: result.gene,

          // Pharmacogenomic Profile
          pharmacogenomic_profile: {
            diplotype: result.diplotype,
            phenotype: result.phenotype,
            detected_variants: result.detectedVariants,
            confidence_score: result.confidenceScore,
          },

          // Risk Assessment
          risk_assessment: {
            risk_category: result.risk,
            severity: result.severity,
            cpic_level: result.cpicLevel ?? 'C',
          },

          // Clinical Recommendation
          clinical_recommendation: {
            action: result.recommendation,
            alternative_drugs: result.alternativeDrugs ?? [],
            monitoring_parameters: result.monitoringParameters ?? [],
          },

          // LLM-Generated Explanation
          llm_explanation: explanation,
        };
      })
    );

    const processingTime = Date.now() - startTime;

    // ── 5. Final Response (Hackathon Schema) ──────────────────────
    const response = {
      patient_id: patientId,
      timestamp: new Date().toISOString(),
      drugs_analyzed: drugs,
      results: processedResults,
      quality_metrics: {
        vcf_parsing_success: variants.length > 0,
        total_vcf_lines: totalLines,
        variants_parsed: variants.length,
        parse_errors: parseErrors,
        processing_time_ms: processingTime,
        knowledge_base_version: '2024.1',
        guidelines_source: 'CPIC 2024',
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[PharmaGuard] Error processing VCF:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
