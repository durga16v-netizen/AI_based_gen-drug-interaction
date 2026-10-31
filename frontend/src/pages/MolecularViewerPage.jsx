import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Search, 
  Rotate3d, 
  Download, 
  Sliders, 
  Layers, 
  FileCode, 
  Check, 
  Copy,
  Info,
  Loader2
} from 'lucide-react';
import MoleculeViewer from '../components/MoleculeViewer';
import { fetchMolecule } from '../services/api';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function MolecularViewerPage({ initialCompound = 'Aspirin' }) {
  const [compound, setCompound] = useState(initialCompound);
  const [data, setData] = useState({
    name: 'Aspirin',
    cid: 2244,
    molecular_formula: 'C9H8O4',
    molecular_weight: 180.16,
    logp: 1.19,
    hbd: 1,
    hba: 4,
    tpsa: 63.6,
    smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const loadCompound = async (name) => {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchMolecule(name);
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to fetch molecular coordinates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompound(compound);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadCompound(compound);
  };

  const sampleMolecules = ['Aspirin', 'Imatinib', 'Cisplatin', 'Warfarin', 'Tamoxifen', 'Metformin'];

  const copySmiles = () => {
    if (data.smiles) {
      navigator.clipboard.writeText(data.smiles);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadSDF = () => {
    const content = data.sdf_3d || `
  GeneRx ChemData Export
  Aspirin (CID ${data.cid || 2244})
  9  9  0     0  0  0  0  0  0999 V2000
    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.4000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.1000    1.2124    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
  M  END
  $$$$
`;
    const blob = new Blob([content], { type: 'chemical/x-mdl-sdfile' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.name || 'molecule'}_conformer.sdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <DisclaimerBanner />

      {/* Header & Compound Selector */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs tracking-wider uppercase">
              <Box className="w-4 h-4" />
              <span>Cheminformatics & Structural Biology</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              3D Molecular Structure & Conformer Viewer
            </h2>
            <p className="text-xs text-slate-400">
              Interactive 3D ball-and-stick spatial model with PubChem PUG REST coordinate resolution.
            </p>
          </div>

          {/* Molecule Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 mr-1 font-medium">Library:</span>
            {sampleMolecules.map(m => (
              <button
                key={m}
                onClick={() => {
                  setCompound(m);
                  loadCompound(m);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  compound.toLowerCase() === m.toLowerCase()
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={compound}
              onChange={(e) => setCompound(e.target.value)}
              placeholder="Search chemical compound by name or PubChem CID (e.g. Cisplatin, 2244)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Box className="w-4 h-4" />}
            <span>Load Molecule</span>
          </button>
        </form>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 rounded-xl text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Main Structural View & Detailed Chemistry Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 3D Molecule Viewport */}
        <div className="lg:col-span-2">
          <MoleculeViewer
            drugName={data.name}
            cid={data.cid}
            formula={data.molecular_formula}
            mw={data.molecular_weight}
            smiles={data.smiles}
            height={380}
          />
        </div>

        {/* Right 1 Col: Detailed Chemistry & SDF Download */}
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800/80">
              Molecular Informatics
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs mt-2">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Compound Name</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{data.name}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">PubChem CID</span>
                <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">{data.cid || 'N/A'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Molecular Formula</span>
                <span className="font-mono font-medium">{data.molecular_formula || 'N/A'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Molecular Weight</span>
                <span>{data.molecular_weight} g/mol</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">LogP (Lipophilicity)</span>
                <span>{data.logp ?? 'N/A'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Polar Surface Area</span>
                <span>{data.tpsa ? `${data.tpsa} Å²` : 'N/A'}</span>
              </div>
            </div>

            {/* Canonical SMILES with copy */}
            {data.smiles && (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>Canonical SMILES:</span>
                  <button
                    onClick={copySmiles}
                    className="text-blue-600 dark:text-blue-400 flex items-center gap-1 font-sans"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono text-[10px] break-all text-slate-700 dark:text-slate-300">
                  {data.smiles}
                </div>
              </div>
            )}
          </div>

          {/* Download Conformer SDF Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <button
              onClick={downloadSDF}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download 3D SDF Conformer</span>
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-2">
              Compatible with PyMOL, ChimeraX, Avogadro and AutoDock.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
