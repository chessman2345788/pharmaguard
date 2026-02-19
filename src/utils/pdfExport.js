/**
 * PharmaGuard – Clinical PDF Report Generator
 * Uses jsPDF + jspdf-autotable to produce a professional,
 * clinic-ready pharmacogenomics report.
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';

const RISK_COLORS = {
    'High Risk': [220, 38, 38],   // red
    'Toxic': [220, 38, 38],
    'Caution': [217, 119, 6],    // amber
    'Medium': [217, 119, 6],
    'Safe': [22, 163, 74],   // green
    'Low Risk': [22, 163, 74],
    'Ineffective': [124, 58, 237],  // purple
    'Unknown': [107, 114, 128],  // gray
};

const getRiskColor = (label = '') => {
    for (const [key, color] of Object.entries(RISK_COLORS)) {
        if (label.toLowerCase().includes(key.toLowerCase())) return color;
    }
    return RISK_COLORS['Unknown'];
};

const hexToRgb = (arr) => ({ r: arr[0], g: arr[1], b: arr[2] });

export const generatePDF = (results) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 18;

    // ── Header bar ───────────────────────────────────────────────────────────
    doc.setFillColor(22, 163, 74);
    doc.rect(0, 0, pageW, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('PharmaGuard AI', margin, 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Pharmacogenomics Clinical Decision Report', margin, 18);

    // Report meta (top-right)
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    doc.setFontSize(8);
    doc.text(`Generated: ${dateStr} at ${timeStr}`, pageW - margin, 11, { align: 'right' });
    doc.text(`Patient ID: ${results[0]?.patient_id || 'PG-DEMO'}`, pageW - margin, 17, { align: 'right' });

    let y = 36;

    // ── Disclaimer banner ────────────────────────────────────────────────────
    doc.setFillColor(255, 251, 235);
    doc.setDrawColor(217, 119, 6);
    doc.roundedRect(margin, y, pageW - margin * 2, 10, 2, 2, 'FD');
    doc.setTextColor(146, 64, 14);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('⚠  CLINICAL USE ONLY', margin + 4, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.text('This report is intended for licensed healthcare professionals. Not a substitute for clinical judgment.', margin + 40, y + 4);
    y += 16;

    // ── Summary table ────────────────────────────────────────────────────────
    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Risk Summary', margin, y);
    y += 6;

    const summaryRows = results.map((r) => [
        r.drug_name,
        r.pharmacogenomic_profile?.primary_gene || '—',
        r.pharmacogenomic_profile?.diplotype || '—',
        r.pharmacogenomic_profile?.phenotype || '—',
        r.risk_assessment?.risk_label || '—',
        `${Math.round((r.risk_assessment?.confidence_score || 0) * 100)}%`,
    ]);

    doc.autoTable({
        startY: y,
        head: [['Drug', 'Gene', 'Diplotype', 'Phenotype', 'Risk', 'Confidence']],
        body: summaryRows,
        theme: 'grid',
        headStyles: {
            fillColor: [17, 24, 39],
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 9,
        },
        bodyStyles: { fontSize: 9, textColor: [31, 41, 55] },
        columnStyles: {
            0: { fontStyle: 'bold' },
            4: { fontStyle: 'bold' },
        },
        didParseCell: (data) => {
            if (data.section === 'body' && data.column.index === 4) {
                const label = data.cell.raw;
                const [r, g, b] = getRiskColor(label);
                data.cell.styles.textColor = [r, g, b];
            }
        },
        margin: { left: margin, right: margin },
    });

    y = doc.lastAutoTable.finalY + 12;

    // ── Per-drug detail sections ───────────────────────────────────────────
    for (const result of results) {
        const riskLabel = result.risk_assessment?.risk_label || 'Unknown';
        const color = getRiskColor(riskLabel);

        // Check if we need a new page
        if (y > pageH - 60) {
            doc.addPage();
            y = 20;
        }

        // Drug header bar
        doc.setFillColor(...color, 0.1);
        doc.setFillColor(color[0], color[1], color[2]);
        doc.setGState(doc.GState({ opacity: 0.1 }));
        doc.rect(margin, y, pageW - margin * 2, 10, 'F');
        doc.setGState(doc.GState({ opacity: 1 }));

        doc.setDrawColor(...color);
        doc.setLineWidth(0.5);
        doc.rect(margin, y, pageW - margin * 2, 10, 'D');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text(`${result.drug_name}  ·  ${riskLabel}`, margin + 3, y + 6.5);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(`Gene: ${result.pharmacogenomic_profile?.primary_gene || '—'}  |  Diplotype: ${result.pharmacogenomic_profile?.diplotype || '—'}  |  Phenotype: ${result.pharmacogenomic_profile?.phenotype || '—'}`, pageW - margin - 3, y + 6.5, { align: 'right' });
        y += 14;

        // Recommendation box
        const rec = result.clinical_recommendation?.dosing_advice || 'No specific recommendation available.';
        const recLines = doc.splitTextToSize(rec, pageW - margin * 2 - 8);

        doc.setFillColor(240, 253, 244);
        doc.setDrawColor(187, 247, 208);
        doc.roundedRect(margin, y, pageW - margin * 2, recLines.length * 5 + 6, 2, 2, 'FD');
        doc.setTextColor(22, 101, 52);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text('RECOMMENDATION', margin + 3, y + 4.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(21, 128, 61);
        doc.text(recLines, margin + 3, y + 9.5);
        y += recLines.length * 5 + 10;

        // Mechanism
        const mech = result.llm_explanation?.mechanism || result.llm_explanation?.summary || '';
        if (mech) {
            const mechLines = doc.splitTextToSize(mech, pageW - margin * 2 - 4);
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(8);
            doc.setTextColor(107, 114, 128);
            doc.text(mechLines, margin + 2, y);
            y += mechLines.length * 4.5 + 6;
        }

        // Citations
        const cites = result.llm_explanation?.variant_citations || [];
        if (cites.length > 0) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(147, 197, 253);
            doc.setTextColor(59, 130, 246);
            doc.text('References: ' + cites.join('  ·  '), margin + 2, y);
            y += 7;
        }

        y += 4;
    }

    // ── Footer on every page ─────────────────────────────────────────────────
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFillColor(243, 244, 246);
        doc.rect(0, pageH - 12, pageW, 12, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(107, 114, 128);
        doc.text('PharmaGuard AI  |  pharmaguard.ai  |  Powered by CPIC Guidelines', margin, pageH - 5);
        doc.text(`Page ${i} of ${pageCount}`, pageW - margin, pageH - 5, { align: 'right' });
    }

    // ── Save ─────────────────────────────────────────────────────────────────
    const patientId = results[0]?.patient_id || 'report';
    const filename = `pharmaguard_${patientId}_${now.toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
};
