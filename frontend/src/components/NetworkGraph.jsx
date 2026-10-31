import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Share2, Info } from 'lucide-react';

export default function NetworkGraph({ 
  data, 
  onNodeClick, 
  height = 420,
  showSummary = true 
}) {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const draggedNodeRef = useRef(null);

  // Initialize node layout with force or radial coordinates
  useEffect(() => {
    if (!data || !data.nodes || data.nodes.length === 0) {
      // Default TP53 network fallback matching reference screenshot
      const defaultNodes = [
        { id: 'gene_tp53', label: 'TP53', type: 'gene', color: '#8B5CF6', size: 36, x: 260, y: 210 },
        // Drugs
        { id: 'drug_cisplatin', label: 'Cisplatin', type: 'drug', color: '#10B981', size: 22, x: 260, y: 70 },
        { id: 'drug_doxorubicin', label: 'Doxorubicin', type: 'drug', color: '#10B981', size: 22, x: 140, y: 120 },
        { id: 'drug_gemcitabine', label: 'Gemcitabine', type: 'drug', color: '#10B981', size: 22, x: 100, y: 220 },
        { id: 'drug_paclitaxel', label: 'Paclitaxel', type: 'drug', color: '#10B981', size: 22, x: 140, y: 310 },
        { id: 'drug_5fu', label: '5-FU', type: 'drug', color: '#10B981', size: 22, x: 230, y: 360 },
        // Diseases
        { id: 'dis_breast', label: 'Breast Cancer', type: 'disease', color: '#6366F1', size: 24, x: 380, y: 110 },
        { id: 'dis_lung', label: 'Lung Cancer', type: 'disease', color: '#6366F1', size: 24, x: 420, y: 190 },
        { id: 'dis_colorectal', label: 'Colorectal Cancer', type: 'disease', color: '#6366F1', size: 24, x: 430, y: 280 },
        { id: 'dis_ovarian', label: 'Ovarian Cancer', type: 'disease', color: '#6366F1', size: 24, x: 370, y: 350 }
      ];

      const defaultEdges = [
        { source: 'gene_tp53', target: 'drug_cisplatin', label: 'DNA Crosslinker' },
        { source: 'gene_tp53', target: 'drug_doxorubicin', label: 'Topo II Inhibitor' },
        { source: 'gene_tp53', target: 'drug_gemcitabine', label: 'Metabolic Inhibitor' },
        { source: 'gene_tp53', target: 'drug_paclitaxel', label: 'Microtubule Binder' },
        { source: 'gene_tp53', target: 'drug_5fu', label: 'TS Inhibitor' },
        { source: 'gene_tp53', target: 'dis_breast', label: 'Implicated' },
        { source: 'gene_tp53', target: 'dis_lung', label: 'Implicated' },
        { source: 'gene_tp53', target: 'dis_colorectal', label: 'Implicated' },
        { source: 'gene_tp53', target: 'dis_ovarian', label: 'Implicated' }
      ];

      setNodes(defaultNodes);
      setEdges(defaultEdges);
      return;
    }

    // Layout incoming graph in radial cluster
    const cx = 260;
    const cy = 210;
    const computedNodes = data.nodes.map((node, i) => {
      if (node.type === 'gene' && i === 0) {
        return { ...node, x: cx, y: cy };
      }
      // Distribute radially
      const angle = (i / (data.nodes.length - 1)) * 2 * Math.PI;
      const radius = node.type === 'disease' ? 170 : 130;
      return {
        ...node,
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle)
      };
    });

    setNodes(computedNodes);
    setEdges(data.edges || []);
  }, [data]);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(scale, scale);

    // Draw edges
    edges.forEach(edge => {
      const sNode = nodes.find(n => n.id === edge.source);
      const tNode = nodes.find(n => n.id === edge.target);
      if (!sNode || !tNode) return;

      ctx.beginPath();
      ctx.moveTo(sNode.x, sNode.y);
      ctx.lineTo(tNode.x, tNode.y);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw small directional dash
      const mx = (sNode.x + tNode.x) / 2;
      const my = (sNode.y + tNode.y) / 2;
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(mx, my, 2.5, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw nodes
    nodes.forEach(node => {
      const isHovered = hoveredNode && hoveredNode.id === node.id;
      const size = isHovered ? node.size + 4 : node.size;

      // Outer glow
      if (isHovered) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, size + 6, 0, 2 * Math.PI);
        ctx.fillStyle = node.color + '33';
        ctx.fill();
      }

      // Main Node Circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Node label
      ctx.font = node.type === 'gene' ? 'bold 12px Inter, sans-serif' : '500 10px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);

      // Sub-label below node for clarity
      if (node.type !== 'gene') {
        ctx.font = '500 9px Inter, sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText(node.label, node.x, node.y + size + 11);
      }
    });

    ctx.restore();
  }, [nodes, edges, pan, scale, hoveredNode]);

  // Mouse interaction handlers
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left - pan.x) / scale;
    const my = (e.clientY - rect.top - pan.y) / scale;

    const clicked = nodes.find(n => Math.hypot(n.x - mx, n.y - my) <= n.size);
    if (clicked) {
      draggedNodeRef.current = clicked;
      if (onNodeClick) onNodeClick(clicked);
    } else {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left - pan.x) / scale;
    const my = (e.clientY - rect.top - pan.y) / scale;

    if (draggedNodeRef.current) {
      setNodes(prev => prev.map(n => 
        n.id === draggedNodeRef.current.id ? { ...n, x: mx, y: my } : n
      ));
      return;
    }

    if (isDraggingRef.current) {
      setPan({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y
      });
      return;
    }

    const hover = nodes.find(n => Math.hypot(n.x - mx, n.y - my) <= n.size);
    setHoveredNode(hover || null);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    draggedNodeRef.current = null;
  };

  const resetView = () => {
    setScale(1.0);
    setPan({ x: 0, y: 0 });
  };

  const summary = data?.summary || {
    central_entity: 'TP53',
    connected_drugs: 48,
    related_diseases: 12,
    primary_interaction_type: 'Binding / Regulation'
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      {/* Interactive Network Graph Viewport */}
      <div className="relative flex-1 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-4 shadow-sm overflow-hidden">
        {/* Controls Overlay */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
          <button 
            onClick={() => setScale(s => Math.min(2.0, s + 0.15))}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setScale(s => Math.max(0.5, s - 0.15))}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button 
            onClick={resetView}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300 shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
            <span>Gene</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            <span>Drug</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1]" />
            <span>Disease</span>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={540}
          height={height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-auto cursor-grab active:cursor-grabbing block"
        />
      </div>

      {/* Network Summary Panel (Matches Reference Screenshot) */}
      {showSummary && (
        <div className="lg:w-64 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800/80">
              Network Summary
            </h4>
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium block mb-1">Central Target</span>
                <span className="font-bold text-slate-900 dark:text-white text-base">
                  {summary.central_entity || 'TP53'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block mb-1">Connected Drugs</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm">
                  {summary.connected_drugs || 48} Candidates
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block mb-1">Related Diseases</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400 text-sm">
                  {summary.related_diseases || 12} Indications
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block mb-1">Interaction Type</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400 text-sm">
                  {summary.primary_interaction_type || 'Binding / Regulation'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400">
            Interactive topology visualization. Drag nodes to explore cluster affinities.
          </div>
        </div>
      )}
    </div>
  );
}
