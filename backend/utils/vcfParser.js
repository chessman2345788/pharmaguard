/**
 * Simple VCF Parser for Pharmacogenomics
 * Extracts GENE, STAR, clinical RS from INFO tags
 */
export const parseVCF = (text) => {
  const lines = text.split('\n');
  const variants = [];

  for (const line of lines) {
    if (!line || line.startsWith('#')) continue;

    const parts = line.split('\t');
    if (parts.length < 8) continue;

    const info = parts[7];
    const infoParts = info.split(';');
    const tagMap = {};

    infoParts.forEach(p => {
      const [key, val] = p.split('=');
      tagMap[key] = val;
    });

    // Check for our target genes/tags
    if (tagMap.GENE || tagMap.STAR || tagMap.RS) {
      variants.push({
        gene: tagMap.GENE || 'Unknown',
        star: tagMap.STAR || 'N/A',
        rs: tagMap.RS || parts[2] || 'Unknown',
        chrom: parts[0],
        pos: parts[1],
        ref: parts[3],
        alt: parts[4]
      });
    }
  }

  return variants;
};
