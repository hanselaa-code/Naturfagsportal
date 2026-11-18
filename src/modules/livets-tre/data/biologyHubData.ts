import type { ThemeId } from './themes';
import { evoImg } from './treeOfLifeData';

export interface BiologyHubNode {
  id: ThemeId;
  order: number;
  title: string;
  subtitle: string;
  cx: number;
  cy: number;
  r: number;
  accentHex: string;
  glowHex: string;
  imageUrl: string;
}

export const BIOLOGY_CENTER_NODE = {
  id: 'biologi' as const,
  title: 'Biologi',
  subtitle: 'Biologiske prosesser',
  dropdownTitle: 'Biologi – Biologiske prosesser',
  dropdownBadge: 'Hovedoversikt • 6 temaer',
  dropdownDescription:
    'Samlet oversikt over cellebiologi, genetikk, proteinsyntese og evolusjon i Naturfag Vg1.',
  cx: 540,
  cy: 375,
  r: 132,
  accentHex: '#10B981',
  imageUrl: evoImg('cell_nucleus.png'),
};

// 6 eksisterende temaer i pedagogisk rekkefølge rundt sentrum
export const BIOLOGY_HUB_NODES: BiologyHubNode[] = [
  {
    id: 'dyrecellen',
    order: 1,
    title: 'Dyrecellen',
    subtitle: 'Organeller & cellebiologi',
    cx: 235,
    cy: 195,
    r: 86,
    accentHex: '#38BDF8',
    glowHex: 'rgba(56, 189, 248, 0.35)',
    imageUrl: evoImg('cell_central_clean.png'),
  },
  {
    id: 'plantecellen',
    order: 2,
    title: 'Plantecellen',
    subtitle: 'Cellevegg & kloroplaster',
    cx: 540,
    cy: 120,
    r: 86,
    accentHex: '#34D399',
    glowHex: 'rgba(52, 211, 153, 0.35)',
    imageUrl: evoImg('plant_central_clean.png'),
  },
  {
    id: 'dna-replikasjon',
    order: 3,
    title: 'DNA-replikasjon',
    subtitle: 'Arvestoff & kopiering',
    cx: 845,
    cy: 195,
    r: 86,
    accentHex: '#A78BFA',
    glowHex: 'rgba(167, 139, 250, 0.35)',
    imageUrl: evoImg('dna_step5_double_helix.png'),
  },
  {
    id: 'proteinsyntesen',
    order: 4,
    title: 'Proteinsyntesen',
    subtitle: 'Fra gen til protein',
    cx: 845,
    cy: 555,
    r: 86,
    accentHex: '#F472B6',
    glowHex: 'rgba(244, 114, 182, 0.35)',
    imageUrl: evoImg('prot_step2_transcription.png'),
  },
  {
    id: 'livets-tre',
    order: 5,
    title: 'Livets Tre',
    subtitle: '3,7 mrd. år med evolusjon',
    cx: 540,
    cy: 630,
    r: 86,
    accentHex: '#F59E0B',
    glowHex: 'rgba(245, 158, 11, 0.35)',
    imageUrl: evoImg('homo_sapiens.png'),
  },
  {
    id: 'kroppens-evolusjon',
    order: 6,
    title: 'Kroppens evolusjon',
    subtitle: 'Evolusjonære spor i oss',
    cx: 235,
    cy: 555,
    r: 86,
    accentHex: '#FB923C',
    glowHex: 'rgba(251, 146, 60, 0.35)',
    imageUrl: evoImg('body_central_clean.png'),
  },
];

export const BIOLOGY_DASHED_ARCS: {
  id: string;
  from: ThemeId;
  to: ThemeId;
  d: string;
}[] = [
  {
    id: 'arc-dyre-plante',
    from: 'dyrecellen',
    to: 'plantecellen',
    d: 'M 310 155 Q 390 105 456 120',
  },
  {
    id: 'arc-plante-dna',
    from: 'plantecellen',
    to: 'dna-replikasjon',
    d: 'M 624 120 Q 690 105 770 155',
  },
  {
    id: 'arc-dna-protein',
    from: 'dna-replikasjon',
    to: 'proteinsyntesen',
    d: 'M 885 275 Q 925 375 885 475',
  },
  {
    id: 'arc-protein-tre',
    from: 'proteinsyntesen',
    to: 'livets-tre',
    d: 'M 770 595 Q 690 645 624 630',
  },
  {
    id: 'arc-tre-kropp',
    from: 'livets-tre',
    to: 'kroppens-evolusjon',
    d: 'M 456 630 Q 390 645 310 595',
  },
  {
    id: 'arc-kropp-dyre',
    from: 'kroppens-evolusjon',
    to: 'dyrecellen',
    d: 'M 195 475 Q 155 375 195 275',
  },
];
