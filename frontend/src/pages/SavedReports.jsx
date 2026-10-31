import React, { useState } from 'react';
import { 
  Bookmark, 
  Printer, 
  Download, 
  FileSpreadsheet, 
  FileCode, 
  FileText, 
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function SavedReports() {
  const [selectedReport, setSelectedReport] = useState('tp53');

  const reportPresets = [
    {
      id: 'tp53',
      title: 'TP53 Oncological Target & Therapeutic Interaction Dossier',
      date: 'Oct 31, 2026',
      records: 48,
      author: 'Durga (Bioinformatics)',
      summary: 'Complete analysis of human TP53 tumor suppressor protein interactions with DNA-damaging platinum agents, topoisomerase inhibitors, and MDM2 antagonists.'
    },
    {
      id: 'egfr',
      title: 'EGFR Tyrosine Kinase Inhibitors & Resistance Profile',
      date: 'Oct 30, 2026',
      records: 35,
      author: 'Durga (Bioinformatics)',
      summary: 'Evidence-based comparative ranking of 1st, 2nd, and 3rd generation EGFR TKIs (Gefitinib, Erlotinib, Afatinib, Osimertinib) with exon 19 del / L858R / T790M somatic mutations.'
    },
    {
      id: 'cpic',
      title: 'Clinical Pharmacogenomics (CPIC Level 1A) Actionable Guidelines',
      date: 'Oct 28, 2026',
      records: 12,
      author: 'Durga (Bioinformatics)',
      summary: 'Curated CPIC Level 1A actionable dosing guidelines for CYP2D6, CYP2C19, CYP2C9, VKORC1, DPYD, TPMT, and SLCO1B1.'
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Gene,Drug,Interaction_Type,Evidence_Score,Clinical_Level,Sources,PubMed_PMID\n" +
      "TP53,Cisplatin,DNA Crosslinker,94.0,FDA Approved,DrugBank;ChEMBL;DGIdb,10713718\n" +
      "TP53,Doxorubicin,Topoisomerase II Inhibitor,91.0,FDA Approved,DrugBank;DGIdb;TTD,9271112\n" +
      "TP53,Nutlin-3a,MDM2 Antagonist,86.0,Clinical Trial,ChEMBL;DGIdb,14704432\n" +
      "EGFR,Osimertinib,Covalent TKI,97.0,FDA Approved,DrugBank;ChEMBL;CIViC,26715699\n" +
      "EGFR,Gefitinib,Tyrosine Kinase Inhibitor,95.0,FDA Approved,DrugBank;PharmGKB,15118073\n" +
      "VKORC1,Warfarin,VKOR Inhibitor,98.0,CPIC Level 1A,PharmGKB;CPIC;DGIdb,19228618\n" +
      "CYP2D6,Tamoxifen,Prodrug Bioactivation,96.0,CPIC Level 1A,PharmGKB;CPIC,16103433\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `GeneRx_Export_${selectedReport}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const data = {
      project: "GeneRx AI-Based Drug-Gene Interaction Analysis System",
      export_date: "2026-10-31",
      report_id: selectedReport,
      data: reportPresets.find(r => r.id === selectedReport)
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GeneRx_Export_${selectedReport}.json`;
    a.click();
    URL.revokeObjectURL(a);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <DisclaimerBanner />

      {/* Header and Export Actions */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs tracking-wider uppercase">
            <Bookmark className="w-4 h-4" />
            <span>Academic Export Center</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Saved Reports & Research Dossiers
          </h2>
          <p className="text-xs text-slate-400">
            Export evidence records, algorithmic scores, and computational predictions to PDF, CSV, or JSON.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print PDF</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <FileCode className="w-4 h-4" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportPresets.map(report => (
          <div
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
              selectedReport === report.id
                ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-500 shadow-md'
                : 'bg-white dark:bg-[#0f172a] border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{report.date}</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {report.records} Evidence Records
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                {report.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {report.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">By {report.author}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                selectedReport === report.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {selectedReport === report.id ? 'Active' : 'Select'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
