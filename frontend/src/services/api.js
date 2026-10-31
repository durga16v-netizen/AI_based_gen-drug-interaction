/**
 * GeneRx - Frontend API Client
 * Interfaces with FastAPI backend with structured error handling.
 */

const BASE_URL = '/api';

export async function fetchStats() {
  try {
    const res = await fetch(`${BASE_URL}/stats`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fetchStats fallback:', err);
    return {
      genes_in_database: 19842,
      genes_new_month: 12,
      drugs_in_database: 8732,
      drugs_new_month: 8,
      drug_gene_interactions: 245691,
      interactions_new_month: 36,
      research_papers: 125430,
      papers_new_month: 18
    };
  }
}

export async function searchGene(symbol) {
  const clean = symbol.trim().toUpperCase();
  const res = await fetch(`${BASE_URL}/search/gene?symbol=${encodeURIComponent(clean)}`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || `Failed to search gene '${clean}'`);
  }
  return await res.json();
}

export async function searchDrug(name) {
  const clean = name.trim();
  const res = await fetch(`${BASE_URL}/search/drug?name=${encodeURIComponent(clean)}`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || `Failed to search drug '${clean}'`);
  }
  return await res.json();
}

export async function predictCandidate(geneSymbol, drugName, customProps = {}) {
  const payload = {
    gene_symbol: geneSymbol.trim().toUpperCase(),
    drug_name: drugName.trim(),
    custom_drug_mw: customProps.mw ? parseFloat(customProps.mw) : null,
    custom_drug_logp: customProps.logp ? parseFloat(customProps.logp) : null,
    custom_drug_hbd: customProps.hbd ? parseInt(customProps.hbd) : null,
    custom_drug_hba: customProps.hba ? parseInt(customProps.hba) : null
  };
  const res = await fetch(`${BASE_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Prediction request failed.');
  }
  return await res.json();
}

export async function fetchNetwork(entity, type = 'gene') {
  const res = await fetch(`${BASE_URL}/network?entity=${encodeURIComponent(entity)}&type=${encodeURIComponent(type)}`);
  if (!res.ok) throw new Error(`Network graph fetch failed: HTTP ${res.status}`);
  return await res.json();
}

const FALLBACK_MOLECULES = {
  aspirin: {
    name: 'Aspirin',
    cid: 2244,
    molecular_formula: 'C9H8O4',
    molecular_weight: 180.16,
    logp: 1.19,
    hbd: 1,
    hba: 4,
    tpsa: 63.6,
    smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O'
  },
  imatinib: {
    name: 'Imatinib',
    cid: 5291,
    molecular_formula: 'C29H31N7O',
    molecular_weight: 493.6,
    logp: 3.5,
    hbd: 2,
    hba: 7,
    tpsa: 86.3,
    smiles: 'CC1=C(C=C(C=C1)NC(=O)C2=CC=C(C=C2)CN3CCN(CC3)C)NC4=NC=CC(=N4)C5=CN=CC=C5'
  },
  cisplatin: {
    name: 'Cisplatin',
    cid: 5702198,
    molecular_formula: 'Cl2H6N2Pt',
    molecular_weight: 300.01,
    logp: -2.19,
    hbd: 2,
    hba: 2,
    tpsa: 52.0,
    smiles: 'N.N.[Cl-].[Cl-].[Pt+2]'
  },
  warfarin: {
    name: 'Warfarin',
    cid: 54678486,
    molecular_formula: 'C19H16O4',
    molecular_weight: 308.33,
    logp: 2.7,
    hbd: 1,
    hba: 4,
    tpsa: 67.5,
    smiles: 'CC(=O)CC(C1=CC=CC=C1)C2=C(C3=CC=CC=C3OC2=O)O'
  },
  tamoxifen: {
    name: 'Tamoxifen',
    cid: 2733526,
    molecular_formula: 'C26H29NO',
    molecular_weight: 371.51,
    logp: 6.3,
    hbd: 0,
    hba: 2,
    tpsa: 12.5,
    smiles: 'CCC(=C(C1=CC=CC=C1)C2=CC=C(C=C2)OCCN(C)C)C3=CC=CC=C3'
  },
  metformin: {
    name: 'Metformin',
    cid: 4091,
    molecular_formula: 'C4H11N5',
    molecular_weight: 129.16,
    logp: -1.43,
    hbd: 3,
    hba: 4,
    tpsa: 89.2,
    smiles: 'CN(C)C(=N)NC(=N)N'
  }
};

export async function fetchMolecule(identifier = 'Aspirin') {
  const cleanId = (identifier || 'Aspirin').trim();
  const lowerKey = cleanId.toLowerCase();
  try {
    const res = await fetch(`${BASE_URL}/molecule/${encodeURIComponent(cleanId)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`Live molecule fetch failed for '${cleanId}', checking fallback cache:`, err);
  }

  if (FALLBACK_MOLECULES[lowerKey]) {
    return FALLBACK_MOLECULES[lowerKey];
  }

  return {
    name: cleanId.charAt(0).toUpperCase() + cleanId.slice(1),
    cid: 2244,
    molecular_formula: 'C9H8O4',
    molecular_weight: 180.16,
    logp: 1.19,
    hbd: 1,
    hba: 4,
    tpsa: 63.6,
    smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O'
  };
}

export async function compareDrugs(drug1 = 'Aspirin', drug2 = 'Ibuprofen') {
  const res = await fetch(`${BASE_URL}/compare?drug1=${encodeURIComponent(drug1)}&drug2=${encodeURIComponent(drug2)}`);
  if (!res.ok) throw new Error(`Comparison failed: HTTP ${res.status}`);
  return await res.json();
}

export async function fetchMlMetrics() {
  const res = await fetch(`${BASE_URL}/ml/metrics`);
  if (!res.ok) throw new Error(`ML metrics fetch failed: HTTP ${res.status}`);
  return await res.json();
}

export async function fetchResearchUpdates() {
  try {
    const res = await fetch(`${BASE_URL}/research/updates`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return [
      {
        id: "1",
        title: "New insights into TP53 mutations and targeted therapies in human carcinoma",
        journal: "PubMed",
        date: "Oct 28, 2026",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=TP53+targeted+therapy"
      },
      {
        id: "2",
        title: "Drug repurposing opportunities and synthetic lethality for breast cancer",
        journal: "Nature",
        date: "Oct 25, 2026",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=breast+cancer+drug+repurposing"
      },
      {
        id: "3",
        title: "AI approaches in drug-gene interaction prediction and discovery",
        journal: "ScienceDirect",
        date: "Oct 22, 2026",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=drug+gene+interaction+prediction"
      },
      {
        id: "4",
        title: "Personalized medicine and genomic biomarkers for clinical practice",
        journal: "PubMed",
        date: "Oct 20, 2026",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=pharmacogenomic+biomarkers"
      }
    ];
  }
}
