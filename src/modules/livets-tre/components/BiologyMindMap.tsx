import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import {
  BIOLOGY_CENTER_NODE,
  BIOLOGY_DASHED_ARCS,
  BIOLOGY_HUB_NODES,
} from '../data/biologyHubData';
import type { ThemeId } from '../data/themes';

interface BiologyMindMapProps {
  onSelectTheme: (themeId: ThemeId) => void;
}

export function BiologyMindMap({ onSelectTheme }: BiologyMindMapProps) {
  const [hoveredId, setHoveredId] = useState<ThemeId | 'biologi' | null>(null);

  return (
    <div className="relative flex-1 min-h-0 w-full flex flex-col items-center justify-between px-2 py-2 sm:px-5 sm:py-3 lg:px-8 lg:py-4 max-w-[1680px] mx-auto select-none">
      {/* Top quick-jump pill bar */}
      <div className="w-full flex items-center justify-center pt-0.5 pb-1 shrink-0">
        <div className="inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/75 text-[11px] sm:text-xs text-slate-300 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
          <span>Biologi-temaer:</span>
          {BIOLOGY_HUB_NODES.map((n, idx) => (
            <span key={n.id} className="inline-flex items-center">
              <button
                type="button"
                onClick={() => onSelectTheme(n.id)}
                style={{ color: n.accentHex }}
                className="font-bold hover:underline underline-offset-2 cursor-pointer"
              >
                {n.order}. {n.title}
              </button>
              {idx < BIOLOGY_HUB_NODES.length - 1 && (
                <span className="text-slate-500 ml-1">•</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Interactive SVG Mindmap */}
      <div className="flex-1 min-h-0 w-full flex items-center justify-center">
        <svg
          id="biology-mindmap-svg"
          viewBox="90 15 900 720"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full max-h-[calc(100vh-11rem)] max-w-[1160px] overflow-visible drop-shadow-[0_16px_45px_rgba(0,0,0,0.55)]"
          role="img"
          aria-label="Tankekart over Biologi med seks tilknyttede temaer"
        >
          <defs>
            <clipPath id="clip-bio-center">
              <circle
                cx={BIOLOGY_CENTER_NODE.cx}
                cy={BIOLOGY_CENTER_NODE.cy}
                r={BIOLOGY_CENTER_NODE.r}
              />
            </clipPath>

            {BIOLOGY_HUB_NODES.map((node) => (
              <clipPath key={node.id} id={`clip-bio-${node.id}`}>
                <circle cx={node.cx} cy={node.cy} r={node.r} />
              </clipPath>
            ))}

            <radialGradient id="bio-scrim-center" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#091814" stopOpacity="0.62" />
              <stop offset="65%" stopColor="#0B1813" stopOpacity="0.40" />
              <stop offset="100%" stopColor="#07111A" stopOpacity="0.65" />
            </radialGradient>

            <radialGradient id="bio-scrim-satellite" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#050B18" stopOpacity="0.68" />
              <stop offset="60%" stopColor="#071022" stopOpacity="0.40" />
              <stop offset="100%" stopColor="#050914" stopOpacity="0.62" />
            </radialGradient>

            <radialGradient id="bio-glow-center" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.28" />
              <stop offset="65%" stopColor="#38BDF8" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#07111A" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Dashed outer progression arcs */}
          <g aria-hidden="true">
            {BIOLOGY_DASHED_ARCS.map((arc) => {
              const isHighlighted =
                hoveredId === arc.from || hoveredId === arc.to;
              return (
                <path
                  key={arc.id}
                  d={arc.d}
                  fill="none"
                  stroke={isHighlighted ? '#34D399' : '#334155'}
                  strokeWidth={isHighlighted ? 2.5 : 1.75}
                  strokeDasharray="6 6"
                  className="transition-colors duration-300"
                />
              );
            })}
          </g>

          {/* Radial spokes from Biologi center to each topic */}
          <g aria-hidden="true">
            {BIOLOGY_HUB_NODES.map((node) => {
              const isHighlighted =
                hoveredId === node.id || hoveredId === 'biologi';
              return (
                <line
                  key={`spoke-${node.id}`}
                  x1={BIOLOGY_CENTER_NODE.cx}
                  y1={BIOLOGY_CENTER_NODE.cy}
                  x2={node.cx}
                  y2={node.cy}
                  stroke={isHighlighted ? node.accentHex : '#475569'}
                  strokeOpacity={isHighlighted ? 0.85 : 0.45}
                  strokeWidth={isHighlighted ? 3 : 2}
                  className="transition-all duration-300"
                />
              );
            })}
          </g>

          {/* Center Biologi Node */}
          <g
            onMouseEnter={() => setHoveredId('biologi')}
            onMouseLeave={() => setHoveredId(null)}
            className="cursor-default"
          >
            <circle
              cx={BIOLOGY_CENTER_NODE.cx}
              cy={BIOLOGY_CENTER_NODE.cy}
              r={BIOLOGY_CENTER_NODE.r + 36}
              fill="url(#bio-glow-center)"
            />
            <image
              href={BIOLOGY_CENTER_NODE.imageUrl}
              x={BIOLOGY_CENTER_NODE.cx - BIOLOGY_CENTER_NODE.r}
              y={BIOLOGY_CENTER_NODE.cy - BIOLOGY_CENTER_NODE.r}
              width={BIOLOGY_CENTER_NODE.r * 2}
              height={BIOLOGY_CENTER_NODE.r * 2}
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#clip-bio-center)"
            />
            <circle
              cx={BIOLOGY_CENTER_NODE.cx}
              cy={BIOLOGY_CENTER_NODE.cy}
              r={BIOLOGY_CENTER_NODE.r}
              fill="url(#bio-scrim-center)"
            />
            <circle
              cx={BIOLOGY_CENTER_NODE.cx}
              cy={BIOLOGY_CENTER_NODE.cy}
              r={BIOLOGY_CENTER_NODE.r}
              fill="none"
              stroke={BIOLOGY_CENTER_NODE.accentHex}
              strokeWidth={3.5}
            />
            <text
              x={BIOLOGY_CENTER_NODE.cx}
              y={BIOLOGY_CENTER_NODE.cy - 6}
              textAnchor="middle"
              className="font-display fill-white text-[34px] font-extrabold tracking-tight"
            >
              {BIOLOGY_CENTER_NODE.title}
            </text>
            <text
              x={BIOLOGY_CENTER_NODE.cx}
              y={BIOLOGY_CENTER_NODE.cy + 22}
              textAnchor="middle"
              className="fill-emerald-300 text-[14px] font-semibold tracking-wide"
            >
              {BIOLOGY_CENTER_NODE.subtitle}
            </text>
          </g>

          {/* Satellite Topic Nodes */}
          {BIOLOGY_HUB_NODES.map((node) => {
            const isHovered = hoveredId === node.id;
            return (
              <g
                key={node.id}
                onClick={() => onSelectTheme(node.id)}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectTheme(node.id);
                  }
                }}
                aria-label={`Åpne ${node.title}: ${node.subtitle}`}
                className="cursor-pointer outline-none"
              >
                {isHovered && (
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r={node.r + 12}
                    fill={node.glowHex}
                    className="transition-opacity duration-200"
                  />
                )}

                <image
                  href={node.imageUrl}
                  x={node.cx - node.r}
                  y={node.cy - node.r}
                  width={node.r * 2}
                  height={node.r * 2}
                  preserveAspectRatio="xMidYMid slice"
                  clipPath={`url(#clip-bio-${node.id})`}
                />

                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={node.r}
                  fill="url(#bio-scrim-satellite)"
                />

                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={node.r}
                  fill="none"
                  stroke={node.accentHex}
                  strokeWidth={isHovered ? 4 : 2.5}
                  className="transition-all duration-200"
                />

                {/* Step number badge */}
                <circle
                  cx={node.cx}
                  cy={node.cy - node.r + 4}
                  r={14}
                  fill="#0B1120"
                  stroke={node.accentHex}
                  strokeWidth={2}
                />
                <text
                  x={node.cx}
                  y={node.cy - node.r + 9}
                  textAnchor="middle"
                  className="font-mono-time fill-white text-[12px] font-bold"
                >
                  {node.order}
                </text>

                <text
                  x={node.cx}
                  y={node.cy - 2}
                  textAnchor="middle"
                  className="font-display fill-white text-[18px] font-extrabold"
                >
                  {node.title}
                </text>
                <text
                  x={node.cx}
                  y={node.cy + 18}
                  textAnchor="middle"
                  className="fill-slate-200 text-[11px] font-medium"
                >
                  {node.subtitle}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
