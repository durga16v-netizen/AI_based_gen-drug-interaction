import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function RadarComparison({ 
  drug1 = { name: 'Aspirin', efficacy: 75, safety: 82, bioav: 90, risk: 45, cost: 95 },
  drug2 = { name: 'Ibuprofen', efficacy: 85, safety: 70, bioav: 85, risk: 55, cost: 90 },
  onCompareClick
}) {
  const [selected1, setSelected1] = useState(drug1.name);
  const [selected2, setSelected2] = useState(drug2.name);

  const categories = [
    { key: 'efficacy', label: 'Efficacy', angle: 0 },
    { key: 'safety', label: 'Safety', angle: (2 * Math.PI) / 5 },
    { key: 'risk', label: 'Interaction Risk', angle: (4 * Math.PI) / 5 },
    { key: 'bioav', label: 'Bioavailability', angle: (6 * Math.PI) / 5 },
    { key: 'cost', label: 'Cost', angle: (8 * Math.PI) / 5 }
  ];

  const size = 260;
  const center = size / 2;
  const radius = 80;

  // Compute polygon points for drug 1
  const points1 = categories.map((cat, i) => {
    const val = (drug1[cat.key] || 70) / 100;
    const ang = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const x = center + radius * val * Math.cos(ang);
    const y = center + radius * val * Math.sin(ang);
    return `${x},${y}`;
  }).join(' ');

  // Compute polygon points for drug 2
  const points2 = categories.map((cat, i) => {
    const val = (drug2[cat.key] || 65) / 100;
    const ang = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const x = center + radius * val * Math.cos(ang);
    const y = center + radius * val * Math.sin(ang);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
            Drug vs Drug Comparison
          </h4>
          <p className="text-[11px] text-slate-400">
            Compare multiple drugs based on efficacy, safety and interaction profile.
          </p>
        </div>
        <button
          onClick={onCompareClick}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"
        >
          <span>Compare</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SVG Radar Visualization */}
      <div className="relative flex items-center justify-center my-3">
        <svg width={size} height={size} className="overflow-visible">
          {/* Background Concentric Webs */}
          {[0.25, 0.5, 0.75, 1.0].map((level, idx) => {
            const webPoints = categories.map((_, i) => {
              const ang = (i * 2 * Math.PI) / 5 - Math.PI / 2;
              const x = center + radius * level * Math.cos(ang);
              const y = center + radius * level * Math.sin(ang);
              return `${x},${y}`;
            }).join(' ');
            return (
              <polygon
                key={idx}
                points={webPoints}
                fill="none"
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="1"
              />
            );
          })}

          {/* Radial Axis Spokes */}
          {categories.map((cat, i) => {
            const ang = (i * 2 * Math.PI) / 5 - Math.PI / 2;
            const x = center + radius * Math.cos(ang);
            const y = center + radius * Math.sin(ang);
            const labelX = center + (radius + 24) * Math.cos(ang);
            const labelY = center + (radius + 24) * Math.sin(ang);

            return (
              <g key={i}>
                <line
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-800"
                  strokeWidth="1"
                />
                <text
                  x={labelX}
                  y={labelY}
                  fontSize="10"
                  fontWeight="500"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-slate-500 dark:fill-slate-400 font-sans"
                >
                  {cat.label}
                </text>
              </g>
            );
          })}

          {/* Drug 1 Polygon (Blue) */}
          <polygon
            points={points1}
            fill="rgba(59, 130, 246, 0.25)"
            stroke="#3B82F6"
            strokeWidth="2"
          />

          {/* Drug 2 Polygon (Purple) */}
          <polygon
            points={points2}
            fill="rgba(139, 92, 246, 0.2)"
            stroke="#8B5CF6"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
        </svg>
      </div>

      {/* Legend Matching Reference Screenshot */}
      <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
          <span className="font-medium text-slate-700 dark:text-slate-300">{drug1.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
          <span className="font-medium text-slate-700 dark:text-slate-300">{drug2.name}</span>
        </div>
      </div>
    </div>
  );
}
