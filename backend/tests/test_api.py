"""
GeneRx - Backend REST API Unit & Integration Tests
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "version" in data

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["ml_model_loaded"] is True
    assert data["model_accuracy"] > 0.90

def test_stats():
    response = client.get("/api/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["genes_in_database"] == 19842
    assert data["drugs_in_database"] == 8732

def test_gene_search_valid():
    response = client.get("/api/search/gene?symbol=TP53")
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "TP53"
    assert data["gene"]["symbol"] == "TP53"
    assert len(data["interactions"]) > 0
    first_int = data["interactions"][0]
    assert "evidence_score" in first_int
    assert "evidence_breakdown" in first_int
    assert "ai_prediction" in first_int
    assert first_int["evidence_score"] >= 0

def test_gene_search_empty():
    response = client.get("/api/search/gene?symbol=")
    assert response.status_code == 400

def test_drug_search_valid():
    response = client.get("/api/search/drug?name=Aspirin")
    assert response.status_code == 200
    data = response.json()
    assert data["drug"]["name"].lower() == "aspirin"
    assert len(data["interactions"]) > 0
    first_int = data["interactions"][0]
    assert "evidence_score" in first_int
    assert "publications" in first_int

def test_drug_search_empty():
    response = client.get("/api/search/drug?name=")
    assert response.status_code == 400

def test_ai_predict_candidate():
    payload = {
        "gene_symbol": "EGFR",
        "drug_name": "Gefitinib",
        "custom_drug_mw": 446.9,
        "custom_drug_logp": 3.75
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["implemented"] is True
    assert 0.0 <= data["prediction_score"] <= 1.0
    assert "confidence_level" in data
    assert "explanation" in data
    assert "disclaimer" in data

def test_network_graph():
    response = client.get("/api/network?entity=TP53&type=gene")
    assert response.status_code == 200
    data = response.json()
    assert data["central_entity"] == "TP53"
    assert len(data["nodes"]) >= 1
    assert any(n["type"] == "gene" for n in data["nodes"])

def test_drug_comparison():
    response = client.get("/api/compare?drug1=Aspirin&drug2=Ibuprofen")
    assert response.status_code == 200
    data = response.json()
    assert "drug1" in data and "drug2" in data
    assert data["drug1"]["name"] == "Aspirin"
    assert data["drug2"]["name"] == "Ibuprofen"
    assert len(data["radar_labels"]) == 5

def test_molecule_structure():
    response = client.get("/api/molecule/Aspirin")
    assert response.status_code == 200
    data = response.json()
    assert data["name"].lower() == "aspirin"
    assert data["cid"] == 2244

def test_ml_metrics():
    response = client.get("/api/ml/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "metrics" in data
    assert "roc_auc" in data["metrics"]
    assert "confusion_matrix" in data
    assert "roc_curve" in data
