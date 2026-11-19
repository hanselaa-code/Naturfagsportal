import { Atom, Focus, Maximize2, Minus, Plus, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  KarbonAtometStepNode,
  KarbonNodeCategory,
} from '../data/karbonAtometData';

interface KarbonAtometExplorerProps {
  steps: KarbonAtometStepNode[];
  currentStepIndex: number;
  unlockedStepIndex: number;
  showAllSteps: boolean;
  onSelectStep: (idx: number) => void;
}

const WORLD_W = 1640;
const WORLD_H = 1080;
const CENTER_X = 820;
const CENTER_Y = 540;
const CORE_ANCHOR_RADIUS = 132;
const CARD_W = 310;
const CARD_H = 104;

type CoreViewMode = 'bohr' | 'tetrahedron';
type ChainLength = 1 | 3 | 6;
type IsomerMode = 'n-butane' | 'isobutane';
type BondOrder = 1 | 2 | 3;
type RingMode = 'cyclohexane' | 'benzene';
type HeteroGroup = 'oh' | 'carbonyl' | 'nh2';
type AllotropeMode = 'diamond' | 'graphite' | 'graphene';
type ElementCompare = 'C' | 'Si';

interface CategoryColors {
  fill: string;
  stroke: string;
  cardBorder: string;
  badgeBg: string;
  badgeText: string;
  activeBtnClass: string;
  dotClass: string;
}

function getCategoryColors(category: KarbonNodeCategory): CategoryColors {
  switch (category) {
    case 'core':
      return {
        fill: '#A78BFA',
        stroke: '#DDD6FE',
        cardBorder: 'rgba(167, 139, 250, 0.5)',
        badgeBg: 'rgba(139, 92, 246, 0.22)',
        badgeText: '#DDD6FE',
        activeBtnClass:
          'bg-violet-500/25 text-violet-200 border-violet-400/60',
        dotClass: 'bg-violet-400',
      };
    case 'skeleton':
      return {
        fill: '#38BDF8',
        stroke: '#BAE6FD',
        cardBorder: 'rgba(56, 189, 248, 0.48)',
        badgeBg: 'rgba(14, 165, 233, 0.2)',
        badgeText: '#BAE6FD',
        activeBtnClass: 'bg-sky-500/25 text-sky-200 border-sky-400/60',
        dotClass: 'bg-sky-400',
      };
    case 'bonding':
      return {
        fill: '#F59E0B',
        stroke: '#FDE68A',
        cardBorder: 'rgba(245, 158, 11, 0.48)',
        badgeBg: 'rgba(245, 158, 11, 0.2)',
        badgeText: '#FDE68A',
        activeBtnClass: 'bg-amber-500/25 text-amber-200 border-amber-400/60',
        dotClass: 'bg-amber-400',
      };
    case 'materials_life':
    default:
      return {
        fill: '#34D399',
        stroke: '#A7F3D0',
        cardBorder: 'rgba(52, 211, 153, 0.48)',
        badgeBg: 'rgba(16, 185, 129, 0.2)',
        badgeText: '#A7F3D0',
        activeBtnClass:
          'bg-emerald-500/25 text-emerald-200 border-emerald-400/60',
        dotClass: 'bg-emerald-400',
      };
  }
}

interface BondGeometry {
  path: string;
  anchorX: number;
  anchorY: number;
}

function buildRadialBondGeometry(node: KarbonAtometStepNode): BondGeometry {
  let targetX = node.x;
  let targetY = node.y;

  if (node.side === 'left') {
    targetX = node.x + CARD_W / 2;
    targetY = node.y;
  } else if (node.side === 'right') {
    targetX = node.x - CARD_W / 2;
    targetY = node.y;
  } else if (node.side === 'top') {
    targetX = node.x;
    targetY = node.y + CARD_H / 2;
  } else if (node.side === 'bottom') {
    targetX = node.x;
    targetY = node.y - CARD_H / 2;
  } else {
    const fallbackAngle = Math.atan2(node.y - CENTER_Y, node.x - CENTER_X);
    targetX = node.x - Math.cos(fallbackAngle) * (CARD_W / 2);
    targetY = node.y - Math.sin(fallbackAngle) * (CARD_H / 2);
  }

  const theta = Math.atan2(targetY - CENTER_Y, targetX - CENTER_X);
  const anchorX = CENTER_X + Math.cos(theta) * CORE_ANCHOR_RADIUS;
  const anchorY = CENTER_Y + Math.sin(theta) * CORE_ANCHOR_RADIUS;
  const dist = Math.hypot(targetX - anchorX, targetY - anchorY);

  const c1x = anchorX + Math.cos(theta) * dist * 0.42;
  const c1y = anchorY + Math.sin(theta) * dist * 0.42;

  let c2x = targetX;
  let c2y = targetY;

  if (node.side === 'left') {
    c2x = targetX + Math.min(115, dist * 0.36);
  } else if (node.side === 'right') {
    c2x = targetX - Math.min(115, dist * 0.36);
  } else if (node.side === 'top') {
    c2y = targetY + Math.min(95, dist * 0.36);
  } else if (node.side === 'bottom') {
    c2y = targetY - Math.min(95, dist * 0.36);
  }

  return {
    path: `M ${anchorX.toFixed(1)} ${anchorY.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${targetX.toFixed(1)} ${targetY.toFixed(1)}`,
    anchorX,
    anchorY,
  };
}

interface MiniDiagramProps {
  stepIndex: number;
  chainLength: ChainLength;
  isomerMode: IsomerMode;
  bondOrder: BondOrder;
  ringMode: RingMode;
  heteroGroup: HeteroGroup;
  allotropeMode: AllotropeMode;
  elementCompare: ElementCompare;
  accentColor: string;
}

