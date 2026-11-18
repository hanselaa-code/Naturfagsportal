export interface KarbonKeyTrait {
  title: string;
  description: string;
}

export interface KarbonStepNode {
  id: string;
  stepNumber: number;
  title: string;
  shortLabel: string;
  badgeText: string;
  categoryLabel: string;
  image: string;
  imageCaption: string;
  summaryTitle: string;
  whatHappens: string;
  keyTraits: KarbonKeyTrait[];
  didYouKnow: string;
  classroomTest: string;
  examples: string[];
}

export interface KarbonControlQuestion {
  id: string;
  number: number;
  question: string;
  contextHint: string;
  points: { heading: string; detail: string }[];
  takeaway: string;
}

export interface KarbonMcqQuestion {
  id: string;
  number: number;
  relatedStepIndex: number;
  topicBadge: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface BohrAtomPreset {
  symbol: string;
  name: string;
  atomicNumber: number;
  neutrons: number;
  shells: number[];
  groupNote: string;
  octetNeed: string;
  accent: string;
}

export const BOHR_ATOM_PRESETS: BohrAtomPreset[] = [
  {
    symbol: 'H',
    name: 'Hydrogen',
    atomicNumber: 1,
    neutrons: 0,
    shells: [1],
    groupNote: 'Unntak: ønsker 2 i K-skallet',
    octetNeed: 'Mangler 1 elektron',
    accent: '#38BDF8',
  },
  {
    symbol: 'C',
    name: 'Karbon',
    atomicNumber: 6,
    neutrons: 6,
    shells: [2, 4],
    groupNote: 'Gruppe 14 • 4 valenselektroner',
    octetNeed: 'Danner 4 elektronparbindinger',
    accent: '#A78BFA',
  },
  {
    symbol: 'N',
    name: 'Nitrogen',
    atomicNumber: 7,
    neutrons: 7,
    shells: [2, 5],
    groupNote: 'Gruppe 15 • 5 valenselektroner',
    octetNeed: 'Mangler 3 elektroner',
    accent: '#60A5FA',
  },
  {
    symbol: 'O',
    name: 'Oksygen',
    atomicNumber: 8,
    neutrons: 8,
    shells: [2, 6],
    groupNote: 'Gruppe 16 • 6 valenselektroner',
    octetNeed: 'Mangler 2 elektroner',
    accent: '#F472B6',
  },
  {
    symbol: 'Ne',
    name: 'Neon (Edelgass)',
    atomicNumber: 10,
    neutrons: 10,
    shells: [2, 8],
    groupNote: 'Gruppe 18 • Fullt ytterste skall',
    octetNeed: 'Stabil oktett (reagerer ikke)',
    accent: '#34D399',
  },
  {
    symbol: 'Na',
    name: 'Natrium (Metall)',
    atomicNumber: 11,
    neutrons: 12,
    shells: [2, 8, 1],
    groupNote: 'Gruppe 1 • 1 valenselektron',
    octetNeed: 'Gir fra seg 1 elektron → Na⁺',
    accent: '#F59E0B',
  },
  {
    symbol: 'Cl',
    name: 'Klor (Ikke-metall)',
    atomicNumber: 17,
    neutrons: 18,
    shells: [2, 8, 7],
    groupNote: 'Gruppe 17 • 7 valenselektroner',
    octetNeed: 'Tar opp 1 elektron → Cl⁻',
    accent: '#2DD4BF',
  },
];

export const ATOM_BINDING_STEPS: KarbonStepNode[] = [
  {
    id: 'bind_atom',
    stepNumber: 1,
    title: 'Atomets oppbygning',
    shortLabel: 'Atomets oppbygning',
    badgeText: 'Del 1 • Atomkjerne & elektroner',
    categoryLabel: 'Grunnlag',
    image: './assets/karbon/bind_step1_atom.jpg',
    imageCaption:
      'Et atom består av en positivt ladet kjerne (protoner og nøytroner) omgitt av negativt ladde elektroner.',
    summaryTitle: 'Tre byggesteiner styrer hele kjemien',
    whatHappens:
      'Alt stoff rundt oss er bygd opp av atomer. Innerst ligger en bitteliten, tung atomkjerne med positivt ladde protoner (+) og nøytrale nøytroner (0). Rundt kjernen beveger det seg lette, negativt ladde elektroner (–). I et nøytralt atom er det alltid like mange elektroner som protoner.',
    keyTraits: [
      {
        title: 'Atomnummer = antall protoner',
        description:
          'Antall protoner i kjernen avgjør hvilket grunnstoff atomet er (karbon har alltid 6 protoner).',
      },
      {
        title: 'Elektronene bestemmer kjemien',
        description:
          'Selv om kjernen står for nesten all massen, er det elektronene ytterst som avgjør hvordan atomer binder seg til hverandre.',
      },
    ],
    didYouKnow:
      'Hvis atomkjernen var på størrelse med en klinkekule midt på en fotballbane, ville de ytterste elektronene befunnet seg helt ute på tribunen!',
    classroomTest:
      'Klikk på ulike grunnstoffer i Atom- & Bindingslaben til venstre og tell antall protoner (+) i kjernen mot antall elektroner (–) i skallene.',
    examples: ['Proton (+)', 'Nøytron (0)', 'Elektron (–)', 'Atomnummer'],
  },
  {
    id: 'bind_shells',
    stepNumber: 2,
    title: 'Elektronskall & valenselektroner',
    shortLabel: 'Elektronskall',
    badgeText: 'Del 2 • K, L, M-skall',
    categoryLabel: 'Skallmodell',
    image: './assets/karbon/bind_step2_shells.jpg',
    imageCaption:
      'Elektronene fordeler seg i energiskall rundt kjernen. Elektronene i det ytterste skallet kalles valenselektroner.',
    summaryTitle: 'Det ytterste skallet er kjemisk viktigst',
    whatHappens:
      'I Bohrs atommodell fordeler elektronene seg i faste skall rundt kjernen: innerst K-skallet (plass til maks 2 elektroner), deretter L-skallet (maks 8) og M-skallet (plass til 8 i de første 18 grunnstoffene). Elektronene i det aller ytterste skallet kalles valenselektroner.',
    keyTraits: [
      {
        title: '2 – 8 – 8-regelen (for lette grunnstoffer)',
        description:
          'Karbon (atomnummer 6) har 2 elektroner i innerste skall og 4 valenselektroner i ytterste skall.',
      },
      {
        title: 'Periodesystemet avslører skallene',
        description:
          'Periodenummeret (raden) forteller hvor mange skall atomet har, og gruppen (for hovedgruppene) viser antall valenselektroner.',
      },
    ],
    didYouKnow:
      'Natrium (Na, nr. 11) og kalium (K, nr. 19) reagerer begge voldsomt med vann fordi begge har nøyaktig 1 valenselektron i ytterste skall!',
    classroomTest:
      'Velg Karbon (C), Oksygen (O) og Klor (Cl) i laben og sammenlign hvor mange valenselektroner de har i det ytterste skallet.',
    examples: ['K-, L-, M-skall', 'Valenselektroner', 'Periodesystemet'],
  },
  {
    id: 'bind_octet',
    stepNumber: 3,
    title: 'Oktettregelen & edelgasser',
    shortLabel: 'Oktettregelen',
    badgeText: 'Del 3 • 8 i ytterste skall',
    categoryLabel: 'Stabilitet',
    image: './assets/karbon/bind_step3_octet.jpg',
    imageCaption:
      'Atomer er mest stabile når de har 8 elektroner i ytterste skall (eller 2 for de aller minste atomene).',
    summaryTitle: 'Hvorfor reagerer atomer i det hele tatt?',
    whatHappens:
      'Edelgassene i gruppe 18 (som helium, neon og argon) har allerede fullt ytterste skall og reagerer nesten aldri. Alle andre atomer prøver å oppnå den samme stabile edelgass-strukturen: 8 elektroner i ytterste skall (oktettregelen), eller 2 for hydrogen og helium.',
    keyTraits: [
      {
        title: 'Tre måter å få fullt skall på',
        description:
          'Atomer kan (1) dele elektroner med hverandre, (2) gi fra seg elektroner, eller (3) ta opp elektroner.',
      },
      {
        title: 'Karbons spesialrolle',
        description:
          'Med 4 valenselektroner mangler karbon 4 til oktett – derfor deler det elektroner og kan danne hele 4 bindinger!',
      },
    ],
    didYouKnow:
      'Helium brukes i luftskip i stedet for hydrogen fordi helium har fullt K-skall (2 elektroner) og derfor ikke brenner eller eksploderer.',
    classroomTest:
      'Sammenlign Neon (Ne) med Natrium (Na) og Klor (Cl) i modellen. Hvorfor er det lettest for Na å miste 1 elektron, mens Cl heller tar opp 1?',
    examples: ['Oktettregelen', 'Edelgass-struktur', '8 valenselektroner'],
  },
  {
    id: 'bind_covalent',
    stepNumber: 4,
    title: 'Elektronparbinding (kovalent binding)',
    shortLabel: 'Elektronparbinding',
    badgeText: 'Del 4 • Ikke-metall + ikke-metall',
    categoryLabel: 'Molekylbinding',
    image: './assets/karbon/bind_step4_covalent.jpg',
    imageCaption:
      'Når to ikke-metaller møtes, deler de ett eller flere elektronpar slik at begge får fullt ytterste skall.',
    summaryTitle: 'Deling av elektroner skaper molekyler',
    whatHappens:
      'Når to ikke-metallatomer (som C, H, O og N) binder seg sammen, ønsker begge å trekke til seg elektroner. Løsningen er samarbeid: de deler ett eller flere elektronpar mellom seg. Denne sterke bindingen kalles elektronparbinding (kovalent binding), og resultatet er et molekyl.',
    keyTraits: [
      {
        title: 'Én strek = ett delt elektronpar',
        description:
          'I strukturformler tegner vi hvert delte elektronpar som en strek (f.eks. H–H eller H–O–H).',
      },
      {
        title: 'Byggesteinen i all organisk kjemi',
        description:
          'Alle karbonforbindelser, DNA, proteiner og plast holdes sammen av sterke elektronparbindinger.',
      },
    ],
    didYouKnow:
      'Oksygenet vi puster inn (O₂) består av to oksygenatomer som deler hele to elektronpar (en dobbeltbinding: O=O).',
    classroomTest:
      'Bytt mellom H₂, CH₄ og CO₂ i bindingslaben til venstre og tell hvor mange elektroner hvert atom «låner» til sammen for å nå oktett.',
    examples: ['Elektronparbinding', 'Kovalent binding', 'Molekyl', 'Ikke-metall'],
  },
  {
    id: 'bind_polar',
    stepNumber: 5,
    title: 'Enkelt-, dobbelt- & polar binding',
    shortLabel: 'Dobbelt & polar',
    badgeText: 'Del 5 • Skjev deling & form',
    categoryLabel: 'Molekylbinding',
    image: './assets/karbon/bind_step5_polar.jpg',
    imageCaption:
      'Oksygen trekker sterkere på de delte elektronene enn hydrogen, slik at vannmolekylet blir polart (δ⁻ og δ⁺).',
    summaryTitle: 'Ikke all deling er helt rettferdig',
    whatHappens:
      'Atomer kan dele ett par (enkeltbinding, C–C), to par (dobbeltbinding, C=C / O=C=O) eller tre par (trippelbinding, N≡N). I tillegg trekker ulike grunnstoffer forskjellig på de delte elektronene (elektronegativitet). I vann (H₂O) trekker oksygen elektronene nærmere seg og blir svakt negativt (δ⁻), mens hydrogen blir svakt positivt (δ⁺).',
    keyTraits: [
      {
        title: 'Polar kovalent binding (f.eks. H₂O)',
        description:
          'Ulik ladningsfordeling gjør at vannmolekyler tiltrekker hverandre og løser opp salter og sukker svært godt.',
      },
      {
        title: 'Upolar binding (f.eks. CH₄ og olje)',
        description:
          'Karbon og hydrogen deler elektronene nesten helt likt – derfor blander ikke olje og bensin seg med vann.',
      },
    ],
    didYouKnow:
      '«Likt løser likt» er en gyllen regel i kjemien: polare stoffer (som vann og etanol) løser polare stoffer og salter, mens upolare stoffer (som olje og fett) løser upolare stoffer.',
    classroomTest:
      'Velg H₂O og CO₂ i laben. Legg merke til hvordan vannet er bøyd og polart (δ⁺/δ⁻), mens CO₂ er rettlinjet!',
    examples: ['Dobbeltbinding', 'Polar binding', 'Upolar binding', 'Likt løser likt'],
  },
  {
    id: 'bind_ionic',
    stepNumber: 6,
    title: 'Ionebinding & saltkrystaller',
    shortLabel: 'Ionebinding',
    badgeText: 'Del 6 • Metall + ikke-metall',
    categoryLabel: 'Ionbinding',
    image: './assets/karbon/bind_step6_ionic.jpg',
    imageCaption:
      'Natrium gir fra seg ett elektron til klor. Resultatet blir Na⁺ og Cl⁻ som tiltrekker hverandre i et fast ionegitter.',
    summaryTitle: 'Elektronoverføring fra metall til ikke-metall',
    whatHappens:
      'Når et metall møter et ikke-metall, gir metallet fra seg valenselektroner til ikke-metallet. Når natrium (Na) mister ett elektron, får det 11 protoner og 10 elektroner – altså ladning +1 (Na⁺). Klor (Cl) tar opp elektronet og blir negativt ladd (Cl⁻). Motsatte ladninger tiltrekker hverandre i et tredimensjonalt ionegitter (salt).',
    keyTraits: [
      {
        title: 'Kation (+) og anion (–)',
        description:
          'Metaller danner positive ioner (gir bort elektroner), mens ikke-metaller danner negative ioner (tar opp elektroner).',
      },
      {
        title: 'Salter danner ikke enkeltmolekyler',
        description:
          'NaCl er ikke ett par, men et enormt krystallgitter av vekselvis Na⁺ og Cl⁻ i forholdet 1 : 1.',
      },
    ],
    didYouKnow:
      'Vanlig bordsalt (NaCl) består av natrium (et mykt metall som eksploderer i vann) og klor (en giftig grønn gass) – men sammen som ioner blir de et livsviktig næringssalt!',
    classroomTest:
      'Se på Na → Cl-animasjonen i laben: tell hvor mange elektroner som er i ytterste skall hos både Na⁺ og Cl⁻ etter overføringen!',
    examples: ['Ionebinding', 'Elektronoverføring', 'Ionegitter', 'Salt (NaCl)'],
  },
  {
    id: 'bind_metallic',
    stepNumber: 7,
    title: 'Metallbinding & elektronhav',
    shortLabel: 'Metallbinding',
    badgeText: 'Del 7 • Metall + metall',
    categoryLabel: 'Metallbinding',
    image: './assets/karbon/bind_step7_metallic.jpg',
    imageCaption:
      'I metaller flyter valenselektronene fritt som et felles «elektronhav» mellom faste, positive metallioner.',
    summaryTitle: 'Delte elektroner på tvers av hele metallet',
    whatHappens:
      'Metallatomer holder svakt på sine ytterste elektroner. Når mange metallatomer ligger tett sammen (som i kobber, jern eller aluminium), slipper alle sine valenselektroner løs i et felles, bevegelig «elektronhav» rundt de positive metallionene.',
    keyTraits: [
      {
        title: 'Høy strøm- og varmeledningsevne',
        description:
          'Fordi elektronene i elektronhavet kan bevege seg fritt gjennom hele metallet, leder metaller strøm og varme svært godt.',
      },
      {
        title: 'Formbare (ikke sprø som salt)',
        description:
          'Når du hamrer på et metall, glir lagene av metallioner forbi hverandre uten at elektronhavet slipper taket.',
      },
    ],
    didYouKnow:
      'Gull er så formbart på grunn av metallbindingen at 1 gram gull kan hamres ut til en tråd som er over 2 kilometer lang uten å brekke.',
    classroomTest:
      'Sammenlign kobbernettet i steg 7 med saltgitteret i steg 6: hvorfor knuses et saltkorn når du slår på det med en hammer, mens kobber bare bøyes?',
    examples: ['Metallbinding', 'Elektronhav', 'Strømledning', 'Formbarhet'],
  },
  {
    id: 'bind_properties',
    stepNumber: 8,
    title: 'Bindingstypen styrer egenskapene',
    shortLabel: 'Egenskaper i praksis',
    badgeText: 'Del 8 • Oppsummering & sammenligning',
    categoryLabel: 'Oversikt',
    image: './assets/karbon/bind_step8_properties.jpg',
    imageCaption:
      'Om et stoff er gass, væske, sprøtt salt eller ledende metall avhenger direkte av hvilken bindingstype som holder det sammen.',
    summaryTitle: 'Fra mikroskopisk binding til makroskopisk egenskap',
    whatHappens:
      'Ved å vite hvilken bindingstype et stoff har, kan vi forutsi egenskapene det får: Molekylstoffer (elektronparbinding) har ofte lave smelte- og kokepunkter og leder ikke strøm. Ionestoffer (salter) har høye smeltepunkter, er sprø og leder strøm når de er smeltet eller løst i vann. Metaller leder strøm i fast form og kan bøyes.',
    keyTraits: [
      {
        title: 'Molekylstoffer (ikke-metall + ikke-metall)',
        description:
          'Sterke bindinger inne i molekylet, men svake krefter mellom molekylene → ofte gass eller væske ved romtemperatur (CH₄, CO₂, H₂O).',
      },
      {
        title: 'Salter & metaller',
        description:
          'Sterke krefter gjennom hele krystallen → fast stoff med høyt smeltepunkt (NaCl smelter først ved 801 °C!).',
      },
    ],
    didYouKnow:
      'Rent destillert vann (kun H₂O-molekyler) leder nesten ikke strøm i det hele tatt – det er først når salter (ioner) løses i vannet at det blir strømførende!',
    classroomTest:
      'Bruk oversikten til venstre og gjett bindingstypen til tre hverdagsstoffer: sukker (C₁₂H₂₂O₁₁), bordsalt (NaCl) og aluminiumsfolie (Al).',
    examples: ['Smeltepunkt', 'Strømledning', 'Løselighet', 'Molekyl vs. salt'],
  },
];

export const ATOM_BINDING_CONTROL_QUESTIONS: KarbonControlQuestion[] = [
  {
    id: 'bcq1',
    number: 1,
    question:
      'Hva sier oktettregelen, og hvordan hjelper den oss med å forstå hvorfor karbon danner 4 bindinger?',
    contextHint: 'Se på antall elektroner i det ytterste skallet til karbon (atomnummer 6).',
    points: [
      {
        heading: 'Oktettregelen',
        detail:
          'Atomer søker å ha 8 elektroner i sitt ytterste skall (2 for de minste atomene) for å bli stabile som edelgasser.',
      },
      {
        heading: 'Karbon har 4 valenselektroner',
        detail:
          'Med 2 elektroner innerst og 4 ytterst mangler karbon 4 elektroner på fullt skall. Derfor deler det 4 elektronpar med andre atomer.',
      },
    ],
    takeaway:
      'Karbons 4 valenselektroner gjør at det kan danne lange kjeder, ringer og dobbeltbindinger – grunnlaget for all organisk kjemi.',
  },
  {
    id: 'bcq2',
    number: 2,
    question:
      'Forklar hovedforskjellen mellom en elektronparbinding (kovalent) og en ionebinding.',
    contextHint: 'Tenk på hvilke typer grunnstoffer som møtes og hva som skjer med elektronene.',
    points: [
      {
        heading: 'Elektronparbinding (ikke-metall + ikke-metall)',
        detail:
          'Atomene deler ett eller flere elektronpar mellom seg og danner avgrensede molekyler (f.eks. H₂O, CH₄).',
      },
      {
        heading: 'Ionebinding (metall + ikke-metall)',
        detail:
          'Metallet gir fra seg elektroner til ikke-metallet, slik at det dannes positive og negative ioner som holdes sammen i et ionegitter (f.eks. NaCl).',
      },
    ],
    takeaway:
      'Kovalente bindinger deler elektroner i molekyler; ionebindinger overfører elektroner og danner ionegitter.',
  },
  {
    id: 'bcq3',
    number: 3,
    question:
      'Hvorfor leder kobber strøm i fast form, mens bordsalt (NaCl) bare leder strøm når det er løst i vann eller smeltet?',
    contextHint: 'Strøm krever ladde partikler som kan bevege seg fritt.',
    points: [
      {
        heading: 'Kobber (metallbinding)',
        detail:
          'Har et fritt bevegelig elektronhav i fast form som transporterer elektrisk ladning med en gang.',
      },
      {
        heading: 'Salt (ionebinding)',
        detail:
          'I fast form er Na⁺- og Cl⁻-ionene låst fast i gitteret. Først når saltet løses i vann eller smeltes, blir ionene frie til å bevege seg.',
      },
    ],
    takeaway:
      'Elektrisk strøm krever frie ladningsbærere – enten frie elektroner (metaller) eller frie ioner (saltløsning/smelte).',
  },
];

export const ATOM_BINDING_MCQ_QUESTIONS: KarbonMcqQuestion[] = [
  {
    id: 'bmcq1',
    number: 1,
    relatedStepIndex: 0,
    topicBadge: 'Atomets oppbygning',
    question: 'Hva bestemmer hvilket grunnstoff et atom tilhører?',
    options: [
      'Antall nøytroner i kjernen',
      'Antall protoner i kjernen (atomnummeret)',
      'Antall elektronskall',
      'Hvor tungt atomet er',
    ],
    correctIndex: 1,
    explanation:
      'Atomnummeret er antall protoner i kjernen og definerer grunnstoffet. Karbon har alltid 6 protoner.',
  },
  {
    id: 'bmcq2',
    number: 2,
    relatedStepIndex: 1,
    topicBadge: 'Elektronskall',
    question: 'Hvor mange valenselektroner (elektroner i ytterste skall) har karbon (atomnummer 6)?',
    options: ['2', '4', '6', '8'],
    correctIndex: 1,
    explanation:
      'Karbon har 2 elektroner i det innerste K-skallet og 4 valenselektroner i L-skallet.',
  },
  {
    id: 'bmcq3',
    number: 3,
    relatedStepIndex: 2,
    topicBadge: 'Oktettregelen',
    question: 'Hvorfor reagerer edelgassene (gruppe 18) nesten ikke med andre stoffer?',
    options: [
      'De har ingen protoner',
      'De har allerede fullt ytterste elektronskall (oktett)',
      'De er alltid i fast form',
      'De mangler elektroner i K-skallet',
    ],
    correctIndex: 1,
    explanation:
      'Edelgassene har fullt ytterste skall fra naturens side og trenger verken gi bort, ta opp eller dele elektroner.',
  },
  {
    id: 'bmcq4',
    number: 4,
    relatedStepIndex: 3,
    topicBadge: 'Elektronparbinding',
    question: 'Hvilken bindingstype oppstår når to ikke-metaller deler elektronpar?',
    options: [
      'Ionebinding',
      'Metallbinding',
      'Elektronparbinding (kovalent binding)',
      'Kjernekraft',
    ],
    correctIndex: 2,
    explanation:
      'Ikke-metaller deler elektronpar for å oppnå fullt ytterste skall, og det kalles elektronparbinding eller kovalent binding.',
  },
  {
    id: 'bmcq5',
    number: 5,
    relatedStepIndex: 4,
    topicBadge: 'Polar binding',
    question: 'Hvorfor er vannmolekylet (H₂O) polart?',
    options: [
      'Fordi det inneholder natriumioner',
      'Fordi oksygen trekker sterkere på de delte elektronene enn hydrogen, og molekylet er bøyd',
      'Fordi hydrogen har 8 valenselektroner',
      'Fordi det har trippelbinding',
    ],
    correctIndex: 1,
    explanation:
      'Oksygen er mer elektronegativt enn hydrogen, slik at oksygensiden blir svakt negativ (δ⁻) og hydrogensiden svakt positiv (δ⁺).',
  },
  {
    id: 'bmcq6',
    number: 6,
    relatedStepIndex: 5,
    topicBadge: 'Ionebinding',
    question: 'Hva skjer når natrium (Na) og klor (Cl) danner bordsalt (NaCl)?',
    options: [
      'De deler ett elektronpar likt',
      'Natrium gir fra seg ett elektron til klor, og det dannes Na⁺ og Cl⁻',
      'Klor gir fra seg syv elektroner til natrium',
      'De danner et elektronhav',
    ],
    correctIndex: 1,
    explanation:
      'Natrium har 1 valenselektron og gir det til klor (som har 7), slik at begge får fullt ytterste skall som ioner (Na⁺ og Cl⁻).',
  },
  {
    id: 'bmcq7',
    number: 7,
    relatedStepIndex: 6,
    topicBadge: 'Metallbinding',
    question: 'Hva gjør at metaller leder elektrisk strøm så godt?',
    options: [
      'De har et fritt bevegelig «elektronhav» av valenselektroner',
      'De består av polare molekyler',
      'De har høyt smeltepunkt',
      'Protonene beveger seg gjennom metallet',
    ],
    correctIndex: 0,
    explanation:
      'De delokaliserte valenselektronene i elektronhavet kan strømme fritt gjennom hele metallgitteret når spenning settes på.',
  },
];
