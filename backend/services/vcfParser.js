/**
 * PharmaGuard AI – Server-Side VCF Parser
 * Parses standard VCF v4.2 files to extract pharmacogenomic variants
 */

const TARGET_GENES = ['CYP2D6', 'CYP2C19', 'CYP2C9', 'SLCO1B1', 'TPMT', 'DPYD'];

/**
 * Parses raw VCF file content and returns an array of pharmacogenomic variant objects.
 * @param {string} content - Raw text content of the VCF file
 * @returns {{ gene: string, diplotype: string, rsid: string, position: string, ref: string, alt: string }[]}
 */
export const parseVCF = (content) => {
    if (!content || typeof content !== 'string') {
        throw new Error('Invalid VCF content: content must be a non-empty string.');
    }

    const lines = content.split('\n');
    const variants = [];
    let hasHeader = false;

    for (const rawLine of lines) {
        const line = rawLine.trim();

        // Skip comment/meta lines but detect that we at least have a VCF header
        if (line.startsWith('##')) continue;
        if (line.startsWith('#CHROM')) {
            hasHeader = true;
            continue;
        }
        if (!line) continue;

        const parts = line.split('\t');
        if (parts.length < 8) continue;

        const [chrom, pos, id, ref, alt, , , info] = parts;

        // Parse INFO field key=value pairs
        const infoMap = {};
        info.split(';').forEach((entry) => {
            const eqIdx = entry.indexOf('=');
            if (eqIdx > -1) {
                infoMap[entry.substring(0, eqIdx)] = entry.substring(eqIdx + 1);
            } else {
                infoMap[entry] = true;
            }
        });

        const gene = infoMap['GENE'] || infoMap['ANN']?.split('|')?.[3] || null;

        if (!gene || !TARGET_GENES.includes(gene)) continue;

        // Star allele / diplotype
        const starRaw = infoMap['STAR'] || infoMap['HAPLOTYPE'] || null;
        const diplotype = starRaw
            ? starRaw.includes('*')
                ? starRaw
                : `*${starRaw}`
            : 'N/A';

        // rsID from INFO or the ID column
        const rsid = infoMap['RS'] ? `rs${infoMap['RS']}` : id !== '.' ? id : 'N/A';

        variants.push({
            gene,
            diplotype,
            rsid,
            position: pos,
            chrom,
            ref: ref || 'N/A',
            alt: alt !== '.' ? alt : 'N/A',
        });
    }

    if (!hasHeader) {
        // Still return variants even without a header; VCF files from tools
        // don't always include the full meta-information block
    }

    return variants;
};

/**
 * Stats summary from parsed variants
 */
export const getVCFStats = (variants) => ({
    totalVariants: variants.length,
    genesMatched: [...new Set(variants.map((v) => v.gene))].length,
    genes: [...new Set(variants.map((v) => v.gene))],
    actionableVariants: variants.filter((v) => v.diplotype !== 'N/A').length,
});
