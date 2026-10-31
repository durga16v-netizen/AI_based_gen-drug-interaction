import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import GeneAnalysis from './pages/GeneAnalysis';
import DrugAnalysis from './pages/DrugAnalysis';
import InteractionNetwork from './pages/InteractionNetwork';
import MolecularViewerPage from './pages/MolecularViewerPage';
import AiPredictor from './pages/AiPredictor';
import ResearchPapers from './pages/ResearchPapers';
import SavedReports from './pages/SavedReports';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Cross-page search state
  const [geneQuery, setGeneQuery] = useState('TP53');
  const [drugQuery, setDrugQuery] = useState('Aspirin');

  // Handle dark mode class on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Global search navigation
  const handleGlobalSearch = (query, mode = null) => {
    const clean = query.trim();
    if (!clean) return;

    if (mode === 'gene' || (!mode && /^[A-Z0-9-]{2,8}$/i.test(clean) && !clean.toLowerCase().includes('in') && !clean.toLowerCase().includes('ol'))) {
      setGeneQuery(clean.toUpperCase());
      setActiveTab('gene-analysis');
    } else if (mode === 'network') {
      setGeneQuery(clean);
      setActiveTab('interactions');
    } else if (mode === 'research') {
      setActiveTab('research');
    } else {
      setDrugQuery(clean);
      setActiveTab('drug-analysis');
    }
  };

  const handleInspectDrug = (drugName) => {
    setDrugQuery(drugName);
    setActiveTab('drug-analysis');
  };

  const handleInspectGene = (geneSymbol) => {
    setGeneQuery(geneSymbol);
    setActiveTab('gene-analysis');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1120] text-slate-800 dark:text-slate-100 flex transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Navbar */}
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onSearch={handleGlobalSearch}
          setMobileOpen={setMobileOpen}
          activeTab={activeTab}
        />

        {/* Dynamic Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard 
              onNavigateSearch={handleGlobalSearch} 
            />
          )}

          {activeTab === 'gene-analysis' && (
            <GeneAnalysis 
              initialQuery={geneQuery}
              onInspectDrug={handleInspectDrug}
            />
          )}

          {activeTab === 'drug-analysis' && (
            <DrugAnalysis 
              initialQuery={drugQuery}
              onInspectGene={handleInspectGene}
            />
          )}

          {activeTab === 'interactions' && (
            <InteractionNetwork 
              initialEntity={geneQuery}
              initialType="gene"
            />
          )}

          {activeTab === 'molecular-viewer' && (
            <MolecularViewerPage 
              initialCompound={drugQuery}
            />
          )}

          {activeTab === 'ai-predictor' && (
            <AiPredictor />
          )}

          {activeTab === 'research' && (
            <ResearchPapers 
              initialTerm={`${geneQuery} ${drugQuery}`}
            />
          )}

          {activeTab === 'saved-reports' && (
            <SavedReports />
          )}
        </main>
      </div>
    </div>
  );
}
