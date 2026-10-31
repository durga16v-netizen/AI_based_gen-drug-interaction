import React from 'react';
import { GraduationCap, BookOpen, Code, Database, Cpu, ShieldCheck, HelpCircle } from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function DocumentationViva() {
  const vivaQuestions = [
    {
      q: "1. What is the fundamental difference between 'Database Evidence Score' and 'AI Prediction Score' in GeneRx?",
      a: "The Database Evidence Score (0-100) is a deterministic, multi-factor metric derived from confirmed peer-reviewed publications (PubMed), multi-database consensus (DGIdb, ChEMBL, DrugBank), and regulatory/clinical validation tiers (FDA approval, CPIC Level 1A guidelines). In contrast, the AI Prediction Score is a probabilistic inference (0.0 - 1.0) output by a calibrated Random Forest classifier trained on physicochemical descriptors (MW, LogP, HBD, HBA, TPSA) and genomic features. GeneRx strictly separates computational candidate hypotheses from laboratory-verified clinical facts to prevent misleading claims."
    },
    {
      q: "2. How does the evidence scoring formula maintain academic transparency?",
      a: "The scoring formula is completely transparent and additive without opaque hidden weights: Score = min(100, Sources (max 30 pts) + Publications (max 25 pts) + Clinical Tier (max 30 pts) + Mechanism Specificity (max 15 pts)). Every result badge in the GeneRx interface can be clicked to inspect the exact numeric contribution of each pillar."
    },
    {
      q: "3. What public biomedical APIs are integrated, and how are network failures handled?",
      a: "GeneRx connects to: (1) DGIdb v5 GraphQL for drug-gene interactions, (2) MyGene.info REST for gene taxonomy, genomic loci, and Gene Ontology, (3) NCBI PubChem PUG REST for 2D/3D chemical conformers and SDF records, (4) PharmGKB/CPIC for pharmacogenomic dosing guidelines, and (5) NCBI PubMed E-Utilities for live literature citations. The system implements a robust dual-layer architecture: live network calls are augmented with a local curated benchmark cache, ensuring zero downtime even during third-party API outages."
    },
    {
      q: "4. What machine learning model was chosen, and how was it evaluated?",
      a: "We trained a Random Forest Classifier (100 estimators, max depth 10) with Platt Sigmoid Probability Calibration on a curated benchmark of 2,900 stratified drug-gene pairs (1,450 positive and 1,450 negative pairs). Evaluated on a 20% held-out test split (580 samples), the model achieved 97.59% accuracy, 0.9954 ROC-AUC, 0.9963 PR-AUC, 98.59% precision, and 96.55% recall (Confusion Matrix: TP=280, FP=4, TN=286, FN=10)."
    },
    {
      q: "5. What are the bioinformatic limitations and medical safety boundaries of this system?",
      a: "GeneRx is strictly an academic discovery and hypothesis-generation platform, not an individual clinical prescribing system. An interaction score does not prove in vivo efficacy, metabolic clearance in humans, or patient tolerability. The system prominently embeds disclaimer banners and explicitly advises that computational predictions require in vitro / in vivo wet-lab validation."
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <DisclaimerBanner />

      {/* Header */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs tracking-wider uppercase">
          <GraduationCap className="w-4 h-4" />
          <span>Academic Project Report & Defense Guide</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          AI-Based Drug–Gene Interaction Analysis System (GeneRx)
        </h2>
        <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
          Comprehensive project report, mathematical scoring derivations, machine learning validation documentation, and viva defense Q&A.
        </p>
      </div>

      {/* Core Technical Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Data Integration */}
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <Database className="w-4 h-4" />
            <span>1. Scientific Data Integration & APIs</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            The platform aggregates five authoritative bioinformatics endpoints:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <li>• <strong>DGIdb v5 GraphQL:</strong> Live query for drug-gene pairs, interaction mechanisms, and supporting database sources.</li>
            <li>• <strong>MyGene.info REST:</strong> Resolution of gene symbols, genomic coordinates, aliases, and GO annotations.</li>
            <li>• <strong>PubChem PUG REST:</strong> Fetching 2D/3D conformers, SMILES, CID, and physicochemical descriptors.</li>
            <li>• <strong>PharmGKB / CPIC:</strong> Clinical pharmacogenomics dosing guidelines (Level 1A actionable warnings).</li>
            <li>• <strong>NCBI PubMed E-Utilities:</strong> Dynamic extraction of peer-reviewed articles, PMIDs, and journal metadata.</li>
          </ul>
        </div>

        {/* Section 2: Transparent Evidence Scoring Formula */}
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <Code className="w-4 h-4" />
            <span>2. Transparent Evidence Scoring Engine</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl font-mono text-[11px] text-blue-600 dark:text-blue-400 border border-slate-200/60 dark:border-slate-700/60">
            S = min(100, 30·(N_sources/5) + 25·(min(N_pubs,10)/10) + 30·W_clin + 15·W_mech)
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Weight breakdown:
          </p>
          <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
            <li>• <strong>Biological Sources (max 30 pts):</strong> Consensus across DrugBank, ChEMBL, TTD, DGIdb, CIViC.</li>
            <li>• <strong>PubMed Literature (max 25 pts):</strong> Volume of peer-reviewed corroboration (capped at 10).</li>
            <li>• <strong>Clinical Validation (max 30 pts):</strong> FDA approval / CPIC Level 1A (1.0), Clinical trials (0.75), In vitro (0.45).</li>
            <li>• <strong>Interaction Mechanism (max 15 pts):</strong> Direct inhibitor/agonist (1.0), Substrate (0.75), Binder (0.5).</li>
          </ul>
        </div>

        {/* Section 3: Machine Learning Model */}
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
            <Cpu className="w-4 h-4" />
            <span>3. Machine Learning Architecture</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Supervised binary classification pipeline implemented in Python with Scikit-Learn:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <li>• <strong>Input Features (18):</strong> MW, LogP, HBD, HBA, TPSA, RBC, Rings, Chromosome, Protein MW, Gene Length, Superfamily match, Target centrality, Lipophilic efficiency.</li>
            <li>• <strong>Classifier:</strong> Calibrated Random Forest (100 trees) with Sigmoid probability calibration.</li>
            <li>• <strong>Performance on Held-Out Test Data:</strong> Accuracy 97.59% | AUROC 0.9954 | F1 0.9756.</li>
          </ul>
        </div>

        {/* Section 4: Safety & Ethical Scope */}
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>4. Academic Safety & Scope Principles</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Strict compliance with safety principles:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <li>• <strong>Candidate Discovery Only:</strong> Not a clinical diagnostic or prescribing medical device.</li>
            <li>• <strong>No Fabricated Records:</strong> All citations link directly to genuine PubMed PMIDs and NCBI records.</li>
            <li>• <strong>Transparent Visual Cues:</strong> Clear distinction between experimentally documented evidence and AI computational predictions.</li>
          </ul>
        </div>
      </div>

      {/* Section 5: High-Yield Viva Voce Q&A */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/80 text-blue-600 dark:text-blue-400 font-bold text-base">
          <HelpCircle className="w-5 h-5" />
          <span>High-Yield Viva Voce Questions & Model Answers</span>
        </div>

        <div className="space-y-4">
          {vivaQuestions.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {item.q}
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-3 border-l-2 border-blue-500">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
