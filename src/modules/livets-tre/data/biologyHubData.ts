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
  dropdownBadge: 'Hovedoversikt • 8 temaer',
  dropdownDescription:
    'Samlet oversikt over cellebiologi, genetikk, proteinsyntese og evolusjon i Naturfag Vg1.',
  cx: 540,
  cy: 375,
  r: 120,
  accentHex: '#10B981',
  imageUrl: evoImg('cell_nucleus.png'),
};

// 8 temaer i pedagogisk rekkefølge i en jevn ring rundt sentrum
export const BIOLOGY_HUB_NODES: BiologyHubNode[] = [
  {
    id: 'dyrecellen',
    order: 1,
    title: 'Dyrecellen',
    subtitle: 'Organeller & cellebiologi',
    cx: 540,
    cy: 105,
    r: 72,
    accentHex: '#38BDF8',
    glowHex: 'rgba(56, 189, 248, 0.35)',
    imageUrl: evoImg('cell_central_clean.png'),
  },
  {
    id: 'plantecellen',
    order: 2,
    title: 'Plantecellen',
    subtitle: 'Cellevegg & kloroplaster',
    cx: 734,
    cy: 184,
    r: 72,
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
    cy: 375,
    r: 72,
    accentHex: '#A78BFA',
    glowHex: 'rgba(167, 139, 250, 0.35)',
    imageUrl: evoImg('dna_step5_double_helix.png'),
  },
  {
    id: 'proteinsyntesen',
    order: 4,
    title: 'Proteinsyntesen',
    subtitle: 'Fra gen til protein',
    cx: 734,
    cy: 566,
    r: 72,
    accentHex: '#F472B6',
    glowHex: 'rgba(244, 114, 182, 0.35)',
    imageUrl: evoImg('prot_step2_transcription.png'),
  },
  {
    id: 'genetikk',
    order: 5,
    title: 'Genetikk',
    subtitle: 'Arv, meiose & krysningskjema',
    cx: 540,
    cy: 645,
    r: 72,
    accentHex: '#C084FC',
    glowHex: 'rgba(192, 132, 252, 0.35)',
    imageUrl: evoImg('gen_step5_punnett.jpg'),
  },
  {
    id: 'evolusjon',
    order: 6,
    title: 'Hva er evolusjon?',
    subtitle: 'Mekanismer, eksempler & bevis',
    cx: 346,
    cy: 566,
    r: 72,
    accentHex: '#2DD4BF',
    glowHex: 'rgba(45, 212, 191, 0.35)',
    imageUrl: evoImg('evo_step1_what.jpg'),
  },
  {
    id: 'livets-tre',
    order: 7,
    title: 'Livets Tre',
    subtitle: '3,7 mrd. år med evolusjon',
    cx: 265,
    cy: 375,
    r: 72,
    accentHex: '#F59E0B',
    glowHex: 'rgba(245, 158, 11, 0.35)',
    imageUrl: evoImg('homo_sapiens.png'),
  },
  {
    id: 'kroppens-evolusjon',
    order: 8,
    title: 'Kroppens evolusjon',
    subtitle: 'Evolusjonære spor i oss',
    cx: 346,
    cy: 184,
    r: 72,
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
    d: 'M 608 118 Q 652 128 682 148',
  },
  {
    id: 'arc-2-3',
    from: 'plantecellen',
    to: 'dna-replikasjon',
    d: 'M 774 244 Q 802 280 810 306',
  },
  {
    id: 'arc-3-4',
    from: 'dna-replikasjon',
    to: 'proteinsyntesen',
    d: 'M 810 444 Q 802 470 774 506',
  },
  {
    id: 'arc-4-5',
    from: 'proteinsyntesen',
    to: 'genetikk',
    d: 'M 682 602 Q 652 622 608 632',
  },
  {
    id: 'arc-5-6',
    from: 'genetikk',
    to: 'evolusjon',
    d: 'M 472 632 Q 428 622 398 602',
  },
  {
    id: 'arc-6-7',
    from: 'evolusjon',
    to: 'livets-tre',
    d: 'M 306 506 Q 278 470 270 444',
  },
  {
    id: 'arc-7-8',
    from: 'livets-tre',
    to: 'kroppens-evolusjon',
    d: 'M 270 306 Q 278 280 306 244',
  },
  {
    id: 'arc-8-1',
    from: 'kroppens-evolusjon',
    to: 'dyrecellen',
    d: 'M 398 148 Q 428 128 472 118',
  },
];