function StationMiniDiagram({
  stepIndex,
  chainLength,
  isomerMode,
  bondOrder,
  ringMode,
  heteroGroup,
  allotropeMode,
  elementCompare,
  accentColor,
}: MiniDiagramProps) {
  // Coordinate box: 0..88 x 0..76 (centered at 44, 38)
  switch (stepIndex) {
    case 1: {
      // Carbon chains: C1 Methane, C3 Propane, C6 Hexane
      if (chainLength === 1) {
        return (
          <g>
            <line x1={44} y1={38} x2={44} y2={15} stroke="#38BDF8" strokeWidth={2.2} />
            <line x1={44} y1={38} x2={44} y2={61} stroke="#38BDF8" strokeWidth={2.2} />
            <line x1={44} y1={38} x2={21} y2={38} stroke="#38BDF8" strokeWidth={2.2} />
            <line x1={44} y1={38} x2={67} y2={38} stroke="#38BDF8" strokeWidth={2.2} />
            {[
              [44, 15],
              [44, 61],
              [21, 38],
              [67, 38],
            ].map(([hx, hy], i) => (
              <g key={i}>
                <circle cx={hx} cy={hy} r={6.5} fill="#0F172A" stroke="#BAE6FD" strokeWidth={1.4} />
                <text x={hx} y={hy + 3} textAnchor="middle" fill="#E0F2FE" fontSize={7.5} fontWeight={700}>
                  H
                </text>
              </g>
            ))}
            <circle cx={44} cy={38} r={10} fill="#0284C7" stroke="#BAE6FD" strokeWidth={1.8} />
            <text x={44} y={41.5} textAnchor="middle" fill="#FFFFFF" fontSize={9.5} fontWeight={800}>
              C
            </text>
          </g>
        );
      }

      const pts: [number, number][] =
        chainLength === 3
          ? [
              [20, 46],
              [44, 28],
              [68, 46],
            ]
          : [
              [10, 46],
              [23, 29],
              [37, 46],
              [51, 29],
              [65, 46],
              [78, 29],
            ];
      const poly = pts.map(([x, y]) => `${x},${y}`).join(' ');
      const nodeR = chainLength === 3 ? 7.5 : 5.5;

      return (
        <g>
          <polyline
            points={poly}
            fill="none"
            stroke="#38BDF8"
            strokeWidth={2.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {pts.map(([cx, cy], idx) => (
            <g key={idx}>
              <circle
                cx={cx}
                cy={cy}
                r={nodeR}
                fill="#0C4A6E"
                stroke="#BAE6FD"
                strokeWidth={1.5}
              />
              {chainLength === 3 && (
                <text
                  x={cx}
                  y={cy + 3}
                  textAnchor="middle"
                  fill="#F8FAFC"
                  fontSize={8}
                  fontWeight={800}
                >
                  C
                </text>
              )}
            </g>
          ))}
          <text
            x={44}
            y={68}
            textAnchor="middle"
            fill="#7DD3FC"
            fontSize={8.5}
            fontWeight={700}
            className="font-mono-time"
          >
            {chainLength === 3 ? 'C₃H₈' : 'C₆H₁₄'}
          </text>
        </g>
      );
    }

    case 2: {
      // Branching & Isomers: n-butane vs isobutane
      if (isomerMode === 'n-butane') {
        const pts: [number, number][] = [
          [14, 46],
          [34, 28],
          [54, 46],
          [74, 28],
        ];
        return (
          <g>
            <polyline
              points={pts.map(([x, y]) => `${x},${y}`).join(' ')}
              fill="none"
              stroke="#38BDF8"
              strokeWidth={2.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {pts.map(([cx, cy], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r={6.8} fill="#0369A1" stroke="#BAE6FD" strokeWidth={1.4} />
                <text x={cx} y={cy + 2.8} textAnchor="middle" fill="#FFFFFF" fontSize={7.5} fontWeight={800}>
                  C
                </text>
              </g>
            ))}
            <text x={44} y={67} textAnchor="middle" fill="#7DD3FC" fontSize={8} fontWeight={700} className="font-mono-time">
              n-butan
            </text>
          </g>
        );
      }
      // Isobutane (branched)
      const arms: [number, number][] = [
        [44, 16],
        [20, 50],
        [68, 50],
      ];
      return (
        <g>
          {arms.map(([ax, ay], i) => (
            <line
              key={i}
              x1={44}
              y1={39}
              x2={ax}
              y2={ay}
              stroke="#38BDF8"
              strokeWidth={2.6}
              strokeLinecap="round"
            />
          ))}
          {arms.map(([ax, ay], i) => (
            <g key={i}>
              <circle cx={ax} cy={ay} r={6.8} fill="#0369A1" stroke="#BAE6FD" strokeWidth={1.4} />
              <text x={ax} y={ay + 2.8} textAnchor="middle" fill="#FFFFFF" fontSize={7.5} fontWeight={800}>
                C
              </text>
            </g>
          ))}
          <circle cx={44} cy={39} r={8} fill="#0284C7" stroke="#E0F2FE" strokeWidth={1.8} />
          <text x={44} y={42} textAnchor="middle" fill="#FFFFFF" fontSize={8.5} fontWeight={800}>
            C
          </text>
          <text x={44} y={69} textAnchor="middle" fill="#7DD3FC" fontSize={8} fontWeight={700} className="font-mono-time">
            isobutan
          </text>
        </g>
      );
    }

    case 3: {
      // Single / Double / Triple C-C bonds
      const bondOffsets =
        bondOrder === 1 ? [0] : bondOrder === 2 ? [-4, 4] : [-6.5, 0, 6.5];
      return (
        <g>
          {bondOffsets.map((dy, i) => (
            <line
              key={i}
              x1={24}
              y1={35 + dy}
              x2={64}
              y2={35 + dy}
              stroke="#F59E0B"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          ))}
          <circle cx={22} cy={35} r={10.5} fill="#92400E" stroke="#FDE68A" strokeWidth={1.8} />
          <text x={22} y={38.5} textAnchor="middle" fill="#FFFFFF" fontSize={9.5} fontWeight={800}>
            C
          </text>
          <circle cx={66} cy={35} r={10.5} fill="#92400E" stroke="#FDE68A" strokeWidth={1.8} />
          <text x={66} y={38.5} textAnchor="middle" fill="#FFFFFF" fontSize={9.5} fontWeight={800}>
            C
          </text>
          <text
            x={44}
            y={64}
            textAnchor="middle"
            fill="#FDE68A"
            fontSize={8.5}
            fontWeight={700}
            className="font-mono-time"
          >
            {bondOrder === 1 ? '109,5°' : bondOrder === 2 ? '120°' : '180°'}
          </text>
        </g>
      );
    }

    case 4: {
      // Rings: Cyclohexane vs Benzene
      const r = 21;
      const hexPts = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 2;
        return [44 + Math.cos(a) * r, 36 + Math.sin(a) * r] as [number, number];
      });
      const poly = hexPts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
      return (
        <g>
          <polygon
            points={poly}
            fill={ringMode === 'benzene' ? 'rgba(245, 158, 11, 0.14)' : 'rgba(56, 189, 248, 0.08)'}
            stroke="#F59E0B"
            strokeWidth={2.4}
            strokeLinejoin="round"
          />
          {ringMode === 'benzene' && (
            <circle
              cx={44}
              cy={36}
              r={12}
              fill="none"
              stroke="#FDE68A"
              strokeWidth={1.8}
              strokeDasharray="3 2.5"
            />
          )}
          {hexPts.map(([x, y], idx) => (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r={3.2}
              fill="#FDE68A"
            />
          ))}
          <text
            x={44}
            y={69}
            textAnchor="middle"
            fill="#FDE68A"
            fontSize={8}
            fontWeight={700}
            className="font-mono-time"
          >
            {ringMode === 'benzene' ? 'C₆H₆' : 'C₆H₁₂'}
          </text>
        </g>
      );
    }

    case 5: {
      // Heteroatoms: -OH, =O, -NH2
      if (heteroGroup === 'oh') {
        return (
          <g>
            <line x1={22} y1={36} x2={47} y2={36} stroke="#F59E0B" strokeWidth={2.5} />
            <line x1={47} y1={36} x2={68} y2={24} stroke="#FB7185" strokeWidth={2.2} />
            <circle cx={22} cy={36} r={9.5} fill="#334155" stroke="#CBD5E1" strokeWidth={1.6} />
            <text x={22} y={39.5} textAnchor="middle" fill="#FFFFFF" fontSize={9} fontWeight={800}>C</text>
            <circle cx={47} cy={36} r={9.5} fill="#E11D48" stroke="#FECDD3" strokeWidth={1.6} />
            <text x={47} y={39.5} textAnchor="middle" fill="#FFFFFF" fontSize={9} fontWeight={800}>O</text>
            <circle cx={68} cy={24} r={6.5} fill="#0F172A" stroke="#E2E8F0" strokeWidth={1.4} />
            <text x={68} y={27} textAnchor="middle" fill="#F8FAFC" fontSize={7.5} fontWeight={700}>H</text>
            <text x={44} y={66} textAnchor="middle" fill="#FDA4AF" fontSize={8} fontWeight={700} className="font-mono-time">
              –OH
            </text>
          </g>
        );
      }
      if (heteroGroup === 'carbonyl') {
        return (
          <g>
            <line x1={24} y1={32} x2={62} y2={32} stroke="#FB7185" strokeWidth={2.4} />
            <line x1={24} y1={39} x2={62} y2={39} stroke="#FB7185" strokeWidth={2.4} />
            <circle cx={24} cy={35.5} r={10} fill="#334155" stroke="#CBD5E1" strokeWidth={1.6} />
            <text x={24} y={39} textAnchor="middle" fill="#FFFFFF" fontSize={9} fontWeight={800}>C</text>
            <circle cx={62} cy={35.5} r={10} fill="#E11D48" stroke="#FECDD3" strokeWidth={1.6} />
            <text x={62} y={39} textAnchor="middle" fill="#FFFFFF" fontSize={9} fontWeight={800}>O</text>
            <text x={44} y={66} textAnchor="middle" fill="#FDA4AF" fontSize={8} fontWeight={700} className="font-mono-time">
              C=O
            </text>
          </g>
        );
      }
      // -NH2
      return (
        <g>
          <line x1={20} y1={38} x2={47} y2={38} stroke="#F59E0B" strokeWidth={2.4} />
          <line x1={47} y1={38} x2={67} y2={23} stroke="#60A5FA" strokeWidth={2.2} />
          <line x1={47} y1={38} x2={67} y2={53} stroke="#60A5FA" strokeWidth={2.2} />
          <circle cx={20} cy={38} r={9} fill="#334155" stroke="#CBD5E1" strokeWidth={1.5} />
          <text x={20} y={41} textAnchor="middle" fill="#FFFFFF" fontSize={8.5} fontWeight={800}>C</text>
          <circle cx={47} cy={38} r={9.5} fill="#2563EB" stroke="#BFDBFE" strokeWidth={1.6} />
          <text x={47} y={41} textAnchor="middle" fill="#FFFFFF" fontSize={9} fontWeight={800}>N</text>
          <circle cx={67} cy={23} r={6} fill="#0F172A" stroke="#E2E8F0" strokeWidth={1.3} />
          <text x={67} y={25.5} textAnchor="middle" fill="#F8FAFC" fontSize={7} fontWeight={700}>H</text>
          <circle cx={67} cy={53} r={6} fill="#0F172A" stroke="#E2E8F0" strokeWidth={1.3} />
          <text x={67} y={55.5} textAnchor="middle" fill="#F8FAFC" fontSize={7} fontWeight={700}>H</text>
          <text x={44} y={68} textAnchor="middle" fill="#93C5FD" fontSize={8} fontWeight={700} className="font-mono-time">
            –NH₂
          </text>
        </g>
      );
    }

    case 6: {
      // Allotropes: Diamond 3D, Graphite 2D layers, Graphene 1 layer
      if (allotropeMode === 'diamond') {
        return (
          <g>
            {/* 3D tetrahedral crystal cage */}
            <line x1={44} y1={14} x2={22} y2={42} stroke="#34D399" strokeWidth={2} />
            <line x1={44} y1={14} x2={66} y2={42} stroke="#34D399" strokeWidth={2} />
            <line x1={44} y1={14} x2={44} y2={35} stroke="#A7F3D0" strokeWidth={2.2} />
            <line x1={44} y1={35} x2={22} y2={42} stroke="#A7F3D0" strokeWidth={2} />
            <line x1={44} y1={35} x2={66} y2={42} stroke="#A7F3D0" strokeWidth={2} />
            <line x1={44} y1={35} x2={44} y2={58} stroke="#A7F3D0" strokeWidth={2.2} />
            <line x1={22} y1={42} x2={44} y2={58} stroke="#34D399" strokeWidth={1.6} opacity={0.7} />
            <line x1={66} y1={42} x2={44} y2={58} stroke="#34D399" strokeWidth={1.6} opacity={0.7} />
            {[
              [44, 14],
              [44, 35],
              [22, 42],
              [66, 42],
              [44, 58],
            ].map(([cx, cy], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={i === 1 ? 5.5 : 4.2}
                fill={i === 1 ? '#34D399' : '#065F46'}
                stroke="#A7F3D0"
                strokeWidth={1.4}
              />
            ))}
            <text x={44} y={71} textAnchor="middle" fill="#A7F3D0" fontSize={7.8} fontWeight={700} className="font-mono-time">
              Diamant 3D
            </text>
          </g>
        );
      }
      if (allotropeMode === 'graphite') {
        return (
          <g>
            {/* Top layer */}
            <polygon
              points="16,24 32,16 56,16 72,24 56,31 32,31"
              fill="rgba(52, 211, 153, 0.16)"
              stroke="#34D399"
              strokeWidth={1.8}
            />
            {/* Dashed weak interlayer forces */}
            <line x1={32} y1={31} x2={32} y2={45} stroke="#94A3B8" strokeWidth={1.3} strokeDasharray="2.5 2.5" />
            <line x1={56} y1={31} x2={56} y2={45} stroke="#94A3B8" strokeWidth={1.3} strokeDasharray="2.5 2.5" />
            {/* Bottom layer */}
            <polygon
              points="16,52 32,44 56,44 72,52 56,59 32,59"
              fill="rgba(52, 211, 153, 0.12)"
              stroke="#34D399"
              strokeWidth={1.8}
            />
            <text x={44} y={71} textAnchor="middle" fill="#A7F3D0" fontSize={7.8} fontWeight={700} className="font-mono-time">
              Grafitt 2D
            </text>
          </g>
        );
      }
      // Graphene honeycomb
      return (
        <g>
          <polygon
            points="26,20 40,20 47,32 40,44 26,44 19,32"
            fill="rgba(52, 211, 153, 0.16)"
            stroke="#6EE7B7"
            strokeWidth={1.8}
          />
          <polygon
            points="47,32 61,32 68,44 61,56 47,56 40,44"
            fill="rgba(52, 211, 153, 0.16)"
            stroke="#6EE7B7"
            strokeWidth={1.8}
          />
          <polygon
            points="47,10 61,10 68,21 61,32 47,32 40,20"
            fill="rgba(52, 211, 153, 0.12)"
            stroke="#34D399"
            strokeWidth={1.5}
          />
          <text x={44} y={70} textAnchor="middle" fill="#A7F3D0" fontSize={7.8} fontWeight={700} className="font-mono-time">
            Grafen (1 lag)
          </text>
        </g>
      );
    }

    case 7:
    default: {
      // Carbon vs Silicon / Life's chemistry
      if (elementCompare === 'C') {
        return (
          <g>
            {/* DNA / Biomolecule carbon web */}
            <path
              d="M 22 14 C 58 24, 30 46, 66 56"
              fill="none"
              stroke="#34D399"
              strokeWidth={2.4}
              strokeLinecap="round"
            />
            <path
              d="M 66 14 C 30 24, 58 46, 22 56"
              fill="none"
              stroke="#A78BFA"
              strokeWidth={2.4}
              strokeLinecap="round"
            />
            {[20, 35, 50].map((y, idx) => (
              <line
                key={idx}
                x1={31}
                y1={y}
                x2={57}
                y2={y}
                stroke="#A7F3D0"
                strokeWidth={1.5}
                opacity={0.75}
              />
            ))}
            <text x={44} y={70} textAnchor="middle" fill="#A7F3D0" fontSize={8} fontWeight={700} className="font-mono-time">
              C • Livet
            </text>
          </g>
        );
      }
      // Silicon SiO2 crystal network
      return (
        <g>
          <rect
            x={22}
            y={18}
            width={44}
            height={36}
            rx={4}
            fill="rgba(148, 163, 184, 0.12)"
            stroke="#94A3B8"
            strokeWidth={1.8}
          />
          <line x1={22} y1={36} x2={66} y2={36} stroke="#94A3B8" strokeWidth={1.4} />
          <line x1={44} y1={18} x2={44} y2={54} stroke="#94A3B8" strokeWidth={1.4} />
          {[
            [22, 18],
            [66, 18],
            [44, 36],
            [22, 54],
            [66, 54],
          ].map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={i === 2 ? 6.5 : 4.2}
              fill={i === 2 ? '#475569' : '#1E293B'}
              stroke={accentColor}
              strokeWidth={1.4}
            />
          ))}
          <text x={44} y={39} textAnchor="middle" fill="#F8FAFC" fontSize={7.5} fontWeight={800}>
            Si
          </text>
          <text x={44} y={70} textAnchor="middle" fill="#CBD5E1" fontSize={8} fontWeight={700} className="font-mono-time">
            SiO₂ stein
          </text>
        </g>
      );
    }
  }
}

