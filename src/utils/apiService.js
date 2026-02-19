/**
 * PharmaGuard AI – Frontend API Service
 * Central client for all backend calls. Replaces all mock/local processing.
 */

const API_BASE = '/api'; // proxied to http://localhost:5001 via Vite

/**
 * Upload a VCF file and analyze against selected drugs.
 * @param {File|null} file - VCF file object (null if using demo data)
 * @param {string[]} drugs - Array of drug names
 * @param {Array|null} demoVariants - Pre-built demo variants (if no file)
 * @returns {Promise<{ vcf_stats: object, results: Array }>}
 */
export const analyzeVCF = async (file, drugs, demoVariants = null) => {
    const formData = new FormData();

    if (file) {
        formData.append('file', file);
    } else if (demoVariants) {
        // For demo mode: send pre-defined variants as JSON string
        formData.append('demoData', JSON.stringify(demoVariants));
        // Attach a dummy blank file to satisfy multer when needed
    }

    formData.append('drugs', drugs.join(','));

    const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        body: formData,
    });

    const text = await response.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch (err) {
        console.error('Backend returned non-JSON:', text);
        throw new Error(`Server returned invalid response: ${text.slice(0, 100)}...`);
    }

    if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
    }

    return data;
};

/**
 * Send a chat message to the clinical AI assistant.
 * @param {string} message - User's question
 * @param {Array} context - Current analysis results (for context-aware answers)
 * @returns {Promise<string>} - AI reply text
 */
export const sendChatMessage = async (message, context = []) => {
    const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || `Chat error: ${response.status}`);
    }

    return data.reply;
};

/**
 * Check backend health.
 * @returns {Promise<object>}
 */
export const checkHealth = async () => {
    const response = await fetch(`${API_BASE}/health`);
    return response.json();
};
