// Product specification data — the single source of truth for the specification
// record rendered on the product page.
//
// Keyed by SKU so the record always matches the exact product being viewed.
// The seeder (scripts/catalog-data.json) carries commerce and variant fields
// (name/sku/size/family/price/qty/category); analytical values live here only.
//
// RULES
//  - purity is the literal placeholder '≥99%' on every product. It is a
//    declaration, not a per-product measurement: never render a precise figure
//    and never present it as a test result, certificate, or verification.
//  - An unsourced value is OMITTED from the record. Never guess a CAS number,
//    formula, or molecular weight, and never render a "pending" / "in testing"
//    status placeholder.
//  - Values below are sourced from PubChem and the primary literature. See the
//    shape brief's sourced-chemistry table before editing.

export interface ProductSpec {
  /** CAS Registry Number. */
  cas?: string;
  /** Molecular formula. */
  formula?: string;
  /** Average molecular weight in g/mol. */
  molecularWeight?: string;
  /** Amino-acid sequence, one-letter code where the compound is a peptide. */
  sequence?: string;
  /** Purity declaration. Always the placeholder '≥99%'. */
  purity: string;
  /** Physical form as supplied. */
  form: string;
  /** Storage and handling. */
  storage: string;
}

/** The one purity string every product carries. */
export const PURITY_DECLARATION = '≥99%';

/** Standard handling line: kept cool, away from light. */
const STORAGE_COOL_DARK = 'Store cool and dry, away from direct light';

/** Lyophilized powder in a sealed vial. */
const FORM_LYOPHILIZED = 'Lyophilized powder';

export const PRODUCT_SPECS: Record<string, ProductSpec> = {
  'SEMAGLUTIDE-5MG': {
    cas: '910463-68-2',
    formula: 'C187H291N45O59',
    molecularWeight: '4113.58',
    purity: PURITY_DECLARATION,
    form: FORM_LYOPHILIZED,
    storage: STORAGE_COOL_DARK
  },
  'TIRZEPATIDE-10MG': {
    cas: '2023788-19-2',
    formula: 'C225H348N48O68',
    molecularWeight: '4813',
    purity: PURITY_DECLARATION,
    form: FORM_LYOPHILIZED,
    storage: STORAGE_COOL_DARK
  },
  'EPITALON-10MG': {
    cas: '307297-39-8',
    formula: 'C14H22N4O9',
    molecularWeight: '390.35',
    sequence: 'AEDG',
    purity: PURITY_DECLARATION,
    form: FORM_LYOPHILIZED,
    storage: STORAGE_COOL_DARK
  },
  'HUMANIN-10MG': {
    cas: '330936-69-1',
    purity: PURITY_DECLARATION,
    form: FORM_LYOPHILIZED,
    storage: STORAGE_COOL_DARK
  },
  'BPC157-5MG': {
    cas: '137525-51-0',
    formula: 'C62H98N16O22',
    molecularWeight: '1419.5',
    sequence: 'GEPPPGKPADDAGLV',
    purity: PURITY_DECLARATION,
    form: FORM_LYOPHILIZED,
    storage: STORAGE_COOL_DARK
  },
  'BPC157-10MG': {
    cas: '137525-51-0',
    formula: 'C62H98N16O22',
    molecularWeight: '1419.5',
    sequence: 'GEPPPGKPADDAGLV',
    purity: PURITY_DECLARATION,
    form: FORM_LYOPHILIZED,
    storage: STORAGE_COOL_DARK
  },
  'TB500-5MG': {
    cas: '885340-08-9',
    formula: 'C38H68N10O14',
    molecularWeight: '889.02',
    sequence: 'Ac-LKKTETQ',
    purity: PURITY_DECLARATION,
    form: FORM_LYOPHILIZED,
    storage: STORAGE_COOL_DARK
  },
  'TB500-10MG': {
    cas: '885340-08-9',
    formula: 'C38H68N10O14',
    molecularWeight: '889.02',
    sequence: 'Ac-LKKTETQ',
    purity: PURITY_DECLARATION,
    form: FORM_LYOPHILIZED,
    storage: STORAGE_COOL_DARK
  },
  'IPAMORELIN-5MG': {
    cas: '170851-70-4',
    formula: 'C38H49N9O5',
    molecularWeight: '711.9',
    purity: PURITY_DECLARATION,
    form: FORM_LYOPHILIZED,
    storage: STORAGE_COOL_DARK
  },
  'CJC1295-5MG': {
    cas: '863288-34-0',
    formula: 'C152H252N44O42',
    molecularWeight: '3367.9',
    purity: PURITY_DECLARATION,
    form: FORM_LYOPHILIZED,
    storage: STORAGE_COOL_DARK
  },
  'CJC1295-10MG': {
    cas: '863288-34-0',
    formula: 'C152H252N44O42',
    molecularWeight: '3367.9',
    purity: PURITY_DECLARATION,
    form: FORM_LYOPHILIZED,
    storage: STORAGE_COOL_DARK
  },
  'SEMAX-10MG': {
    cas: '80714-61-0',
    formula: 'C37H51N9O10S',
    molecularWeight: '813.9',
    sequence: 'MEHFPGP',
    purity: PURITY_DECLARATION,
    form: FORM_LYOPHILIZED,
    storage: STORAGE_COOL_DARK
  },
  'SELANK-10MG': {
    cas: '129954-34-3',
    formula: 'C33H57N11O9',
    molecularWeight: '751.9',
    sequence: 'TKPRPGP',
    purity: PURITY_DECLARATION,
    form: FORM_LYOPHILIZED,
    storage: STORAGE_COOL_DARK
  },
  'GHKCU-50MG': {
    cas: '89030-95-5',
    purity: PURITY_DECLARATION,
    form: 'Powder',
    storage: STORAGE_COOL_DARK
  }
};

/**
 * The specification record for a SKU, or null when none is recorded.
 * A null result means the product page renders no specification section at all
 * — never an empty table and never a placeholder row.
 */
export function getProductSpec(sku?: string | null): ProductSpec | null {
  if (!sku) return null;
  return PRODUCT_SPECS[sku] ?? null;
}
