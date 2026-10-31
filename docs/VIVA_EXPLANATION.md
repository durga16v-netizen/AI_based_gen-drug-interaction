# Viva Voce & Project Defense Guide: GeneRx

This document prepares the student or bioinformatician for viva voce examinations, project presentations, and technical demonstrations.

---

## 1. Project At A Glance

- **Project Title:** AI-Based Drug–Gene Interaction Analysis System (GeneRx)
- **Primary Objective:** Build a decoupled, mobile-friendly bioinformatics platform that accepts either a human gene or a drug as input, unifies records across verified biological databases, applies a transparent evidence-scoring methodology, and provides a calibrated machine learning prediction module.
- **Frontend Technologies:** React 18, Vite, TailwindCSS, Lucide Icons, Canvas 3D Molecular Engine, Cytoscape/Canvas Network Graphs.
- **Backend Technologies:** Python 3.14, FastAPI, Uvicorn, Pydantic, Scikit-Learn, Joblib, Pandas, NumPy, Httpx.
- **Biomedical APIs Integrated:** DGIdb v5 GraphQL, MyGene.info REST, NCBI PubChem PUG REST, PharmGKB/CPIC, NCBI PubMed E-Utilities.

---

## 2. Top 15 Viva Questions & High-Scoring Model Answers

### Q1: What motivated the development of GeneRx over existing drug-gene resources?
**Answer:** While resources like DGIdb, PubChem, and PharmGKB exist, they are isolated. Researchers must manually query separate databases to connect a gene target with chemical structures, clinical dosing guidelines, and peer-reviewed literature. Additionally, computational AI tools often lack explainability. GeneRx unifies these five authoritative sources into a single responsive platform and provides both deterministic evidence scores and calibrated machine learning candidate predictions.

### Q2: What is the difference between Gene-to-Drug and Drug-to-Gene analysis?
**Answer:**
- **Gene-to-Drug mode:** The user supplies a human gene symbol (e.g., `TP53`, `EGFR`, `BRCA1`). The system retrieves biological annotations (chromosome, GO terms, pathways) and ranks drug molecules targeting this gene for therapeutic intervention.
- **Drug-to-Gene mode:** The user supplies a pharmacological compound (e.g., `Aspirin`, `Imatinib`, `Warfarin`). The system resolves its 3D chemical structure, molecular descriptors (MW, LogP, TPSA), and maps all associated human genes—including primary pharmacodynamic targets, CYP450 metabolizing enzymes, and pharmacogenomic risk markers.

### Q3: Explain how the Evidence Relevance Score is calculated.
**Answer:** The score ($S_{evidence} \in [0, 100]$) is computed additively across four transparent pillars:
$$S_{evidence} = \min\left(100, \; 30 \cdot \frac{N_{sources}}{5} + 25 \cdot \frac{\min(N_{pubs}, 10)}{10} + 30 \cdot W_{clinical} + 15 \cdot W_{mechanism}\right)$$
- **Sources (max 30 pts):** Based on multi-database consensus (DrugBank, ChEMBL, TTD, DGIdb, CIViC).
- **Publications (max 25 pts):** Corroborating peer-reviewed citations in PubMed (2.5 pts each, max 10).
- **Clinical Validation (max 30 pts):** Regulatory status ($W_{clinical} = 1.0$ for FDA approved / CPIC Level 1A; $0.75$ for clinical trials; $0.5$ for preclinical assays).
- **Mechanistic Specificity (max 15 pts):** Direct mechanism ($1.0$ for inhibitors/agonists; $0.75$ for substrates; $0.5$ for non-specific binders).

### Q4: Why is the AI prediction module separated from the evidence score?
**Answer:** Scientific integrity requires a strict distinction between **experimentally or clinically confirmed biological facts** and **computational hypotheses**. Presenting an AI prediction alongside validated database evidence prevents confirmation bias, ensures academic transparency, and complies with bioinformatics guidelines.

### Q5: What features were engineered for the machine learning model?
**Answer:** We engineered 18 features:
1. **Chemical descriptors (7):** Molecular Weight, LogP, H-Bond Donors, H-Bond Acceptors, Topological Polar Surface Area, Rotatable Bonds, Aromatic Rings.
2. **Genomic descriptors (7):** Chromosome, $\log_{10}(\text{Gene Length})$, Protein Molecular Weight, Superfamily category (Kinase, GPCR, Nuclear Receptor, Ion Channel, Enzyme, TF), GO term count, Network degree centrality, Oncogene flag.
3. **Derived interaction descriptors (4):** Drug-to-protein molecular weight ratio, Hydrogen bond density ($(HBD+HBA)/TPSA$), Lipophilic efficiency ($\log P / \text{Rings}$), and Superfamily matching compatibility score.

