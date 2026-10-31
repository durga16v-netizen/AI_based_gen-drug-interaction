import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, Rotate3d, Eye, Sliders, Box, Download, Check } from 'lucide-react';

export default function MoleculeViewer({ 
  drugName = 'Aspirin', 
  cid = 2244,
  formula = 'C9H8O4',
  mw = 180.16,
  smiles = 'CC(=O)OC1=CC=CC=C1C(=O)O',
  height = 240
}) {
  const [activeTab, setActiveTab] = useState('3d'); // '3d', '2d', 'props'
  const [autoRotate, setAutoRotate] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  // Rotation angles for 3D ball-and-stick rendering
  const angleRef = useRef({ x: 0.3, y: 0.4, z: 0 });
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // 3D coordinates for Aspirin (or generic molecule)
  // [x, y, z, element, radius]
  const atoms = [
    // Benzene ring carbons (black/gray)
    { x: -0.8, y: -0.2, z: 0.0, elem: 'C', color: '#334155', r: 12 },
    { x: -0.4, y: 0.9, z: 0.0, elem: 'C', color: '#334155', r: 12 },
    { x: 0.8, y: 1.1, z: 0.1, elem: 'C', color: '#334155', r: 12 },
    { x: 1.6, y: 0.2, z: 0.2, elem: 'C', color: '#334155', r: 12 },
    { x: 1.2, y: -0.9, z: 0.1, elem: 'C', color: '#334155', r: 12 },
    { x: 0.0, y: -1.1, z: 0.0, elem: 'C', color: '#334155', r: 12 },
    // Carboxylic group
    { x: 2.9, y: 0.4, z: 0.3, elem: 'C', color: '#334155', r: 12 },
    { x: 3.5, y: 1.3, z: 0.4, elem: 'O', color: '#EF4444', r: 14 },
    { x: 3.5, y: -0.6, z: 0.3, elem: 'O', color: '#EF4444', r: 14 },
    // Ester bridge
    { x: -1.2, y: 1.9, z: -0.1, elem: 'O', color: '#EF4444', r: 14 },
    { x: -2.4, y: 1.6, z: -0.2, elem: 'C', color: '#334155', r: 12 },
    { x: -3.0, y: 2.6, z: -0.3, elem: 'O', color: '#EF4444', r: 14 },
    { x: -3.0, y: 0.3, z: -0.2, elem: 'C', color: '#334155', r: 12 },
    // Hydrogens (white/silver)
    { x: -1.7, y: -0.4, z: -0.1, elem: 'H', color: '#E2E8F0', r: 8 },
    { x: 1.1, y: 2.1, z: 0.2, elem: 'H', color: '#E2E8F0', r: 8 },
    { x: 1.8, y: -1.7, z: 0.1, elem: 'H', color: '#E2E8F0', r: 8 },
    { x: -0.3, y: -2.0, z: -0.1, elem: 'H', color: '#E2E8F0', r: 8 },
    { x: 4.4, y: -0.4, z: 0.4, elem: 'H', color: '#E2E8F0', r: 8 }
  ];

  // Atom connectivity bonds: [i, j]
  const bonds = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
    [3, 6], [6, 7], [6, 8],
    [1, 9], [9, 10], [10, 11], [10, 12],
    [0, 13], [2, 14], [4, 15], [5, 16], [8, 17]
  ];

  useEffect(() => {
    if (activeTab !== '3d') return;

    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      if (autoRotate && !isDraggingRef.current) {
        angleRef.current.y += 0.012;
        angleRef.current.x += 0.005;
      }

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const ax = angleRef.current.x;
      const ay = angleRef.current.y;
      const scale = isExpanded ? 52 : 36;
      const cx = w / 2;
      const cy = h / 2;

      // Project atoms into 2D with 3D rotation
      const projected = atoms.map((atom, idx) => {
        // Rotate Y
        let x1 = atom.x * Math.cos(ay) + atom.z * Math.sin(ay);
        let z1 = -atom.x * Math.sin(ay) + atom.z * Math.cos(ay);
        // Rotate X
        let y2 = atom.y * Math.cos(ax) - z1 * Math.sin(ax);
        let z2 = atom.y * Math.sin(ax) + z1 * Math.cos(ax);

        return {
          idx,
          x: cx + x1 * scale,
          y: cy - y2 * scale,
          z: z2,
          color: atom.color,
          r: atom.r * (isExpanded ? 1.3 : 1.0),
          elem: atom.elem
        };
      });

      // Sort by Z for correct depth buffering
      projected.sort((a, b) => a.z - b.z);

      // Draw bonds
      bonds.forEach(([i, j]) => {
        const p1 = projected.find(p => p.idx === i);
        const p2 = projected.find(p => p.idx === j);
        if (!p1 || !p2) return;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = isExpanded ? 4.5 : 3.5;
        ctx.lineCap = 'round';
        ctx.stroke();
      });

      // Draw atoms
      projected.forEach(atom => {
        const grad = ctx.createRadialGradient(
          atom.x - atom.r * 0.3, atom.y - atom.r * 0.3, atom.r * 0.1,
          atom.x, atom.y, atom.r
        );
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, atom.color);
        grad.addColorStop(1, '#0f172a');

        ctx.beginPath();
        ctx.arc(atom.x, atom.y, atom.r, 0, 2 * Math.PI);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#475569';
        ctx.stroke();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeTab, autoRotate, isExpanded]);

  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    angleRef.current.y += dx * 0.01;
    angleRef.current.x += dy * 0.01;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const copySmiles = () => {
    navigator.clipboard.writeText(smiles);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-4 shadow-sm flex flex-col justify-between ${
      isExpanded ? 'fixed inset-6 z-50 shadow-2xl flex flex-col' : ''
    }`}>
      {/* Header with Title and Fullscreen toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              {drugName}
            </h4>
            <span className="text-[11px] font-mono text-slate-400">
              (CID: {cid || '2244'})
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {formula} | {mw} g/mol
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? "Pause Rotation" : "Auto Rotate"}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ${
              autoRotate ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/60' : ''
            }`}
          >
            <Rotate3d className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Close" : "Expand Fullscreen"}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative flex-1 my-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl overflow-hidden flex items-center justify-center min-h-[200px]">
        {activeTab === '3d' && (
          <canvas
            ref={canvasRef}
            width={isExpanded ? 800 : 360}
            height={isExpanded ? 500 : height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="cursor-grab active:cursor-grabbing w-full h-full block"
          />
        )}

        {activeTab === '2d' && (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-36 h-36 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 p-2 shadow-inner flex items-center justify-center">
              <img
                src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?image_size=300x300`}
                alt={`${drugName} 2D Structure`}
                className="max-w-full max-h-full object-contain dark:invert-[0.88] dark:hue-rotate-180"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              2D Topological Skeletal Formula
            </div>
          </div>
        )}

        {activeTab === 'props' && (
          <div className="p-4 w-full h-full overflow-y-auto space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-400">Chemical Name:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{drugName}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-400">PubChem CID:</span>
              <span className="font-mono text-blue-600 dark:text-blue-400">{cid}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-400">Molecular Formula:</span>
              <span className="font-mono">{formula}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-400">Molecular Weight:</span>
              <span>{mw} g/mol</span>
            </div>
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1 text-[11px] text-slate-400">
                <span>Canonical SMILES:</span>
                <button 
                  onClick={copySmiles}
                  className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-sans"
                >
                  {copied ? <Check className="w-3 h-3" /> : null}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono text-[10px] break-all text-slate-700 dark:text-slate-300">
                {smiles}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Switcher Buttons (Matches Reference Screenshot) */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('3d')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === '3d'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D View</span>
          </button>
          <button
            onClick={() => setActiveTab('2d')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === '2d'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>2D View</span>
          </button>
          <button
            onClick={() => setActiveTab('props')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'props'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Properties</span>
          </button>
        </div>

        {isExpanded && (
          <button
            onClick={() => setIsExpanded(false)}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
          >
            Close Fullscreen
          </button>
        )}
      </div>
    </div>
  );
}
