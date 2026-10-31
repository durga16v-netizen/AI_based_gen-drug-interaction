import React, { useState } from 'react';
import { HelpCircle, X, CheckCircle, Database, BookOpen, Award, Cog } from 'lucide-react';

export default function EvidenceScoreBadge({ score, breakdown }) {
  const [showModal, setShowModal] = useState(false);

  // Determine badge styling based on score
  let badgeStyle = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300';
  let tierLabel = 'Exploratory';

  if (score >= 80) {
    badgeStyle = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    tierLabel = 'Tier 1 Evidence';
  } else if (score >= 60) {
    badgeStyle = 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    tierLabel = 'Tier 2 Evidence';
  } else if (score >= 40) {
    badgeStyle = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    tierLabel = 'Moderate';
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        title="View Evidence Calculation Breakdown"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeStyle} hover:opacity-90 transition-opacity cursor-pointer`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        <span>{score.toFixed(1)}</span>
        <span className="text-[10px] font-normal opacity-75">/100</span>
        <HelpCircle className="w-3 h-3 opacity-60 ml-0.5" />
      </button>

      {/* Breakdown Modal */}
      {showModal && breakdown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  {score.toFixed(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    Evidence Scoring Breakdown
                  </h4>
                  <span className="text-[11px] text-slate-400">{tierLabel}</span>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Formula Box */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl font-mono text-[11px] text-blue-600 dark:text-blue-400 border border-slate-200/60 dark:border-slate-700/60">
              {breakdown.calculation_formula || `Score = Sources + Pubs + Clinical + Mechanism = ${score}/100`}
            </div>

            {/* Score Pillars */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Database className="w-4 h-4 text-blue-500" />
                  <span>Biological Sources ({breakdown.source_count || 1})</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {breakdown.source_score?.toFixed(1) || 0} / 30 pts
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                  <span>PubMed Citations ({breakdown.publication_count || 0})</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {breakdown.publication_score?.toFixed(1) || 0} / 25 pts
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Award className="w-4 h-4 text-purple-500" />
                  <span>Clinical Validation Tier ({breakdown.clinical_level || 'Investigational'})</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {breakdown.clinical_tier_score?.toFixed(1) || 0} / 30 pts
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Cog className="w-4 h-4 text-amber-500" />
                  <span>Mechanism Specificity ({breakdown.interaction_category || 'Inhibitor'})</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {breakdown.mechanism_score?.toFixed(1) || 0} / 15 pts
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              Scores are calculated deterministically to provide full academic transparency without black-box weightings.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
