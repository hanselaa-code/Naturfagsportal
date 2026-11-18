import { Atom, Sparkles, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BOHR_ATOM_PRESETS } from '../data/atomBindingData';

interface AtomBindingExplorerProps {
  currentStepIndex: number;
  onSelectStep: (idx: number) => void;
}

type MoleculeId = 'H2' | 'CH4' | 'CO2' | 'H2O';

function getShellRadius(shellIdx: number): number {
  return 78 + shellIdx * 48;
}

export function AtomBindingExplorer({
  currentStepIndex,
}: AtomBindingExplorerProps) {
  const [selectedAtomSymbol, setSelectedAtomSymbol] = useState<string>('C');
  const [selectedMolecule, setSelectedMolecule] = useState<MoleculeId>('CH4');
  const [ionicTransferred, setIonicTransferred] = useState<boolean>(true);
  const [voltageOn, setVoltageOn] = useState<boolean>(true);

  useEffect(() => {
    if (currentStepIndex === 0) setSelectedAtomSymbol('C');
    if (currentStepIndex === 1) setSelectedAtomSymbol('O');
    if (currentStepIndex === 2) setSelectedAtomSymbol('Ne');
    if (currentStepIndex === 3) setSelectedMolecule('CH4');
    if (currentStepIndex === 4) setSelectedMolecule('H2O');
    if (currentStepIndex === 5) setIonicTransferred(true);
    if (currentStepIndex === 6) setVoltageOn(true);
  }, [currentStepIndex]);

  const activeAtom =
    BOHR_ATOM_PRESETS.find((a) => a.symbol === selectedAtomSymbol) ??
    BOHR_ATOM_PRESETS[1];

  const isBohrMode = currentStepIndex <= 2;
  const isCovalentMode = currentStepIndex === 3 || currentStepIndex === 4;
  const isIonicMode = currentStepIndex === 5;
  const isMetallicMode = currentStepIndex === 6;
  const isComparisonMode = currentStepIndex === 7;

  return (
    <div className="relative w-full h-full rounded-2xl border border-slate-800/90 bg-[#070D19] overflow-hidden shadow-2xl flex flex-col select-none">
      {/* Top Interactive Lab Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <Atom className="w-4 h-4 text-violet-300" />
          <span className="text-xs font-extrabold text-violet-100">
            Atom- &amp; Bindingslab
          </span>
        </div>

        {/* Dynamic interactive controls depending on active step */}
        {isBohrMode && (
          <div className="flex flex-wrap items-center gap-1">
            {BOHR_ATOM_PRESETS.map((preset) => (
              <button
                key={preset.symbol}
                type="button"
                onClick={() => setSelectedAtomSymbol(preset.symbol)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                  preset.symbol === activeAtom.symbol
                    ? 'bg-violet-500 text-slate-950 border-violet-300'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                {preset.symbol}
              </button>
            ))}
          </div>
        )}

        {isCovalentMode && (
          <div className="flex flex-wrap items-center gap-1">
            {(
              [
                { id: 'H2', label: 'H₂ (enkelt)' },
                { id: 'CH4', label: 'CH₄ (4 bindinger)' },
                { id: 'CO2', label: 'CO₂ (dobbelt)' },
                { id: 'H2O', label: 'H₂O (polar)' },
              ] as { id: MoleculeId; label: string }[]
            ).map((mol) => (
              <button
                key={mol.id}
                type="button"
                onClick={() => setSelectedMolecule(mol.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                  selectedMolecule === mol.id
                    ? 'bg-sky-400 text-slate-950 border-sky-200'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                {mol.label}
              </button>
            ))}
          </div>
        )}

        {isIonicMode && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIonicTransferred(false)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer ${
                !ionicTransferred
                  ? 'bg-amber-400 text-slate-950 border-amber-200'
                  : 'bg-slate-900 text-slate-300 border-slate-700'
              }`}
            >
              Før overføring (Na + Cl)
            </button>
            <button
              type="button"
              onClick={() => setIonicTransferred(true)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer ${
                ionicTransferred
                  ? 'bg-emerald-400 text-slate-950 border-emerald-200'
                  : 'bg-slate-900 text-slate-300 border-slate-700'
              }`}
            >
              Etter overføring (Na⁺Cl⁻)
            </button>
          </div>
        )}

        {isMetallicMode && (
          <button
            type="button"
            onClick={() => setVoltageOn((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold border cursor-pointer ${
              voltageOn
                ? 'bg-amber-400 text-slate-950 border-amber-200'
                : 'bg-slate-900 text-slate-300 border-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{voltageOn ? 'Spenning PÅ (strøm går)' : 'Spenning AV'}</span>
          </button>
        )}

        {isComparisonMode && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>3 hovedtyper kjemisk binding</span>
          </span>
        )}
      </div>

      {/* Main Lab Canvas */}
      <div className="flex-1 min-h-0 w-full flex items-center justify-center p-2 sm:p-4">
        {isBohrMode && (
          <svg
            viewBox="0 0 800 500"
            className="w-full h-full max-h-full"
            role="img"
            aria-label={`Bohr-modell av ${activeAtom.name}`}
          >
            <defs>
              <radialGradient id="bohr-core-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={activeAtom.accent} stopOpacity="0.45" />
                <stop offset="100%" stopColor="#070D19" stopOpacity="0" />
              </radialGradient>
            </defs>

            <circle cx="400" cy="230" r="210" fill="url(#bohr-core-glow)" />

            {/* Shells */}
            {activeAtom.shells.map((electronCount, shellIdx) => {
              const r = getShellRadius(shellIdx);
              const isOuter = shellIdx === activeAtom.shells.length - 1;
              const shellNames = ['K-skall', 'L-skall', 'M-skall'];

              return (
                <g key={`shell-${shellIdx}`}>
                  <circle
                    cx="400"
                    cy="230"
                    r={r}
                    fill="none"
                    stroke={isOuter ? activeAtom.accent : '#475569'}
                    strokeWidth={isOuter ? 2.5 : 1.5}
                    strokeDasharray={isOuter ? undefined : '5 5'}
                  />
                  <text
                    x="400"
                    y={230 - r - 6}
                    textAnchor="middle"
                    fill={isOuter ? activeAtom.accent : '#94A3B8'}
                    fontSize="11"
                    fontWeight="700"
                  >
                    {shellNames[shellIdx]} ({electronCount} e⁻)
                  </text>

                  {/* Electrons */}
                  {Array.from({ length: electronCount }).map((_, eIdx) => {
                    const angle =
                      (eIdx / electronCount) * Math.PI * 2 - Math.PI / 2;
                    const ex = 400 + Math.cos(angle) * r;
                    const ey = 230 + Math.sin(angle) * r;
                    return (
                      <g key={`e-${shellIdx}-${eIdx}`}>
                        <circle
                          cx={ex}
                          cy={ey}
                          r={isOuter ? 9 : 7}
                          fill={isOuter ? activeAtom.accent : '#38BDF8'}
                          stroke="#070D19"
                          strokeWidth="2"
                        />
                        <text
                          x={ex}
                          y={ey + 3}
                          textAnchor="middle"
                          fill="#070D19"
                          fontSize="9"
                          fontWeight="900"
                        >
                          –
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* Nucleus */}
            <circle
              cx="400"
              cy="230"
              r="38"
              fill="#1E293B"
              stroke={activeAtom.accent}
              strokeWidth="3"
            />
            <text
              x="400"
              y="226"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="22"
              fontWeight="900"
            >
              {activeAtom.symbol}
            </text>
            <text
              x="400"
              y="244"
              textAnchor="middle"
              fill="#CBD5E1"
              fontSize="10.5"
              fontWeight="700"
            >
              {activeAtom.atomicNumber} p⁺ • {activeAtom.neutrons} n⁰
            </text>

            {/* Bottom info strip */}
            <rect
              x="90"
              y="420"
              width="620"
              height="62"
              rx="14"
              fill="rgba(15, 23, 42, 0.9)"
              stroke="#334155"
            />
            <text
              x="115"
              y="445"
              fill="#FFFFFF"
              fontSize="15"
              fontWeight="800"
            >
              {activeAtom.name} ({activeAtom.symbol}) — Skall:{' '}
              {activeAtom.shells.join(' – ')}
            </text>
            <text x="115" y="466" fill={activeAtom.accent} fontSize="12.5" fontWeight="700">
              {activeAtom.groupNote} • {activeAtom.octetNeed}
            </text>
          </svg>
        )}

        {isCovalentMode && (
          <svg
            viewBox="0 0 800 500"
            className="w-full h-full max-h-full"
            role="img"
            aria-label={`Kovalent binding i ${selectedMolecule}`}
          >
            {selectedMolecule === 'H2' && (
              <g>
                <circle
                  cx="330"
                  cy="230"
                  r="95"
                  fill="rgba(56, 189, 248, 0.12)"
                  stroke="#38BDF8"
                  strokeWidth="2.5"
                />
                <circle
                  cx="470"
                  cy="230"
                  r="95"
                  fill="rgba(167, 139, 250, 0.12)"
                  stroke="#A78BFA"
                  strokeWidth="2.5"
                />
                <circle cx="330" cy="230" r="28" fill="#0F172A" stroke="#38BDF8" strokeWidth="3" />
                <text x="330" y="237" textAnchor="middle" fill="#FFF" fontSize="20" fontWeight="900">H</text>
                <circle cx="470" cy="230" r="28" fill="#0F172A" stroke="#A78BFA" strokeWidth="3" />
                <text x="470" y="237" textAnchor="middle" fill="#FFF" fontSize="20" fontWeight="900">H</text>

                {/* Shared electron pair */}
                <circle cx="400" cy="212" r="9" fill="#FBBF24" />
                <circle cx="400" cy="248" r="9" fill="#FBBF24" />
                <text x="400" y="370" textAnchor="middle" fill="#E2E8F0" fontSize="15" fontWeight="800">
                  Hydrogengass (H₂): 1 delt elektronpar → H–H (upolar enkeltbinding)
                </text>
              </g>
            )}

            {selectedMolecule === 'CH4' && (
              <g>
                {/* Bonds */}
                {[
                  { x: 400, y: 105 },
                  { x: 400, y: 355 },
                  { x: 265, y: 230 },
                  { x: 535, y: 230 },
                ].map((pos, idx) => (
                  <g key={`ch4-h-${idx}`}>
                    <line
                      x1="400"
                      y1="230"
                      x2={pos.x}
                      y2={pos.y}
                      stroke="#A78BFA"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <circle
                      cx={(400 + pos.x) / 2 - 5}
                      cy={(230 + pos.y) / 2}
                      r="5"
                      fill="#FBBF24"
                    />
                    <circle
                      cx={(400 + pos.x) / 2 + 5}
                      cy={(230 + pos.y) / 2}
                      r="5"
                      fill="#FBBF24"
                    />
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="30"
                      fill="#0F172A"
                      stroke="#38BDF8"
                      strokeWidth="3"
                    />
                    <text
                      x={pos.x}
                      y={pos.y + 7}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="19"
                      fontWeight="900"
                    >
                      H
                    </text>
                  </g>
                ))}
                <circle cx="400" cy="230" r="44" fill="#1E1B4B" stroke="#A78BFA" strokeWidth="3.5" />
                <text x="400" y="238" textAnchor="middle" fill="#FFFFFF" fontSize="26" fontWeight="900">C</text>
                <text x="400" y="445" textAnchor="middle" fill="#E2E8F0" fontSize="15" fontWeight="800">
                  Metan (CH₄): Karbon deler 4 elektronpar → 8 elektroner rundt C, 2 rundt hver H
                </text>
              </g>
            )}

            {selectedMolecule === 'CO2' && (
              <g>
                {/* Double bonds */}
                <line x1="255" y1="216" x2="365" y2="216" stroke="#F472B6" strokeWidth="5" />
                <line x1="255" y1="244" x2="365" y2="244" stroke="#F472B6" strokeWidth="5" />
                <line x1="435" y1="216" x2="545" y2="216" stroke="#F472B6" strokeWidth="5" />
                <line x1="435" y1="244" x2="545" y2="244" stroke="#F472B6" strokeWidth="5" />

                <circle cx="220" cy="230" r="42" fill="#3B0764" stroke="#F472B6" strokeWidth="3.5" />
                <text x="220" y="238" textAnchor="middle" fill="#FFF" fontSize="24" fontWeight="900">O</text>

                <circle cx="400" cy="230" r="46" fill="#1E1B4B" stroke="#A78BFA" strokeWidth="3.5" />
                <text x="400" y="238" textAnchor="middle" fill="#FFF" fontSize="26" fontWeight="900">C</text>

                <circle cx="580" cy="230" r="42" fill="#3B0764" stroke="#F472B6" strokeWidth="3.5" />
                <text x="580" y="238" textAnchor="middle" fill="#FFF" fontSize="24" fontWeight="900">O</text>

                <text x="400" y="360" textAnchor="middle" fill="#E2E8F0" fontSize="15" fontWeight="800">
                  Karbondioksid (CO₂): To dobbeltbindinger (O=C=O) gir rettlinjet, upolart molekyl
                </text>
              </g>
            )}

            {selectedMolecule === 'H2O' && (
              <g>
                <ellipse
                  cx="400"
                  cy="225"
                  rx="170"
                  ry="120"
                  fill="rgba(244, 114, 182, 0.08)"
                  stroke="#38BDF8"
                  strokeDasharray="6 6"
                  strokeWidth="1.5"
                />
                <line x1="400" y1="185" x2="290" y2="290" stroke="#38BDF8" strokeWidth="7" strokeLinecap="round" />
                <line x1="400" y1="185" x2="510" y2="290" stroke="#38BDF8" strokeWidth="7" strokeLinecap="round" />

                <circle cx="400" cy="185" r="46" fill="#500724" stroke="#F472B6" strokeWidth="3.5" />
                <text x="400" y="193" textAnchor="middle" fill="#FFF" fontSize="26" fontWeight="900">O</text>
                <text x="400" y="122" textAnchor="middle" fill="#F472B6" fontSize="18" fontWeight="900">
                  δ⁻ (trekker elektroner)
                </text>

                <circle cx="290" cy="290" r="32" fill="#0C4A6E" stroke="#38BDF8" strokeWidth="3" />
                <text x="290" y="298" textAnchor="middle" fill="#FFF" fontSize="20" fontWeight="900">H</text>
                <text x="240" y="340" textAnchor="middle" fill="#38BDF8" fontSize="16" fontWeight="900">δ⁺</text>

                <circle cx="510" cy="290" r="32" fill="#0C4A6E" stroke="#38BDF8" strokeWidth="3" />
                <text x="510" y="298" textAnchor="middle" fill="#FFF" fontSize="20" fontWeight="900">H</text>
                <text x="560" y="340" textAnchor="middle" fill="#38BDF8" fontSize="16" fontWeight="900">δ⁺</text>

                <text x="400" y="425" textAnchor="middle" fill="#E2E8F0" fontSize="15" fontWeight="800">
                  Vann (H₂O): Bøyd form (104,5°) + skjev deling gjør vannmolekylet til en polar dipol
                </text>
              </g>
            )}
          </svg>
        )}

        {isIonicMode && (
          <svg
            viewBox="0 0 800 500"
            className="w-full h-full max-h-full"
            role="img"
            aria-label="Ionebinding mellom Natrium og Klor"
          >
            {/* Left: Na -> Cl transfer */}
            <circle cx="170" cy="230" r="90" fill="rgba(245, 158, 11, 0.08)" stroke="#F59E0B" strokeWidth="2.5" />
            <circle cx="170" cy="230" r="40" fill="#1E293B" stroke="#F59E0B" strokeWidth="3" />
            <text x="170" y="236" textAnchor="middle" fill="#FFF" fontSize="22" fontWeight="900">
              {ionicTransferred ? 'Na⁺' : 'Na'}
            </text>
            <text x="170" y="355" textAnchor="middle" fill="#FCD34D" fontSize="13" fontWeight="700">
              {ionicTransferred ? '2 – 8 (fullt L-skall!)' : '2 – 8 – 1 (1 valenselektron)'}
            </text>

            <circle cx="380" cy="230" r="95" fill="rgba(45, 212, 191, 0.08)" stroke="#2DD4BF" strokeWidth="2.5" />
            <circle cx="380" cy="230" r="40" fill="#1E293B" stroke="#2DD4BF" strokeWidth="3" />
            <text x="380" y="236" textAnchor="middle" fill="#FFF" fontSize="22" fontWeight="900">
              {ionicTransferred ? 'Cl⁻' : 'Cl'}
            </text>
            <text x="380" y="355" textAnchor="middle" fill="#5EEAD4" fontSize="13" fontWeight="700">
              {ionicTransferred ? '2 – 8 – 8 (fullt M-skall!)' : '2 – 8 – 7 (mangler 1 e⁻)'}
            </text>

            {/* Transferring electron */}
            <path
              d="M 225 145 Q 280 95 335 145"
              fill="none"
              stroke="#FBBF24"
              strokeWidth="3"
              strokeDasharray="6 4"
            />
            <circle
              cx={ionicTransferred ? 335 : 225}
              cy={145}
              r="10"
              fill="#FBBF24"
            />

            {/* Right: 3x3 Salt crystal lattice */}
            <text x="645" y="105" textAnchor="middle" fill="#E2E8F0" fontSize="14" fontWeight="800">
              NaCl Ionegitter
            </text>
            {[0, 1, 2].map((row) =>
              [0, 1, 2].map((col) => {
                const isNa = (row + col) % 2 === 0;
                const cx = 575 + col * 70;
                const cy = 155 + row * 70;
                return (
                  <g key={`lat-${row}-${col}`}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isNa ? 20 : 26}
                      fill={isNa ? '#F59E0B' : '#2DD4BF'}
                      fillOpacity="0.25"
                      stroke={isNa ? '#F59E0B' : '#2DD4BF'}
                      strokeWidth="2.5"
                    />
                    <text
                      x={cx}
                      y={cy + 5}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="13"
                      fontWeight="900"
                    >
                      {isNa ? 'Na⁺' : 'Cl⁻'}
                    </text>
                  </g>
                );
              }),
            )}

            <text x="400" y="455" textAnchor="middle" fill="#CBD5E1" fontSize="14" fontWeight="700">
              Motsatte ladninger (Na⁺ og Cl⁻) tiltrekker hverandre i et sterkt 3D-krystallgitter
            </text>
          </svg>
        )}

        {isMetallicMode && (
          <svg
            viewBox="0 0 800 500"
            className="w-full h-full max-h-full"
            role="img"
            aria-label="Metallbinding og elektronhav"
          >
            {/* Positive metal ion grid */}
            {[0, 1, 2].map((row) =>
              [0, 1, 2, 3, 4].map((col) => {
                const cx = 160 + col * 120;
                const cy = 135 + row * 105;
                return (
                  <g key={`metal-${row}-${col}`}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r="30"
                      fill="rgba(251, 146, 60, 0.22)"
                      stroke="#FB923C"
                      strokeWidth="3"
                    />
                    <text
                      x={cx}
                      y={cy + 6}
                      textAnchor="middle"
                      fill="#FED7AA"
                      fontSize="15"
                      fontWeight="900"
                    >
                      Cu²⁺
                    </text>
                  </g>
                );
              }),
            )}

            {/* Free electrons in the electron sea */}
            {[
              { x: 110, y: 185 },
              { x: 220, y: 95 },
              { x: 340, y: 290 },
              { x: 460, y: 185 },
              { x: 580, y: 95 },
              { x: 690, y: 290 },
              { x: 280, y: 190 },
              { x: 520, y: 285 },
              { x: 640, y: 185 },
              { x: 180, y: 310 },
            ].map((e, i) => (
              <g key={`sea-e-${i}`}>
                {voltageOn && (
                  <line
                    x1={e.x - 24}
                    y1={e.y}
                    x2={e.x}
                    y2={e.y}
                    stroke="#38BDF8"
                    strokeWidth="2.5"
                    strokeOpacity="0.65"
                  />
                )}
                <circle cx={e.x} cy={e.y} r="8" fill="#38BDF8" />
                <text
                  x={e.x}
                  y={e.y + 3}
                  textAnchor="middle"
                  fill="#070D19"
                  fontSize="10"
                  fontWeight="900"
                >
                  –
                </text>
              </g>
            ))}

            <text x="400" y="445" textAnchor="middle" fill="#E2E8F0" fontSize="14.5" fontWeight="800">
              {voltageOn
                ? 'Spenning PÅ: Frie elektroner i elektronhavet strømmer gjennom hele kobbernettet!'
                : 'Spenning AV: Elektronene beveger seg tilfeldig rundt de positive metallionene.'}
            </text>
          </svg>
        )}

        {isComparisonMode && (
          <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 gap-3 p-2 overflow-y-auto">
            {[
              {
                title: 'Elektronparbinding',
                sub: 'Ikke-metall + ikke-metall',
                example: 'Vann (H₂O), Metan (CH₄), Sukker',
                accent: '#38BDF8',
                points: [
                  'Deler elektronpar i molekyler',
                  'Ofte lavt smelte- og kokepunkt',
                  'Leder ikke strøm',
                ],
              },
              {
                title: 'Ionebinding',
                sub: 'Metall + ikke-metall',
                example: 'Bordsalt (NaCl), Kalsiumkarbonat',
                accent: '#2DD4BF',
                points: [
                  'Elektronoverføring → ionegitter',
                  'Høyt smeltepunkt (sprø krystaller)',
                  'Leder strøm i vann eller som smelte',
                ],
              },
              {
                title: 'Metallbinding',
                sub: 'Metall + metall',
                example: 'Kobber (Cu), Jern (Fe), Gull (Au)',
                accent: '#FB923C',
                points: [
                  'Positive ioner i fritt elektronhav',
                  'Leder strøm og varme i fast form',
                  'Formbare – kan bøyes og valses',
                ],
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border bg-slate-900/85 p-4 flex flex-col justify-between space-y-3"
                style={{ borderColor: `${card.accent}66` }}
              >
                <div>
                  <div
                    className="text-xs font-mono font-bold uppercase tracking-wider"
                    style={{ color: card.accent }}
                  >
                    {card.sub}
                  </div>
                  <h3 className="text-lg font-extrabold text-white mt-0.5">
                    {card.title}
                  </h3>
                  <div className="text-xs text-slate-400 mt-1">
                    Eksempel: <strong className="text-slate-200">{card.example}</strong>
                  </div>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-200">
                  {card.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/70 border border-slate-800"
                    >
                      <span
                        className="w-2 h-2 rounded-full mt-1 shrink-0"
                        style={{ backgroundColor: card.accent }}
                      />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
