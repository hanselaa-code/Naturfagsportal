import type { McqQuestionItem } from './mcqQuestionsData';
import {
  evoImg,
  type ControlQuestionItem,
  type TreeNodeData,
} from './treeOfLifeData';

export const GENETICS_MAIN_STEP_IDS: string[] = [
  'gen_alleles',
  'gen_genotype',
  'gen_dominant',
  'gen_meiosis',
  'gen_punnett',
  'gen_sex_linked',
  'gen_env_epigenetics',
  'gen_crispr',
];

export const GENETICS_NODES: TreeNodeData[] = [
  {
    id: 'gen_alleles',
    stepIndex: 0,
    isMainPath: true,
    parentId: null,
    stepNumber: 1,
    title: 'Gener, alleler og kromosomer',
    shortLabel: 'Gener & alleler',
    latinName: 'Arvelighetens byggesteiner',
    timeMa: 'Nivå 1 • Grunnlag',
    eraLabel: 'Kromosom',
    x: 240,
    y: 360,
    labelAnchor: 'bottom',
    image: evoImg('gen_step1_alleles.jpg'),
    imageCaption:
      'Homologe kromosompar har de samme genene på samme plass (lokus), men kan ha ulike varianter – kalt alleler.',
    summaryTitle: 'To kopier av nesten hvert eneste gen',
    whatHappens:
      'I kroppscellene våre har vi 46 kromosomer fordelt på 23 par. I hvert par kommer ett kromosom fra mor og ett fra far (homologe kromosomer). Et gen er en oppskrift på et protein, og de ulike utgavene av samme gen kalles alleler.',
    keyTraits: [
      {
        title: 'Gen = oppskrift på en egenskap',
        description:
          'Hvert gen ligger på en bestemt plass (lokus) på et kromosom og koder for eksempel for øyefarge, blodtype eller enzymer.',
        icon: 'dna',
      },
      {
        title: 'Allel = genvariant',
        description:
          'Du kan få ett allel for brune øyne fra mor og ett allel for blå øyne fra far. Samme gen – to ulike alleler.',
        icon: 'layers',
      },
    ],
    didYouKnow:
      'Mennesket har omtrent 20 000–21 000 proteinkodende gener, som utgjør bare rundt 1,5 % av hele DNA-et vårt.',
    examples: ['Homologe kromosomer', 'Lokus', 'Allelpar'],
    accentCategory: 'origin',
  },
  {
    id: 'gen_genotype',
    stepIndex: 1,
    isMainPath: true,
    parentId: 'gen_alleles',
    stepNumber: 2,
    title: 'Genotype, fenotype & homozygot/heterozygot',
    shortLabel: 'Genotype & fenotype',
    latinName: 'Kode vs. synlig resultat',
    timeMa: 'Nivå 1 • Grunnlag',
    eraLabel: 'Begreper',
    x: 540,
    y: 220,
    labelAnchor: 'top',
    image: evoImg('gen_step2_genotype.jpg'),
    imageCaption:
      'Genotypen er selve DNA-koden (f.eks. Bb), mens fenotypen er den synlige egenskapen som kommer til uttrykk.',
    summaryTitle: 'Forskjellen på oppskrift og ferdig egenskap',
    whatHappens:
      'Genotypen er kombinasjonen av alleler du har for et gen (skrives ofte med bokstaver som AA, Aa eller aa). Hvis begge allelene er like (AA eller aa), er du homozygot. Hvis du har to ulike alleler (Aa), er du heterozygot. Fenotypen er selve egenskapen vi kan se eller måle – påvirket av både gener og miljø.',
    keyTraits: [
      {
        title: 'Homozygot (AA eller aa)',
        description:
          'To identiske alleler for det samme genet – én fra hver forelder.',
        icon: 'sparkles',
      },
      {
        title: 'Heterozygot (Aa)',
        description:
          'To forskjellige alleler for samme gen. Ofte vil det ene allelet bestemme fenotypen.',
        icon: 'activity',
      },
    ],
    didYouKnow:
      'To personer med brune øyne kan ha helt lik fenotype, men forskjellig genotype – den ene kan være BB og den andre Bb!',
    examples: ['Genotype (AA/Aa/aa)', 'Fenotype', 'Homozygot & heterozygot'],
    accentCategory: 'microbe',
  },
  {
    id: 'gen_dominant',
    stepIndex: 2,
    isMainPath: true,
    parentId: 'gen_genotype',
    stepNumber: 3,
    title: 'Dominant og recessiv arv',
    shortLabel: 'Dominant & recessiv',
    latinName: 'Mendels arvelover',
    timeMa: 'Nivå 2 • Mekanisme',
    eraLabel: 'Arvelov',
    x: 840,
    y: 360,
    labelAnchor: 'bottom',
    image: evoImg('gen_step3_dominant.jpg'),
    imageCaption:
      'Et dominant allel (stor bokstav, A) slår gjennom selv når det bare finnes i én kopi, mens et recessivt allel (a) krever to kopier.',
    summaryTitle: 'Hvilket allel bestemmer når de møtes?',
    whatHappens:
      'Når en organisme er heterozygot (Aa), vil det dominante allelet (A) vanligvis skjule effekten av det recessive allelet (a). For at en recessiv egenskap skal vises i fenotypen, må individet være homozygot recessivt (aa). Dette ble først kartlagt av Gregor Mendel på 1860-tallet ved å krysse erteplanter.',
    keyTraits: [
      {
        title: 'Dominant allel (A)',
        description:
          'Trenger bare én kopi (AA eller Aa) for å komme til uttrykk i fenotypen.',
        icon: 'zap',
      },
      {
        title: 'Recessivt allel (a)',
        description:
          'Kommer bare til uttrykk hvis begge allelene er recessive (aa), men kan bæres skjult videre til neste generasjon.',
        icon: 'shield',
      },
    ],
    didYouKnow:
      'Brune øyne og evnen til å rulle tunga har sterke dominante trekk, men mange egenskaper hos mennesker styres egentlig av flere gener sammen (polygen arv).',
    examples: ['AA & Aa → dominant', 'aa → recessiv', 'Mendels erteplanter'],
    accentCategory: 'plant_fungi',
  },
  {
    id: 'gen_meiosis',
    stepIndex: 3,
    isMainPath: true,
    parentId: 'gen_dominant',
    stepNumber: 4,
    title: 'Meiose – dannelse av kjønnsceller',
    shortLabel: 'Meiose (46 → 23)',
    latinName: 'Reduksjonsdeling',
    timeMa: 'Nivå 2 • Celledeling',
    eraLabel: 'Variasjon',
    x: 1140,
    y: 220,
    labelAnchor: 'top',
    image: evoImg('gen_step4_meiosis.jpg'),
    imageCaption:
      'Ved meiose halveres kromosomtallet fra 46 til 23, og overkrysning blander gener fra mor og far i nye kombinasjoner.',
    summaryTitle: 'Hvordan genene deles ut til egg og sædceller',
    whatHappens:
      'For at et barn ikke skal få 92 kromosomer ved befruktning, må kjønnscellene (egg og sædceller) bare ha halvparten av kromosomene (23 stk = haploid). Dette skjer ved meiose (reduksjonsdeling). Under meiosen bytter homologe kromosomer biter med hverandre (overkrysning) og fordeles tilfeldig.',
    keyTraits: [
      {
        title: 'Fra diploid (2n = 46) til haploid (n = 23)',
        description:
          'Hver kjønnscelle får bare ett kromosom fra hvert av de 23 parene – og dermed bare ett allel per gen.',
        icon: 'dna',
      },
      {
        title: 'Overkrysning & tilfeldig fordeling',
        description:
          'Over 8 millioner mulige kromosomkombinasjoner per forelder gjør at søsken (unntatt eneggede tvillinger) blir genetisk unike.',
        icon: 'sparkles',
      },
    ],
    didYouKnow:
      'Når man regner med overkrysning, kan ett foreldrepar teoretisk få over 70 billioner genetisk ulike barn!',
    examples: ['Meiose (46 → 23)', 'Overkrysning', 'Befruktning (23 + 23)'],
    accentCategory: 'vertebrate',
  },
  {
    id: 'gen_punnett',
    stepIndex: 4,
    isMainPath: true,
    parentId: 'gen_meiosis',
    stepNumber: 5,
    title: 'Krysningsskjema (Punnett-kvadrat)',
    shortLabel: 'Krysningsskjema',
    latinName: 'Sannsynlighet i arv',
    timeMa: 'Nivå 3 • Verktøy',
    eraLabel: 'Beregning',
    x: 1460,
    y: 440,
    labelAnchor: 'bottom',
    image: evoImg('gen_step5_punnett.jpg'),
    imageCaption:
      'Krysningsskjemaet viser alle mulige kombinasjoner av kjønnsceller fra mor og far – f.eks. 3:1-forhold ved Aa × Aa.',
    summaryTitle: 'Regn ut sannsynligheten for arvelige egenskaper',
    whatHappens:
      'Et krysningsskjema (Punnett-kvadrat) er et 2×2-rutenett som brukes til å finne sannsynligheten for barnets genotype og fenotype. Mors kjønnscelle-alleler skrives øverst og fars på venstre side. Krysser vi to heterozygote foreldre (Aa × Aa), får vi 25 % AA, 50 % Aa og 25 % aa – altså 75 % sjanse for dominant fenotype og 25 % for recessiv.',
    keyTraits: [
      {
        title: 'Aa × Aa gir 3 : 1 i fenotype',
        description:
          'Tre av fire ruter (AA, Aa, Aa) gir dominant egenskap (75 %), mens én av fire (aa) gir recessiv egenskap (25 %).',
        icon: 'compass',
      },
      {
        title: 'Sannsynlighet, ikke garanti',
        description:
          'Hvert barn er en ny «myntkast»-hendelse: 25 % sjanse betyr ikke at nøyaktig 1 av 4 søsken får egenskapen.',
        icon: 'activity',
      },
    ],
    didYouKnow:
      'Krysningsskjemaet er oppkalt etter den britiske genetikeren Reginald Punnett, som utviklet metoden i 1905 for å gjøre Mendels lover enkle å regne ut.',
    examples: ['Aa × Aa → 25/50/25 %', 'Aa × aa → 50/50 %', 'AA × aa → 100 % Aa'],
    accentCategory: 'mammal',
  },
  {
    id: 'gen_sex_linked',
    stepIndex: 5,
    isMainPath: true,
    parentId: 'gen_punnett',
    stepNumber: 6,
    title: 'Kjønnskromosomer og kjønnsbundet arv',
    shortLabel: 'XX / XY & kjønnsarv',
    latinName: 'X-bundet arv',
    timeMa: 'Nivå 3 • Spesialtilfelle',
    eraLabel: 'Kjønn',
    x: 1760,
    y: 230,
    labelAnchor: 'top',
    image: evoImg('gen_step6_sex_linked.jpg'),
    imageCaption:
      'Kvinner har XX og menn har XY. Fordi Y-kromosomet er mye mindre, har gutter bare én kopi av gener på X-kromosomet.',
    summaryTitle: 'Hvorfor noen egenskaper rammer gutter oftere',
    whatHappens:
      'Det 23. kromosomparet bestemmer biologisk kjønn: jenter har XX og gutter har XY. Egget inneholder alltid et X-kromosom, mens sædcellen enten har X eller Y (50 % sjanse for hvert). Gener som ligger på X-kromosomet kalles kjønnsbundne. Siden gutter bare har ett X-kromosom, har de ikke et ekstra X til å veie opp for et recessivt sykdomsallel.',
    keyTraits: [
      {
        title: 'Far bestemmer kromosomkjønnet',
        description:
          'Mor gir alltid X; hvis sædcellen har X blir det XX (jente), hvis den har Y blir det XY (gutt).',
        icon: 'users',
      },
      {
        title: 'Rød-grønn fargeblindhet & blødersykdom',
        description:
          'Rundt 8 % av menn har rød-grønn fargeblindhet, mot bare ~0,5 % av kvinner, fordi genet ligger på X-kromosomet.',
        icon: 'eye',
      },
    ],
    didYouKnow:
      'X-kromosomet inneholder rundt 800–900 gener, mens det mye mindre Y-kromosomet bare har rundt 50–70 gener (blant annet SRY-genet som starter utviklingen av mannlige kjønnsorganer).',
    examples: ['XX vs. XY', 'X-bundet recessiv arv', 'Fargeblindhet'],
    accentCategory: 'human',
  },
  {
    id: 'gen_env_epigenetics',
    stepIndex: 6,
    isMainPath: true,
    parentId: 'gen_sex_linked',
    stepNumber: 7,
    title: 'Samspill mellom arv, miljø og epigenetikk',
    shortLabel: 'Arv, miljø & epigenetikk',
    latinName: 'Genuttrykk & plastisitet',
    timeMa: 'Nivå 4 • Samspill',
    eraLabel: 'Miljø',
    x: 2080,
    y: 440,
    labelAnchor: 'bottom',
    image: evoImg('gen_step7_env_epigenetics.jpg'),
    imageCaption:
      'Kjemiske «brytere» (epigenetiske merker) på DNA kan skru gener av og på uten å endre selve DNA-sekvensen.',
    summaryTitle: 'Genene er ikke alltid hele historien',
    whatHappens:
      'De fleste egenskaper – som høyde, muskelstyrke, hudfarge og risiko for livsstilssykdommer – skyldes et samspill mellom mange gener og miljøfaktorer som kosthold, sollys, trening og stress. Epigenetikk handler om hvordan miljøet setter små kjemiske merker på DNA eller histoner som slår gener av eller på.',
    keyTraits: [
      {
        title: 'Arv gir potensial – miljøet former resultatet',
        description:
          'Du kan arve gener for å bli høy, men uten nok næring i oppveksten når du ikke maks høyde.',
        icon: 'leaf',
      },
      {
        title: 'Epigenetiske «brytere»',
        description:
          'Selv om eneggede tvillinger har identisk DNA, kan ulike livserfaringer gi forskjellig genuttrykk over tid.',
        icon: 'brain',
      },
    ],
    didYouKnow:
      'Hos honningbier har dronningen og arbeiderne helt identisk DNA! Forskjellen skapes kun av at dronninglarven får spesialfôret dronninggelé, som slår på «dronning-gener» via epigenetikk.',
    examples: ['Arv + miljø', 'Epigenetikk', 'Eneggede tvillinger'],
    accentCategory: 'human',
  },
  {
    id: 'gen_crispr',
    stepIndex: 7,
    isMainPath: true,
    parentId: 'gen_env_epigenetics',
    stepNumber: 8,
    title: 'Genteknologi og CRISPR',
    shortLabel: 'Genteknologi & CRISPR',
    latinName: 'Moderne genetikk & etikk',
    timeMa: 'Nivå 4 • Fremtid',
    eraLabel: 'Teknologi',
    x: 2380,
    y: 260,
    labelAnchor: 'top',
    image: evoImg('gen_step8_crispr.jpg'),
    imageCaption:
      'CRISPR-Cas9 fungerer som en molekylær gensaks som kan finne og endre bestemte DNA-sekvenser med stor presisjon.',
    summaryTitle: 'Fra å lese DNA til å redigere gener',
    whatHappens:
      'I dag kan vi både lese hele genomet vårt (DNA-sekvensering), bruke gentester i medisin og rettsvitenskap, og redigere DNA direkte med CRISPR-Cas9. Med genteknologi kan vi lage insulin ved hjelp av bakterier, utvikle mer motstandsdyktige planter og behandle alvorlige arvelige sykdommer som sigdcelleanemi – men det reiser også viktige etiske spørsmål.',
    keyTraits: [
      {
        title: 'CRISPR-Cas9 («gensaks»)',
        description:
          'En guide-RNA leder Cas9-enzymet til nøyaktig riktig sted på DNA-et slik at et defekt gen kan repareres eller slås av.',
        icon: 'cpu',
      },
      {
        title: 'Etikk og bioteknologiloven',
        description:
          'Skal vi tillate genredigering på kjønnsceller (som går i arv), eller bare på kroppsceller for å kurere sykdom?',
        icon: 'heart',
      },
    ],
    didYouKnow:
      'CRISPR ble opprinnelig oppdaget som bakterienes eget immunforsvar mot virus! Forskere lærte å programmere systemet til å klippe hvilket som helst DNA-sted.',
    examples: ['CRISPR-Cas9', 'Genterapi', 'Bioteknologi & etikk'],
    accentCategory: 'origin',
  },
];

