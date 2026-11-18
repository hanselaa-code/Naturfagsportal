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
  dropdownBadge: 'Hovedoversikt • 7 temaer',
  dropdownDescription:
    'Samlet oversikt over cellebiologi, genetikk, proteinsyntese og evolusjon i Naturfag Vg1.',
  cx: 540,
  cy: 375,
  r: 124,
  accentHex: '#10B981',
  imageUrl: evoImg('cell_nucleus.png'),
};

// 7 temaer i pedagogisk rekkefølge i en jevn ring rundt sentrum (r_ring ≈ 270)
export const BIOLOGY_HUB_NODES: BiologyHubNode[] = [
  {
    id: 'dyrecellen',
    order: 1,
    title: 'Dyrecellen',
    subtitle: 'Organeller & cellebiologi',
    cx: 540,
    cy: 105,
    r: 76,
    accentHex: '#38BDF8',
    glowHex: 'rgba(56, 189, 248, 0.35)',
    imageUrl: evoImg('cell_central_clean.png'),
  },
  {
    id: 'plantecellen',
    order: 2,
    title: 'Plantecellen',
    subtitle: 'Cellevegg & kloroplaster',
    cx: 760,
    cy: 205,
    r: 76,
    accentHex: '#34D399',
    glowHex: 'rgba(52, 211, 153, 0.35)',
    imageUrl: evoImg('plant_central_clean.png'),
  },
  {
    id: 'dna-replikasjon',
    order: 3,
    title: 'DNA-replikasjon',
    subtitle: 'Arvestoff & kopiering',
    cx: 815,
    cy: 435,
    r: 76,
    accentHex: '#A78BFA',
    glowHex: 'rgba(167, 139, 250, 0.35)',
    imageUrl: evoImg('dna_step5_double_helix.png'),
  },
  {
    id: 'proteinsyntesen',
    order: 4,
    title: 'Proteinsyntesen',
    subtitle: 'Fra gen til protein',
    cx: 665,
    cy: 620,
    r: 76,
    accentHex: '#F472B6',
    glowHex: 'rgba(244, 114, 182, 0.35)',
    imageUrl: evoImg('prot_step2_transcription.png'),
  },
  {
    id: 'evolusjon',
    order: 5,
    title: 'Hva er evolusjon?',
    subtitle: 'Mekanismer, eksempler & bevis',
    cx: 415,
    cy: 620,
    r: 76,
    accentHex: '#2DD4BF',
    glowHex: 'rgba(45, 212, 191, 0.35)',
    imageUrl: evoImg('evo_step1_what.jpg'),
  },
  {
    id: 'livets-tre',
    order: 6,
    title: 'Livets Tre',
    subtitle: '3,7 mrd. år med evolusjon',
    cx: 265,
    cy: 435,
    r: 76,
    accentHex: '#F59E0B',
    glowHex: 'rgba(245, 158, 11, 0.35)',
    imageUrl: evoImg('homo_sapiens.png'),
  },
  {
    id: 'kroppens-evolusjon',
    order: 7,
    title: 'Kroppens evolusjon',
    subtitle: 'Evolusjonære spor i oss',
    cx: 320,
    cy: 205,
    r: 76,
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
    id: 'arc-1-2',
    from: 'dyrecellen',
    to: 'plantecellen',
    d: 'M 612 118 Q 665 130 702 158',
  },
  {
    id: 'arc-2-3',
    from: 'plantecellen',
    to: 'dna-replikasjon',
    d: 'M 795 274 Q 825 320 818 360',
  },
  {
    id: 'arc-3-4',
    from: 'dna-replikasjon',
    to: 'proteinsyntesen',
    d: 'M 780 503 Q 750 555 718 575',
  },
  {
    id: 'arc-4-5',
    from: 'proteinsyntesen',
    to: 'evolusjon',
    d: 'M 589 635 Q 540 655 491 635',
  },
  {
    id: 'arc-5-6',
    from: 'evolusjon',
    to: 'livets-tre',
    d: 'M 362 575 Q 330 555 300 503',
  },
  {
    id: 'arc-6-7',
    from: 'livets-tre',
    to: 'kroppens-evolusjon',
    d: 'M 262 360 Q 255 320 285 274',
  },
  {
    id: 'arc-7-1',
    from: 'kroppens-evolusjon',
    to: 'dyrecellen',
    d: 'M 378 158 Q 415 130 468 118',
  },
];
