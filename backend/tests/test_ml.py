"""
GeneRx - Machine Learning Unit Tests
Verifies feature extraction, model calibration, inference probability range, and held-out metrics.
"""

import os
import pytest
from backend.app.ml.feature_extraction import extract_features_for_pair, FEATURE_COLS
from backend.app.ml.predict import predict_drug_gene_interaction, get_model_metadata

def test_feature_extraction():
    drug_props = {"mw": 180.16, "logp": 1.19, "hbd": 1, "hba": 4, "tpsa": 63.6, "rbc": 3, "rings": 1}
    gene_props = {"chr": 17, "length": 19149, "protein_mw": 43.7, "superfamily": 7, "go_count": 86, "degree": 472, "is_cancer": 1}

    feats = extract_features_for_pair(drug_props, gene_props)
    for col in FEATURE_COLS:
        assert col in feats, f"Missing feature column: {col}"
    assert feats["drug_mw"] == 180.16
    assert feats["gene_chr"] == 17

def test_model_metadata_loaded():
    meta = get_model_metadata()
    assert meta is not None
    assert "metrics" in meta
    assert meta["metrics"]["accuracy"] >= 0.85
    assert meta["metrics"]["roc_auc"] >= 0.90
    assert "confusion_matrix" in meta

def test_ml_prediction_bounds():
    drug_props = {"mw": 493.6, "logp": 3.5, "hbd": 2, "hba": 7, "tpsa": 86.3, "rbc": 7, "rings": 5}
    gene_props = {"chr": 9, "length": 174240, "protein_mw": 122.9, "superfamily": 1, "go_count": 58, "degree": 94, "is_cancer": 1}

    pred = predict_drug_gene_interaction(drug_props, gene_props, drug_name="Imatinib", gene_symbol="ABL1")
    assert pred["implemented"] is True
    assert 0.0 <= pred["prediction_score"] <= 1.0
    assert pred["prediction_score"] > 0.50  # known strong kinase inhibitor match
    assert pred["confidence_level"] in ["High Confidence", "Moderate Confidence"]
    assert "disclaimer" in pred
