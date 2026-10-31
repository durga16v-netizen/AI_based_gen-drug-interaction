"""
GeneRx - Machine Learning Training and Validation Pipeline
Algorithm: Random Forest Classifier with Probability Calibration
Task: Drug-Gene Interaction (DGI) Binary Classification
Held-out Evaluation: Stratified 80/20 Test Split with AUROC, AUPR, and Confusion Matrix
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, average_precision_score, confusion_matrix,
    roc_curve, precision_recall_curve, brier_score_loss
)

FEATURE_COLS = [
    "drug_mw", "drug_logp", "drug_hbd", "drug_hba", "drug_tpsa",
    "drug_rbc", "drug_rings", "gene_chr", "gene_log_len",
    "gene_protein_mw", "gene_superfamily", "gene_go_count",
    "gene_degree", "gene_is_cancer", "mw_ratio", "hb_density",
    "lipophilic_eff", "target_class_match"
]

def train_and_evaluate():
    data_path = os.path.join(os.path.dirname(__file__), "..", "data", "benchmark_dataset.csv")
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Benchmark dataset not found at {data_path}")

    print(f"Loading benchmark dataset from {data_path}...")
    df = pd.read_csv(data_path)
    print(f"Dataset shape: {df.shape}")

    X = df[FEATURE_COLS].values
    y = df["label"].values

    # Stratified 80/20 train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    print(f"Train samples: {len(y_train)} ({sum(y_train)} pos / {len(y_train) - sum(y_train)} neg)")
    print(f"Held-out test samples: {len(y_test)} ({sum(y_test)} pos / {len(y_test) - sum(y_test)} neg)")

    # Standardize features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Base Random Forest
    base_rf = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=4,
        min_samples_leaf=2,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1
    )

    # 5-fold cross-validation on train set
    cv_scores = cross_val_score(base_rf, X_train_scaled, y_train, cv=5, scoring="roc_auc")
    print(f"5-Fold CV ROC-AUC: {cv_scores.mean():.4f} +/- {cv_scores.std():.4f}")

    # Probability Calibration using Sigmoid
    calibrated_model = CalibratedClassifierCV(estimator=base_rf, method="sigmoid", cv=5)
    calibrated_model.fit(X_train_scaled, y_train)

    # Also fit base RF on full train set to extract feature importances
    base_rf.fit(X_train_scaled, y_train)
    importances = base_rf.feature_importances_
    feat_importance_list = [
        {"feature": name, "importance": round(float(imp), 4)}
        for name, imp in sorted(zip(FEATURE_COLS, importances), key=lambda x: x[1], reverse=True)
    ]

    # Evaluate on held-out test set
    y_pred = calibrated_model.predict(X_test_scaled)
    y_proba = calibrated_model.predict_proba(X_test_scaled)[:, 1]

    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred))
    rec = float(recall_score(y_test, y_pred))
    f1 = float(f1_score(y_test, y_pred))
    roc_auc = float(roc_auc_score(y_test, y_proba))
    pr_auc = float(average_precision_score(y_test, y_proba))
    brier = float(brier_score_loss(y_test, y_proba))

    tn, fp, fn, tp = confusion_matrix(y_test, y_pred).ravel()
    specificity = float(tn / (tn + fp)) if (tn + fp) > 0 else 0.0

    # ROC curve points (sample down to ~50 points for efficient frontend charting)
    fpr, tpr, roc_thresh = roc_curve(y_test, y_proba)
    step = max(1, len(fpr) // 50)
    roc_points = [{"fpr": round(float(f), 4), "tpr": round(float(t), 4)} for f, t in zip(fpr[::step], tpr[::step])]
    if roc_points[-1]["fpr"] != 1.0:
        roc_points.append({"fpr": 1.0, "tpr": 1.0})

    # PR curve points
    p_curve, r_curve, _ = precision_recall_curve(y_test, y_proba)
    p_step = max(1, len(p_curve) // 50)
    pr_points = [{"recall": round(float(r), 4), "precision": round(float(p), 4)} for r, p in zip(r_curve[::p_step], p_curve[::p_step])]

    metadata = {
        "model_name": "GeneRx Calibrated Random Forest Classifier",
        "version": "1.0.0",
        "trained_date": "2026-10-31",
        "algorithm": "RandomForestClassifier(n_estimators=100, max_depth=10) with CalibratedClassifierCV(method='sigmoid')",
        "feature_count": len(FEATURE_COLS),
        "feature_names": FEATURE_COLS,
        "train_samples": int(len(y_train)),
        "test_samples": int(len(y_test)),
        "cv_roc_auc_mean": round(float(cv_scores.mean()), 4),
        "cv_roc_auc_std": round(float(cv_scores.std()), 4),
        "metrics": {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall_sensitivity": round(rec, 4),
            "specificity": round(specificity, 4),
            "f1_score": round(f1, 4),
            "roc_auc": round(roc_auc, 4),
            "pr_auc": round(pr_auc, 4),
            "brier_score": round(brier, 4)
        },
        "confusion_matrix": {
            "true_positive": int(tp),
            "false_positive": int(fp),
            "true_negative": int(tn),
            "false_negative": int(fn)
        },
        "roc_curve": roc_points,
        "pr_curve": pr_points,
        "feature_importances": feat_importance_list,
        "limitations": [
            "Trained on small-molecule and selected macromolecular drug interactions; highly novel scaffolds with unusual macrocycles may yield lower confidence.",
            "Predictions reflect physical-chemical and target family compatibility, and do not model in vivo pharmacokinetics or blood-brain barrier permeability.",
            "Outputs are probabilistic candidate scores intended solely for hypothesis generation and must be validated through experimental assays.",
            "Never use computational interaction scores as clinical prescribing guidance."
        ]
    }

    # Save model artifacts
    out_dir = os.path.dirname(__file__)
    model_file = os.path.join(out_dir, "model.joblib")
    scaler_file = os.path.join(out_dir, "scaler.joblib")
    meta_file = os.path.join(out_dir, "model_metadata.json")

    joblib.dump(calibrated_model, model_file)
    joblib.dump(scaler, scaler_file)
    with open(meta_file, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print("\n" + "="*50)
    print("MODEL TRAINING & EVALUATION REPORT")
    print("="*50)
    print(f"Accuracy:            {acc*100:.2f}%")
    print(f"ROC-AUC:             {roc_auc:.4f}")
    print(f"PR-AUC:              {pr_auc:.4f}")
    print(f"F1-Score:            {f1:.4f}")
    print(f"Precision:           {prec:.4f}")
    print(f"Recall (Sensitivity):{rec:.4f}")
    print(f"Specificity:         {specificity:.4f}")
    print(f"Confusion Matrix:    TP={tp}, FP={fp}, TN={tn}, FN={fn}")
    print("="*50)
    print(f"Saved artifacts to {out_dir}")
    return metadata

if __name__ == "__main__":
    train_and_evaluate()
