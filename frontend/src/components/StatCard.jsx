import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function StatCard({ title, value, change, icon: Icon, color = 'blue' }) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400',
      badge: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
    },
    emerald: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      badge: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
    },
    purple: {
      bg: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400',
      badge: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
    },
    amber: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400',
      badge: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
    }
  };

  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide">
          {title}
        </span>
        <div className={`p-2 rounded-xl ${selectedColor.bg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {value.toLocaleString()}
        </h3>
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
        <TrendingUp className="w-3.5 h-3.5" />
        <span>+{change} new this month</span>
      </div>
    </div>
  );
}
