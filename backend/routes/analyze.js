/**
 * POST /api/analyze
 * Accepts a VCF file + drug list, returns full pharmacogenomic risk analysis.
 */

import express from 'express';
import multer from 'multer';
import { parseVCF, getVCFStats } from '../services/vcfParser.js';
import { predictRisk } from '../services/riskEngine.js';
import { generateExplanation } from '../services/geminiService.js';

const router = express.Router();

// Multer config: store in memory, limit to 10MB
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.originalname.endsWith('.vcf') || file.mimetype === 'text/plain') {
            cb(null, true);
        } else {
            cb(new Error('Only .vcf files are accepted.'));
        }
    },
});

router.post('/', upload.single('file'), async (req, res) => {
    try {
        // ── 1. Validate inputs ──────────────────────────────────────────────────
        if (!req.file && !req.body.demoData) {
            return res.status(400).json({ error: 'No VCF file uploaded.' });
        }

        const drugsRaw = req.body.drugs;
        if (!drugsRaw) {
            return res.status(400).json({ error: 'No drugs specified.' });
        }

        const drugs = drugsRaw
            .split(',')
            .map((d) => d.trim().toUpperCase())
            .filter(Boolean);

        if (drugs.length === 0) {
            return res.status(400).json({ error: 'At least one drug must be specified.' });
        }

        // ── 2. Parse VCF ────────────────────────────────────────────────────────
        let variants = [];
        let vcfStats = { totalVariants: 0, genesMatched: 0, genes: [], actionableVariants: 0 };

        if (req.body.demoData) {
            // Pre-parsed demo variants sent from client
            try {
                variants = JSON.parse(req.body.demoData);
            } catch {
                return res.status(400).json({ error: 'Invalid demoData JSON.' });
            }
        } else {
            const vcfContent = req.file.buffer.toString('utf-8');
            variants = parseVCF(vcfContent);
            vcfStats = getVCFStats(variants);
        }

        // ── 3. Run risk engine ──────────────────────────────────────────────────
        const rawResults = predictRisk(variants, drugs);

        // ── 4. Augment with Gemini AI explanations (best-effort) ───────────────
        const enhancedResults = await Promise.all(
            rawResults.map(async (result) => {
                try {
                    const aiText = await generateExplanation(
                        result.drug_name,
                        result.pharmacogenomic_profile.primary_gene,
                        result.pharmacogenomic_profile.phenotype,
                        result.risk_assessment.risk_label,
                        result.llm_explanation.mechanism
                    );
                    return {
                        ...result,
                        llm_explanation: {
                            ...result.llm_explanation,
                            ai_narrative: aiText,
                        },
                    };
                } catch {
                    return result; // fallback: return without AI augmentation
                }
            })
        );

        // ── 5. Return response ──────────────────────────────────────────────────
        return res.status(200).json({
            success: true,
            vcf_stats: vcfStats,
            results: enhancedResults,
        });
    } catch (err) {
        console.error('[/api/analyze]', err);
        return res.status(500).json({ error: err.message || 'Analysis failed.' });
    }
});

export default router;
