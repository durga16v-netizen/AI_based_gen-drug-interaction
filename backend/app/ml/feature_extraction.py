"""
GeneRx - Feature Extraction Module
Extracts or predicts physicochemical and genomic descriptors for any drug-gene pair.
"""

import math
import re

FEATURE_COLS = [
    "drug_mw", "drug_logp", "drug_hbd", "drug_hba", "drug_tpsa",
    "drug_rbc", "drug_rings", "gene_chr", "gene_log_len",
    "gene_protein_mw", "gene_superfamily", "gene_go_count",
    "gene_degree", "gene_is_cancer", "mw_ratio", "hb_density",
    "lipophilic_eff", "target_class_match"
]

SUPERFAMILY_MAP = {
    "kinase": 1,
    "tyrosine kinase": 1,
    "receptor": 2,
    "gpcr": 2,
    "g protein-coupled receptor": 2,
    "nuclear receptor": 3,
    "transcription factor": 7,
    "ion channel": 4,
    "channel": 4,
    "protease": 5,
    "hydrolase": 5,
    "enzyme": 6,
    "transferase": 6,
    "oxidoreductase": 6,
    "cytochrome": 6,
    "other": 0
}

def determine_gene_superfamily(summary: str, go_terms: list, name: str) -> int:
    text = f"{summary} {name} {' '.join(go_terms or [])}".lower()
    if any(k in text for k in ["kinase", "tk", "cdk", "egfr", "braf", "abl"]):
        return 1
    if any(k in text for k in ["gpcr", "g protein-coupled", "adrenergic", "dopamine", "angiotensin receptor"]):
        return 2
    if any(k in text for k in ["nuclear receptor", "ppar", "estrogen receptor", "androgen"]):
        return 3
    if any(k in text for k in ["ion channel", "calcium channel", "potassium channel", "sodium channel"]):
        return 4
    if any(k in text for k in ["protease", "peptidase", "caspase"]):
        return 5
    if any(k in text for k in ["cytochrome", "cyp", "reductase", "synthase", "dehydrogenase", "vkor"]):
        return 6
    if any(k in text for k in ["transcription factor", "zinc finger", "tp53", "brca"]):
        return 7
    return 0

def extract_features_for_pair(drug_props: dict, gene_props: dict) -> dict:
    mw = float(drug_props.get("mw", 350.0))
    logp = float(drug_props.get("logp", 2.0))
    hbd = int(drug_props.get("hbd", 2))
    hba = int(drug_props.get("hba", 4))
    tpsa = float(drug_props.get("tpsa", 70.0))
    rbc = int(drug_props.get("rbc", 5))
    rings = int(drug_props.get("rings", 3))

    chr_val = gene_props.get("chr", 1)
    if isinstance(chr_val, str):
        if chr_val.upper() == "X":
            chr_num = 23
        elif chr_val.upper() == "Y":
            chr_num = 24
        else:
            match = re.search(r"\d+", chr_val)
            chr_num = int(match.group(0)) if match else 1
    else:
        chr_num = int(chr_val or 1)

    gene_len = max(float(gene_props.get("length", 25000)), 1000.0)
    gene_log_len = round(math.log10(gene_len), 3)
    protein_mw = float(gene_props.get("protein_mw", 65.0))
    superfamily = int(gene_props.get("superfamily", 0))
    go_count = int(gene_props.get("go_count", 30))
    degree = int(gene_props.get("degree", 25))
    is_cancer = 1 if gene_props.get("is_cancer") else 0

    mw_ratio = mw / (protein_mw * 1000.0) if protein_mw > 0 else 0.005
    hb_density = (hbd + hba) / max(tpsa, 1.0)
    lipophilic_eff = logp / max(rings, 1)

    kinase_match = 1.0 if (superfamily == 1 and 300 <= mw <= 580 and rings >= 3) else 0.0
    nuclear_match = 1.0 if (superfamily == 3 and logp > 2.0) else 0.0
    gpcr_match = 1.0 if (superfamily == 2 and 40 <= tpsa <= 100) else 0.0
    enzyme_match = 1.0 if (superfamily == 6 and hba >= 3) else 0.0
    target_class_match = kinase_match + nuclear_match + gpcr_match + enzyme_match

    return {
        "drug_mw": mw,
        "drug_logp": logp,
        "drug_hbd": hbd,
        "drug_hba": hba,
        "drug_tpsa": tpsa,
        "drug_rbc": rbc,
        "drug_rings": rings,
        "gene_chr": chr_num,
        "gene_log_len": gene_log_len,
        "gene_protein_mw": protein_mw,
        "gene_superfamily": superfamily,
        "gene_go_count": go_count,
        "gene_degree": degree,
        "gene_is_cancer": is_cancer,
        "mw_ratio": round(mw_ratio, 6),
        "hb_density": round(hb_density, 4),
        "lipophilic_eff": round(lipophilic_eff, 3),
        "target_class_match": target_class_match
    }
