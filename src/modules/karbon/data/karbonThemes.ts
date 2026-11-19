export type KarbonThemeId =
  | 'atommodell-bindinger'
  | 'karbonatomet'
  | 'hydrokarboner'
  | 'alkoholer'
  | 'karboksylsyrer-estere'
  | 'polymerer-plast'
  | 'karbonsyklusen';

export type KarbonAppView = 'karbon' | KarbonThemeId;

export interface KarbonThemeMeta {
  id: KarbonThemeId;
  order: number;
  title: string;
  shortTitle: string;
  dropdownTitle: string;
  dropdownBadge: string;
  dropdownDescription: string;
  accentHex: string;
  glowHex: string;
  cx: number;
  cy: number;
  r: number;
  ready: boolean;
}

export const KARBON_CENTER_NODE = {
  id: 'karbon' as const,
  title: 'Karbon',
  subtitle: 'Kjemi i hverdagen',
  dropdownTitle: 'Karbon – Oversikt',
  dropdownBadge: 'Hovedoversikt • 7 undertemaer',
  dropdownDescription:
    'Samlet meny for karbonkjemi, kjemiske bindinger, organiske stoffgrupper, plast og karbonsyklusen i Naturfag Vg1.',
  cx: 540,
  cy: 375,
  r: 120,
  accentHex: '#A78BFA',
  imageUrl: './assets/portal/card_karbon.jpg',
};

// 7 undertemaer i pedagogisk rekkefølge plassert i en jevn ring rundt sentrum
export const KARBON_THEME_LIST: KarbonThemeMeta[] = [
  {
    id: 'atommodell-bindinger',
    order: 1,
    title: 'Atommodell & kjemiske bindinger',
    shortTitle: 'Bindinger',
    dropdownTitle: 'Atommodell & bindinger',
    dropdownBadge: 'Grunnlag • Oktett & bindinger',
    dropdownDescription:
      'Skallmodell, valenselektroner, oktettregelen, elektronparbinding (kovalent) og ionebinding.',
    accentHex: '#38BDF8',
    glowHex: 'rgba(56, 189, 248, 0.35)',
    cx: 540,
    cy: 105,
    r: 74,
    ready: true,
  },
  {
    id: 'karbonatomet',
    order: 2,
    title: 'Karbonatomet & mangfoldet',
    shortTitle: 'Karbonatomet',
    dropdownTitle: 'Karbonatomet & struktur',
    dropdownBadge: '4 bindinger • Kjeder & ringer',
    dropdownDescription:
      'Hvorfor karbon er livets og kjemiens byggestein: 4 bindinger, kjeder, forgreninger, ringer og dobbeltbindinger.',
    accentHex: '#A78BFA',
    glowHex: 'rgba(167, 139, 250, 0.35)',
    cx: 760,
    cy: 205,
    r: 74,
    ready: false,
  },
  {
    id: 'hydrokarboner',
    order: 3,
    title: 'Hydrokarboner (alkaner, alkener & alkyner)',
    shortTitle: 'Hydrokarboner',
    dropdownTitle: 'Hydrokarboner',
    dropdownBadge: 'Alkaner • Alkener • Alkyner',
    dropdownDescription:
      'Metan til oktan, navnsetting, mettede og umettede hydrokarboner, forbrenning og fossile brennstoffer.',
    accentHex: '#F59E0B',
    glowHex: 'rgba(245, 158, 11, 0.35)',
    cx: 815,
    cy: 435,
    r: 74,
    ready: false,
  },
  {
    id: 'alkoholer',
    order: 4,
    title: 'Alkoholer',
    shortTitle: 'Alkoholer',
    dropdownTitle: 'Alkoholer',
    dropdownBadge: 'Funksjonell gruppe • –OH',
    dropdownDescription:
      'Hydroksylgruppen (–OH), metanol, etanol, propanol, løselighet, kokepunkt og bruk i hverdag og industri.',
    accentHex: '#2DD4BF',
    glowHex: 'rgba(45, 212, 191, 0.35)',
    cx: 665,
    cy: 620,
    r: 74,
    ready: false,
  },
  {
    id: 'karboksylsyrer-estere',
    order: 5,
    title: 'Karboksylsyrer & estere',
    shortTitle: 'Syrer & estere',
    dropdownTitle: 'Karboksylsyrer & estere',
    dropdownBadge: '–COOH • Lukt & smak',
    dropdownDescription:
      'Karboksylgruppen (–COOH), maursyre, eddiksyre, reaksjon med alkoholer til estere og aromastoffer.',
    accentHex: '#F472B6',
    glowHex: 'rgba(244, 114, 182, 0.35)',
    cx: 415,
    cy: 620,
    r: 74,
    ready: false,
  },
  {
    id: 'polymerer-plast',
    order: 6,
    title: 'Polymerer, plast & bærekraft',
    shortTitle: 'Polymerer & plast',
    dropdownTitle: 'Polymerer & plast',
    dropdownBadge: 'Monomer → Polymer',
    dropdownDescription:
      'Addisjonspolymerisasjon, termoplast og herdeplast, mikroplast, nedbrytning og kjemisk gjenvinning.',
    accentHex: '#FB923C',
    glowHex: 'rgba(251, 146, 60, 0.35)',
    cx: 265,
    cy: 435,
    r: 74,
    ready: false,
  },
  {
    id: 'karbonsyklusen',
    order: 7,
    title: 'Karbonsyklusen & klima',
    shortTitle: 'Karbonsyklusen',
    dropdownTitle: 'Karbonsyklusen',
    dropdownBadge: 'Kretsløp • Atmosfære & hav',
    dropdownDescription:
      'Det raske og langsomme karbonkretsløpet mellom atmosfære, biosfære, hav og berggrunn.',
    accentHex: '#34D399',
    glowHex: 'rgba(52, 211, 153, 0.35)',
    cx: 320,
    cy: 205,
    r: 74,
    ready: false,
  },
];