export function KarbonAtometExplorer({
  steps,
  currentStepIndex,
  unlockedStepIndex,
  showAllSteps,
  onSelectStep,
}: KarbonAtometExplorerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [viewport, setViewport] = useState({ width: 920, height: 680 });
  const [camera, setCamera] = useState({ x: CENTER_X, y: CENTER_Y, scale: 0.62 });
  const [cameraMode, setCameraMode] = useState<'follow' | 'overview' | 'manual'>(
    'follow',
  );
  const [isDragging, setIsDragging] = useState(false);

  // Step-aware Mini-Lab interactive states
  const [coreViewMode, setCoreViewMode] = useState<CoreViewMode>('bohr');
  const [chainLength, setChainLength] = useState<ChainLength>(3);
  const [isomerMode, setIsomerMode] = useState<IsomerMode>('isobutane');
  const [bondOrder, setBondOrder] = useState<BondOrder>(2);
  const [ringMode, setRingMode] = useState<RingMode>('benzene');
  const [heteroGroup, setHeteroGroup] = useState<HeteroGroup>('oh');
  const [allotropeMode, setAllotropeMode] = useState<AllotropeMode>('diamond');
  const [elementCompare, setElementCompare] = useState<ElementCompare>('C');

  const dragRef = useRef<{
    startX: number;
    startY: number;
    camStartX: number;
    camStartY: number;
    moved: boolean;
  } | null>(null);

  const effectiveMaxStep = showAllSteps
    ? Math.max(0, steps.length - 1)
    : unlockedStepIndex;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setViewport({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const computeOverviewCamera = useCallback(() => {
    const padW = WORLD_W + 70;
    const padH = WORLD_H + 110;
    const scale = Math.max(
      0.24,
      Math.min(0.95, Math.min(viewport.width / padW, viewport.height / padH)),
    );
    return {
      x: CENTER_X,
      y: CENTER_Y - 12,
      scale,
    };
  }, [viewport.height, viewport.width]);

  const computeFollowCamera = useCallback(
    (stepIdx: number) => {
      if (showAllSteps) {
        return computeOverviewCamera();
      }
      const selected = steps[stepIdx] ?? steps[0];
      if (!selected || selected.stepIndex === 0 || selected.side === 'center') {
        const spanX = 760;
        const spanY = 640;
        const rawScale = Math.min(viewport.width / spanX, viewport.height / spanY);
        return {
          x: CENTER_X,
          y: CENTER_Y + 8,
          scale: Math.max(0.42, Math.min(1.05, rawScale)),
        };
      }

      // Frame BOTH the central Carbon atom AND the active step's card/molecule
      const cardLeft = selected.x - CARD_W / 2 - 55;
      const cardRight = selected.x + CARD_W / 2 + 55;
      const cardTop = selected.y - CARD_H / 2 - 90;
      const cardBottom = selected.y + CARD_H / 2 + 75;

      const coreLeft = CENTER_X - 185;
      const coreRight = CENTER_X + 185;
      const coreTop = CENTER_Y - 195;
      const coreBottom = CENTER_Y + 205;

      const minX = Math.min(cardLeft, coreLeft);
      const maxX = Math.max(cardRight, coreRight);
      const minY = Math.min(cardTop, coreTop);
      const maxY = Math.max(cardBottom, coreBottom);

      const spanX = Math.max(820, maxX - minX);
      const spanY = Math.max(600, maxY - minY);

      const rawScale = Math.min(viewport.width / spanX, viewport.height / spanY);
      const clampedScale = Math.max(0.36, Math.min(0.96, rawScale));

      return {
        x: (minX + maxX) / 2,
        y: (minY + maxY) / 2 - 14,
        scale: clampedScale,
      };
    },
    [computeOverviewCamera, showAllSteps, steps, viewport.height, viewport.width],
  );

  useEffect(() => {
    setCameraMode(showAllSteps ? 'overview' : 'follow');
  }, [currentStepIndex, unlockedStepIndex, showAllSteps]);

  useEffect(() => {
    if (cameraMode === 'follow') {
      setCamera(computeFollowCamera(currentStepIndex));
    } else if (cameraMode === 'overview') {
      setCamera(computeOverviewCamera());
    }
  }, [
    cameraMode,
    computeFollowCamera,
    computeOverviewCamera,
    currentStepIndex,
  ]);

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      camStartX: camera.x,
      camStartY: camera.y,
      moved: false,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      drag.moved = true;
      setCameraMode('manual');
      setCamera((prev) => ({
        ...prev,
        x: drag.camStartX - dx / prev.scale,
        y: drag.camStartY - dy / prev.scale,
      }));
    }
  };

  const handlePointerUp = () => {
    dragRef.current = null;
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    setCameraMode('manual');
    setCamera((prev) => ({
      ...prev,
      scale: Math.max(0.22, Math.min(2.0, prev.scale * factor)),
    }));
  };

  const radialStations = useMemo(
    () => steps.filter((s) => s.stepIndex > 0),
    [steps],
  );

  const unlockedStations = useMemo(
    () => radialStations.filter((s) => s.stepIndex <= effectiveMaxStep),
    [radialStations, effectiveMaxStep],
  );

  const lockedStations = useMemo(
    () => radialStations.filter((s) => s.stepIndex > effectiveMaxStep),
    [radialStations, effectiveMaxStep],
  );

  const activeStep = steps[currentStepIndex] ?? steps[0];
  const activeColors = getCategoryColors(activeStep?.category ?? 'core');

  const liveReadoutText = useMemo(() => {
    switch (currentStepIndex) {
      case 0:
        return coreViewMode === 'bohr'
          ? 'Bohr-modell: 2 elektroner i K-skall + 4 valenselektroner i L-skall → kan danne 4 kovalente bindinger'
          : 'CH₄ Tetraeder: 109,5° bindingsvinkel i 3D gir størst mulig avstand mellom de 4 elektronparene';
      case 1:
        if (chainLength === 1) {
          return 'CH₄ (Metan, 1 C) • Enkleste hydrokarbon, gass ved romtemperatur (−162 °C)';
        }
        if (chainLength === 3) {
          return 'C₃H₈ (Propan, 3 C) • Kort karbonkjede, brukes som grillgass (−42 °C)';
        }
        return 'C₆H₁₄ (Heksan, 6 C) • Lengre kjede gir sterkere tiltrekning og høyere kokepunkt (+69 °C)';
      case 2:
        return isomerMode === 'n-butane'
          ? 'n-butan (C₄H₁₀) • Rett kjede gir stor kontaktflate mellom molekylene → kokepunkt −0,5 °C'
          : 'Isobutan (C₄H₁₀) • Samme formel, men forgrenet kuleform gir lavere kokepunkt (−11,7 °C)';
      case 3:
        if (bondOrder === 1) {
          return 'Enkeltbinding (C–C • 109,5°) • Ett delt elektronpar og fri rotasjon rundt bindingen';
        }
        if (bondOrder === 2) {
          return 'Dobbeltbinding (C=C • 120°) • To delte elektronpar — stiv, plan binding uten fri rotasjon';
        }
        return 'Trippelbinding (C≡C • 180°) • Tre delte elektronpar — lineær, kort og svært energirik';
      case 4:
        return ringMode === 'cyclohexane'
          ? 'Sykloheksan (C₆H₁₂) • Mettet sekskantring med kun enkeltbindinger mellom karbonatomene'
          : 'Benzen (C₆H₆) • Aromatisk ring der 6 elektroner deles over hele ringen — ekstra stabil';
      case 5:
        if (heteroGroup === 'oh') {
          return '–OH (Hydroksylgruppe) • Gjør molekylet polart og vannløselig, f.eks. i alkoholer (etanol)';
        }
        if (heteroGroup === 'carbonyl') {
          return '=O (Karbonylgruppe) • Sterkt polar C=O-binding, sentral i sukker, aldehyder og ketoner';
        }
        return '–NH₂ (Amingruppe) • Nitrogen gir basiske egenskaper — byggestein i aminosyrer og proteiner';
      case 6:
        if (allotropeMode === 'diamond') {
          return 'Diamant (3D-gitter) • Hvert C binder 4 naboer — naturens hardeste mineral, leder ikke strøm';
        }
        if (allotropeMode === 'graphite') {
          return 'Grafitt (2D-lag) • 3 bindinger per C + frie elektroner mellom lagene — mykt og leder strøm';
        }
        return 'Grafen (1 atomlag) • Ett enkelt sekskantnett av karbon — ekstremt sterkt og strømledende';
      case 7:
      default:
        return elementCompare === 'C'
          ? 'Karbon (C): Sterk C–C-binding (347 kJ/mol) • CO₂ er gass som kretser i naturen • >10 mill. stoffer'
          : 'Silisium (Si): Svakere Si–Si (226 kJ/mol) • SiO₂ er hard stein/kvarts • Kan ikke drive livets kretsløp';
    }
  }, [
    allotropeMode,
    bondOrder,
    chainLength,
    coreViewMode,
    currentStepIndex,
    elementCompare,
    heteroGroup,
    isomerMode,
    ringMode,
  ]);

  const translateX = viewport.width / 2 - camera.x * camera.scale;
  const translateY = viewport.height / 2 - camera.y * camera.scale;

  const isCoreSelected = currentStepIndex === 0;

  return (
    <div
      ref={containerRef}
      id="karbon-atomet-explorer-canvas"
      className="relative w-full h-full overflow-hidden rounded-2xl glass-panel select-none"
    >
      {/* Top Step-Aware Interactive Mini-Lab Bar */}
      <div className="absolute top-2.5 left-2.5 right-2.5 sm:top-3.5 sm:left-3.5 sm:right-3.5 z-10 flex flex-col gap-1.5 pointer-events-none">
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl glass-subtle border border-slate-700/60 pointer-events-auto">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`w-2 h-2 rounded-full shrink-0 ${activeColors.dotClass}`} />
            <Atom className="w-3.5 h-3.5 text-violet-300 shrink-0" />
            <span className="text-[11px] sm:text-xs font-extrabold text-slate-100 truncate">
              Steg {currentStepIndex + 1} • Interaktiv karbon-lab
            </span>
          </div>

          {/* Dynamic controls per active step */}
          <div className="flex flex-wrap items-center gap-1.5">
            {currentStepIndex === 0 && (
              <>
                <button
                  type="button"
                  aria-label="Vis Bohr-skall med 2 og 4 elektroner"
                  onClick={() => setCoreViewMode('bohr')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                    coreViewMode === 'bohr'
                      ? activeColors.activeBtnClass
                      : 'bg-slate-900/75 text-slate-300 border-slate-700/70 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  Bohr-skall (2+4)
                </button>
                <button
                  type="button"
                  aria-label="Vis 3D tetraeder med 109,5 graders vinkel"
                  onClick={() => setCoreViewMode('tetrahedron')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                    coreViewMode === 'tetrahedron'
                      ? activeColors.activeBtnClass
                      : 'bg-slate-900/75 text-slate-300 border-slate-700/70 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  Tetraeder (109,5°)
                </button>
              </>
            )}

            {currentStepIndex === 1 && (
              <>
                {(
                  [
                    { len: 1, label: 'C₁ Metan' },
                    { len: 3, label: 'C₃ Propan' },
                    { len: 6, label: 'C₆ Heksan' },
                  ] as { len: ChainLength; label: string }[]
                ).map((item) => (
                  <button
                    key={item.len}
                    type="button"
                    aria-label={`Velg kjedelengde ${item.label}`}
                    onClick={() => setChainLength(item.len)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                      chainLength === item.len
                        ? activeColors.activeBtnClass
                        : 'bg-slate-900/75 text-slate-300 border-slate-700/70 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </>
            )}

            {currentStepIndex === 2 && (
              <>
                <button
                  type="button"
                  aria-label="Velg n-butan med rett kjede"
                  onClick={() => setIsomerMode('n-butane')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                    isomerMode === 'n-butane'
                      ? activeColors.activeBtnClass
                      : 'bg-slate-900/75 text-slate-300 border-slate-700/70 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  n-butan (rett, −0,5 °C)
                </button>
                <button
                  type="button"
                  aria-label="Velg isobutan med forgrenet kjede"
                  onClick={() => setIsomerMode('isobutane')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                    isomerMode === 'isobutane'
                      ? activeColors.activeBtnClass
                      : 'bg-slate-900/75 text-slate-300 border-slate-700/70 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  Isobutan (forgrenet, −11,7 °C)
                </button>
              </>
            )}

            {currentStepIndex === 3 && (
              <>
                {(
                  [
                    { order: 1, label: 'Enkelt (C–C, 109,5°)' },
                    { order: 2, label: 'Dobbelt (C=C, 120°)' },
                    { order: 3, label: 'Trippel (C≡C, 180°)' },
                  ] as { order: BondOrder; label: string }[]
                ).map((item) => (
                  <button
                    key={item.order}
                    type="button"
                    aria-label={`Velg ${item.label}`}
                    onClick={() => setBondOrder(item.order)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                      bondOrder === item.order
                        ? activeColors.activeBtnClass
                        : 'bg-slate-900/75 text-slate-300 border-slate-700/70 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </>
            )}

            {currentStepIndex === 4 && (
              <>
                <button
                  type="button"
                  aria-label="Vis sykloheksan C6H12"
                  onClick={() => setRingMode('cyclohexane')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                    ringMode === 'cyclohexane'
                      ? activeColors.activeBtnClass
                      : 'bg-slate-900/75 text-slate-300 border-slate-700/70 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  Sykloheksan (C₆H₁₂)
                </button>
                <button
                  type="button"
                  aria-label="Vis benzen C6H6"
                  onClick={() => setRingMode('benzene')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                    ringMode === 'benzene'
                      ? activeColors.activeBtnClass
                      : 'bg-slate-900/75 text-slate-300 border-slate-700/70 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  Benzen (C₆H₆)
                </button>
              </>
            )}

            {currentStepIndex === 5 && (
              <>
                {(
                  [
                    { id: 'oh', label: '–OH (Alkohol)' },
                    { id: 'carbonyl', label: '=O (Karbonyl)' },
                    { id: 'nh2', label: '–NH₂ (Amin)' },
                  ] as { id: HeteroGroup; label: string }[]
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Velg funksjonell gruppe ${item.label}`}
                    onClick={() => setHeteroGroup(item.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                      heteroGroup === item.id
                        ? activeColors.activeBtnClass
                        : 'bg-slate-900/75 text-slate-300 border-slate-700/70 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </>
            )}

            {currentStepIndex === 6 && (
              <>
                {(
                  [
                    { id: 'diamond', label: 'Diamant (3D)' },
                    { id: 'graphite', label: 'Grafitt (2D-lag)' },
                    { id: 'graphene', label: 'Grafen (1 lag)' },
                  ] as { id: AllotropeMode; label: string }[]
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Velg karbonallotrop ${item.label}`}
                    onClick={() => setAllotropeMode(item.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                      allotropeMode === item.id
                        ? activeColors.activeBtnClass
                        : 'bg-slate-900/75 text-slate-300 border-slate-700/70 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </>
            )}

            {currentStepIndex === 7 && (
              <>
                <button
                  type="button"
                  aria-label="Sammenlign med karbon"
                  onClick={() => setElementCompare('C')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                    elementCompare === 'C'
                      ? activeColors.activeBtnClass
                      : 'bg-slate-900/75 text-slate-300 border-slate-700/70 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  Karbon (C)
                </button>
                <button
                  type="button"
                  aria-label="Sammenlign med silisium"
                  onClick={() => setElementCompare('Si')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                    elementCompare === 'Si'
                      ? activeColors.activeBtnClass
                      : 'bg-slate-900/75 text-slate-300 border-slate-700/70 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  Silisium (Si)
                </button>
              </>
            )}
          </div>
        </div>

        {/* Live molecular readout pill */}
        <div className="self-center max-w-full px-3 py-1 rounded-full bg-slate-950/80 border border-slate-700/60 backdrop-blur-md text-[11px] text-slate-200 font-medium truncate shadow-lg">
          {liveReadoutText}
        </div>
      </div>

      {/* Camera controls floating bottom-left */}
      <div className="absolute bottom-2.5 left-2.5 sm:bottom-3.5 sm:left-3.5 z-10 flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-xl glass-subtle">
        <button
          id="btn-karbon-zoom-in"
          type="button"
          aria-label="Zoom inn"
          onClick={() => {
            setCameraMode('manual');
            setCamera((prev) => ({
              ...prev,
              scale: Math.min(2.0, prev.scale * 1.2),
            }));
          }}
          title="Zoom inn"
          className="p-1.5 sm:p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          id="btn-karbon-zoom-out"
          type="button"
          aria-label="Zoom ut"
          onClick={() => {
            setCameraMode('manual');
            setCamera((prev) => ({
              ...prev,
              scale: Math.max(0.22, prev.scale / 1.2),
            }));
          }}
          title="Zoom ut"
          className="p-1.5 sm:p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-slate-700/70 mx-0.5" />
        <button
          id="btn-karbon-camera-follow"
          type="button"
          aria-label="Følg aktiv karbon-gren"
          onClick={() => {
            setCameraMode('follow');
            setCamera(computeFollowCamera(currentStepIndex));
          }}
          className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            cameraMode === 'follow'
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
          title="Fokuser på karbonatomet og aktiv gren"
        >
          <Focus className="w-3.5 h-3.5" />
          <span>Følg</span>
        </button>
        <button
          id="btn-karbon-camera-overview"
          type="button"
          aria-label="Vis hele karbonkartet"
          onClick={() => {
            setCameraMode('overview');
            setCamera(computeOverviewCamera());
          }}
          className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            cameraMode === 'overview'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
          title="Vis alle 8 karbon-stasjoner"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Hele kartet</span>
        </button>
      </div>

      {/* Hint bottom-right */}
      <div className="hidden sm:flex absolute bottom-3.5 right-3.5 z-10 items-center gap-1.5 px-3 py-1.5 rounded-xl glass-subtle text-[11px] text-slate-400 pointer-events-none">
        <Sparkles className="w-3.5 h-3.5 text-violet-400" />
        <span>Dra for å panorere • Klikk på en karbon-gren for å utforske</span>
      </div>

      <svg
        className={`w-full h-full touch-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
        role="img"
        aria-label="Interaktivt radialt karbonunivers med karbonatomet i sentrum og 7 molekylære grener"
      >
        <defs>
          <radialGradient id="karbonCoreAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(167, 139, 250, 0.28)" />
            <stop offset="48%" stopColor="rgba(56, 189, 248, 0.12)" />
            <stop offset="100%" stopColor="rgba(7, 13, 25, 0)" />
          </radialGradient>

          <radialGradient id="karbonNucleusGrad" cx="35%" cy="32%" r="70%">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="48%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#3B0764" />
          </radialGradient>

          <radialGradient id="karbonElectronGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </radialGradient>

          <filter id="karbonSoftGlow" x="-45%" y="-45%" width="190%" height="190%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g
          style={{
            transform: `translate(${translateX}px, ${translateY}px) scale(${camera.scale})`,
            transformOrigin: '0 0',
            transition: isDragging
              ? 'none'
              : 'transform 680ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {/* Ambient Carbon Universe Aura & Expanding Concentric Rings */}
          <g className="pointer-events-none">
            <circle cx={CENTER_X} cy={CENTER_Y} r={540} fill="url(#karbonCoreAura)" />

            {[
              { r: 215, threshold: 1, color: 'rgba(167, 139, 250, 0.32)', dash: '5 10' },
              { r: 340, threshold: 3, color: 'rgba(56, 189, 248, 0.26)', dash: '6 12' },
              { r: 465, threshold: 5, color: 'rgba(245, 158, 11, 0.22)', dash: '4 11' },
              { r: 585, threshold: 7, color: 'rgba(52, 211, 153, 0.2)', dash: '8 14' },
            ].map((ring) => {
              const lit = effectiveMaxStep >= ring.threshold;
              return (
                <circle
                  key={ring.r}
                  cx={CENTER_X}
                  cy={CENTER_Y}
                  r={ring.r}
                  fill="none"
                  stroke={lit ? ring.color : 'rgba(148, 163, 184, 0.07)'}
                  strokeWidth={lit ? 1.8 : 1.1}
                  strokeDasharray={ring.dash}
                  style={{ transition: 'stroke 500ms ease, stroke-width 500ms ease' }}
                />
              );
            })}

            <text
              x={CENTER_X}
              y={52}
              textAnchor="middle"
              fill="rgba(148, 163, 184, 0.58)"
              fontSize={12}
              fontWeight={700}
              letterSpacing="0.16em"
              className="font-mono-time"
            >
              KARBONETS UNIVERS • 4 VALENSELEKTRONER • &gt;10 MILL. FORBINDELSER
            </text>
          </g>

          {/* Locked Ghost Radial Stations & Dashed Bonds */}
          {lockedStations.map((node) => {
            const geom = buildRadialBondGeometry(node);
            return (
              <g key={`locked-karbon-${node.id}`}>
                <path
                  d={geom.path}
                  fill="none"
                  stroke="rgba(148, 163, 184, 0.1)"
                  strokeWidth={1.8}
                  strokeDasharray="5 8"
                  className="pointer-events-none"
                />

                {/* Clickable ghost card */}
                <g
                  onClick={(e) => {
                    e.stopPropagation();
                    if (dragRef.current?.moved) return;
                    onSelectStep(node.stepIndex);
                  }}
                  className="cursor-pointer"
                >
                  <rect
                    x={node.x - CARD_W / 2}
                    y={node.y - CARD_H / 2}
                    width={CARD_W}
                    height={CARD_H}
                    rx={16}
                    fill="rgba(15, 23, 42, 0.34)"
                    stroke="rgba(148, 163, 184, 0.14)"
                    strokeWidth={1.3}
                    strokeDasharray="5 7"
                    className="hover:stroke-violet-400/50 transition-colors"
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fill="rgba(148, 163, 184, 0.42)"
                    fontSize={12.5}
                    fontWeight={600}
                    className="pointer-events-none font-mono-time"
                  >
                    Steg {node.stepNumber} • Klikk eller trykk Neste
                  </text>
                </g>

                {/* Subtle ghost pin on carbon core perimeter */}
                <g
                  onClick={(e) => {
                    e.stopPropagation();
                    if (dragRef.current?.moved) return;
                    onSelectStep(node.stepIndex);
                  }}
                  className="cursor-pointer"
                >
                  <circle cx={geom.anchorX} cy={geom.anchorY} r={18} fill="transparent" />
                  <circle
                    cx={geom.anchorX}
                    cy={geom.anchorY}
                    r={9}
                    fill="rgba(11, 17, 32, 0.85)"
                    stroke="rgba(148, 163, 184, 0.35)"
                    strokeWidth={1.6}
                  />
                  <text
                    x={geom.anchorX}
                    y={geom.anchorY + 3.5}
                    textAnchor="middle"
                    fill="#94A3B8"
                    fontSize={9.5}
                    fontWeight={800}
                    className="pointer-events-none font-display"
                  >
                    {node.stepNumber}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Unlocked Radial Stations & Glowing Curved Bonds */}
          {unlockedStations.map((node) => {
            const isSelected = node.stepIndex === currentStepIndex;
            const colors = getCategoryColors(node.category);
            const geom = buildRadialBondGeometry(node);
            const cardLeft = node.x - CARD_W / 2;
            const cardTop = node.y - CARD_H / 2;

            return (
              <g key={node.id} id={`karbon-station-${node.id}`}>
                {/* Ambient glow under bond curve */}
                <path
                  d={geom.path}
                  fill="none"
                  stroke={colors.fill}
                  strokeWidth={isSelected ? 10 : 5}
                  strokeLinecap="round"
                  opacity={isSelected ? 0.34 : 0.12}
                  className="pointer-events-none"
                />

                {/* Crisp animated bond curve */}
                <path
                  d={geom.path}
                  pathLength={1}
                  fill="none"
                  stroke={isSelected ? colors.stroke : colors.fill}
                  strokeWidth={isSelected ? 3.5 : 2.2}
                  strokeLinecap="round"
                  opacity={isSelected ? 1 : 0.78}
                  className="animate-branch-draw pointer-events-none"
                />

                {/* Junction pin on Carbon perimeter */}
                <g
                  onClick={(e) => {
                    e.stopPropagation();
                    if (dragRef.current?.moved) return;
                    onSelectStep(node.stepIndex);
                  }}
                  className="cursor-pointer"
                >
                  <circle cx={geom.anchorX} cy={geom.anchorY} r={24} fill="transparent" />
                  {isSelected && (
                    <circle
                      cx={geom.anchorX}
                      cy={geom.anchorY}
                      r={19}
                      fill="none"
                      stroke={colors.stroke}
                      strokeWidth={2.2}
                      className="node-pulse-ring"
                    />
                  )}
                  <circle
                    cx={geom.anchorX}
                    cy={geom.anchorY}
                    r={isSelected ? 12.5 : 10}
                    fill={isSelected ? colors.fill : '#0B1120'}
                    stroke={isSelected ? '#FFFFFF' : colors.stroke}
                    strokeWidth={isSelected ? 2.6 : 2}
                    filter="url(#karbonSoftGlow)"
                  />
                  <text
                    x={geom.anchorX}
                    y={geom.anchorY + 3.8}
                    textAnchor="middle"
                    fill={isSelected ? '#08101E' : '#F8FAFC'}
                    fontSize={11}
                    fontWeight={800}
                    className="pointer-events-none font-display"
                  >
                    {node.stepNumber}
                  </text>
                </g>

                {/* Radial Molecular Station Card */}
                <g
                  onClick={(e) => {
                    e.stopPropagation();
                    if (dragRef.current?.moved) return;
                    onSelectStep(node.stepIndex);
                  }}
                  className="cursor-pointer"
                >
                  {isSelected && (
                    <rect
                      x={cardLeft - 4}
                      y={cardTop - 4}
                      width={CARD_W + 8}
                      height={CARD_H + 8}
                      rx={20}
                      fill="none"
                      stroke={colors.fill}
                      strokeWidth={2.2}
                      opacity={0.58}
                      filter="url(#karbonSoftGlow)"
                    />
                  )}

                  <rect
                    x={cardLeft}
                    y={cardTop}
                    width={CARD_W}
                    height={CARD_H}
                    rx={16}
                    fill={
                      isSelected
                        ? 'rgba(17, 29, 52, 0.96)'
                        : 'rgba(11, 19, 36, 0.92)'
                    }
                    stroke={isSelected ? colors.stroke : colors.cardBorder}
                    strokeWidth={isSelected ? 2.6 : 1.5}
                  />

                  {/* Left side miniature molecular diagram frame */}
                  <rect
                    x={cardLeft + 10}
                    y={cardTop + 12}
                    width={88}
                    height={80}
                    rx={11}
                    fill="rgba(7, 13, 25, 0.78)"
                    stroke={
                      isSelected
                        ? colors.cardBorder
                        : 'rgba(148, 163, 184, 0.16)'
                    }
                    strokeWidth={1.1}
                  />

                  <g
                    transform={`translate(${cardLeft + 10}, ${cardTop + 14})`}
                    className="pointer-events-none"
                  >
                    <StationMiniDiagram
                      stepIndex={node.stepIndex}
                      chainLength={chainLength}
                      isomerMode={isomerMode}
                      bondOrder={bondOrder}
                      ringMode={ringMode}
                      heteroGroup={heteroGroup}
                      allotropeMode={allotropeMode}
                      elementCompare={elementCompare}
                      accentColor={colors.stroke}
                    />
                  </g>

                  {/* Right side metadata: Step badge + category dot */}
                  <rect
                    x={cardLeft + 108}
                    y={cardTop + 14}
                    width={54}
                    height={20}
                    rx={10}
                    fill={isSelected ? colors.fill : colors.badgeBg}
                  />
                  <text
                    x={cardLeft + 135}
                    y={cardTop + 27.5}
                    textAnchor="middle"
                    fill={isSelected ? '#08101E' : colors.badgeText}
                    fontSize={10.5}
                    fontWeight={800}
                    className="pointer-events-none font-display"
                  >
                    Steg {node.stepNumber}
                  </text>

                  <circle
                    cx={cardLeft + 172}
                    cy={cardTop + 24}
                    r={3.5}
                    fill={colors.fill}
                    className="pointer-events-none"
                  />
                  <text
                    x={cardLeft + 181}
                    y={cardTop + 27.5}
                    fill="#94A3B8"
                    fontSize={10.5}
                    fontWeight={600}
                    className="pointer-events-none"
                  >
                    {node.categoryLabel.length > 18
                      ? `${node.categoryLabel.slice(0, 17)}…`
                      : node.categoryLabel}
                  </text>

                  {/* Bold shortLabel */}
                  <text
                    x={cardLeft + 108}
                    y={cardTop + 57}
                    fill="#FFFFFF"
                    fontSize={node.shortLabel.length > 20 ? 13.5 : 15}
                    fontWeight={800}
                    className="pointer-events-none font-display"
                  >
                    {node.shortLabel}
                  </text>

                  {/* Monospace formulaTag */}
                  <text
                    x={cardLeft + 108}
                    y={cardTop + 82}
                    fill={colors.badgeText}
                    fontSize={11.5}
                    fontWeight={700}
                    className="pointer-events-none font-mono-time"
                  >
                    {node.formulaTag.length > 26
                      ? `${node.formulaTag.slice(0, 25)}…`
                      : node.formulaTag}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Expanding Central Carbon Atom Core at (820, 540) */}
          <g
            id="karbon-central-atom"
            onClick={(e) => {
              e.stopPropagation();
              if (dragRef.current?.moved) return;
              onSelectStep(0);
            }}
            className="cursor-pointer"
          >
            {/* Invisible generous hit area */}
            <circle cx={CENTER_X} cy={CENTER_Y} r={136} fill="transparent" />

            {/* Active selection halo */}
            {isCoreSelected && (
              <circle
                cx={CENTER_X}
                cy={CENTER_Y}
                r={126}
                fill="none"
                stroke="#DDD6FE"
                strokeWidth={2.6}
                opacity={0.75}
                className="node-pulse-ring"
              />
            )}

            {/* Core dark glass backdrop */}
            <circle
              cx={CENTER_X}
              cy={CENTER_Y}
              r={118}
              fill="rgba(10, 16, 32, 0.9)"
              stroke={
                isCoreSelected
                  ? 'rgba(196, 181, 253, 0.72)'
                  : 'rgba(167, 139, 250, 0.35)'
              }
              strokeWidth={isCoreSelected ? 2.6 : 1.6}
              filter="url(#karbonSoftGlow)"
            />

            {coreViewMode === 'bohr' ? (
              <g className="pointer-events-none">
                {/* 4 Radiating Valence Bond Arms */}
                {[45, 135, 225, 315].map((deg) => {
                  const rad = (deg * Math.PI) / 180;
                  const x1 = CENTER_X + Math.cos(rad) * 96;
                  const y1 = CENTER_Y + Math.sin(rad) * 96;
                  const x2 = CENTER_X + Math.cos(rad) * 124;
                  const y2 = CENTER_Y + Math.sin(rad) * 124;
                  return (
                    <g key={deg}>
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#A78BFA"
                        strokeWidth={3}
                        strokeLinecap="round"
                        opacity={0.85}
                      />
                      <circle
                        cx={x2}
                        cy={y2}
                        r={4.2}
                        fill="#DDD6FE"
                        filter="url(#karbonSoftGlow)"
                      />
                    </g>
                  );
                })}

                {/* Outer L-shell (4 valence electrons) */}
                <circle
                  cx={CENTER_X}
                  cy={CENTER_Y}
                  r={96}
                  fill="none"
                  stroke="rgba(56, 189, 248, 0.5)"
                  strokeWidth={2}
                  strokeDasharray="6 5"
                />
                {[45, 135, 225, 315].map((deg) => {
                  const rad = (deg * Math.PI) / 180;
                  const ex = CENTER_X + Math.cos(rad) * 96;
                  const ey = CENTER_Y + Math.sin(rad) * 96;
                  return (
                    <g key={`val-${deg}`}>
                      <circle
                        cx={ex}
                        cy={ey}
                        r={11.5}
                        fill="rgba(56, 189, 248, 0.2)"
                      />
                      <circle
                        cx={ex}
                        cy={ey}
                        r={7}
                        fill="url(#karbonElectronGrad)"
                        stroke="#FFFFFF"
                        strokeWidth={1.4}
                        filter="url(#karbonSoftGlow)"
                      />
                      <text
                        x={ex}
                        y={ey + 3}
                        textAnchor="middle"
                        fill="#082F49"
                        fontSize={8.5}
                        fontWeight={900}
                      >
                        e⁻
                      </text>
                    </g>
                  );
                })}

                {/* Inner K-shell (2 inner electrons) */}
                <circle
                  cx={CENTER_X}
                  cy={CENTER_Y}
                  r={58}
                  fill="none"
                  stroke="rgba(167, 139, 250, 0.55)"
                  strokeWidth={1.8}
                />
                {[0, 180].map((deg) => {
                  const rad = (deg * Math.PI) / 180;
                  const ex = CENTER_X + Math.cos(rad) * 58;
                  const ey = CENTER_Y + Math.sin(rad) * 58;
                  return (
                    <circle
                      key={`inner-${deg}`}
                      cx={ex}
                      cy={ey}
                      r={5.8}
                      fill="#C4B5FD"
                      stroke="#FFFFFF"
                      strokeWidth={1.3}
                    />
                  );
                })}

                {/* Carbon Nucleus */}
                <circle
                  cx={CENTER_X}
                  cy={CENTER_Y}
                  r={34}
                  fill="url(#karbonNucleusGrad)"
                  stroke="#DDD6FE"
                  strokeWidth={2.2}
                  filter="url(#karbonSoftGlow)"
                />
                <text
                  x={CENTER_X}
                  y={CENTER_Y - 1}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize={24}
                  fontWeight={900}
                  className="font-display"
                >
                  C
                </text>
                <text
                  x={CENTER_X}
                  y={CENTER_Y + 16}
                  textAnchor="middle"
                  fill="#EDE9FE"
                  fontSize={10.5}
                  fontWeight={700}
                  className="font-mono-time"
                >
                  6p⁺ 6n⁰
                </text>
              </g>
            ) : (
              /* 3D Tetrahedral CH4 View */
              <g className="pointer-events-none">
                {/* Back-right dashed wedge */}
                <line
                  x1={CENTER_X + 14}
                  y1={CENTER_Y + 8}
                  x2={CENTER_X + 74}
                  y2={CENTER_Y + 34}
                  stroke="#94A3B8"
                  strokeWidth={4}
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                />
                <circle
                  cx={CENTER_X + 82}
                  cy={CENTER_Y + 38}
                  r={14}
                  fill="#1E293B"
                  stroke="#94A3B8"
                  strokeWidth={1.6}
                />
                <text
                  x={CENTER_X + 82}
                  y={CENTER_Y + 42.5}
                  textAnchor="middle"
                  fill="#CBD5E1"
                  fontSize={12}
                  fontWeight={800}
                >
                  H
                </text>

                {/* Top in-plane bond */}
                <line
                  x1={CENTER_X}
                  y1={CENTER_Y}
                  x2={CENTER_X}
                  y2={CENTER_Y - 84}
                  stroke="#A78BFA"
                  strokeWidth={4}
                  strokeLinecap="round"
                />
                <circle
                  cx={CENTER_X}
                  cy={CENTER_Y - 88}
                  r={16}
                  fill="#0F172A"
                  stroke="#DDD6FE"
                  strokeWidth={2}
                />
                <text
                  x={CENTER_X}
                  y={CENTER_Y - 83.5}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize={13}
                  fontWeight={800}
                >
                  H
                </text>

                {/* Bottom-left in-plane bond */}
                <line
                  x1={CENTER_X}
                  y1={CENTER_Y}
                  x2={CENTER_X - 78}
                  y2={CENTER_Y + 46}
                  stroke="#A78BFA"
                  strokeWidth={4}
                  strokeLinecap="round"
                />
                <circle
                  cx={CENTER_X - 84}
                  cy={CENTER_Y + 50}
                  r={16}
                  fill="#0F172A"
                  stroke="#DDD6FE"
                  strokeWidth={2}
                />
                <text
                  x={CENTER_X - 84}
                  y={CENTER_Y + 54.5}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize={13}
                  fontWeight={800}
                >
                  H
                </text>

                {/* Front-bottom-right solid wedge */}
                <polygon
                  points={`${CENTER_X + 6},${CENTER_Y + 8} ${CENTER_X + 46},${CENTER_Y + 76} ${CENTER_X + 26},${CENTER_Y + 86}`}
                  fill="#38BDF8"
                  opacity={0.9}
                />
                <circle
                  cx={CENTER_X + 40}
                  cy={CENTER_Y + 84}
                  r={18}
                  fill="#0369A1"
                  stroke="#BAE6FD"
                  strokeWidth={2.2}
                  filter="url(#karbonSoftGlow)"
                />
                <text
                  x={CENTER_X + 40}
                  y={CENTER_Y + 89}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize={14}
                  fontWeight={800}
                >
                  H
                </text>

                {/* 109.5 degree angle arc */}
                <path
                  d={`M ${CENTER_X} ${CENTER_Y - 46} A 46 46 0 0 0 ${CENTER_X - 39} ${CENTER_Y + 24}`}
                  fill="none"
                  stroke="#FDE68A"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                />
                <text
                  x={CENTER_X - 58}
                  y={CENTER_Y - 22}
                  textAnchor="middle"
                  fill="#FDE68A"
                  fontSize={12.5}
                  fontWeight={800}
                  className="font-mono-time"
                >
                  109,5°
                </text>

                {/* Central Carbon sphere */}
                <circle
                  cx={CENTER_X}
                  cy={CENTER_Y}
                  r={30}
                  fill="url(#karbonNucleusGrad)"
                  stroke="#EDE9FE"
                  strokeWidth={2.4}
                  filter="url(#karbonSoftGlow)"
                />
                <text
                  x={CENTER_X}
                  y={CENTER_Y + 7}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize={22}
                  fontWeight={900}
                  className="font-display"
                >
                  C
                </text>
              </g>
            )}

            {/* Central title pill just below the atom core */}
            <g transform={`translate(${CENTER_X}, ${CENTER_Y + 158})`}>
              <rect
                x={-166}
                y={-18}
                width={332}
                height={36}
                rx={18}
                fill={
                  isCoreSelected
                    ? 'rgba(124, 58, 237, 0.28)'
                    : 'rgba(11, 19, 36, 0.92)'
                }
                stroke={
                  isCoreSelected
                    ? '#DDD6FE'
                    : 'rgba(167, 139, 250, 0.48)'
                }
                strokeWidth={isCoreSelected ? 2 : 1.4}
              />
              <text
                x={0}
                y={4.5}
                textAnchor="middle"
                fill="#F5F3FF"
                fontSize={13}
                fontWeight={800}
                className="pointer-events-none font-display"
              >
                1. Karbonatomet • 4 bindinger • 109,5°
              </text>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
