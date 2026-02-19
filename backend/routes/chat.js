/**
 * POST /api/chat
 * Clinical AI chatbot powered by Gemini.
 * Body: { message: string, context: AnalysisResult[] }
 */

import express from 'express';
import { chatWithContext } from '../services/geminiService.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { message, context = [] } = req.body;

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({ error: 'Message is required.' });
        }

        if (message.trim().length > 1000) {
            return res.status(400).json({ error: 'Message too long (max 1000 characters).' });
        }

        const response = await chatWithContext(message.trim(), context);
        return res.status(200).json({ success: true, reply: response });
    } catch (err) {
        console.error('[/api/chat]', err);
        return res.status(500).json({ error: err.message || 'Chat service unavailable.' });
    }
});

export default router;
