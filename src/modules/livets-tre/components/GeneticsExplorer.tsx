import { Dna, Focus, Grid2x2, Maximize2, Minus, Plus, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GENETICS_NODES } from '../data/geneticsData';
import type { TreeNodeData } from '../data/treeOfLifeData';

interface GeneticsExplorerProps {
  unlockedStepIndex: number;
  showAllSteps: boolean;
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
}

interface NodePosition {
  x: number;
  y: number;
  labelSide: 'top' | 'bottom';
  phase: 'foundation' | 'inheritance' | 'prediction' | 'modern';
  tag: string;
}

const GENETICS_POSITIONS: Record<string, NodePosition> = {
  gen_alleles: {
    x: 240,
    y: 420,
    labelSide: 'bottom',
    phase: 'foundation',
    tag: '23 par • Lokus',
  },
  gen_genotype: {
    x: 540,
    y: 260,
    labelSide: 'top',
    phase: 'foundation',
    tag: 'AA / Aa / aa',
  },
  gen_dominant: {
    x: 840,
    y: 480,
    labelSide: 'bottom',
    phase: 'inheritance',
    tag: 'A > a',
  },
  gen_meiosis: {
    x: 1140,
    y: 260,
    labelSide: 'top',
    phase: 'inheritance',
    tag: '46 → 23',
  },
  gen_punnett: {
    x: 1460,
    y: 480,
    labelSide: 'bottom',
    phase: 'prediction',
    tag: '3 : 1 (75/25%)',
  },
  gen_sex_linked: {
    x: 1760,
    y: 260,
    labelSide: 'top',
    phase: 'prediction',
    tag: 'XX / XY',
  },
  gen_env_epigenetics: {
    x: 2080,
    y: 480,
    labelSide: 'bottom',
    phase: 'modern',
    tag: 'Arv + miljø',
  },
  gen_crispr: {
    x: 2380,
    y: 320,
    labelSide: 'top',
    phase: 'modern',
    tag: 'CRISPR-Cas9',
  },
};

const PHASE_BANDS = [
  {
    id: 'foundation',
    x: 70,
    width: 635,
    title: '1. GRUNNLAGET',
    subtitle: 'Gener • Alleler • Fenotype',
    accent: '#A78BFA',
    bg: 'rgba(167, 139, 250, 0.055)',
  },
  {
    id: 'inheritance',
    x: 720,
    width: 585,
    title: '2. ARV & MEIOSE',
    subtitle: 'Dominant/Recessiv • 46 → 23',
    accent: '#38BDF8',
    bg: 'rgba(56, 189, 248, 0.05)',
  },
  {
    id: 'prediction',
    x: 1320,
    width: 605,
    title: '3. KRYSNING & KJØNN',
    subtitle: 'Punnett-kvadrat • XX / XY',
    accent: '#F472B6',
    bg: 'rgba(244, 114, 182, 0.05)',
  },
  {
    id: 'modern',
    x: 1940,
    width: 610,
    title: '4. SAMSPILL & TEKNOLOGI',
    subtitle: 'Epigenetikk • CRISPR-Cas9',
    accent: '#34D399',
    bg: 'rgba(52, 211, 153, 0.055)',
  },
];

function getPhaseColors(phase: NodePosition['phase']) {
  switch (phase) {
    case 'foundation':
      return {
        accent: '#A78BFA',
        stroke: '#DDD6FE',
        badgeBg: 'rgba(76, 29, 149, 0.9)',
        badgeBorder: 'rgba(167, 139, 250, 0.55)',
        text: '#EDE9FE',
      };
    case 'inheritance':
      return {
        accent: '#38BDF8',
        stroke: '#BAE6FD',
        badgeBg: 'rgba(12, 74, 110, 0.9)',
        badgeBorder: 'rgba(56, 189, 248, 0.55)',
        text: '#E0F2FE',
      };
    case 'prediction':
      return {
        accent: '#F472B6',
        stroke: '#FBCFE8',
        badgeBg: 'rgba(131, 24, 67, 0.9)',
        badgeBorder: 'rgba(244, 114, 182, 0.55)',
        text: '#FCE7F3',
      };
    case 'modern':
    default:
      return {
        accent: '#34D399',
        stroke: '#A7F3D0',
        badgeBg: 'rgba(6, 78, 59, 0.9)',
        badgeBorder: 'rgba(52, 211, 153, 0.55)',
        text: '#D1FAE5',
      };
  }
}

function buildCurvePath(a: NodePosition, b: NodePosition): string {
  const dx = b.x - a.x;
  const c1x = a.x + dx * 0.45;
  const c2x = b.x - dx * 0.45;
  return `M ${a.x} ${a.y} C ${c1x} ${a.y}, ${c2x} ${b.y}, ${b.x} ${b.y}`;
}