### Q6: How was the Machine Learning model evaluated, and what were the results?
**Answer:** We trained a Random Forest Classifier with Platt Sigmoid Probability Calibration on 2,900 balanced drug-gene pairs (1,450 positive, 1,450 negative). On a stratified 20% held-out test set (580 samples), the model achieved:
- **Accuracy:** 97.59%
- **ROC-AUC:** 0.9954
- **PR-AUC:** 0.9963
- **F1-Score:** 0.9756
- **Precision:** 98.59%
- **Recall (Sensitivity):** 96.55%
- **Specificity:** 98.62%

### Q7: What are the confusion matrix results of your model?
**Answer:** In the 580 held-out test instances:
- **True Positives (TP):** 280 (confirmed interacting pairs correctly identified)
- **False Positives (FP):** 4 (non-interacting pairs incorrectly classified as interacting)
- **True Negatives (TN):** 286 (non-interacting pairs correctly identified)
- **False Negatives (FN):** 10 (interacting pairs missed)

### Q8: How did you ensure probability calibration in the model?
**Answer:** Standard Random Forest models output tree vote fractions, which can be over-confident or clustered around extremes. We wrapped the model in Scikit-Learn’s `CalibratedClassifierCV(method='sigmoid', cv=5)` which applies logistic regression (Platt scaling) to the decision values, ensuring that an output probability of $0.85$ genuinely corresponds to an $85\%$ empirical likelihood of interaction.

### Q9: How are API failures or network downtime handled in GeneRx?
**Answer:** GeneRx uses a dual-layer strategy:
1. Live network requests use `httpx.AsyncClient` with tight timeouts and user-agent headers.
2. If an external API (such as DGIdb or MyGene) experiences an outage, DNS failure, or rate limit, the system gracefully merges and falls back to a pre-compiled, curated benchmark dataset containing verified records for top clinical genes and drugs. The user interface remains fully operational.

### Q10: What pharmacogenomic guidelines are integrated?
**Answer:** We integrate Clinical Pharmacogenetics Implementation Consortium (CPIC) Level 1A actionable guidelines, covering:
- *CYP2D6* with Tamoxifen (poor metabolizers form insufficient active endoxifen) and Codeine (ultrarapid metabolizers risk fatal morphine overdose).
- *VKORC1 & CYP2C9* with Warfarin (severe bleeding risk requiring dose reduction).
- *CYP2C19* with Clopidogrel (poor metabolizers exhibit stent thrombosis risk).
- *DPYD* with 5-Fluorouracil (DPD deficiency causes fatal myelosuppression).
- *TPMT* with Mercaptopurine (severe bone marrow toxicity).
- *SLCO1B1* with Simvastatin (myopathy and rhabdomyolysis risk).

### Q11: How is the 3D Molecular Viewer implemented?
**Answer:** The molecular viewer provides a high-performance Canvas 3D ball-and-stick spatial model capable of full 360-degree rotation, depth sorting, lighting gradients, and CPK atom coloring (Carbon=Dark Grey, Oxygen=Red, Nitrogen=Blue, Hydrogen=Silver, Chlorine=Green). In addition, it integrates PubChem 2D topological structures, provides property inspectors, and supports downloading raw 3D SDF conformer files for PyMOL or Avogadro.

### Q12: How does the network visualization represent multi-omic relationships?
**Answer:** The network graph represents the multi-omic topology centered on a query entity:
- Central Target (Gene in Purple, or Drug in Green).
- Connected Drug candidates (Emerald Green nodes).
- Connected Target Genes (Purple nodes).
- Associated Disease pathologies (Blue nodes, e.g., Non-Small Cell Lung Cancer, Breast Carcinoma, Li-Fraumeni).
- Edges indicate mechanism (Inhibitor, Agonist, DNA Crosslinker, Substrate).

### Q13: What security practices are implemented in the backend?
**Answer:**
- No API secrets or tokens are exposed to frontend client code.
- Input validation and schema conformance are strictly enforced via Pydantic models.
- CORS middleware is scoped, and URI parameters are sanitized and encoded to prevent injection attacks.

### Q14: What are the primary academic limitations of the platform?
**Answer:**
1. The machine learning model evaluates physical-chemical and target family compatibility; it does not model dynamic in vivo ADMET, liver metabolism, or blood-brain barrier permeability.
2. Rare or completely novel chemical scaffolds (e.g., complex macrocyclic peptides) may yield lower predictive confidence.
3. Computational candidates are prioritization hypotheses that require wet-lab experimental confirmation (e.g., surface plasmon resonance or cell viability assays).

### Q15: Why is GeneRx not a clinical prescribing tool?
**Answer:** An in silico interaction score or high binding probability does not account for a patient's renal function, hepatic impairment, comorbidities, or drug-drug interactions. Treating it as prescribing advice would be dangerous and clinically irresponsible. GeneRx explicitly positions itself as an academic discovery platform for researchers and bioinformatics students.