export const KARBON_THEMES: Record<KarbonThemeId, KarbonThemeMeta> =
  Object.fromEntries(KARBON_THEME_LIST.map((t) => [t.id, t])) as Record<
    KarbonThemeId,
    KarbonThemeMeta
  >;

export const KARBON_DASHED_ARCS: {
  id: string;
  from: KarbonThemeId;
  to: KarbonThemeId;
  d: string;
}[] = [
  {
    id: 'karc-1-2',
    from: 'atommodell-bindinger',
    to: 'karbonatomet',
    d: 'M 612 118 Q 665 130 702 158',
  },
  {
    id: 'karc-2-3',
    from: 'karbonatomet',
    to: 'hydrokarboner',
    d: 'M 795 274 Q 825 320 818 360',
  },
  {
    id: 'karc-3-4',
    from: 'hydrokarboner',
    to: 'alkoholer',
    d: 'M 780 503 Q 750 555 718 575',
  },
  {
    id: 'karc-4-5',
    from: 'alkoholer',
    to: 'karboksylsyrer-estere',
    d: 'M 589 635 Q 540 655 491 635',
  },
  {
    id: 'karc-5-6',
    from: 'karboksylsyrer-estere',
    to: 'polymerer-plast',
    d: 'M 362 575 Q 330 555 300 503',
  },
  {
    id: 'karc-6-7',
    from: 'polymerer-plast',
    to: 'karbonsyklusen',
    d: 'M 262 360 Q 255 320 285 274',
  },
  {
    id: 'karc-7-1',
    from: 'karbonsyklusen',
    to: 'atommodell-bindinger',
    d: 'M 378 158 Q 415 130 468 118',
  },
];

export function parseKarbonView(value?: string): KarbonAppView {
  if (!value) return 'karbon';
  const raw = value.replace(/^#/, '').trim();
  let clean = raw.toLowerCase();
  try {
    clean = decodeURIComponent(raw).toLowerCase();
  } catch {
    // Keep raw lowercased string on malformed URI encoding
  }
  if (Object.prototype.hasOwnProperty.call(KARBON_THEMES, clean)) {
    return clean as KarbonThemeId;
  }
  return 'karbon';
}
