import { NextRequest, NextResponse } from 'next/server';
import { parseVCF } from '@/lib/vcf-parser';
import { assessRisk } from '@/lib/risk-engine';
import { generateExplanation } from '@/lib/llm-service';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const drugString = formData.get('drugs') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const vcfContent = buffer.toString('utf-8');
    
    // 1. Parse VCF
    const variants = parseVCF(vcfContent);

    // 2. Assess Risk
    const drugs = drugString ? drugString.split(',').map(d => d.trim()) : [];
    const riskResults = assessRisk({ variants, drugs });

    // 3. Generate Explanations (Mocked for speed/safety/hackathon demo)
    const processedResults = await Promise.all(riskResults.map(async (result) => {
        const explanation = await generateExplanation(result, result.drug);
        return {
            ...result,
            llm_explanation: explanation
        };
    }));

    // 4. Construct Final JSON strict schema
    const response = {
      patient_id: "PATIENT_DEMO", // In real app, extracting from VCF header often impossible/anonymized
      timestamp: new Date().toISOString(),
      drugs_analyzed: drugs,
      results: processedResults, // This matches the risk assessment structure mostly
      quality_metrics: {
        vcf_parsing_success: variants.length > 0,
        variant_count: variants.length
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing VCF:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
