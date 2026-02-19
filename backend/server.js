/**
 * PharmaGuard AI – Express Backend Server
 * Runs on port 5001 (proxied by Vite in development)
 */

import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });
import express from 'express';
import cors from 'cors';
import analyzeRouter from './routes/analyze.js';
import chatRouter from './routes/chat.js';

const app = express();
const PORT = process.env.PORT || 5001;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(
    cors({
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);
app.use(express.json({ limit: '11mb' }));
app.use(express.urlencoded({ extended: true, limit: '11mb' }));

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/analyze', analyzeRouter);
app.use('/api/chat', chatRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'PharmaGuard API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        gemini_enabled: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.url} not found.` });
});

// Global error handler
app.use((err, req, res, _next) => {
    console.error('[Server Error]', err.message);
    res.status(500).json({ error: err.message || 'Internal server error.' });
});

// ── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🧬 PharmaGuard API running at http://localhost:${PORT}`);
    console.log(`   ✅ Health:   http://localhost:${PORT}/api/health`);
    console.log(`   ✅ Analyze:  POST http://localhost:${PORT}/api/analyze`);
    console.log(`   ✅ Chat:     POST http://localhost:${PORT}/api/chat`);
    const hasKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here';
    console.log(`   ${hasKey ? '🤖 Gemini AI: ENABLED' : '⚠️  Gemini AI: DISABLED (no API key – using fallback responses)'}\n`);
});
