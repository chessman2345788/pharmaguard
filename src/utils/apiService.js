/**
 * PharmaGuard AI – Frontend API Service
 * Central client for all backend calls. Replaces all mock/local processing.
 */

import { parseVCF } from './vcfParser';
import { predictRisk } from './riskEngine';
import { geminiChatService } from './geminiChatService';

/**
 * Upload a VCF file and analyze against selected drugs.
 * @param {File|null} file - VCF file object (null if using demo data)
 * @param {string[]} drugs - Array of drug names
 * @param {Array|null} demoVariants - Pre-built demo variants (if no file)
 * @returns {Promise<{ vcf_stats: object, results: Array }>}
 */
export const analyzeVCF = async (file, drugs, demoVariants = null) => {
    try {
        let variants = [];

        if (file) {
            // Read file content in browser
            const text = await file.text();
            variants = await parseVCF(text);
        } else if (demoVariants) {
            variants = demoVariants;
        }

        // Perform risk analysis locally
        const riskResults = predictRisk(variants, drugs);

        // Calculate stats
        const vcf_stats = {
            totalVariants: variants.length,
            genesMatched: new Set(variants.map(v => v.gene)).size,
            actionableVariants: riskResults.filter(r => r.risk_assessment.risk_label !== 'Safe').length
        };

        return {
            vcf_stats,
            results: riskResults
        };

    } catch (err) {
        console.error('Analysis failed:', err);
        throw new Error('Failed to analyze VCF file. Please check the file format.');
    }
};

/**
 * Send a chat message to the clinical AI assistant.
 * @param {string} message - User's question
 * @param {Array} context - Current analysis results (for context-aware answers)
 * @returns {Promise<string>} - AI reply text
 */
export const sendChatMessage = async (message, context = []) => {
    return await geminiChatService(message, context);
};

/**
 * Check health (mock for client-side compatibility)
 * @returns {Promise<object>}
 */
export const checkHealth = async () => {
    return { status: 'ok', mode: 'client-side' };
};
