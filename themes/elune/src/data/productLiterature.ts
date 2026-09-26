// Product narrative + primary literature, keyed by SKU.
//
// WHY THIS FILE EXISTS
// A product page whose compound has a record here carries a short, plain
// description of what that compound actually is, and the primary literature
// that describes it; the other SKUs carry none and the section is omitted
// entirely. The reader here is not a scientist but is careful, so the register
// is ordinary language with the exact chemistry left intact — and the citations
// are there to be followed.
//
// COMPLIANCE — these rules are absolute, not stylistic:
//  - NO benefit claims. Nothing is said to "support", "help", "improve",
//    "promote" or "boost" anything. A compound is described, not recommended.
//  - NO dosing, protocols, administration routes or dosage ranges.
//  - NO medical, therapeutic or weight-loss framing. This matters most for the
//    GLP-1 analogues (semaglutide, tirzepatide): their clinical literature is
//    overwhelmingly about weight and glycaemic outcomes, and none of that is
//    cited here. What is cited is structure, receptor pharmacology and
//    analytical chemistry, which is what a reference compound's identity rests
//    on. See PRODUCT.md and the surface brief.
//  - NO testing, certification or accreditation wording. Purity is the literal
//    '≥99%' declaration and belongs to the specification table, not here.
//  - Literature is presented as the context a compound has been studied in,
//    never as evidence that it does something for the reader.
//
// CITATION INTEGRITY
// Every reference below was retrieved from PubMed by machine and resolved to an
// exact title, journal, year and DOI before being written here — none is from
// memory. An unresolvable reference was omitted rather than shipped. This store's
// whole mechanism is verifiability, so an invented citation would be the worst
// defect it could carry. Any reference can be re-verified by resolving its DOI
// against doi.org, which lands on the publisher's own record.
// Where a compound's literature is thin, it carries fewer references rather than
// padded ones, and the summary says so plainly.
//
// ONE NARRATIVE PER MOLECULE
// The narrative describes the compound, not the vial, and no summary below names
// a size or strength. Where one compound ships in more than one size
// (scripts/catalog-data.json `family`), every size of that compound references
// the same narrative object. A compound with no sourced narrative gets none —
// multi-component blends included, since no single molecule's description would
// be true of the blend.

export interface LiteratureRef {
  /** Exact published title. */
  title: string;
  /** First author, journal and year, as a short attribution line. */
  source: string;
  /** DOI or PubMed link, verified to resolve. */
  url: string;
}

export interface ProductNarrative {
  /** One or two short paragraphs. Plain language, precise underneath. */
  summary: string[];
  /** Primary literature, or omitted where the record is thin. */
  literature?: LiteratureRef[];
}

const TIRZEPATIDE_NARRATIVE: ProductNarrative = {
  summary: [
    'Tirzepatide is a 39-residue synthetic peptide built on the human glucose-dependent insulinotropic polypeptide (GIP) sequence, with modifications that include a C20 fatty-diacid moiety and a C-terminal amidation. It is an agonist at two incretin receptors — GIP and GLP-1 — rather than one, which is the structural property that distinguishes it from the single-receptor analogues.',
    'Because its behaviour depends on engaging two receptors with different shapes, the structural basis of that dual agonism has been characterised directly by cryo-electron microscopy and mutagenesis. Those structural studies are the primary literature for what the molecule is.'
  ],
  literature: [
    {
      title: 'Structural determinants of dual incretin receptor agonism by tirzepatide',
      source: 'Sun B et al. · Proc Natl Acad Sci U S A · 2022',
      url: 'https://doi.org/10.1073/pnas.2116506119'
    },
    {
      title: 'Cryo-electron microscopy structure of the glucagon receptor with a dual-agonist peptide',
      source: 'Chang R et al. · J Biol Chem · 2020',
      url: 'https://doi.org/10.1074/jbc.RA120.013793'
    }
  ]
};

const EPITALON_NARRATIVE: ProductNarrative = {
  summary: [
    'Epitalon is a synthetic tetrapeptide with the sequence AEDG (Ala-Glu-Asp-Gly). It is a synthetic fragment derived from epithalamin, a pineal gland preparation, and belongs to the family of short peptides investigated in that research tradition.',
    'At four residues it is very small and strongly polar. The literature on it is thin, and it is deliberately not cited here: the published titles in this area assert biological effects, and quoting such titles beside a purchasable item would be an efficacy claim, which this store does not make.'
  ]
};

