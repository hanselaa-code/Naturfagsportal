import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import {
  KARBON_CENTER_NODE,
  KARBON_DASHED_ARCS,
  KARBON_THEME_LIST,
  type KarbonThemeId,
} from '../data/karbonThemes';

interface KarbonHubProps {
  onSelectTheme: (themeId: KarbonThemeId) => void;
}

export function KarbonHub({ onSelectTheme }: KarbonHubProps) {
  const [hoveredId, setHoveredId] = useState<KarbonThemeId | 'karbon' | null>(
    null,
  );

  return (
    <div className="relative flex-1 min-h-0 w-full flex flex-col items-center justify-between px-2 py-2 sm:px-5 sm:py-3 lg:px-8 lg:py-4 max-w-[1680px] mx-auto select-none">
      {/* Quick-jump pill bar */}
      <div className="w-full flex items-center justify-center pt-0.5 pb-1 shrink-0">
        <div className="inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/75 text-[11px] sm:text-xs text-slate-300 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-violet-300 shrink-0" />
          <span>Karbon-temaer:</span>
          {KARBON_THEME_LIST.map((n, idx) => (
            <span key={n.id} className="inline-flex items-center">
              <button
                type="button"
                onClick={() => onSelectTheme(n.id)}
                style={{ color: n.accentHex }}
                className="font-bold hover:underline underline-offset-2 cursor-pointer"
              >
                {n.order}. {n.shortTitle}
              </button>
              {idx < KARBON_THEME_LIST.length - 1 && (
                <span className="text-slate-500 ml-1">•</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Interactive SVG Mindmap */}
      <div className="flex-1 min-h-0 w-full flex items-center justify-center">
        <svg
          id="karbon-mindmap-svg"
          viewBox="90 15 900 720"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full max-h-[calc(100vh-11rem)] max-w-[1160px] overflow-visible drop-shadow-[0_16px_45px_rgba(0,0,0,0.55)]"
          role="img"
          aria-label="Tankekart over Karbon-kapittelet med sju undertemaer"
        >
          <defs>
            <clipPath id="clip-karbon-center">
              <circle
                cx={KARBON_CENTER_NODE.cx}
                cy={KARBON_CENTER_NODE.cy}
                r={KARBON_CENTER_NODE.r}
              />
            </clipPath>

            <radialGradient id="karbon-scrim-center" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#120E24" stopOpacity="0.62" />
              <stop offset="65%" stopColor="#0F1124" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#080D1A" stopOpacity="0.7" />
            </radialGradient>

            <radialGradient id="karbon-glow-center" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.28" />
              <stop offset="65%" stopColor="#38BDF8" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#080D1A" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Dashed outer progression arcs */}
          <g aria-hidden="true">
            {KARBON_DASHED_ARCS.map((arc) => {
              const isHighlighted =
                hoveredId === arc.from || hoveredId === arc.to;
              return (
                <path
                  key={arc.id}
                  d={arc.d}
                  fill="none"
                  stroke={isHighlighted ? '#A78BFA' : '#334155'}
                  strokeWidth={isHighlighted ? 2.5 : 1.75}
                  strokeDasharray="6 6"
                  className="transition-colors duration-300"
                />
              );
            })}
          </g>

          {/* Radial spokes */}
          <g aria-hidden="true">
            {KARBON_THEME_LIST.map((node) => {
              const isHighlighted =
                hoveredId === node.id || hoveredId === 'karbon';
              return (
                <line
                  key={`spoke-${node.id}`}
                  x1={KARBON_CENTER_NODE.cx}
                  y1={KARBON_CENTER_NODE.cy}
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

          {/* Center Karbon Node */}
          <g
            onMouseEnter={() => setHoveredId('karbon')}
            onMouseLeave={() => setHoveredId(null)}
            className="cursor-default"
          >
            <circle
              cx={KARBON_CENTER_NODE.cx}
              cy={KARBON_CENTER_NODE.cy}
              r={KARBON_CENTER_NODE.r + 36}
              fill="url(#karbon-glow-center)"
            />
            <image
              href={KARBON_CENTER_NODE.imageUrl}
              x={KARBON_CENTER_NODE.cx - KARBON_CENTER_NODE.r}
              y={KARBON_CENTER_NODE.cy - KARBON_CENTER_NODE.r}
              width={KARBON_CENTER_NODE.r * 2}
              height={KARBON_CENTER_NODE.r * 2}
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#clip-karbon-center)"
            />
            <circle
              cx={KARBON_CENTER_NODE.cx}
              cy={KARBON_CENTER_NODE.cy}
              r={KARBON_CENTER_NODE.r}
              fill="url(#karbon-scrim-center)"
            />
            <circle
              cx={KARBON_CENTER_NODE.cx}
              cy={KARBON_CENTER_NODE.cy}
              r={KARBON_CENTER_NODE.r}
              fill="none"
              stroke={KARBON_CENTER_NODE.accentHex}
              strokeWidth={3.5}
            />
            <text
              x={KARBON_CENTER_NODE.cx}
              y={KARBON_CENTER_NODE.cy - 6}
              textAnchor="middle"
              className="font-display fill-white text-[34px] font-extrabold tracking-tight"
            >
              {KARBON_CENTER_NODE.title}
            </text>
            <text
              x={KARBON_CENTER_NODE.cx}
              y={KARBON_CENTER_NODE.cy + 22}
              textAnchor="middle"
              className="fill-violet-300 text-[14px] font-semibold tracking-wide"
            >
              {KARBON_CENTER_NODE.subtitle}
            </text>
          </g>

          {/* Satellite Topic Nodes */}
          {KARBON_THEME_LIST.map((node) => {
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
                aria-label={`Åpne ${node.title}`}
                className="cursor-pointer outline-none"
              >
                {isHovered && (
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r={node.r + 12}
                    fill={node.glowHex}
                  />
                )}

                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={node.r}
                  fill="#0D1528"
                  stroke={node.accentHex}
                  strokeWidth={isHovered ? 4 : 2.5}
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
                  className="font-mono fill-white text-[12px] font-bold"
                >
                  {node.order}
                </text>

                <text
                  x={node.cx}
                  y={node.cy - 4}
                  textAnchor="middle"
                  className="font-display fill-white text-[16px] font-extrabold"
                >
                  {node.shortTitle}
                </text>
                <text
                  x={node.cx}
                  y={node.cy + 16}
                  textAnchor="middle"
                  className={
                    node.ready
                      ? 'fill-emerald-300 text-[10.5px] font-bold'
                      : 'fill-slate-400 text-[10.5px] font-medium'
                  }
                >
                  {node.ready ? 'Klar • Utforsk' : 'Meny opprettet'}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
