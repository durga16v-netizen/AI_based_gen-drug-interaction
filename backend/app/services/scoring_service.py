"""
GeneRx - Evidence-Based Relevance Scoring Service
Calculates transparent, mathematically documented interaction evidence scores (0 - 100).
"""

from typing import List, Dict, Any

CLINICAL_WEIGHTS = {
    "fda approved": 1.0,
    "cpic level 1a": 1.0,
    "cpic level 1b": 0.9,
    "clinical trial": 0.75,
    "phase 3": 0.8,
    "phase 2": 0.7,
    "phase 1": 0.6,
    "preclinical": 0.5,
    "in vitro": 0.45,
    "literature": 0.3,
    "predicted": 0.15
}

MECHANISM_WEIGHTS = {
    "inhibitor": 1.0,
    "agonist": 1.0,
    "antagonist": 1.0,
    "blocker": 0.9,
    "modulator": 0.85,
    "substrate": 0.75,
    "inducer": 0.7,
    "transporter": 0.7,
    "binder": 0.5,
    "associated": 0.4,
    "unspecified": 0.3
}

def calculate_evidence_score(
    sources: List[str],
    publications: List[Any],
    clinical_level: str = "Preclinical",
    interaction_type: str = "inhibitor"
) -> Dict[str, Any]:
    """
    Computes transparent evidence score:
    Score = min(100, Source_Score (max 30) + Pub_Score (max 25) + Clinical_Score (max 30) + Mech_Score (max 15))
    """
    n_sources = len(set(sources)) if sources else 1
    # 1. Source score: up to 5 databases (6 points each, max 30)
    source_score = round(min(30.0, (n_sources / 5.0) * 30.0), 1)

    # 2. Publication score: up to 10 peer-reviewed papers (2.5 points each, max 25)
    n_pubs = len(publications) if publications else 1
    pub_score = round(min(25.0, (min(n_pubs, 10) / 10.0) * 25.0), 1)

    # 3. Clinical validation tier: max 30 points
    clin_clean = clinical_level.lower()
    w_clin = 0.45
    for key, weight in CLINICAL_WEIGHTS.items():
        if key in clin_clean:
            w_clin = weight
            break
    clin_score = round(30.0 * w_clin, 1)

    # 4. Mechanistic specificity: max 15 points
    mech_clean = interaction_type.lower()
    w_mech = 0.5
    for key, weight in MECHANISM_WEIGHTS.items():
        if key in mech_clean:
            w_mech = weight
            break
    mech_score = round(15.0 * w_mech, 1)

    total_score = round(min(100.0, source_score + pub_score + clin_score + mech_score), 1)

    formula_str = (
        f"Score = min(100, Sources({source_score}/30) + Pubs({pub_score}/25) + "
        f"Clinical({clin_score}/30) + Mechanism({mech_score}/15)) = {total_score}/100"
    )

    return {
        "overall_score": total_score,
        "source_score": source_score,
        "publication_score": pub_score,
        "clinical_tier_score": clin_score,
        "mechanism_score": mech_score,
        "calculation_formula": formula_str,
        "source_count": n_sources,
        "publication_count": n_pubs,
        "clinical_level": clinical_level,
        "interaction_category": interaction_type
    }
