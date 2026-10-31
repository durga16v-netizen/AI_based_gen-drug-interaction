import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  Search, 
  Dna, 
  Pill, 
  Layers, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  SlidersHorizontal,
  Info,
  Loader2
} from 'lucide-react';
import NetworkGraph from '../components/NetworkGraph';
import { fetchNetwork } from '../services/api';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function InteractionNetwork({ initialEntity = 'TP53', initialType = 'gene' }) {
  const [entity, setEntity] = useState(initialEntity);
  const [type, setType] = useState(initialType);
  const [loading, setLoading] = useState(false);
  const [networkData, setNetworkData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const loadNetwork = async (ent, t) => {
    if (!ent.trim()) return;
    setLoading(true);
    try {
      const data = await fetchNetwork(ent, t);
      setNetworkData(data);
    } catch (err) {
      console.warn('Network fetch error, using fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNetwork(entity, type);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadNetwork(entity, type);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <DisclaimerBanner />

      {/* Header and Controls */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs tracking-wider uppercase">
              <Share2 className="w-4 h-4" />
              <span>Multi-Omic Topology Explorer</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Drug–Gene Interaction Network
            </h2>
            <p className="text-xs text-slate-400">
              Explore interconnected target families, chemical perturbagens, and associated disease pathologies.
            </p>
          </div>

          {/* Quick Selectors */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Quick Jumps:</span>
            {['TP53', 'EGFR', 'BRCA1', 'Aspirin', 'Imatinib'].map(item => (
              <button
                key={item}
                onClick={() => {
                  const t = (item === 'Aspirin' || item === 'Imatinib') ? 'drug' : 'gene';
                  setEntity(item);
                  setType(t);
                  loadNetwork(item, t);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 rounded-lg text-xs font-semibold transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold sm:w-48">
            <button
              type="button"
              onClick={() => setType('gene')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                type === 'gene' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              Gene Center
            </button>
            <button
              type="button"
              onClick={() => setType('drug')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                type === 'drug' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              Drug Center
            </button>
          </div>

          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={entity}
              onChange={(e) => setEntity(e.target.value)}
              placeholder={type === 'gene' ? "Enter central gene symbol (e.g., TP53, EGFR, BRAF)..." : "Enter central drug name (e.g., Cisplatin, Imatinib)..."}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
            <span>Render Graph</span>
          </button>
        </form>
      </div>

      {/* Network Graph Area */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <NetworkGraph
          data={networkData}
          onNodeClick={(node) => setSelectedNode(node)}
          height={480}
          showSummary={true}
        />

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs animate-fadeIn">
            <div className="flex items-center gap-3">
              <span 
                className="w-3.5 h-3.5 rounded-full" 
                style={{ backgroundColor: selectedNode.color }} 
              />
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {selectedNode.label}
                </span>
                <span className="text-slate-400 ml-2 capitalize">
                  Type: {selectedNode.type} | Category: {selectedNode.category || 'N/A'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
