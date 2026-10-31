"""
GeneRx - Pharmacogenomics & ClinPGx / PharmGKB Service
Provides official CPIC (Clinical Pharmacogenetics Implementation Consortium) guidelines,
metabolizer phenotype implications, and clinical alerts.
"""

from typing import List, Dict, Any

CLINICAL_GUIDELINES: List[Dict[str, Any]] = [
    {
        "gene": "CYP2D6",
        "drug": "Tamoxifen",
        "source": "CPIC Level 1A / PharmGKB",
        "level": "Level 1A",
        "recommendation": "In CYP2D6 poor metabolizers (*4, *5), standard tamoxifen dosing results in significantly reduced active metabolite Endoxifen concentrations. Recommend alternative endocrine therapy (e.g., Aromatase Inhibitors for postmenopausal women) or dose escalation to 40 mg/day under supervision.",
        "phenotype_warning": "Poor Metabolizer: Decreased therapeutic efficacy in estrogen receptor-positive breast cancer."
    },
    {
        "gene": "CYP2D6",
        "drug": "Codeine",
        "source": "CPIC Level 1A / FDA Black Box",
        "level": "Level 1A",
        "recommendation": "Codeine is a prodrug requiring O-demethylation to morphine via CYP2D6. Ultrarapid metabolizers experience dangerously high morphine levels (respiratory depression/death). Poor metabolizers achieve inadequate analgesia. Avoid codeine in ultrarapid and poor metabolizers.",
        "phenotype_warning": "Ultrarapid Metabolizer: Fatal morphine toxicity risk. Poor Metabolizer: Lack of analgesic effect."
    },
    {
        "gene": "VKORC1",
        "drug": "Warfarin",
        "source": "CPIC Level 1A / FDA Label",
        "level": "Level 1A",
        "recommendation": "Patients carrying the VKORC1 -1639G>A (rs9923231) variant have decreased enzyme expression and heightened warfarin sensitivity, requiring a 30-50% dose reduction to avoid severe bleeding complications.",
        "phenotype_warning": "A Allele Carrier: Markedly increased bleeding risk; lower initiation dose mandated."
    },
    {
        "gene": "CYP2C9",
        "drug": "Warfarin",
        "source": "CPIC Level 1A / FDA Label",
        "level": "Level 1A",
        "recommendation": "CYP2C9*2 and *3 alleles exhibit impaired metabolic clearance of the more potent S-warfarin enantiomer. Initiating patients on standard doses causes prolonged INR and major hemorrhagic events.",
        "phenotype_warning": "Poor Metabolizer (*2/*3): Severe bleeding risk. Calculate dose using CPIC pharmacogenetic algorithm."
    },
    {
        "gene": "CYP2C19",
        "drug": "Clopidogrel",
        "source": "CPIC Level 1A / FDA Boxed Warning",
        "level": "Level 1A",
        "recommendation": "Clopidogrel requires two-step oxidation by CYP2C19 to form the active antiplatelet thiol metabolite. Intermediate and poor metabolizers (*2, *3) exhibit diminished platelet inhibition and higher risk of stent thrombosis. Alternative P2Y12 inhibitors (Prasugrel or Ticagrelor) are strongly recommended.",
        "phenotype_warning": "Loss-of-Function (*2/*3): Major adverse cardiovascular events (MACE) and stent thrombosis."
    },
    {
        "gene": "DPYD",
        "drug": "5-Fluorouracil",
        "source": "CPIC Level 1A / EMA Warning",
        "level": "Level 1A",
        "recommendation": "Dihydropyrimidine dehydrogenase (DPD) clears over 80% of administered fluoropyrimidines. Carriers of non-functional DPYD variants (*2A, c.2846A>T, HapB3) suffer lethal hematologic, mucocutaneous, and neurotoxicities. Routine pre-treatment screening and dose reductions of 50-100% are mandated.",
        "phenotype_warning": "DPD Deficiency: Life-threatening myelosuppression, pancytopenia, and enteropathy."
    },
    {
        "gene": "TPMT",
        "drug": "Mercaptopurine",
        "source": "CPIC Level 1A / FDA Label",
        "level": "Level 1A",
        "recommendation": "Thiopurine S-methyltransferase metabolizes 6-MP to inactive metabolites. Intermediate or deficient TPMT metabolizers accumulate cytotoxic thioguanine nucleotides (TGNs). Homozygous deficient patients require 90% dose reduction.",
        "phenotype_warning": "TPMT Deficiency: Severe, potentially fatal bone marrow aplasia and neutropenia."
    },
    {
        "gene": "SLCO1B1",
        "drug": "Simvastatin",
        "source": "CPIC Level 1A / PharmGKB",
        "level": "Level 1A",
        "recommendation": "The SLCO1B1 rs4149056 (521T>C, *5) allele reduces hepatic uptake via OATP1B1, substantially elevating plasma statin exposure and conferring up to a 17-fold elevated risk of statin-induced myopathy and rhabdomyolysis.",
        "phenotype_warning": "Decreased Transporter Function: Prescribe lower dose (max 20mg) or substitute with Rosuvastatin/Pravastatin."
    },
    {
        "gene": "EGFR",
        "drug": "Gefitinib",
        "source": "FDA Biomarker / NCCN Guidelines",
        "level": "Level 1A",
        "recommendation": "Indicated exclusively for metastatic non-small cell lung cancer harboring sensitizing EGFR exon 19 deletions or exon 21 L858R substitution mutations. Ineffective in KRAS-mutant or EGFR-wildtype tumors.",
        "phenotype_warning": "Biomarker Dependent: Mandatory somatic mutation verification before initiation."
    },
    {
        "gene": "ERBB2",
        "drug": "Trastuzumab",
        "source": "FDA Biomarker / ASCO-CAP",
        "level": "Level 1A",
        "recommendation": "Mandatory testing for HER2 overexpression (IHC 3+) or ERBB2 gene amplification (FISH ratio >= 2.0) in breast and gastroesophageal adenocarcinoma. Contraindicated in HER2-negative disease due to cardiotoxicity risk.",
        "phenotype_warning": "HER2 Status Essential: Cardiotoxic risk; left ventricular ejection fraction (LVEF) monitoring required."
    },
    {
        "gene": "BRAF",
        "drug": "Vemurafenib",
        "source": "FDA Biomarker / NCCN",
        "level": "Level 1A",
        "recommendation": "Indicated strictly for unresectable or metastatic melanoma carrying the BRAF V600E mutation confirmed by an FDA-approved test. Paradoxical MAPK activation and secondary cutaneous squamous cell carcinomas occur in BRAF wild-type tumors.",
        "phenotype_warning": "V600E Mutation Required: Contraindicated in BRAF wild-type malignancy."
    },
    {
        "gene": "BRCA1",
        "drug": "Olaparib",
        "source": "FDA Biomarker / CPIC",
        "level": "Level 1A",
        "recommendation": "Indicated for germline or somatic BRCA1/2-mutated advanced ovarian, breast, pancreatic, and castration-resistant prostate cancer, leveraging homologous recombination synthetic lethality.",
        "phenotype_warning": "HR Deficiency Biomarker: Increased myelosuppression and secondary MDS/AML risk."
    }
]

def get_guidelines_for_gene(gene_symbol: str) -> List[Dict[str, Any]]:
    gene_upper = gene_symbol.strip().upper()
    return [g for g in CLINICAL_GUIDELINES if g["gene"].upper() == gene_upper]

def get_guidelines_for_drug(drug_name: str) -> List[Dict[str, Any]]:
    drug_lower = drug_name.strip().lower()
    return [g for g in CLINICAL_GUIDELINES if g["drug"].lower() in drug_lower or drug_lower in g["drug"].lower()]
