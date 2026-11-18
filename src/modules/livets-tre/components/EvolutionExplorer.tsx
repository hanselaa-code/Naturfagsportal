import { Dna, Focus, Maximize2, Minus, Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EVOLUTION_NODES } from '../data/evolutionData';
import type { TreeNodeData } from '../data/treeOfLifeData';

interface EvolutionExplorerProps {
  unlockedStepIndex: number;
  showAllSteps: boolean;
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
}

interface NodePosition {
  x: number;
  y: number;
  labelSide: 'top' | 'bottom';
  phase: 'origin' | 'drivers' | 'examples' | 'evidence';
}

const TIMELINE_POSITIONS: Record<string, NodePosition> = {
  evo_what: { x: 240, y: 420, labelSide: 'bottom', phase: 'origin' },
  evo_variation: { x: 540, y: 270, labelSide: 'top', phase: 'drivers' },
  evo_selection: { x: 840, y: 510, labelSide: 'bottom', phase: 'drivers' },
  evo_drift: { x: 1140, y: 270, labelSide: 'top', phase: 'drivers' },
  evo_examples: { x: 1460, y: 510, labelSide: 'bottom', phase: 'examples' },
  evo_antibiotics: { x: 1760, y: 270, labelSide: 'top', phase: 'examples' },
  evo_fossils: { x: 2080, y: 510, labelSide: 'bottom', phase: 'evidence' },
  evo_dna_speciation: { x: 2380, y: 340, labelSide: 'top', phase: 'evidence' },
};

const PHASE_BANDS = [
  {
    id: 'origin',
    x: 70,
    width: 340,
    title: '1. GRUNNIDÉ',
    subtitle: 'Populasjon & arv',
    accent: '#10B981',
    bg: 'rgba(16, 185, 129, 0.055)',
  },
  {
    id: 'drivers',
    x: 425,
    width: 865,
    title: '2. DRIVKREFTER',
    subtitle: 'Mutasjon • Utvalg • Drift',
    accent: '#38BDF8',
    bg: 'rgba(56, 189, 248, 0.05)',
  },
  {
    id: 'examples',
    x: 1305,
    width: 615,
    title: '3. EKSEMPLER I PRAKSIS',
    subtitle: 'Finker • Målere • Resistens',
    accent: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.055)',
  },
  {
    id: 'evidence',
    x: 1935,
    width: 615,
    title: '4. HVORDAN VET VI DET?',
    subtitle: 'Fossiler • Anatomi • DNA',
    accent: '#2DD4BF',
    bg: 'rgba(45, 212, 191, 0.055)',
  },
];

function getPhaseColors(phase: NodePosition['phase']) {
  switch (phase) {
    case 'origin':
      return {
        accent: '#10B981',
        stroke: '#A7F3D0',
        badgeBg: 'rgba(6, 78, 59, 0.9)',
        badgeBorder: 'rgba(52, 211, 153, 0.55)',
        text: '#D1FAE5',
      };
    case 'drivers':
      return {
        accent: '#38BDF8',
        stroke: '#BAE6FD',
        badgeBg: 'rgba(12, 74, 110, 0.9)',
        badgeBorder: 'rgba(56, 189, 248, 0.55)',
        text: '#E0F2FE',
      };
    case 'examples':
      return {
        accent: '#F59E0B',
        stroke: '#FDE68A',
        badgeBg: 'rgba(120, 53, 15, 0.9)',
        badgeBorder: 'rgba(251, 191, 36, 0.55)',
        text: '#FEF3C7',
      };
    case 'evidence':
    default:
      return {
        accent: '#2DD4BF',
        stroke: '#99F6E4',
        badgeBg: 'rgba(19, 78, 74, 0.9)',
        badgeBorder: 'rgba(45, 212, 191, 0.55)',
        text: '#CCFBF1',
      };
  }
}

function buildCurvePath(a: NodePosition, b: NodePosition): string {
  const dx = b.x - a.x;
  const c1x = a.x + dx * 0.45;
  const c2x = b.x - dx * 0.45;
  return `M ${a.x} ${a.y} C ${c1x} ${a.y}, ${c2x} ${b.y}, ${b.x} ${b.y}`;
}