const BPC_157_NARRATIVE: ProductNarrative = {
  summary: [
    'BPC-157 is a synthetic pentadecapeptide with the sequence GEPPPGKPADDAGLV (Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val). It corresponds to a partial sequence of human gastric juice protein BPC, and it is stable in gastric acid — a property that sets it apart from most peptides of its length and is central to how it is described in the literature.',
    'Research on the compound is predominantly preclinical and is concentrated around its relation to the nitric oxide system and around work in the central nervous system.'
  ],
  literature: [
    {
      title: 'Stable gastric pentadecapeptide BPC 157-NO-system relation',
      source: 'Sikiric P et al. · Curr Pharm Des · 2014',
      url: 'https://doi.org/10.2174/13816128113190990411'
    },
    {
      title: 'Pentadecapeptide BPC 157 and the central nervous system',
      source: 'Vukojevic J et al. · Neural Regen Res · 2022',
      url: 'https://doi.org/10.4103/1673-5374.320969'
    }
  ]
};

const TB_500_NARRATIVE: ProductNarrative = {
  summary: [
    'TB-500 is the synthetic N-acetylated fragment Ac-LKKTETQ, which corresponds to the actin-binding region of thymosin β4 — a 43-residue protein whose defining biochemical role is sequestering monomeric actin. The fragment is not the full protein; it is the short peptide carrying that binding motif.',
    'Because the chemistry of interest belongs to the parent protein, the structural and biochemical literature below is on thymosin β4 itself, and that is the context in which this fragment is characterised.'
  ],
  literature: [
    {
      title: 'Thymosin-beta(4) changes the conformation and dynamics of actin monomers',
      source: 'De La Cruz EM et al. · Biophys J · 2000',
      url: 'https://doi.org/10.1016/S0006-3495(00)76797-X'
    },
    {
      title:
        'Thymosin beta 4 (Fx peptide) is a potent regulator of actin polymerization in living cells',
      source: 'Sanders MC et al. · Proc Natl Acad Sci U S A · 1992',
      url: 'https://doi.org/10.1073/pnas.89.10.4678'
    }
  ]
};

const IPAMORELIN_NARRATIVE: ProductNarrative = {
  summary: [
    'Ipamorelin is a synthetic pentapeptide that acts as a selective agonist at the ghrelin receptor (GHS-R1a). Its selectivity — acting through that receptor without engaging the other pathways the earlier secretagogue peptides also touched — is the property by which it was originally characterised.',
    'The primary literature for the compound is a single defining pharmacology paper; the wider literature around this peptide class is largely preclinical, and we cite what establishes the molecule rather than padding the list.'
  ],
  literature: [
    {
      title: 'Ipamorelin, the first selective growth hormone secretagogue',
      source: 'Raun K et al. · Eur J Endocrinol · 1998',
      url: 'https://doi.org/10.1530/eje.0.1390552'
    }
  ]
};

const CJC_1295_NO_DAC_NARRATIVE: ProductNarrative = {
  summary: [
    'This is the "no DAC" form: a 29-residue analogue of growth-hormone-releasing hormone, corresponding to hGRF(1-29) with four substitutions introduced to resist enzymatic cleavage, and an amidated C-terminus. It carries no drug-affinity-complex moiety, which is why it does not conjugate to serum albumin and why its behaviour differs from the conjugated peptide.',
    'That distinction matters and is worth stating plainly: CJC-1295 itself is the same peptide backbone bearing a maleimidopropionic acid linker that binds serum albumin; this product is the unconjugated analogue, and the two are chemically different molecules whose literature is not interchangeable. The paper that identifies CJC-1295 describes that conjugated form and not this material, which is why no references are cited for this product.'
  ]
};

