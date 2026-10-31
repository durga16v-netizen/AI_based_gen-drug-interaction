import React, { useState } from 'react';
import { Search, Moon, Sun, Bell, Menu, Dna, Pill, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function Navbar({ 
  darkMode, 
  setDarkMode, 
  onSearch, 
  onSelectMode, 
  setMobileOpen,
  activeTab 
}) {
  const [query, setQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (onSearch) {
      onSearch(query.trim());
    }
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setMobileOpen(true)}
        className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-2xl">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search gene (e.g., TP53, EGFR, BRCA1) or drug (e.g., Aspirin, Imatinib)..."
            className="w-full pl-10 pr-24 py-2.5 bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 rounded-full text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-800 dark:text-slate-100"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full shadow-sm transition-all"
          >
            Search
          </button>
        </form>
      </div>

      {/* Right Controls: Mode quick jumps, Theme, Notifications, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark / Light Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle Theme"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 text-xs z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200">
                <span>System Notifications</span>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">1 New</span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">Scikit-Learn ML Model Calibrated</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">AUROC: 0.9954 | Accuracy: 97.59% on held-out test data.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge (Durga) */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-semibold flex items-center justify-center text-sm shadow-sm">
            D
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">
              Durga
            </div>
            <div className="text-[10px] text-slate-400 font-medium leading-none">
              Researcher
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
