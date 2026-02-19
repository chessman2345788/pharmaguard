/**
 * PharmaGuard AI – VCF Parser
 * Extracts genes and variants from VCF content
 */
export const parseVCF = async (fileContent) => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const lines = fileContent.split('\n');
  const variants = [];

  // Filter for key pharmacogenomic genes requested
  const TARGET_GENES = ['CYP2D6', 'CYP2C19', 'CYP2C9', 'SLCO1B1', 'TPMT', 'DPYD'];

  lines.forEach(line => {
    if (line.startsWith('#')) return;
    
    const parts = line.split('\t');
    if (parts.length < 8) return;

    const info = parts[7];
    
    // Look for GENE or RS in INFO field
    let geneMatch = info.match(/GENE=([^;]+)/);
    let starMatch = info.match(/STAR=([^;]+)/);
    let rsMatch = info.match(/RS=([^;]+)/);

    const gene = geneMatch ? geneMatch[1] : null;
    const star = starMatch ? starMatch[1] : null;
    const rs = rsMatch ? rsMatch[1] : parts[2]; // Fallback to ID column

    if (gene && TARGET_GENES.includes(gene)) {
      variants.push({
        gene,
        diplotype: star ? `*${star}` : 'N/A',
        rsid: rs,
        position: parts[1],
        ref: parts[3],
        alt: parts[4]
      });
    }
  });

  return variants;
};

export const getPhenotype = (gene, diplotype) => {
  const phenotypes = {
    'CYP2D6': {
      '*4/*4': 'PM', // Poor Metabolizer
      '*1/*1': 'NM', // Normal Metabolizer
      '*1/*2': 'NM',
      '*1/*4': 'IM', // Intermediate Metabolizer
      '*1xN': 'UM'   // Ultrarapid Metabolizer
    },
    'CYP2C19': {
      '*2/*2': 'PM',
      '*3/*3': 'PM',
      '*1/*1': 'NM',
      '*1/*17': 'RM' // Rapid Metabolizer
    }
  };

  return phenotypes[gene]?.[diplotype] || 'NM';
};
