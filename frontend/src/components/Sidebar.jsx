import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Dna, 
  Pill, 
  Share2, 
  Box, 
  Sparkles, 
  FileText, 
  Bookmark, 
  GraduationCap, 
  X,
  ShieldAlert,
  Palette
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) {
  // Configurable sidebar theme options
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('generx_sidebar_theme') || 'slate';
  });

  const themeConfigs = {
    slate: {
      id: 'slate',
      name: 'Deep Slate',
      bgClass: 'bg-[#0f172a]',
      headerBg: 'bg-[#0b1329]/80',
      borderClass: 'border-slate-800/80',
      bottomCard: 'from-[#111c38] to-[#0c1428]',
      dotColor: '#0f172a',
      accent: 'text-blue-400'
    },
    midnight: {
      id: 'midnight',
      name: 'Midnight Black',
      bgClass: 'bg-[#030712]',
      headerBg: 'bg-[#02050e]/90',
      borderClass: 'border-gray-900',
      bottomCard: 'from-[#0b0f19] to-[#030712]',
      dotColor: '#030712',
      accent: 'text-cyan-400'
    },
    navy: {
      id: 'navy',
      name: 'Royal Navy',
      bgClass: 'bg-[#0a1931]',
      headerBg: 'bg-[#061021]/90',
      borderClass: 'border-blue-950/80',
      bottomCard: 'from-[#0e2242] to-[#08152a]',
      dotColor: '#0a1931',
      accent: 'text-sky-400'
    },
    charcoal: {
      id: 'charcoal',
      name: 'Charcoal Zinc',
      bgClass: 'bg-[#18181b]',
      headerBg: 'bg-[#111113]/90',
      borderClass: 'border-zinc-800',
      bottomCard: 'from-[#27272a] to-[#18181b]',
      dotColor: '#18181b',
      accent: 'text-emerald-400'
    },
    indigo: {
      id: 'indigo',
      name: 'Dark Indigo',
      bgClass: 'bg-[#11132b]',
      headerBg: 'bg-[#0b0c1e]/90',
      borderClass: 'border-indigo-950',
      bottomCard: 'from-[#1a1c3d] to-[#11132b]',
      dotColor: '#11132b',
      accent: 'text-purple-400'
    }
  };

  const currentTheme = themeConfigs[theme] || themeConfigs.slate;

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('generx_sidebar_theme', newTheme);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'gene-analysis', label: 'Gene Analysis', icon: Dna },
    { id: 'drug-analysis', label: 'Drug Analysis', icon: Pill },
    { id: 'interactions', label: 'Drug–Gene Interactions', icon: Share2 },
    { id: 'molecular-viewer', label: 'Molecular Viewer', icon: Box },
    { id: 'ai-predictor', label: 'AI Predictor', icon: Sparkles, badge: 'ML' },
    { id: 'research', label: 'Research Papers', icon: FileText },
    { id: 'saved-reports', label: 'Saved Reports', icon: Bookmark }
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Customizable Dark Premium Bioinformatics Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 ${currentTheme.bgClass} border-r ${currentTheme.borderClass}
        flex flex-col transition-all duration-300 ease-in-out text-slate-100 shadow-2xl
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className={`h-20 flex items-center justify-between px-6 border-b ${currentTheme.borderClass} ${currentTheme.headerBg}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <Dna className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-white flex items-center gap-1">
                Gene<span className={currentTheme.accent}>Rx</span>
              </h1>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                AI DGI Intelligence
              </p>
            </div>
          </div>
          <button 
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 font-semibold' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                  }`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-white/20 text-white' : 'bg-blue-950 text-blue-400 border border-blue-800/60'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Color Switcher Palette */}
        <div className="px-4 py-2 mx-3 mb-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
            <Palette className="w-3.5 h-3.5 text-blue-400" />
            <span>Theme:</span>
          </div>
          <div className="flex items-center gap-1.5">
            {Object.values(themeConfigs).map((cfg) => (
              <button
                key={cfg.id}
                onClick={() => handleThemeChange(cfg.id)}
                title={cfg.name}
                className={`w-4 h-4 rounded-full border transition-all ${
                  theme === cfg.id 
                    ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-slate-900 scale-110 border-white' 
                    : 'border-white/30 hover:scale-105'
                }`}
                style={{ backgroundColor: cfg.dotColor }}
              />
            ))}
          </div>
        </div>

        {/* Bottom Slogan Banner */}
        <div className={`p-4 mx-3 mb-4 rounded-2xl bg-gradient-to-br ${currentTheme.bottomCard} border ${currentTheme.borderClass} shadow-inner relative overflow-hidden`}>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Academic Research</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              Better Insights.<br/>Safer Therapies.<br/>Healthier Tomorrow.
            </p>
          </div>
          <Dna className="absolute -right-3 -bottom-3 w-16 h-16 text-blue-500/10 pointer-events-none" />
        </div>
      </aside>
    </>
  );
}
