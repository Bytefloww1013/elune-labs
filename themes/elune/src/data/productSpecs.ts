// Product specification data — the single source of truth for the specification
// record rendered on the product page.
//
// Keyed by SKU so the record always matches the exact product being viewed.
// The seeder (scripts/catalog-data.json) carries commerce and variant fields
// (name/sku/size/family/price/qty/category); analytical values live here only.
//
// RULES
//  - purity is the literal placeholder '≥99%' on every product that has a
//    record here — 22 of the 84 catalog SKUs. It is a declaration, not a
//    per-product measurement: never render a precise figure and never present it
//    as a test result, certificate, or verification. A SKU with no record has no
//    purity value at all; the product page renders no specification section for it.
//  - An unsourced value is OMITTED from the record. Never guess a CAS number,
//    formula, or molecular weight, and never render a "pending" / "in testing"
//    status placeholder.
//  - Values below are sourced from PubChem and the primary literature. See the
//    shape brief's sourced-chemistry table before editing.
//  - A record describes the molecule. Where one compound ships in more than one
//    vial size (scripts/catalog-data.json `family`), every size of that compound
//    references the same record below; no size carries a value its molecule does
//    not have, and a compound with no sourced record gets no record at all —
//    multi-component blends included.

export interface ProductSpec {
  /** CAS Registry Number. */
  cas?: string;
  /** Molecular formula. */
  formula?: string;
  /** Average molecular weight in g/mol. */
  molecularWeight?: string;
  /** Amino-acid sequence, one-letter code where the compound is a peptide. */
  sequence?: string;
  /** Purity declaration. Always the placeholder '≥99%' on a record that exists. */
  purity: string;
  /** Physical form as supplied. */
  form: string;
  /** Storage and handling. */
  storage: string;
}

/** The one purity string every record carries. */
export const PURITY_DECLARATION = '≥99%';

/** Standard handling line: kept cool, away from light. */
const STORAGE_COOL_DARK = 'Store cool and dry, away from direct light';

/** Lyophilized powder in a sealed vial. */
const FORM_LYOPHILIZED = 'Lyophilized powder';

const TIRZEPATIDE_SPEC: ProductSpec = {
  cas: '2023788-19-2',
  formula: 'C225H348N48O68',
  molecularWeight: '4813',
  purity: PURITY_DECLARATION,
  form: FORM_LYOPHILIZED,
  storage: STORAGE_COOL_DARK
};

const EPITALON_SPEC: ProductSpec = {
  cas: '307297-39-8',
  formula: 'C14H22N4O9',
  molecularWeight: '390.35',
  sequence: 'AEDG',
  purity: PURITY_DECLARATION,
  form: FORM_LYOPHILIZED,
  storage: STORAGE_COOL_DARK
};

const BPC_157_SPEC: ProductSpec = {
  cas: '137525-51-0',
  formula: 'C62H98N16O22',
  molecularWeight: '1419.5',
  sequence: 'GEPPPGKPADDAGLV',
  purity: PURITY_DECLARATION,
  form: FORM_LYOPHILIZED,
  storage: STORAGE_COOL_DARK
};

const TB_500_SPEC: ProductSpec = {
  cas: '885340-08-9',
  formula: 'C38H68N10O14',
  molecularWeight: '889.02',
  sequence: 'Ac-LKKTETQ',
  purity: PURITY_DECLARATION,
  form: FORM_LYOPHILIZED,
  storage: STORAGE_COOL_DARK
};

const IPAMORELIN_SPEC: ProductSpec = {
  cas: '170851-70-4',
  formula: 'C38H49N9O5',
  molecularWeight: '711.9',
  purity: PURITY_DECLARATION,
  form: FORM_LYOPHILIZED,
  storage: STORAGE_COOL_DARK
};

const CJC_1295_NO_DAC_SPEC: ProductSpec = {
  cas: '863288-34-0',
  formula: 'C152H252N44O42',
  molecularWeight: '3367.9',
  purity: PURITY_DECLARATION,
  form: FORM_LYOPHILIZED,
  storage: STORAGE_COOL_DARK
};

const SEMAX_SPEC: ProductSpec = {
  cas: '80714-61-0',
  formula: 'C37H51N9O10S',
  molecularWeight: '813.9',
  sequence: 'MEHFPGP',
  purity: PURITY_DECLARATION,
  form: FORM_LYOPHILIZED,
  storage: STORAGE_COOL_DARK
};

const SELANK_SPEC: ProductSpec = {
  cas: '129954-34-3',
  formula: 'C33H57N11O9',
  molecularWeight: '751.9',
  sequence: 'TKPRPGP',
  purity: PURITY_DECLARATION,
  form: FORM_LYOPHILIZED,
  storage: STORAGE_COOL_DARK
};

const GHK_CU_SPEC: ProductSpec = {
  cas: '89030-95-5',
  purity: PURITY_DECLARATION,
  form: 'Powder',
  storage: STORAGE_COOL_DARK
};

export const PRODUCT_SPECS: Record<string, ProductSpec> = {
  'TR10': TIRZEPATIDE_SPEC,
  'TR15': TIRZEPATIDE_SPEC,
  'TR20': TIRZEPATIDE_SPEC,
  'TR30': TIRZEPATIDE_SPEC,
  'TR40': TIRZEPATIDE_SPEC,
  'TR60': TIRZEPATIDE_SPEC,
  'ET10': EPITALON_SPEC,
  'ET50': EPITALON_SPEC,
  'BPC5': BPC_157_SPEC,
  'BPC10': BPC_157_SPEC,
  'TB5': TB_500_SPEC,
  'TB10': TB_500_SPEC,
  'IP5': IPAMORELIN_SPEC,
  'IP10': IPAMORELIN_SPEC,
  'CND5': CJC_1295_NO_DAC_SPEC,
  'CND10': CJC_1295_NO_DAC_SPEC,
  'SX5': SEMAX_SPEC,
  'SX10': SEMAX_SPEC,
  'SK5': SELANK_SPEC,
  'SK10': SELANK_SPEC,
  'GHKS0': GHK_CU_SPEC,
  'GHK100': GHK_CU_SPEC
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