export const GENETICS_NODE_MAP: Record<string, TreeNodeData> =
  Object.fromEntries(GENETICS_NODES.map((n) => [n.id, n]));

export const GENETICS_CONTROL_QUESTIONS: ControlQuestionItem[] = [
  {
    id: 'gq1',
    number: 1,
    question:
      'Hva er forskjellen på genotype og fenotype, og hva betyr det å være heterozygot?',
    contextHint: 'Tenk på forskjellen mellom DNA-koden (bokstavene) og det vi kan se.',
    points: [
      {
        heading: 'Genotype vs. fenotype',
        detail:
          'Genotypen er selve kombinasjonen av alleler i DNA-et (f.eks. Bb), mens fenotypen er den synlige egenskapen (f.eks. brune øyne).',
        badge: 'Kjernebegrep',
      },
      {
        heading: 'Heterozygot (Bb)',
        detail:
          'Betyr at individet har to ulike alleler for det samme genet – ett fra mor og ett fra far.',
      },
    ],
    takeaway:
      'Genotype er den genetiske oppskriften, mens fenotype er resultatet som kommer til uttrykk.',
  },
  {
    id: 'gq2',
    number: 2,
    question:
      'To foreldre har brune øyne og er begge heterozygote (Bb). Hva er sannsynligheten for at barnet får blå øyne (bb)?',
    contextHint: 'Sett opp et 2×2 krysningsskjema for Bb × Bb.',
    points: [
      {
        heading: 'Kombinasjoner',
        detail: 'Mulige genotyper i krysningsskjemaet er BB (25 %), Bb (50 %) og bb (25 %).',
        badge: '3 : 1-forhold',
      },
      {
        heading: 'Sannsynlighet',
        detail: 'Det gir 25 % (1 av 4) sjanse for blå øyne (bb) og 75 % sjanse for brune øyne.',
      },
    ],
    takeaway:
      'To heterozygote foreldre (Bb × Bb) har 25 % sannsynlighet for å få et barn med recessiv fenotype (bb).',
  },
  {
    id: 'gq3',
    number: 3,
    question:
      'Hvorfor er rød-grønn fargeblindhet mye vanligere hos gutter enn hos jenter?',
    contextHint: 'Se på forskjellen mellom XX og XY.',
    points: [
      {
        heading: 'Kjønnsbundet arv på X-kromosomet',
        detail:
          'Genet for rød-grønn fargesyn ligger på X-kromosomet og er recessivt.',
        badge: 'XX vs. XY',
      },
      {
        heading: 'Gutter har bare ett X',
        detail:
          'Gutter (XY) har ikke noe ekstra X-kromosom som kan veie opp for et recessivt allel, mens jenter (XX) må arve det fra begge foreldre.',
      },
    ],
    takeaway:
      'Recessive gener på X-kromosomet slår direkte ut hos gutter (XY), mens jenter (XX) oftere er friske bærere.',
  },
];

