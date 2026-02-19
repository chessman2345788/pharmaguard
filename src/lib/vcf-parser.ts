export interface VcfVariant {
  chrom: string;
  pos: number;
  id: string; // RSID
  ref: string;
  alt: string;
  gene?: string;
  info: Record<string, string>;
}

export function parseVCF(vcfContent: string): VcfVariant[] {
  const lines = vcfContent.split('\n');
  const variants: VcfVariant[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('##')) {
      continue;
    }

    if (trimmedLine.startsWith('#CHROM')) {
      // Header line, can be used to validate columns if needed
      continue;
    }

    const columns = trimmedLine.split('\t');
    if (columns.length < 8) {
      continue;
    }

    const [chrom, pos, id, ref, alt, qual, filter, infoStr] = columns;

    // Parse INFO column
    const info: Record<string, string> = {};
    const infoPairs = infoStr.split(';');
    for (const pair of infoPairs) {
      const [key, value] = pair.split('=');
      if (key) {
        info[key] = value || 'true'; // Flag fields have no value
      }
    }

    variants.push({
      chrom,
      pos: parseInt(pos, 10),
      id,
      ref,
      alt,
      gene: info['GENE'], // Assuming GENE tag exists based on requirements
      info,
    });
  }

  return variants;
}
