import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Search, 
  Box, 
  Sparkles, 
  AlertTriangle, 
  BookOpen, 
  Share2, 
  Dna,
  Loader2,
  Copy,
  Check
} from 'lucide-react';
import { searchDrug } from '../services/api';
import MoleculeViewer from '../components/MoleculeViewer';
import EvidenceScoreBadge from '../components/EvidenceScoreBadge';
import RadarComparison from '../components/RadarComparison';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function DrugAnalysis({ initialQuery = 'Aspirin', onInspectGene }) {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [copiedSmiles, setCopiedSmiles] = useState(false);

  const performSearch = async (drugName) => {
    if (!drugName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchDrug(drugName);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Drug search failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    performSearch(query);
  };

  const sampleDrugs = ['Aspirin', 'Imatinib', 'Warfarin', 'Tamoxifen', 'Metformin', 'Cisplatin'];

  const copySmiles = (smiles) => {
    navigator.clipboard.writeText(smiles);
    setCopiedSmiles(true);
    setTimeout(() => setCopiedSmiles(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Disclaimer */}
      <DisclaimerBanner />

      {/* Drug Search Header */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs tracking-wider uppercase">
              <Pill className="w-4 h-4" />
              <span>Drug-to-Gene Discovery Mode</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Pharmacological Agent & Target Profiling
            </h2>
            <p className="text-xs text-slate-400">
              Retrieve 3D chemical structures from PubChem and uncover target genes, metabolizing enzymes and pharmacogenomic markers.
            </p>
          </div>

          {/* Sample Drug Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 mr-1 font-medium">Examples:</span>
            {sampleDrugs.map(d => (
              <button
                key={d}
                onClick={() => {
                  setQuery(d);
                  performSearch(d);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  query.toLowerCase() === d.toLowerCase()
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Input Field */}
        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter drug name (e.g., Aspirin, Imatinib, Warfarin, Tamoxifen)..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Analyze Drug</span>
          </button>
        </form>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 rounded-xl text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Results View */}
      {result && (
        <div className="space-y-6">
          {/* Drug Chemical Profile & 3D Molecule Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Chemical Metadata & ADMET */}
            <div className="lg:col-span-2 bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {result.drug.name}
                    </h3>
                    {result.drug.pubchem_cid && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                        PubChem CID: {result.drug.pubchem_cid}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {result.drug.molecular_formula} | {result.drug.molecular_weight} g/mol
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Target Genes</span>
                  <span className="text-base font-bold text-blue-600 dark:text-blue-400">
                    {result.total_results} Associated
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {result.drug.description}
              </p>

              {/* Physicochemical Descriptors Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs">
                  <span className="text-slate-400 block text-[10px]">Lipophilicity (LogP)</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {result.drug.logp ?? 'N/A'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs">
                  <span className="text-slate-400 block text-[10px]">Polar Surface (TPSA)</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {result.drug.tpsa ? `${result.drug.tpsa} Å²` : 'N/A'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs">
                  <span className="text-slate-400 block text-[10px]">H-Bond (D / A)</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {result.drug.hbd ?? 0} / {result.drug.hba ?? 0}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs">
                  <span className="text-slate-400 block text-[10px]">Rotatable Bonds</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {result.drug.rotatable_bonds ?? 0}
                  </span>
                </div>
              </div>

              {/* Canonical SMILES Box */}
              {result.drug.canonical_smiles && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1 text-[11px] text-slate-400">
                    <span className="font-medium">Canonical SMILES String:</span>
                    <button
                      onClick={() => copySmiles(result.drug.canonical_smiles)}
                      className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-sans"
                    >
                      {copiedSmiles ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSmiles ? 'Copied' : 'Copy SMILES'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 bg-slate-100 dark:bg-slate-800/70 rounded-xl font-mono text-[11px] break-all text-slate-700 dark:text-slate-300 select-all border border-slate-200/60 dark:border-slate-700/60">
                    {result.drug.canonical_smiles}
                  </div>
                </div>
              )}
            </div>

            {/* Right 1 Col: 3D Molecule Viewer Component */}
            <MoleculeViewer
              drugName={result.drug.name}
              cid={result.drug.pubchem_cid}
              formula={result.drug.molecular_formula}
              mw={result.drug.molecular_weight}
              smiles={result.drug.canonical_smiles}
              height={260}
            />
          </div>

          {/* Pharmacogenomics Clinical Warnings */}
          {result.clinical_guidelines && result.clinical_guidelines.length > 0 && (
            <div className="bg-amber-50/70 dark:bg-amber-950/20 rounded-3xl p-6 border border-amber-200/80 dark:border-amber-900/40 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>PharmGKB / CPIC Clinical Dosing Guidelines ({result.clinical_guidelines.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.clinical_guidelines.map((g, idx) => (
                  <div key={idx} className="p-4 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-amber-200/50 dark:border-amber-900/30 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        Gene Target: {g.gene}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold text-[10px]">
                        {g.level}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {g.recommendation}
                    </p>
                    <div className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                      ⚠️ {g.phenotype_warning}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Target Genes Table */}
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Identified Human Gene Targets & Metabolizers
                </h3>
                <p className="text-xs text-slate-400">
                  Ranked by evidence strength and verified through scientific database annotations.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="py-3 px-3">Target Gene</th>
                    <th className="py-3 px-3">Relationship Type</th>
                    <th className="py-3 px-3">Evidence Score</th>
                    <th className="py-3 px-3">AI Prediction Score</th>
                    <th className="py-3 px-3">Mechanism Summary</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {result.interactions.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                          <Dna className="w-3.5 h-3.5 text-purple-500" />
                          <span>{item.gene_symbol}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {item.clinical_significance || 'Target'}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                          {item.interaction_type}
                        </span>
                        <div className="text-[11px] text-slate-400 capitalize">
                          {item.interaction_category}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <EvidenceScoreBadge 
                          score={item.evidence_score}
                          breakdown={item.evidence_breakdown}
                        />
                      </td>

                      <td className="py-3 px-3">
                        {item.ai_prediction ? (
                          <div>
                            <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                              <span>{item.ai_prediction.prediction_percentage}%</span>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {item.ai_prediction.confidence_level}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">N/A</span>
                        )}
                      </td>

                      <td className="py-3 px-3 max-w-xs text-slate-600 dark:text-slate-300 truncate">
                        {item.mechanism_summary}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            if (onInspectGene) onInspectGene(item.gene_symbol);
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-purple-50 dark:bg-slate-800 dark:hover:bg-purple-950/60 text-slate-700 dark:text-slate-300 hover:text-purple-600 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 ml-auto"
                        >
                          <Dna className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
