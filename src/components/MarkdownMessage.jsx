import React from 'react';

/**
 * Lightweight markdown renderer for AI chat messages.
 * Handles: ### headings, **bold**, line breaks, ⚠️ safety notes.
 * No external dependencies required.
 */
const MarkdownMessage = ({ text, isUser = false }) => {
    if (!text) return null;

    const lines = text.split('\n');
    const elements = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // ### Heading 3
        if (line.startsWith('### ')) {
            elements.push(
                <p key={key++} className={`font-black text-xs uppercase tracking-widest mt-4 mb-1 ${isUser ? 'text-white/80' : 'text-primary'}`}>
                    {line.replace('### ', '')}
                </p>
            );
            continue;
        }

        // ## Heading 2
        if (line.startsWith('## ')) {
            elements.push(
                <p key={key++} className={`font-black text-sm uppercase tracking-widest mt-4 mb-1 ${isUser ? 'text-white/80' : 'text-primary'}`}>
                    {line.replace('## ', '')}
                </p>
            );
            continue;
        }

        // Empty line → small spacer
        if (line.trim() === '') {
            elements.push(<div key={key++} className="h-1" />);
            continue;
        }

        // Regular line — handle **bold** inline
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const inlineElements = parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });

        elements.push(
            <p key={key++} className="leading-relaxed">
                {inlineElements}
            </p>
        );
    }

    return <div className="space-y-0.5 text-sm">{elements}</div>;
};

export default MarkdownMessage;
