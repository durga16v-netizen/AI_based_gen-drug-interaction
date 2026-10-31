import React, { useState, useEffect } from 'react';
import { 
  Dna, 
  Search, 
  ExternalLink, 
  SlidersHorizontal, 
  Sparkles, 
  AlertTriangle, 
  BookOpen, 
  CheckCircle2, 
  Box, 
  FileDown,
  Info,
  Loader2
} from 'lucide-react';
import { searchGene } from '../services/api';
import EvidenceScoreBadge from '../components/EvidenceScoreBadge';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function GeneAnalysis({ initialQuery = 'TP53', onInspectDrug }) {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'high_evidence', 'fda', 'inhibitor'
  const [tableSearch, setTableSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const performSearch = async (geneSym) => {
    if (!geneSym.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchGene(geneSym);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Gene search failed.');
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

  const sampleGenes = ['TP53', 'EGFR', 'BRCA1', 'BRAF', 'ERBB2', 'CYP2D6', 'VKORC1'];

  // Filter interactions
  const filteredInteractions = (result?.interactions || []).filter(item => {
    // Search filter
    const matchesSearch = item.drug_name.toLowerCase().includes(tableSearch.toLowerCase()) ||
                          item.interaction_type.toLowerCase().includes(tableSearch.toLowerCase());
    if (!matchesSearch) return false;

    if (filterType === 'high_evidence') return item.evidence_score >= 70;
    if (filterType === 'fda') return (item.clinical_significance || '').toLowerCase().includes('fda');
    if (filterType === 'inhibitor') return item.interaction_category.toLowerCase() === 'inhibitor';
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Disclaimer */}
      <DisclaimerBanner />

      {/* Gene Search Header */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold text-xs tracking-wider uppercase">
              <Dna className="w-4 h-4" />
              <span>Gene-to-Drug Discovery Mode</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Human Gene Target Analysis
            </h2>
            <p className="text-xs text-slate-400">
              Query biological annotations from MyGene.info and retrieve evidence-ranked drug interactions from DGIdb.
            </p>
          </div>

          {/* Gene Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 mr-1 font-medium">Examples:</span>
            {sampleGenes.map(gene => (
              <button
                key={gene}
                onClick={() => {
                  setQuery(gene);
                  performSearch(gene);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  query.toUpperCase() === gene
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-purple-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-purple-600'
                }`}
              >
                {gene}
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
              placeholder="Enter human gene symbol (e.g., TP53, EGFR, BRCA1, CYP2D6)..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-2xl text-sm shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Analyze Gene</span>
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
          {/* Gene Annotation Summary Card */}
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {result.gene.symbol}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-semibold">
                    Chr {result.gene.chromosome || 'N/A'}
                  </span>
                  {result.gene.entrez_id && (
                    <span className="text-xs font-mono text-slate-400">
                      Entrez: {result.gene.entrez_id}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                  {result.gene.name}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Interacting Drugs</span>
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {result.total_results} Candidates
                  </span>
                </div>
              </div>
            </div>

            {/* Gene Summary Prose */}
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {result.gene.summary}
            </p>

            {/* Gene Ontology & Pathways */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Gene Ontology (GO Terms)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.gene.go_terms.slice(0, 6).map((term, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-[11px]"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Biological Pathways
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.gene.pathways.slice(0, 5).map((pathway, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-lg text-[11px] font-medium"
                    >
                      {pathway}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pharmacogenomic CPIC Guidelines (If Present) */}
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
                        {g.drug}
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

          {/* Drug Interactions Table */}
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Ranked Drug Interaction Candidates
                </h3>
                <p className="text-xs text-slate-400">
                  Transparent evidence-based scoring alongside separate AI prediction probabilities.
                </p>
              </div>

              {/* Table search and Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Filter drug..."
                  className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs placeholder-slate-400 focus:outline-none"
                />

                <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-[11px] font-semibold">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      filterType === 'all' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    All ({result.interactions.length})
                  </button>
                  <button
                    onClick={() => setFilterType('high_evidence')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      filterType === 'high_evidence' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    Tier 1 (≥70)
                  </button>
                  <button
                    onClick={() => setFilterType('fda')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      filterType === 'fda' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    FDA Approved
                  </button>
                </div>
              </div>
            </div>

            {/* Interactions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="py-3 px-3">Drug Candidate</th>
                    <th className="py-3 px-3">Interaction Type</th>
                    <th className="py-3 px-3">Evidence Score</th>
                    <th className="py-3 px-3">AI Prediction Score</th>
                    <th className="py-3 px-3">Sources & Publications</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredInteractions.map((item, idx) => (
                    <tr 
                      key={idx}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Drug Name */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {item.drug_name}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {item.clinical_significance || 'Investigational'}
                        </span>
                      </td>

                      {/* Interaction Type */}
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                          {item.interaction_type}
                        </span>
                        <div className="text-[11px] text-slate-400 capitalize">
                          {item.interaction_category}
                        </div>
                      </td>

                      {/* Evidence Score */}
                      <td className="py-3 px-3">
                        <EvidenceScoreBadge 
                          score={item.evidence_score}
                          breakdown={item.evidence_breakdown}
                        />
                      </td>

                      {/* AI Prediction Score */}
                      <td className="py-3 px-3">
                        {item.ai_prediction ? (
                          <div>
                            <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                              <span>{item.ai_prediction.prediction_percentage}%</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-medium">
                                {item.ai_prediction.confidence_level}
                              </span>
                            </div>
                            <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                                style={{ width: `${item.ai_prediction.prediction_percentage}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Pending</span>
                        )}
                      </td>

                      {/* Sources & Citations */}
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1 mb-1">
                          {item.sources.slice(0, 3).map((s, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[10px]">
                              {s}
                            </span>
                          ))}
                        </div>
                        {item.publications && item.publications.length > 0 && (
                          <div className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400">
                            <BookOpen className="w-3 h-3" />
                            <a 
                              href={item.publications[0].url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="hover:underline"
                            >
                              PMID: {item.publications[0].pmid}
                            </a>
                            {item.publications.length > 1 && (
                              <span className="text-slate-400">+{item.publications.length - 1} more</span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            if (onInspectDrug) onInspectDrug(item.drug_name);
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 ml-auto"
                        >
                          <Box className="w-3.5 h-3.5" />
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