interface PunnettPreset {
  id: string;
  label: string;
  p1: [string, string];
  p2: [string, string];
  summary: string;
}

const PUNNETT_PRESETS: PunnettPreset[] = [
  {
    id: 'hetero',
    label: 'Aa × Aa (begge bærere)',
    p1: ['A', 'a'],
    p2: ['A', 'a'],
    summary: '75 % dominant (AA/Aa) • 25 % recessiv (aa)',
  },
  {
    id: 'testcross',
    label: 'Aa × aa (testkrysning)',
    p1: ['A', 'a'],
    p2: ['a', 'a'],
    summary: '50 % dominant (Aa) • 50 % recessiv (aa)',
  },
  {
    id: 'uniform',
    label: 'AA × aa (renlinjer)',
    p1: ['A', 'A'],
    p2: ['a', 'a'],
    summary: '100 % heterozygote (Aa) med dominant fenotype',
  },
  {
    id: 'sex',
    label: 'XX × XY (kjønnskromosomer)',
    p1: ['X', 'X'],
    p2: ['X', 'Y'],
    summary: '50 % XX (jente) • 50 % XY (gutt)',
  },
];

function formatPair(a: string, b: string): string {
  if (a === 'Y' && b === 'X') return 'XY';
  if (a === 'X' && b === 'Y') return 'XY';
  if (a === 'a' && b === 'A') return 'Aa';
  return `${a}${b}`;
}

