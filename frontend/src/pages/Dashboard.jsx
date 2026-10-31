import React, { useState, useEffect } from 'react';
import { 
  Dna, 
  Pill, 
  Share2, 
  FileText, 
  Search, 
  Clock, 
  ExternalLink, 
  ChevronRight, 
  Zap, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import StatCard from '../components/StatCard';
import NetworkGraph from '../components/NetworkGraph';
import MoleculeViewer from '../components/MoleculeViewer';
import RadarComparison from '../components/RadarComparison';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { fetchStats, fetchResearchUpdates } from '../services/api';

export default function Dashboard({ onNavigateSearch }) {
  const [stats, setStats] = useState({
    genes_in_database: 19842,
    genes_new_month: 12,
    drugs_in_database: 8732,
    drugs_new_month: 8,
    drug_gene_interactions: 245691,
    interactions_new_month: 36,
    research_papers: 125430,
    papers_new_month: 18
  });
  const [searchTab, setSearchTab] = useState('gene'); // 'gene' or 'drug'
  const [searchInput, setSearchInput] = useState('');
  const [researchList, setResearchList] = useState([]);

  useEffect(() => {
    fetchStats().then(setStats);
    fetchResearchUpdates().then(setResearchList);
  }, []);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    onNavigateSearch(searchInput.trim(), searchTab);
  };

  const handlePillClick = (val) => {
    onNavigateSearch(val, 'gene');
  };

  const recentAnalyses = [
    { title: 'TP53', type: 'Gene Analysis', time: '2 hours ago', icon: 'T', color: 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400', query: 'TP53', mode: 'gene' },
    { title: 'Aspirin', type: 'Drug Analysis', time: '5 hours ago', icon: 'A', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400', query: 'Aspirin', mode: 'drug' },
    { title: 'BRCA1', type: 'Gene Analysis', time: '1 day ago', icon: 'B', color: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400', query: 'BRCA1', mode: 'gene' },
    { title: 'Metformin', type: 'Drug Analysis', time: '1 day ago', icon: 'M', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400', query: 'Metformin', mode: 'drug' },
    { title: 'TP53 + Cisplatin', type: 'Drug–Gene Interaction', time: '2 days ago', icon: 'T', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400', query: 'TP53', mode: 'gene' }
  ];

  const popularGenes = ['TP53', 'BRCA1', 'EGFR', 'VEGFA', 'PIK3CA'];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Safety Disclaimer Banner */}
      <DisclaimerBanner />

      {/* 4 Top Metric Stat Cards (Matches Reference Screenshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Genes in Database"
          value={stats.genes_in_database}
          change={stats.genes_new_month}
          icon={Dna}
          color="blue"
        />
        <StatCard
          title="Drugs in Database"
          value={stats.drugs_in_database}
          change={stats.drugs_new_month}
          icon={Pill}
          color="emerald"
        />
        <StatCard
          title="Drug–Gene Interactions"
          value={stats.drug_gene_interactions}
          change={stats.interactions_new_month}
          icon={Share2}
          color="purple"
        />
        <StatCard
          title="Research Papers"
          value={stats.research_papers}
          change={stats.papers_new_month}
          icon={FileText}
          color="amber"
        />
      </div>

      {/* Main Grid: Left (Network & Visuals) + Right (Quick Search, Recent, Updates) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols on lg) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Drug-Gene Interaction Network Card */}
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Drug–Gene Interaction Network
                  </h3>
                  <p className="text-xs text-slate-400">
                    Explore the complex relationships between genes, drugs and diseases.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => onNavigateSearch('TP53', 'network')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Canvas Interactive Network Graph */}
            <NetworkGraph height={380} showSummary={true} />
          </div>

          {/* Lower Row: Drug Comparison & 3D Molecular Viewer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RadarComparison 
              onCompareClick={() => onNavigateSearch('Aspirin', 'drug')}
            />
            <MoleculeViewer 
              drugName="Aspirin"
              cid={2244}
              formula="C9H8O4"
              mw={180.16}
              smiles="CC(=O)OC1=CC=CC=C1C(=O)O"
              height={220}
            />
          </div>
        </div>

        {/* Right Column (1 Col on lg): Quick Search, Recent Analysis, Updates */}
        <div className="space-y-6">
          {/* Quick Search Card (Matches Reference Screenshot) */}
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Quick Search
              </h3>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
              <button
                onClick={() => setSearchTab('gene')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  searchTab === 'gene'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Gene
              </button>
              <button
                onClick={() => setSearchTab('drug')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  searchTab === 'drug'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Drug
              </button>
            </div>

            {/* Search Input */}
            <form onSubmit={handleQuickSearch} className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={searchTab === 'gene' ? "Enter gene name (e.g., BRCA1)..." : "Enter drug name (e.g., Imatinib)..."}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                Search
              </button>
            </form>

            {/* Popular Genes Pills */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Popular Genes
              </span>
              <div className="flex flex-wrap gap-1.5">
                {popularGenes.map(gene => (
                  <button
                    key={gene}
                    onClick={() => handlePillClick(gene)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/60 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 text-xs font-semibold transition-colors"
                  >
                    {gene}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Analysis Card (Matches Reference Screenshot) */}
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Recent Analysis
                </h3>
              </div>
              <button 
                onClick={() => onNavigateSearch('TP53', 'gene')}
                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700"
              >
                View All →
              </button>
            </div>

            <div className="space-y-3">
              {recentAnalyses.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onNavigateSearch(item.query, item.mode)}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl ${item.color} font-bold flex items-center justify-center text-xs`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {item.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <span>{item.time}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Latest Research Updates (Matches Reference Screenshot) */}
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Latest Research Updates
                </h3>
              </div>
              <button 
                onClick={() => onNavigateSearch('cancer', 'research')}
                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700"
              >
                View All →
              </button>
            </div>

            <div className="space-y-3">
              {researchList.map(item => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50/60 dark:hover:bg-slate-800 text-xs transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 leading-snug line-clamp-2">
                      {item.title}
                    </p>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 mt-0.5" />
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                    <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded">
                      {item.journal}
                    </span>
                    <span>{item.date}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Precision Medicine Banner (Matches Reference Screenshot) */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="font-bold text-base sm:text-lg">
            Powering the future of precision medicine
          </h3>
          <p className="text-xs text-slate-400 max-w-xl">
            Integrating AI, bioinformatics and pharmacology for better therapeutic decisions and candidate discovery.
          </p>
        </div>

        <div className="flex items-center gap-4 sm:gap-8">
          <div className="text-center">
            <div className="w-9 h-9 mx-auto rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-1">
              <Zap className="w-4 h-4" />
            </div>
            <span className="font-semibold text-xs block">Faster Analysis</span>
            <span className="text-[10px] text-slate-400">AI-Powered Insights</span>
          </div>

          <div className="text-center">
            <div className="w-9 h-9 mx-auto rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-semibold text-xs block">More Accurate</span>
            <span className="text-[10px] text-slate-400">Evidence-Based Results</span>
          </div>

          <div className="text-center">
            <div className="w-9 h-9 mx-auto rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-1">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-semibold text-xs block">Better Outcomes</span>
            <span className="text-[10px] text-slate-400">For a Healthier Tomorrow</span>
          </div>
        </div>
      </div>
    </div>
  );
}