export const GENETICS_MCQ_QUESTIONS: McqQuestionItem[] = [
  {
    id: 'gmcq1',
    number: 1,
    relatedStepIndex: 0,
    topicBadge: 'Grunnbegrep',
    question:
      'Hva kalles ulike varianter av det samme genet (f.eks. for brun eller blå øyefarge)?',
    options: ['Ribosomer', 'Alleler', 'Kromosompar', 'Enzymer'],
    correctIndex: 1,
    explanation:
      'Ulike utgaver av samme gen på samme plass (lokus) på homologe kromosomer kalles alleler.',
  },
  {
    id: 'gmcq2',
    number: 2,
    relatedStepIndex: 1,
    topicBadge: 'Genotype',
    question: 'Hvilken genotype beskriver et individ som er homozygot recessivt?',
    options: ['AA', 'Aa', 'aa', 'XY'],
    correctIndex: 2,
    explanation:
      'Homozygot betyr to like alleler, og recessivt skrives med liten bokstav – altså aa.',
  },
  {
    id: 'gmcq3',
    number: 3,
    relatedStepIndex: 3,
    topicBadge: 'Meiose',
    question:
      'Hvor mange kromosomer finnes i en normal menneskelig kjønnscelle etter meiose?',
    options: ['46 kromosomer', '23 kromosomer', '92 kromosomer', '12 kromosomer'],
    correctIndex: 1,
    explanation:
      'Meiose halverer kromosomtallet fra diploid (46) til haploid (23), slik at befruktning (23 + 23) gir 46.',
  },
  {
    id: 'gmcq4',
    number: 4,
    relatedStepIndex: 4,
    topicBadge: 'Krysningsskjema',
    question:
      'Hvis vi krysser to heterozygote individer (Aa × Aa), hvor stor andel av avkommene forventes å få den dominante fenotypen?',
    options: ['25 %', '50 %', '75 %', '100 %'],
    correctIndex: 2,
    explanation:
      'Kombinasjonene er AA (25 %), Aa (50 %) og aa (25 %). Både AA og Aa gir dominant fenotype, som til sammen er 75 %.',
  },
  {
    id: 'gmcq5',
    number: 5,
    relatedStepIndex: 5,
    topicBadge: 'Kjønnsarv',
    question: 'Hvem av foreldrene bestemmer om et foster får XX eller XY?',
    options: [
      'Mor, fordi egget kan ha X eller Y',
      'Far, fordi sædcellen enten bærer X eller Y',
      'Begge bidrar med Y-kromosom',
      'Det avgjøres tilfeldig etter befruktning',
    ],
    correctIndex: 1,
    explanation:
      'Egget inneholder alltid ett X-kromosom, mens sædcellen inneholder enten X (gir XX) eller Y (gir XY).',
  },
  {
    id: 'gmcq6',
    number: 6,
    relatedStepIndex: 6,
    topicBadge: 'Epigenetikk',
    question: 'Hva handler epigenetikk om?',
    options: [
      'Hvordan miljøet kan slå gener av og på uten å endre DNA-sekvensen',
      'Hvordan bakterier kopierer plasmid-DNA',
      'Hvordan nye kromosomer dannes i mitokondrier',
      'At mutasjoner alltid er skadelige for organismen',
    ],
    correctIndex: 0,
    explanation:
      'Epigenetiske merker regulerer hvor aktive ulike gener er, uten å endre selve rekkefølgen av baser i DNA.',
  },
  {
    id: 'gmcq7',
    number: 7,
    relatedStepIndex: 7,
    topicBadge: 'Genteknologi',
    question: 'Hva er hovedfunksjonen til CRISPR-Cas9?',
    options: [
      'Å telle antall kromosomer i blodet',
      'Å fungere som en presis «gensaks» for å kutte og redigere DNA',
      'Å lage proteiner direkte uten RNA',
      'Å dele celler raskere under meiose',
    ],
    correctIndex: 1,
    explanation:
      'CRISPR-Cas9 bruker en guide-RNA til å finne en eksakt DNA-sekvens og klippe den for genredigering.',
  },
];
