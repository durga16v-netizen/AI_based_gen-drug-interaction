import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div className="rounded-2xl p-4 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-slate-50/80 dark:from-slate-900/90 dark:via-blue-950/30 dark:to-slate-900/90 border border-blue-200/60 dark:border-blue-900/40 shadow-sm flex items-start gap-3.5">
      <div className="p-2 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
        <ShieldCheck className="w-5 h-5" />
      </div>
      <div className="flex-1 text-xs text-slate-600 dark:text-slate-300 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 dark:text-slate-100 uppercase tracking-wide text-[11px]">
            Academic Research & Bioinformatic Discovery Tool
          </span>
          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-full font-medium text-[10px]">
            Hypothesis Generation
          </span>
        </div>
        <p className="leading-relaxed">
          GeneRx aggregates scientific records from DGIdb, MyGene.info, PubChem, and PharmGKB alongside a calibrated scikit-learn machine learning prediction module.
          <strong className="text-slate-800 dark:text-slate-100 font-semibold ml-1">
            Scores reflect documented evidence strength and chemical compatibility, not proof of clinical efficacy or personalized medical suitability. Do not use for clinical prescribing.
          </strong>
        </p>
      </div>
    </div>
  );
}
