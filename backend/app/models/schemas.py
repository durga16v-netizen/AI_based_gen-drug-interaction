"""
GeneRx - Pydantic Data Models and API Schemas
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class EvidenceScoreDetail(BaseModel):
    overall_score: float = Field(..., description="Overall normalized evidence score 0-100")
    source_score: float = Field(..., description="Points from distinct biological databases (max 30)")
    publication_score: float = Field(..., description="Points from peer-reviewed PubMed citations (max 25)")
    clinical_tier_score: float = Field(..., description="Points from FDA approval or CPIC guideline level (max 30)")
    mechanism_score: float = Field(..., description="Points from mechanistic specificity (max 15)")
    calculation_formula: str = Field(..., description="Transparent mathematical breakdown formula")
    source_count: int
    publication_count: int
    clinical_level: str
    interaction_category: str

class PublicationItem(BaseModel):
    pmid: str
    title: Optional[str] = "Scientific Article"
    journal: Optional[str] = "Biomedical Literature"
    year: Optional[str] = "Recent"
    url: str

class AIPredictionSummary(BaseModel):
    implemented: bool
    prediction_score: float
    prediction_percentage: float
    classification: str
    confidence_level: str
    confidence_color: str
    explanation: str
    disclaimer: str

class DrugGeneInteractionRecord(BaseModel):
    gene_symbol: str
    drug_name: str
    interaction_type: str
    interaction_category: str
    evidence_score: float
    evidence_breakdown: EvidenceScoreDetail
    ai_prediction: Optional[AIPredictionSummary] = None
    sources: List[str]
    publications: List[PublicationItem]
    clinical_significance: Optional[str] = None
    mechanism_summary: Optional[str] = None
    is_database_validated: bool = True

class GeneAnnotation(BaseModel):
    symbol: str
    name: str
    entrez_id: Optional[str] = None
    ensembl_id: Optional[str] = None
    chromosome: Optional[str] = None
    genomic_start: Optional[int] = None
    genomic_end: Optional[int] = None
    strand: Optional[str] = None
    summary: Optional[str] = None
    aliases: List[str] = []
    go_terms: List[str] = []
    pathways: List[str] = []
    drug_count: int = 0

class DrugAnnotation(BaseModel):
    name: str
    pubchem_cid: Optional[int] = None
    molecular_formula: Optional[str] = None
    molecular_weight: Optional[float] = None
    logp: Optional[float] = None
    hbd: Optional[int] = None
    hba: Optional[int] = None
    tpsa: Optional[float] = None
    rotatable_bonds: Optional[int] = None
    canonical_smiles: Optional[str] = None
    description: Optional[str] = None
    gene_target_count: int = 0
    admet_radar: Optional[Dict[str, float]] = None

class PharmacogenomicGuideline(BaseModel):
    gene: str
    drug: str
    source: str = "CPIC / PharmGKB"
    level: str
    recommendation: str
    phenotype_warning: str

class GeneAnalysisResponse(BaseModel):
    query: str
    gene: GeneAnnotation
    interactions: List[DrugGeneInteractionRecord]
    total_results: int
    clinical_guidelines: List[PharmacogenomicGuideline] = []
    disclaimer: str

class DrugAnalysisResponse(BaseModel):
    query: str
    drug: DrugAnnotation
    interactions: List[DrugGeneInteractionRecord]
    total_results: int
    clinical_guidelines: List[PharmacogenomicGuideline] = []
    disclaimer: str

class PredictRequest(BaseModel):
    gene_symbol: str
    drug_name: str
    custom_drug_mw: Optional[float] = None
    custom_drug_logp: Optional[float] = None
    custom_drug_hbd: Optional[int] = None
    custom_drug_hba: Optional[int] = None

class NetworkNode(BaseModel):
    id: str
    label: str
    type: str  # "gene", "drug", "disease"
    color: str
    size: int
    category: Optional[str] = None

class NetworkEdge(BaseModel):
    id: str
    source: str
    target: str
    label: str
    type: str
    score: float

class NetworkGraphResponse(BaseModel):
    central_entity: str
    entity_type: str
    summary: Dict[str, Any]
    nodes: List[NetworkNode]
    edges: List[NetworkEdge]

class DrugComparisonItem(BaseModel):
    name: str
    cid: Optional[int]
    molecular_weight: float
    logp: float
    efficacy_score: float
    safety_score: float
    interaction_risk: float
    bioavailability: float
    cost_tier: float
    targets_count: int

class DrugComparisonResponse(BaseModel):
    drug1: DrugComparisonItem
    drug2: DrugComparisonItem
    radar_labels: List[str]