export function EvolutionExplorer({
  unlockedStepIndex,
  showAllSteps,
  selectedNodeId,
  onSelectNode,
}: EvolutionExplorerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [viewport, setViewport] = useState({ width: 960, height: 680 });
  const [camera, setCamera] = useState({ x: 460, y: 400, scale: 0.92 });
  const [cameraMode, setCameraMode] = useState<'follow' | 'overview' | 'manual'>('follow');
  const [isDragging, setIsDragging] = useState(false);

  const dragRef = useRef<{
    startX: number;
    startY: number;
    camX: number;
    camY: number;
    moved: boolean;
  } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setViewport({ width: rect.width, height: rect.height });
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const nodesWithPos = useMemo(
    () =>
      EVOLUTION_NODES.map((n) => ({
        node: n,
        pos: TIMELINE_POSITIONS[n.id] ?? {
          x: n.x,
          y: n.y,
          labelSide: 'bottom' as const,
          phase: 'origin' as const,
        },
      })),
    [],
  );

  const computeOverviewCamera = useCallback(() => {
    const worldW = 2580;
    const worldH = 740;
    const fitScale = Math.min(
      (viewport.width * 0.94) / worldW,
      (viewport.height * 0.9) / worldH,
    );
    return {
      x: 1310,
      y: 390,
      scale: Math.max(0.26, Math.min(0.9, fitScale)),
    };
  }, [viewport.height, viewport.width]);

  const computeFollowCamera = useCallback(
    (nodeId: string) => {
      const pos = TIMELINE_POSITIONS[nodeId] ?? TIMELINE_POSITIONS.evo_what;
      const baseScale = viewport.width < 640 ? 0.62 : viewport.width < 1024 ? 0.78 : 0.95;
      return {
        x: Math.max(360, Math.min(2260, pos.x + 80)),
        y: pos.y,
        scale: baseScale,
      };
    },
    [viewport.width],
  );

  useEffect(() => {
    if (cameraMode === 'overview') {
      setCamera(computeOverviewCamera());
    } else if (cameraMode === 'follow') {
      setCamera(computeFollowCamera(selectedNodeId));
    }
  }, [cameraMode, computeFollowCamera, computeOverviewCamera, selectedNodeId]);

  useEffect(() => {
    if (showAllSteps) {
      setCameraMode('overview');
    } else {
      setCameraMode('follow');
    }
  }, [showAllSteps]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setCameraMode('manual');
    const factor = e.deltaY > 0 ? 0.9 : 1.11;
    setCamera((prev) => ({
      ...prev,
      scale: Math.max(0.25, Math.min(1.65, prev.scale * factor)),
    }));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      camX: camera.x,
      camY: camera.y,
      moved: false,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      dragRef.current.moved = true;
      setCameraMode('manual');
    }
    setCamera((prev) => ({
      ...prev,
      x: dragRef.current!.camX - dx / prev.scale,
      y: dragRef.current!.camY - dy / prev.scale,
    }));
  };

  const handlePointerUp = () => {
    dragRef.current = null;
    setIsDragging(false);
  };

  const handleNodeClick = (node: TreeNodeData, isUnlocked: boolean) => {
    if (!isUnlocked) return;
    if (dragRef.current?.moved) return;
    onSelectNode(node.id);
    setCameraMode('follow');
  };

  const viewBoxW = viewport.width / camera.scale;
  const viewBoxH = viewport.height / camera.scale;
  const viewBoxX = camera.x - viewBoxW / 2;
  const viewBoxY = camera.y - viewBoxH / 2;

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={`relative h-full w-full overflow-hidden rounded-3xl glass-panel border border-slate-800/80 select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Top-left floating badge */}
      <div className="pointer-events-none absolute top-3.5 left-3.5 z-20 flex items-center gap-2 rounded-full border border-emerald-400/30 bg-slate-950/85 px-3 py-1.5 text-[11px] font-semibold text-emerald-200 shadow-lg backdrop-blur-md">
        <Dna className="h-3.5 w-3.5 text-emerald-400" />
        <span>Evolusjonstidslinje • 8 nøkkelsteg</span>
      </div>

      {/* Top-right zoom & camera controls */}
      <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5 rounded-2xl border border-slate-700/80 bg-slate-950/85 p-1 shadow-xl backdrop-blur-md">
        <button
          type="button"
          onClick={() => {
            setCameraMode('manual');
            setCamera((p) => ({ ...p, scale: Math.min(1.65, p.scale * 1.18) }));
          }}
          title="Zoom inn"
          className="rounded-xl p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setCameraMode('manual');
            setCamera((p) => ({ ...p, scale: Math.max(0.25, p.scale * 0.85) }));
          }}
          title="Zoom ut"
          className="rounded-xl p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="mx-0.5 h-4 w-px bg-slate-800" />
        <button
          type="button"
          onClick={() => setCameraMode('follow')}
          title="Fokus på valgt steg"
          className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-semibold cursor-pointer ${
            cameraMode === 'follow'
              ? 'bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/40'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Focus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Fokus</span>
        </button>
        <button
          type="button"
          onClick={() => setCameraMode('overview')}
          title="Oversikt over hele tidslinjen"
          className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-semibold cursor-pointer ${
            cameraMode === 'overview'
              ? 'bg-amber-500/20 text-amber-200 ring-1 ring-amber-400/40'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Maximize2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Oversikt</span>
        </button>
      </div>

      {/* Interactive SVG Canvas */}
      <svg
        viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxW} ${viewBoxH}`}
        className="h-full w-full transition-[viewBox] duration-500 ease-out"
        role="img"
        aria-label="Interaktiv tidslinje om hva evolusjon er"
      >
        <defs>
          {nodesWithPos.map(({ node, pos }) => {
            const isSelected = node.id === selectedNodeId;
            const r = isSelected ? 88 : 74;
            return (
              <clipPath key={`clip-${node.id}`} id={`evo-clip-${node.id}`}>
                <circle cx={pos.x} cy={pos.y} r={r} />
              </clipPath>
            );
          })}

          <linearGradient id="evo-stream-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="35%" stopColor="#38BDF8" />
            <stop offset="70%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#2DD4BF" />
          </linearGradient>

          <filter id="evo-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Phase Background Zones */}
        <g aria-hidden="true">
          {PHASE_BANDS.map((band) => (
            <g key={band.id}>
              <rect
                x={band.x}
                y={70}
                width={band.width}
                height={620}
                rx={28}
                fill={band.bg}
                stroke={band.accent}
                strokeOpacity={0.18}
                strokeWidth={1.5}
              />
              <text
                x={band.x + 24}
                y={108}
                fill={band.accent}
                className="font-mono-time text-[14px] font-bold tracking-widest"
              >
                {band.title}
              </text>
              <text
                x={band.x + 24}
                y={130}
                fill="#94A3B8"
                className="text-[13px] font-medium"
              >
                {band.subtitle}
              </text>
            </g>
          ))}
        </g>

        {/* 2. Curved Timeline Connections */}
        <g aria-hidden="true">
          {nodesWithPos.slice(0, -1).map((item, idx) => {
            const next = nodesWithPos[idx + 1];
            const pathD = buildCurvePath(item.pos, next.pos);
            const isSegmentUnlocked =
              showAllSteps || next.node.stepIndex <= unlockedStepIndex;

            return (
              <g key={`seg-${item.node.id}-${next.node.id}`}>
                {/* Base subtle track */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#1E293B"
                  strokeWidth={8}
                  strokeLinecap="round"
                />
                {isSegmentUnlocked ? (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="url(#evo-stream-grad)"
                    strokeWidth={5}
                    strokeLinecap="round"
                    filter="url(#evo-glow)"
                    className="animate-branch-draw"
                  />
                ) : (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#334155"
                    strokeWidth={3}
                    strokeDasharray="10 10"
                    strokeLinecap="round"
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* 3. Interactive Step Nodes */}
        {nodesWithPos.map(({ node, pos }) => {
          const isUnlocked = showAllSteps || node.stepIndex <= unlockedStepIndex;
          const isSelected = node.id === selectedNodeId;
          const palette = getPhaseColors(pos.phase);
          const r = isSelected ? 88 : 74;
          const labelY = pos.labelSide === 'top' ? pos.y - r - 22 : pos.y + r + 32;

          return (
            <g
              key={node.id}
              onClick={() => handleNodeClick(node, isUnlocked)}
              role="button"
              tabIndex={isUnlocked ? 0 : -1}
              aria-label={`Steg ${node.stepNumber}: ${node.title}`}
              className={
                isUnlocked ? 'cursor-pointer outline-none' : 'cursor-not-allowed opacity-40'
              }
            >
              {/* Pulse ring on active node */}
              {isSelected && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={r + 12}
                  fill="none"
                  stroke={palette.accent}
                  strokeWidth={3}
                  className="node-pulse-ring"
                />
              )}

              {/* Outer glow halo */}
              {isUnlocked && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={r + 6}
                  fill="none"
                  stroke={palette.accent}
                  strokeOpacity={isSelected ? 0.55 : 0.2}
                  strokeWidth={isSelected ? 6 : 3}
                />
              )}

              {/* Circular Nano Banana illustration */}
              <image
                href={node.image}
                x={pos.x - r}
                y={pos.y - r}
                width={r * 2}
                height={r * 2}
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#evo-clip-${node.id})`}
                style={{
                  filter: isUnlocked ? 'none' : 'grayscale(100%) brightness(0.45)',
                }}
              />

              {/* Crisp circular border */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={r}
                fill="none"
                stroke={isSelected ? '#FFFFFF' : isUnlocked ? palette.stroke : '#475569'}
                strokeWidth={isSelected ? 4 : 2.5}
              />

              {/* Step number badge */}
              <circle
                cx={pos.x - r * 0.72}
                cy={pos.y - r * 0.72}
                r={18}
                fill="#090E1A"
                stroke={palette.accent}
                strokeWidth={2.5}
              />
              <text
                x={pos.x - r * 0.72}
                y={pos.y - r * 0.72 + 6}
                textAnchor="middle"
                fill="#FFFFFF"
                className="font-mono-time text-[14px] font-bold"
              >
                {node.stepNumber}
              </text>

              {/* Node title & era pill */}
              <rect
                x={pos.x - 135}
                y={labelY - 22}
                width={270}
                height={52}
                rx={14}
                fill={isSelected ? palette.badgeBg : 'rgba(11, 17, 32, 0.92)'}
                stroke={isSelected ? palette.accent : 'rgba(71, 85, 105, 0.7)'}
                strokeWidth={isSelected ? 2 : 1.2}
              />
              <text
                x={pos.x}
                y={labelY}
                textAnchor="middle"
                fill="#FFFFFF"
                className="font-display text-[15px] font-bold"
              >
                {node.shortLabel}
              </text>
              <text
                x={pos.x}
                y={labelY + 19}
                textAnchor="middle"
                fill={palette.text}
                className="font-mono-time text-[11px] font-semibold"
              >
                {node.eraLabel} • {node.timeMa}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
