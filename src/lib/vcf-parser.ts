export interface VcfVariant {
  chrom: string;
  pos: number;
  id: string;       // rsID or generated key
  ref: string;
  alt: string;
  gene?: string;
  starAllele?: string;
  genotype?: string; // e.g. "0/1" het or "1/1" hom
  isHomozygous: boolean;
  isHeterozygous: boolean;
  info: Record<string, string>;
}

export interface VcfParseResult {
  variants: VcfVariant[];
  patientId: string;
  parseErrors: string[];
  totalLines: number;
}

export function parseVCF(vcfContent: string): VcfParseResult {
  const lines = vcfContent.split('\n');
  const variants: VcfVariant[] = [];
  const parseErrors: string[] = [];
  let patientId = 'PATIENT_001';
  let formatColumnIndex = -1;
  let sampleColumnIndex = -1;
  let totalLines = 0;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    totalLines++;

    // Extract patient ID from VCF header
    if (line.startsWith('##SAMPLE') || line.startsWith('##patient')) {
      const match = line.match(/ID=([^,>]+)/);
      if (match) patientId = match[1];
      continue;
    }

    // Skip meta-information lines
    if (line.startsWith('##')) continue;

    // Parse column header to find FORMAT and SAMPLE positions
    if (line.startsWith('#CHROM')) {
      const headers = line.replace('#', '').split('\t');
      formatColumnIndex = headers.indexOf('FORMAT');
      sampleColumnIndex = headers.length > 9 ? 9 : -1; // sample is always col 9
      continue;
    }

    const columns = line.split('\t');
    if (columns.length < 8) {
      parseErrors.push(`Skipped malformed line: ${line.substring(0, 50)}`);
      continue;
    }

    const [chrom, posStr, rawId, ref, alt, , , infoStr] = columns;

    // Parse INFO column into key-value map
    const info: Record<string, string> = {};
    for (const pair of (infoStr || '').split(';')) {
      const eqIdx = pair.indexOf('=');
      if (eqIdx !== -1) {
        info[pair.substring(0, eqIdx)] = pair.substring(eqIdx + 1);
      } else if (pair) {
        info[pair] = 'true';
      }
    }

    // Resolve rsID — use INFO RS tag, or the ID column, or positional fallback
    const rsId =
      (rawId && rawId !== '.' ? rawId : null) ||
      (info['RS'] ? `rs${info['RS']}` : null) ||
      `${chrom}:${posStr}`;

    // Parse genotype from sample column
    let genotypeStr = '';
    let isHomozygous = false;
    let isHeterozygous = false;

    if (columns.length > 9 && formatColumnIndex !== -1) {
      const format = columns[formatColumnIndex]?.split(':') ?? [];
      const sample = columns[sampleColumnIndex]?.split(':') ?? [];
      const gtIndex = format.indexOf('GT');
      if (gtIndex !== -1 && sample[gtIndex]) {
        genotypeStr = sample[gtIndex];
        const alleles = genotypeStr.split(/[\/|]/);
        const altAlleles = alleles.filter(a => a !== '0' && a !== '.');
        if (altAlleles.length === 2 && alleles[0] === alleles[1]) {
          isHomozygous = true;
        } else if (altAlleles.length >= 1) {
          isHeterozygous = true;
        }
      }
    }

    variants.push({
      chrom,
      pos: parseInt(posStr, 10),
      id: rsId,
      ref,
      alt,
      gene: info['GENE'] || info['Gene'] || undefined,
      starAllele: info['STAR'] || info['Star'] || undefined,
      genotype: genotypeStr || undefined,
      isHomozygous,
      isHeterozygous,
      info,
    });
  }

  return { variants, patientId, parseErrors, totalLines };
}