const SEMAX_NARRATIVE: ProductNarrative = {
  summary: [
    'Semax is a synthetic heptapeptide with the sequence MEHFPGP (Met-Glu-His-Phe-Pro-Gly-Pro). It is the ACTH(4-10) fragment with a C-terminal Pro-Gly-Pro extension and an acetylated N-terminus; that extension is the structural change that makes it resistant to the serum enzymes which degrade the unmodified fragment quickly.',
    'Its chemistry has been examined in some detail, including what the N-terminal acetylation does to the way the peptide coordinates copper(II) and zinc(II).'
  ],
  literature: [
    {
      title:
        'Degradation of ACTH/MSH(4-10) and its synthetic analog semax by rat serum enzymes: an inhibitor study',
      source: 'Potaman VN et al. · Peptides · 1993',
      url: 'https://doi.org/10.1016/0196-9781(93)90137-6'
    },
    {
      title:
        'Influence of the N-terminus acetylation of Semax, a synthetic analog of ACTH(4-10), on copper(II) and zinc(II) coordination and biological properties',
      source: 'Magrì A et al. · J Inorg Biochem · 2016',
      url: 'https://doi.org/10.1016/j.jinorgbio.2016.08.013'
    }
  ]
};

const SELANK_NARRATIVE: ProductNarrative = {
  summary: [
    'Selank is a synthetic heptapeptide with the sequence TKPRPGP (Thr-Lys-Pro-Arg-Pro-Gly-Pro). It is the immunopeptide tuftsin, Thr-Lys-Pro-Arg, extended with the same Pro-Gly-Pro tail that stabilises Semax — the two compounds share that design and differ in their core tetrapeptide.',
    'The parent peptide tuftsin carries most of the literature on this class, including a detailed account of its properties and its synthetic analogues. Work specific to Selank is a smaller body, and largely behavioural.'
  ],
  literature: [
    {
      title: 'Tuftsin - Properties and Analogs',
      source: 'Siebert A et al. · Curr Med Chem · 2017',
      url: 'https://doi.org/10.2174/0929867324666170725140826'
    },
    {
      title: 'Functional Connectomic Approach to Studying Selank and Semax Effects',
      source: 'Panikratova YR et al. · Dokl Biol Sci · 2020',
      url: 'https://doi.org/10.1134/S001249662001007X'
    }
  ]
};

const GHK_CU_NARRATIVE: ProductNarrative = {
  summary: [
    'GHK-Cu is the copper(II) complex of the tripeptide glycyl-L-histidyl-L-lysine (GHK). The tripeptide occurs naturally in human plasma and has a strong affinity for copper(II), which it binds through the histidine imidazole together with the peptide nitrogens — a coordination geometry that has been worked out both computationally and experimentally.',
    'The chemistry of the copper complex, rather than of the free tripeptide, is what defines the material supplied here.'
  ],
  literature: [
    {
      title: 'Theoretical study of copper binding to GHK peptide',
      source: 'Alshammari N et al. · Comput Biol Chem · 2020',
      url: 'https://doi.org/10.1016/j.compbiolchem.2020.107265'
    }
  ]
};

const NARRATIVES: Record<string, ProductNarrative> = {
  'TR10': TIRZEPATIDE_NARRATIVE,
  'TR15': TIRZEPATIDE_NARRATIVE,
  'TR20': TIRZEPATIDE_NARRATIVE,
  'TR30': TIRZEPATIDE_NARRATIVE,
  'TR40': TIRZEPATIDE_NARRATIVE,
  'TR60': TIRZEPATIDE_NARRATIVE,
  'ET10': EPITALON_NARRATIVE,
  'ET50': EPITALON_NARRATIVE,
  'BPC5': BPC_157_NARRATIVE,
  'BPC10': BPC_157_NARRATIVE,
  'TB5': TB_500_NARRATIVE,
  'TB10': TB_500_NARRATIVE,
  'IP5': IPAMORELIN_NARRATIVE,
  'IP10': IPAMORELIN_NARRATIVE,
  'CND5': CJC_1295_NO_DAC_NARRATIVE,
  'CND10': CJC_1295_NO_DAC_NARRATIVE,
  'SX5': SEMAX_NARRATIVE,
  'SX10': SEMAX_NARRATIVE,
  'SK5': SELANK_NARRATIVE,
  'SK10': SELANK_NARRATIVE,
  'GHKS0': GHK_CU_NARRATIVE,
  'GHK100': GHK_CU_NARRATIVE
};

/**
 * The narrative for a SKU, or null when none is recorded — in which case the
 * product page renders no description section at all, never an empty heading.
 */
export function getProductLiterature(sku?: string | null): ProductNarrative | null {
  if (!sku) return null;
  return NARRATIVES[sku] ?? null;
}