export function GeneticsExplorer({
  unlockedStepIndex,
  showAllSteps,
  selectedNodeId,
  onSelectNode,
}: GeneticsExplorerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cameraMode, setCameraMode] = useState<'follow' | 'overview' | 'manual'>(
    'follow',
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [punnettOpen, setPunnettOpen] = useState(false);
  const [presetIdx, setPresetIdx] = useState(0);

  const [viewBox, setViewBox] = useState({
    x: 40,
    y: 40,
    w: 1120,
    h: 680,
  });

  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  }>({ active: false, startX: 0, startY: 0, origX: 0, origY: 0 });

  const orderedNodes = useMemo(
    () => [...GENETICS_NODES].sort((a, b) => a.stepIndex - b.stepIndex),
    [],
  );

  const maxVisibleStep = showAllSteps
    ? orderedNodes.length - 1
    : unlockedStepIndex;

  useEffect(() => {
    if (selectedNodeId === 'gen_punnett') {
      setPunnettOpen(true);
    }
  }, [selectedNodeId]);

  // Camera tracking
  useEffect(() => {
    if (cameraMode === 'manual') return;

    if (cameraMode === 'overview') {
      setViewBox({ x: 40, y: 40, w: 2540, h: 680 });
      return;
    }

    const pos = GENETICS_POSITIONS[selectedNodeId];
    if (!pos) return;

    const targetW = 1080;
    const targetH = 660;
    const clampedX = Math.max(40, Math.min(2580 - targetW, pos.x - targetW * 0.45));
    const clampedY = Math.max(30, Math.min(720 - targetH, pos.y - targetH * 0.48));
    setViewBox({ x: clampedX, y: clampedY, w: targetW, h: targetH });
  }, [cameraMode, selectedNodeId]);

  const handleZoom = useCallback((factor: number) => {
    setCameraMode('manual');
    setViewBox((prev) => {
      const nextW = Math.max(540, Math.min(2600, prev.w * factor));
      const nextH = Math.max(340, Math.min(1600, prev.h * factor));
      const cx = prev.x + prev.w / 2;
      const cy = prev.y + prev.h / 2;
      return {
        x: cx - nextW / 2,
        y: cy - nextH / 2,
        w: nextW,
        h: nextH,
      };
    });
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent<SVGSVGElement>) => {
      e.preventDefault();
      handleZoom(e.deltaY > 0 ? 1.1 : 0.9);
    },
    [handleZoom],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if ((e.target as HTMLElement).closest('[data-node-interactive="true"]')) {
        return;
      }
      dragRef.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        origX: viewBox.x,
        origY: viewBox.y,
      };
      (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
    },
    [viewBox.x, viewBox.y],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!dragRef.current.active || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scaleX = viewBox.w / rect.width;
      const scaleY = viewBox.h / rect.height;
      const dx = (e.clientX - dragRef.current.startX) * scaleX;
      const dy = (e.clientY - dragRef.current.startY) * scaleY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        setCameraMode('manual');
      }
      setViewBox((prev) => ({
        ...prev,
        x: dragRef.current.origX - dx,
        y: dragRef.current.origY - dy,
      }));
    },
    [viewBox.h, viewBox.w],
  );

  const handlePointerUp = useCallback(() => {
    dragRef.current.active = false;
  }, []);

  const activePreset = PUNNETT_PRESETS[presetIdx];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full rounded-2xl border border-slate-800/90 bg-[#070D19] overflow-hidden shadow-2xl select-none"
    >
      {/* Top-left theme badge */}
      <div className="pointer-events-none absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/85 border border-violet-400/35 backdrop-blur-md">
        <Dna className="w-4 h-4 text-violet-300" />
        <span className="text-xs font-bold text-violet-100">
          Genetikk & Arvelighetskart
        </span>
      </div>

      {/* Top-right camera & Punnett controls */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setPunnettOpen((prev) => !prev)}
          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
            punnettOpen
              ? 'bg-pink-500 text-slate-950 border-pink-300 shadow-[0_0_16px_rgba(244,114,182,0.45)]'
              : 'bg-slate-900/85 text-pink-200 border-pink-400/40 hover:bg-slate-800'
          }`}
          title="Åpne interaktivt krysningsskjema"
        >
          <Grid2x2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Krysningsskjema</span>
        </button>

        <button
          type="button"
          onClick={() => setCameraMode('follow')}
          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
            cameraMode === 'follow'
              ? 'bg-violet-400 text-slate-950 border-violet-300'
              : 'bg-slate-900/85 text-slate-300 border-slate-700 hover:bg-slate-800'
          }`}
          title="Følg aktivt steg"
        >
          <Focus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Følg</span>
        </button>

        <button
          type="button"
          onClick={() => setCameraMode('overview')}
          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
            cameraMode === 'overview'
              ? 'bg-violet-400 text-slate-950 border-violet-300'
              : 'bg-slate-900/85 text-slate-300 border-slate-700 hover:bg-slate-800'
          }`}
          title="Vis hele arvelighetskartet"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Oversikt</span>
        </button>

        <div className="hidden sm:flex items-center bg-slate-900/85 border border-slate-700 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => handleZoom(0.85)}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
            title="Zoom inn"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom(1.18)}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 border-l border-slate-700 cursor-pointer"
            title="Zoom ut"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Mini Punnett Square Simulator */}
      {punnettOpen && (
        <div className="absolute bottom-3 left-3 z-20 w-[min(92vw,310px)] p-3.5 rounded-2xl bg-slate-950/92 border border-pink-400/45 backdrop-blur-md shadow-2xl space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-pink-200">
              <Grid2x2 className="w-4 h-4 text-pink-300" />
              <span>Krysningsskjema (Punnett)</span>
            </div>
            <button
              type="button"
              onClick={() => setPunnettOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              aria-label="Lukk krysningsskjema"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-1">
            {PUNNETT_PRESETS.map((preset, idx) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setPresetIdx(idx)}
                className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                  idx === presetIdx
                    ? 'bg-pink-500/25 border-pink-400 text-pink-100'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                {preset.label.split(' ')[0]} {preset.label.split(' ')[1]}{' '}
                {preset.label.split(' ')[2]}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-1 text-center font-mono-time text-xs">
            <div className="p-1.5 rounded bg-slate-900/60 text-slate-500 text-[10px] flex items-center justify-center">
              Mor \ Far
            </div>
            <div className="p-1.5 rounded bg-violet-500/20 border border-violet-400/30 text-violet-200 font-bold">
              {activePreset.p1[0]}
            </div>
            <div className="p-1.5 rounded bg-violet-500/20 border border-violet-400/30 text-violet-200 font-bold">
              {activePreset.p1[1]}
            </div>

            <div className="p-1.5 rounded bg-sky-500/20 border border-sky-400/30 text-sky-200 font-bold">
              {activePreset.p2[0]}
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-700 text-white font-bold">
              {formatPair(activePreset.p1[0], activePreset.p2[0])}
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-700 text-white font-bold">
              {formatPair(activePreset.p1[1], activePreset.p2[0])}
            </div>

            <div className="p-1.5 rounded bg-sky-500/20 border border-sky-400/30 text-sky-200 font-bold">
              {activePreset.p2[1]}
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-700 text-white font-bold">
              {formatPair(activePreset.p1[0], activePreset.p2[1])}
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-700 text-white font-bold">
              {formatPair(activePreset.p1[1], activePreset.p2[1])}
            </div>
          </div>

          <p className="text-[11px] text-emerald-300 font-semibold leading-snug">
            {activePreset.summary}
          </p>
        </div>
      )}

      {/* Main interactive SVG */}
      <svg
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        role="img"
        aria-label="Interaktivt arvelighetskart for genetikk"
      >
        <defs>
          <pattern
            id="gen-grid"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="rgba(148, 163, 184, 0.06)"
              strokeWidth="1"
            />
          </pattern>

          <linearGradient id="gen-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="35%" stopColor="#38BDF8" />
            <stop offset="70%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>

          {orderedNodes.map((node) => {
            const pos = GENETICS_POSITIONS[node.id];
            if (!pos) return null;
            return (
              <clipPath key={`clip-${node.id}`} id={`clip-gen-${node.id}`}>
                <circle cx={pos.x} cy={pos.y} r={54} />
              </clipPath>
            );
          })}
        </defs>

        {/* Subtle grid background */}
        <rect x="-200" y="-200" width="3200" height="1400" fill="url(#gen-grid)" />

        {/* Phase bands */}
        {PHASE_BANDS.map((band) => (
          <g key={band.id}>
            <rect
              x={band.x}
              y={75}
              width={band.width}
              height={595}
              rx={22}
              fill={band.bg}
              stroke={band.accent}
              strokeOpacity={0.22}
              strokeWidth={1.5}
            />
            <text
              x={band.x + 22}
              y={112}
              fill={band.accent}
              fontSize={14}
              fontWeight={800}
              letterSpacing="0.08em"
            >
              {band.title}
            </text>
            <text
              x={band.x + 22}
              y={134}
              fill="#94A3B8"
              fontSize={12}
              fontWeight={500}
            >
              {band.subtitle}
            </text>
          </g>
        ))}

        {/* Connecting genetic-flow curves */}
        {orderedNodes.slice(0, -1).map((node, idx) => {
          const nextNode = orderedNodes[idx + 1];
          const a = GENETICS_POSITIONS[node.id];
          const b = GENETICS_POSITIONS[nextNode.id];
          if (!a || !b) return null;

          const unlocked = nextNode.stepIndex <= maxVisibleStep;
          const pathD = buildCurvePath(a, b);

          return (
            <g key={`edge-${node.id}-${nextNode.id}`}>
              <path
                d={pathD}
                fill="none"
                stroke={unlocked ? 'url(#gen-line-grad)' : '#334155'}
                strokeWidth={unlocked ? 4.5 : 2.5}
                strokeOpacity={unlocked ? 0.85 : 0.4}
                strokeDasharray={unlocked ? undefined : '8 8'}
              />
            </g>
          );
        })}

        {/* Node circles */}
        {orderedNodes.map((node: TreeNodeData) => {
          const pos = GENETICS_POSITIONS[node.id];
          if (!pos) return null;
          const colors = getPhaseColors(pos.phase);
          const isUnlocked = node.stepIndex <= maxVisibleStep;
          const isSelected = node.id === selectedNodeId;
          const isHovered = node.id === hoveredId;

          const labelY = pos.labelSide === 'top' ? pos.y - 76 : pos.y + 84;
          const tagY = pos.labelSide === 'top' ? pos.y - 98 : pos.y + 105;

          return (
            <g
              key={node.id}
              data-node-interactive="true"
              onClick={() => isUnlocked && onSelectNode(node.id)}
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={
                isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-45'
              }
            >
              {(isSelected || isHovered) && isUnlocked && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={66}
                  fill="none"
                  stroke={colors.accent}
                  strokeWidth={isSelected ? 3 : 2}
                  strokeOpacity={isSelected ? 0.85 : 0.45}
                />
              )}

              <circle
                cx={pos.x}
                cy={pos.y}
                r={56}
                fill="#0B1120"
                stroke={isSelected ? colors.stroke : colors.accent}
                strokeWidth={isSelected ? 4 : 2.5}
              />

              <image
                href={node.image}
                x={pos.x - 54}
                y={pos.y - 54}
                width={108}
                height={108}
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#clip-gen-${node.id})`}
              />

              {/* Step badge */}
              <circle
                cx={pos.x - 40}
                cy={pos.y - 40}
                r={15}
                fill="#0B1120"
                stroke={colors.accent}
                strokeWidth={2.5}
              />
              <text
                x={pos.x - 40}
                y={pos.y - 35}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize={12}
                fontWeight={800}
              >
                {node.stepNumber}
              </text>

              {/* Node title */}
              <text
                x={pos.x}
                y={labelY}
                textAnchor="middle"
                fill="#F8FAFC"
                fontSize={15}
                fontWeight={800}
              >
                {node.shortLabel}
              </text>

              {/* Genotype/tag pill */}
              <text
                x={pos.x}
                y={tagY}
                textAnchor="middle"
                fill={colors.accent}
                fontSize={11.5}
                fontWeight={700}
              >
                {pos.tag}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
