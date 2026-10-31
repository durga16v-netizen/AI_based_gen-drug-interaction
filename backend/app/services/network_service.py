"""
GeneRx - Network Graph Topology Builder
Builds interconnected Gene-Drug-Disease interaction network graphs with physics coordinates.
"""

from typing import List, Dict, Any

# Disease associations for top cancer and pharmacogenomic genes
GENE_DISEASES = {
    "TP53": ["Breast Cancer", "Lung Cancer", "Colorectal Cancer", "Ovarian Cancer", "Li-Fraumeni Syndrome", "Glioblastoma"],
    "EGFR": ["Non-Small Cell Lung Cancer", "Glioblastoma", "Colorectal Cancer", "Head & Neck Squamous Carcinoma"],
    "ERBB2": ["HER2+ Breast Cancer", "Gastric Adenocarcinoma", "Gastroesophageal Junction Cancer"],
    "BRCA1": ["Hereditary Breast Cancer", "Ovarian Carcinoma", "Prostate Cancer", "Pancreatic Cancer"],
    "BRCA2": ["Breast-Ovarian Cancer", "Pancreatic Ductal Adenocarcinoma", "Castration-Resistant Prostate Cancer"],
    "BRAF": ["Melanoma", "Colorectal Carcinoma", "Thyroid Carcinoma", "Non-Small Cell Lung Cancer"],
    "ABL1": ["Chronic Myeloid Leukemia (CML)", "Philadelphia+ Acute Lymphoblastic Leukemia (ALL)"],
    "PTGS1": ["Inflammatory Pain", "Cardiovascular Thrombosis", "Platelet Aggregation"],
    "PTGS2": ["Colorectal Adenoma", "Osteoarthritis", "Rheumatoid Arthritis", "Acute Postoperative Pain"],
    "VKORC1": ["Thromboembolism", "Atrial Fibrillation", "Deep Vein Thrombosis", "Warfarin Sensitivity"],
    "CYP2D6": ["Major Depressive Disorder", "Tamoxifen Resistance", "Opioid Toxicity / Non-Response"],
    "CYP2C19": ["Coronary Stent Thrombosis", "Peptic Ulcer Disease", "Clopidogrel Resistance"],
    "CYP2C9": ["Warfarin Bleeding Risk", "Phenytoin Toxicity", "NSAID GI Bleeding"],
    "DPYD": ["Fluoropyrimidine Toxicity", "Severe Myelosuppression", "Dihydropyrimidine Dehydrogenase Deficiency"],
    "VEGFA": ["Tumor Angiogenesis", "Age-Related Macular Degeneration", "Diabetic Retinopathy", "Renal Cell Carcinoma"],
    "KRAS": ["Pancreatic Adenocarcinoma", "Non-Small Cell Lung Cancer", "Metastatic Colorectal Cancer"]
}

def build_network_graph(central_name: str, entity_type: str, interactions: List[Dict[str, Any]]) -> Dict[str, Any]:
    nodes = []
    edges = []
    seen_nodes = set()

    clean_central = central_name.strip()
    central_id = f"{entity_type}_{clean_central.lower()}"
    
    # 1. Central Node
    central_color = "#8B5CF6" if entity_type == "gene" else "#10B981"
    nodes.append({
        "id": central_id,
        "label": clean_central.upper() if entity_type == "gene" else clean_central.capitalize(),
        "type": entity_type,
        "color": central_color,
        "size": 42,
        "category": "Central Target"
    })
    seen_nodes.add(central_id)

    # 2. Add connected entities (Drugs if central is Gene, Genes if central is Drug)
    connected_drugs = set()
    connected_genes = set()

    for idx, rec in enumerate(interactions[:15]):  # Top 15 for clean visualization
        drug_name = rec.get("drug", "").capitalize()
        gene_name = rec.get("gene", "").upper()
        itype = rec.get("type", "Interaction")
        score = float(rec.get("evidence_score", 75.0))

        if entity_type == "gene" and drug_name:
            connected_drugs.add(drug_name)
            node_id = f"drug_{drug_name.lower().replace(' ', '_')}"
            if node_id not in seen_nodes:
                seen_nodes.add(node_id)
                nodes.append({
                    "id": node_id,
                    "label": drug_name,
                    "type": "drug",
                    "color": "#10B981",  # Emerald Green
                    "size": 24,
                    "category": itype
                })
            edges.append({
                "id": f"e_{central_id}_{node_id}",
                "source": central_id,
                "target": node_id,
                "label": itype,
                "type": "interaction",
                "score": score
            })

        elif entity_type == "drug" and gene_name:
            connected_genes.add(gene_name)
            node_id = f"gene_{gene_name.lower()}"
            if node_id not in seen_nodes:
                seen_nodes.add(node_id)
                nodes.append({
                    "id": node_id,
                    "label": gene_name,
                    "type": "gene",
                    "color": "#8B5CF6",  # Purple
                    "size": 24,
                    "category": itype
                })
            edges.append({
                "id": f"e_{node_id}_{central_id}",
                "source": node_id,
                "target": central_id,
                "label": itype,
                "type": "interaction",
                "score": score
            })

    # 3. Add disease associations (Blue/Indigo nodes)
    disease_list = []
    if entity_type == "gene":
        disease_list = GENE_DISEASES.get(clean_central.upper(), ["Oncogenesis", "Inflammatory Response"])
    else:
        # Pick diseases associated with top interacting genes
        for g in list(connected_genes)[:2]:
            disease_list.extend(GENE_DISEASES.get(g, []))
        if not disease_list:
            disease_list = ["Metabolic Clearance", "Target Pathology"]

    for d in disease_list[:4]:  # Top 4 diseases for clean graph
        d_id = f"disease_{d.lower().replace(' ', '_')}"
        if d_id not in seen_nodes:
            seen_nodes.add(d_id)
            nodes.append({
                "id": d_id,
                "label": d,
                "type": "disease",
                "color": "#3B82F6",  # Blue
                "size": 26,
                "category": "Pathology"
            })
            edges.append({
                "id": f"e_dis_{central_id}_{d_id}",
                "source": central_id,
                "target": d_id,
                "label": "Implicated In",
                "type": "disease_link",
                "score": 85.0
            })

    summary = {
        "central_entity": clean_central.upper() if entity_type == "gene" else clean_central.capitalize(),
        "connected_drugs": len(connected_drugs) if entity_type == "gene" else len(interactions),
        "connected_genes": len(connected_genes) if entity_type == "drug" else 1,
        "related_diseases": len(disease_list),
        "primary_interaction_type": "Binding / Regulation / Inhibition"
    }

    return {
        "central_entity": clean_central,
        "entity_type": entity_type,
        "summary": summary,
        "nodes": nodes,
        "edges": edges
    }
