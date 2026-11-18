import type { McqQuestionItem } from './mcqQuestionsData';
import {
  evoImg,
  type ControlQuestionItem,
  type TreeNodeData,
} from './treeOfLifeData';

export const EVOLUTION_MAIN_STEP_IDS: string[] = [
  'evo_what',
  'evo_variation',
  'evo_selection',
  'evo_drift',
  'evo_examples',
  'evo_antibiotics',
  'evo_fossils',
  'evo_dna_speciation',
];

export const EVOLUTION_NODES: TreeNodeData[] = [
  {
    id: 'evo_what',
    stepIndex: 0,
    isMainPath: true,
    parentId: null,
    stepNumber: 1,
    title: 'Hva er evolusjon?',
    shortLabel: 'Hva er evolusjon?',
    latinName: 'Descent with modification',
    timeMa: 'Generasjon → mill. år',
    eraLabel: 'Grunnidé',
    x: 220,
    y: 360,
    labelAnchor: 'bottom',
    image: evoImg('evo_step1_what.jpg'),
    imageCaption:
      'Alle levende organismer stammer fra felles forfedre og har endret seg gjennom generasjoner.',
    summaryTitle: 'Endring i arvestoffet over generasjoner',
    whatHappens:
      'Biologisk evolusjon betyr at den genetiske sammensetningen (allelfrekvensene) i en populasjon endrer seg fra generasjon til generasjon. Over lang tid fører dette til at arter tilpasser seg miljøet sitt og at nye arter kan oppstå fra felles forfedre.',
    keyTraits: [
      {
        title: 'Populasjoner utvikler seg – ikke enkeltindivider',
        description:
          'Et enkeltindivid kan ikke endre sitt eget DNA for å tilpasse seg; evolusjon skjer når andelen ulike genvarianter endres i en hel populasjon over tid.',
        icon: 'users',
      },
      {
        title: 'Felles avstamning',
        description:
          'Alle arter på jorda deler samme genetiske kode og stammer fra én felles opprinnelse (LUCA) for rundt 3,7 milliarder år siden.',
        icon: 'dna',
      },
    ],
    didYouKnow:
      'Evolusjon har ikke noe «mål» eller plan om å lage mer avanserte vesener – den handler kun om hvilke egenskaper som gir størst sjanse til å overleve og få avkom i akkurat det miljøet som finnes nå.',
    examples: ['Felles stamtre', 'Mikroevolusjon', 'Makroevolusjon'],
    accentCategory: 'origin',
  },
  {
    id: 'evo_variation',
    stepIndex: 1,
    isMainPath: true,
    parentId: 'evo_what',
    stepNumber: 2,
    title: 'Variasjon og mutasjoner',
    shortLabel: 'Variasjon & mutasjon',
    latinName: 'Råmaterialet for evolusjon',
    timeMa: 'Driver 1',
    eraLabel: 'Mekanisme',
    x: 430,
    y: 220,
    labelAnchor: 'top',
    image: evoImg('evo_step2_variation.jpg'),
    imageCaption:
      'Tilfeldige mutasjoner i DNA og rekombinasjon ved kjønnet formering skaper genetisk mangfold.',
    summaryTitle: 'Hvor kommer nye egenskaper fra?',
    whatHappens:
      'For at evolusjon skal kunne skje, må individene i en populasjon være litt forskjellige fra hverandre. Nye genvarianter (alleler) oppstår ved tilfeldige mutasjoner når DNA kopieres, mens kjønnet formering (meiose og befruktning) blander genene i stadig nye kombinasjoner.',
    keyTraits: [
      {
        title: 'Mutasjoner er tilfeldige',
        description:
          'En mutasjon skjer ikke fordi organismen «trenger» den. De fleste mutasjoner er nøytrale eller skadelige, men noen få gir en fordel.',
        icon: 'sparkles',
      },
      {
        title: 'Kjønnet formering gir nye kombinasjoner',
        description:
          'Overkrysning i kjønnscelledelingen sørger for at søsken får unike kombinasjoner av foreldrenes gener.',
        icon: 'dna',
      },
    ],
    didYouKnow:
      'Hvert menneske fødes med omtrent 50–100 helt nye punktmutasjoner som ingen av foreldrene hadde.',
    examples: ['Punktmutasjon', 'Kromosomendring', 'Rekombinasjon'],
    accentCategory: 'microbe',
  },
  {
    id: 'evo_selection',
    stepIndex: 2,
    isMainPath: true,
    parentId: 'evo_variation',
    stepNumber: 3,
    title: 'Naturlig utvalg',
    shortLabel: 'Naturlig utvalg',
    latinName: 'Darwin & Wallace (1859)',
    timeMa: 'Driver 2',
    eraLabel: 'Mekanisme',
    x: 660,
    y: 220,
    labelAnchor: 'top',
    image: evoImg('evo_step3_selection.jpg'),
    imageCaption:
      'Individer med egenskaper som gir bedre kamuflasje eller ressursutnyttelse overlever lettere.',
    summaryTitle: 'Ikke-tilfeldig overlevelse og formering',
    whatHappens:
      'Det fødes alltid flere avkom enn miljøet kan gi mat og plass til. Individene med genetiske varianter som passer best til miljøet (høyest «fitness»), overlever oftere og får flere fruktbare avkom. Dermed blir de fordelaktige genene vanligere i neste generasjon.',
    keyTraits: [
      {
        title: 'Kamp om ressurser og rovdyr',
        description:
          'Matmangel, klima, sykdom og rovdyr fungerer som et «seleksjonspress» som siler ut hvilke varianter som klarer seg best.',
        icon: 'shield',
      },
      {
        title: 'Tilpasning er miljøavhengig',
        description:
          'En lys pelsfarge er en fordel i snø, men en ulempe på mørk lavastein. Når miljøet endrer seg, endres også hva som er «best».',
        icon: 'compass',
      },
    ],
    didYouKnow:
      '«Survival of the fittest» betyr ikke «den sterkeste» – i biologien betyr fitness hvor mange levedyktige avkom et individ klarer å få.',
    examples: ['Kamuflasje', 'Kuldetoleranse', 'Raskere flukt'],
    accentCategory: 'plant_fungi',
  },
  {
    id: 'evo_drift',
    stepIndex: 3,
    isMainPath: true,
    parentId: 'evo_selection',
    stepNumber: 4,
    title: 'Seksuell seleksjon & genetisk drift',
    shortLabel: 'Drift & partnervalg',
    latinName: 'Tilfeldighet og tiltrekning',
    timeMa: 'Driver 3',
    eraLabel: 'Mekanisme',
    x: 890,
    y: 220,
    labelAnchor: 'top',
    image: evoImg('evo_step4_drift.jpg'),
    imageCaption:
      'Påfuglens hale skyldes seksuell seleksjon, mens flaskehalser gir tilfeldig genetisk drift.',
    summaryTitle: 'Andre viktige drivkrefter i evolusjonen',
    whatHappens:
      'Naturlig utvalg er ikke alene. Ved seksuell seleksjon utvikles trekk som øker sjansen for å få partner – selv om de gjør det vanskeligere å overleve (som påfuglens tunge hale). Genetisk drift er tilfeldige endringer i genforrådet, som slår særlig sterkt ut i små populasjoner etter katastrofer (flaskehalseffekt).',
    keyTraits: [
      {
        title: 'Seksuell seleksjon',
        description:
          'Egenskaper som signaliserer god helse og gode gener foretrekkes av partnere, eller gir fordel i kamp om make.',
        icon: 'feather',
      },
      {
        title: 'Flaskehalseffekt & grunnleggereffekt',
        description:
          'Når få individer overlever en katastrofe eller koloniserer en øy, kan sjeldne gener plutselig bli vanlige helt tilfeldig.',
        icon: 'wind',
      },
    ],
    didYouKnow:
      'Geparder har ekstremt lav genetisk variasjon i dag fordi arten gikk gjennom en alvorlig flaskehals for rundt 10 000 år siden.',
    examples: ['Påfuglhale', 'Geopardenes flaskehals', 'Genflyt ved migrasjon'],
    accentCategory: 'invertebrate',
  },
  {
    id: 'evo_examples',
    stepIndex: 4,
    isMainPath: true,
    parentId: 'evo_drift',
    stepNumber: 5,
    title: 'Eksempler: Finker & bjørkemåler',
    shortLabel: 'Klassiske eksempler',
    latinName: 'Geospiza & Biston betularia',
    timeMa: 'Observert i naturen',
    eraLabel: 'Eksempler',
    x: 890,
    y: 500,
    labelAnchor: 'bottom',
    image: evoImg('evo_step5_finches.jpg'),
    imageCaption:
      'Galápagos-finkene har utviklet spesialiserte nebb tilpasset frø, insekter eller kaktusblomster.',
    summaryTitle: 'Evolusjon vi kan se med egne øyne',
    whatHappens:
      'På Galápagos-øyene utviklet én finkeart seg til 14 ulike arter med vidt forskjellige nebbformer tilpasset lokal føde. Under den industrielle revolusjon i England ble bjørketrærne sotete; mørke bjørkemålere fikk bedre kamuflasje enn lyse og økte kraftig i antall på få tiår.',
    keyTraits: [
      {
        title: 'Darwins finker på Galápagos',
        description:
          'Under tørkeår med bare harde frø overlevde finker med kraftige nebb best – gjennomsnittlig nebbstørrelse økte på én generasjon.',
        icon: 'feather',
      },
      {
        title: 'Bjørkemåleren i England',
        description:
          'Da luften ble renere og trærne lysere igjen etter 1960, snudde utvalget og de lyse målerne ble vanligst på nytt.',
        icon: 'eye',
      },
    ],
    didYouKnow:
      'Forskere (Peter og Rosemary Grant) målte nebbstørrelsen på Galápagos-finker i 40 år og dokumenterte målbar evolusjon fra år til år.',
    examples: ['Darwins finker', 'Bjørkemåler', 'Laktosetoleranse hos mennesker'],
    accentCategory: 'vertebrate',
  },
  {
    id: 'evo_antibiotics',
    stepIndex: 5,
    isMainPath: true,
    parentId: 'evo_examples',
    stepNumber: 6,
    title: 'Eksempel: Antibiotikaresistens',
    shortLabel: 'Antibiotikaresistens',
    latinName: 'Evolusjon i sanntid',
    timeMa: 'Timer → år',
    eraLabel: 'Eksempel i medisin',
    x: 660,
    y: 500,
    labelAnchor: 'bottom',
    image: evoImg('evo_step6_antibiotics.jpg'),
    imageCaption:
      'Når antibiotika dreper følsomme bakterier, får de få resistente bakteriene fri bane til å formere seg.',
    summaryTitle: 'Hvorfor blir bakterier resistente?',
    whatHappens:
      'Bakterier deler seg svært raskt (noen hvert 20. minutt). I en stor bakteriepopulasjon vil det ofte finnes noen få bakterier med en tilfeldig mutasjon eller et gen som gjør dem resistente mot antibiotika. Når vi bruker antibiotika, dør alle de vanlige bakteriene – og de resistente overtar.',
    keyTraits: [
      {
        title: 'Seleksjonspress i praksis',
        description:
          'Antibiotika skaper ikke resistensen, men dreper konkurrentene slik at allerede resistente varianter får all næring og plass.',
        icon: 'zap',
      },
      {
        title: 'Horisontal genoverføring',
        description:
          'Bakterier kan til og med dele resistensgener med hverandre via små DNA-ringer kalt plasmider.',
        icon: 'dna',
      },
    ],
    didYouKnow:
      'WHO regner antibiotikaresistens som en av verdens største helsetrusler. Derfor skal antibiotika bare brukes når det er helt nødvendig.',
    examples: ['MRSA-bakterier', 'Plasmider', 'Riktig antibiotikabruk'],
    accentCategory: 'mammal',
  },
  {
    id: 'evo_fossils',
    stepIndex: 6,
    isMainPath: true,
    parentId: 'evo_antibiotics',
    stepNumber: 7,
    title: 'Hvordan vet vi det? Fossiler & anatomi',
    shortLabel: 'Fossiler & anatomi',
    latinName: 'Bevis i stein og skjelett',
    timeMa: 'Dyp tid',
    eraLabel: 'Evidens 1',
    x: 430,
    y: 500,
    labelAnchor: 'bottom',
    image: evoImg('evo_step7_fossils.jpg'),
    imageCaption:
      'Overgangsfossiler i geologiske lag og homologe forlemmer hos ulike pattedyr avslører felles opphav.',
    summaryTitle: 'Spor i bergarter og kroppsbygning',
    whatHappens:
      'Geologiske lag viser en tydelig tidsrekkefølge fra enkle organismer nederst til mer komplekse lenger opp. Overgangsfossiler som Tiktaalik (mellom fisk og landvirveldyr) og urhvaler (med bakbein) viser mellomformer. Samtidig har menneskearm, hvalfinne og flaggermusvinge nøyaktig samme grunnleggende knokkelmønster (homologe strukturer).',
    keyTraits: [
      {
        title: 'Overgangsfossiler',
        description:
          'Tiktaalik (375 mill. år) har både gjeller/skjell som fisk og håndledd/nakke som landdyr.',
        icon: 'bone',
      },
      {
        title: 'Homologe & rudimentære strukturer',
        description:
          'Samme knokkelplan brukes til å gripe, svømme og fly. Hvaler har fortsatt små bekkenknokler inne i kroppen etter landlevende forfedre.',
        icon: 'layers',
      },
    ],
    didYouKnow:
      'Mennesker har også rudimentære spor etter vår evolusjonshistorie, som halebein, visdomstenner og gåsehudrefleks.',
    examples: ['Tiktaalik', 'Archaeopteryx', 'Homologe knokler'],
    accentCategory: 'human',
  },
  {
    id: 'evo_dna_speciation',
    stepIndex: 7,
    isMainPath: true,
    parentId: 'evo_fossils',
    stepNumber: 8,
    title: 'Hvordan vet vi det? DNA & artsdannelse',
    shortLabel: 'DNA & artsdannelse',
    latinName: 'Molekylære bevis & isolasjon',
    timeMa: 'Sluttsyntese',
    eraLabel: 'Evidens 2',
    x: 220,
    y: 500,
    labelAnchor: 'bottom',
    image: evoImg('evo_step8_dna_speciation.jpg'),
    imageCaption:
      'DNA-sammenligning bekrefter slektskap, og geografisk isolasjon lar én art splitte seg i to.',
    summaryTitle: 'Genetiske fingeravtrykk og nye arter',
    whatHappens:
      'Ved å lese av DNA kan vi måle slektskap direkte: arter som skiltes nylig har nesten identisk DNA (menneske og sjimpanse deler ca. 98,8 %). Nye arter oppstår når en populasjon deles av en barriere (fjell, hav, klima) og utvikler seg i hver sin retning til de ikke lenger kan få fruktbart avkom sammen.',
    keyTraits: [
      {
        title: 'Universell genetisk kode',
        description:
          'Fra bakterier til mennesker brukes de samme fire basene (A, T, C, G) og det samme systemet for å lage proteiner.',
        icon: 'dna',
      },
      {
        title: 'Allopatrisk artsdannelse',
        description:
          'Geografisk isolasjon stopper genflyt mellom to grupper, slik at mutasjoner og naturlig utvalg gjør dem til to ulike arter over tid.',
        icon: 'compass',
      },
    ],
    didYouKnow:
      'Vi deler rundt 50–60 % av genene våre med en bananplante – fordi alle eukaryote celler arvet grunnleggende cellemaskineri fra samme forfader.',
    examples: ['98,8 % DNA-likhet med sjimpanse', 'Geografisk isolasjon', 'Reproduktiv barriere'],
    accentCategory: 'origin',
  },
];

export const EVOLUTION_NODE_MAP: Record<string, TreeNodeData> =
  Object.fromEntries(EVOLUTION_NODES.map((n) => [n.id, n]));

export const EVOLUTION_CONTROL_QUESTIONS: ControlQuestionItem[] = [
  {
    id: 'evo_q1',
    number: 1,
    question:
      'Hva mener biologer med evolusjon, og hvorfor sier man at populasjoner utvikler seg – ikke enkeltindivider?',
    contextHint: 'Tenk på arvestoffet (alleler) fra én generasjon til den neste.',
    points: [
      {
        heading: 'Definisjon',
        detail:
          'Evolusjon er endring i genforrådet (allelfrekvensene) i en populasjon over generasjoner.',
        badge: 'Kjernebegrep',
      },
      {
        heading: 'Individ vs. populasjon',
        detail:
          'Et individ beholder sitt DNA hele livet. Endringen skjer mellom generasjoner når noen varianter får flere avkom enn andre.',
      },
    ],
    takeaway:
      'Evolusjon er endring i en populasjons gener over tid, basert på felles avstamning med modifikasjon.',
  },
  {
    id: 'evo_q2',
    number: 2,
    question:
      'Forklar de fire viktigste stegene i naturlig utvalg med antibiotikaresistens som eksempel.',
    contextHint: 'Variasjon → Seleksjonspress → Overlevelse/formering → Arv.',
    points: [
      {
        heading: '1. Variasjon',
        detail:
          'Tilfeldige mutasjoner gjør at noen få bakterier allerede tåler antibiotika før kuren starter.',
      },
      {
        heading: '2. Seleksjonspress',
        detail:
          'Antibiotika dreper de følsomme bakteriene, mens de resistente overlever.',
      },
      {
        heading: '3. Formering & arv',
        detail:
          'De resistente bakteriene deler seg raskt uten konkurranse og gir resistensgenet videre – hele populasjonen blir resistent.',
        badge: 'Evolusjon i sanntid',
      },
    ],
    takeaway:
      'Antibiotika skaper ikke mutasjonene, men velger ut allerede eksisterende resistente bakterier.',
  },
  {
    id: 'evo_q3',
    number: 3,
    question:
      'Hvordan vet vi at evolusjon har skjedd og fortsatt skjer? Nevn minst tre typer bevis.',
    contextHint: 'Kombiner spor fra geologi, anatomi og molekylærbiologi.',
    points: [
      {
        heading: 'Fossiler og overgangsformer',
        detail:
          'Fossiler ligger i kronologiske berglag og viser mellomformer som Tiktaalik (fisk → landdyr) og urhvaler.',
      },
      {
        heading: 'Homologe strukturer',
        detail:
          'Samme grunnleggende knokkelmønster i menneskearm, hvalfinne og flaggermusvinge peker mot felles forfader.',
      },
      {
        heading: 'DNA- og proteinlikhet',
        detail:
          'Alle arter bruker samme genetiske kode, og graden av DNA-likhet stemmer med slektskapet i stamtreet.',
        badge: 'Sterkeste bevis',
      },
    ],
    takeaway:
      'Fossiler, anatomi, DNA og direkte observasjoner i naturen peker samstemt mot evolusjon.',
  },
];

export const EVOLUTION_MCQ_QUESTIONS: McqQuestionItem[] = [
  {
    id: 'evo_mcq_1',
    number: 1,
    relatedStepIndex: 0,
    topicBadge: 'Grunnbegrep',
    question: 'Hva er den mest presise definisjonen på biologisk evolusjon?',
    options: [
      'At enkeltindivider lærer seg nye ferdigheter i løpet av livet',
      'At arvelige egenskaper (allelfrekvenser) i en populasjon endrer seg over generasjoner',
      'At alle arter bevisst prøver å bli mer intelligente',
      'At miljøet endrer DNA-et direkte slik at organismen får det den trenger',
    ],
    correctIndex: 1,
    explanation:
      'Evolusjon skjer i populasjoner over generasjoner når andelen ulike genvarianter endres.',
  },
  {
    id: 'evo_mcq_2',
    number: 2,
    relatedStepIndex: 1,
    topicBadge: 'Variasjon',
    question: 'Hvor oppstår helt nye genvarianter (alleler) i utgangspunktet?',
    options: [
      'Ved tilfeldige mutasjoner i DNA',
      'Ved at dyrene trener musklene sine',
      'Ved at rovdyr spiser byttedyr',
      'Ved geografisk isolasjon alene',
    ],
    correctIndex: 0,
    explanation:
      'Tilfeldige mutasjoner i DNA er den ultimate kilden til nye alleler, som så blandes ved kjønnet formering.',
  },
  {
    id: 'evo_mcq_3',
    number: 3,
    relatedStepIndex: 2,
    topicBadge: 'Naturlig utvalg',
    question: 'Hva betyr «fitness» i evolusjonsbiologien?',
    options: [
      'Hvor sterk og muskuløs en organisme er',
      'Hvor lenge et individ klarer å leve uten mat',
      'Hvor mange levedyktige og fruktbare avkom et individ får sammenlignet med andre',
      'Hvor raskt et dyr kan løpe',
    ],
    correctIndex: 2,
    explanation:
      'Biologisk fitness handler om reproduktiv suksess – altså hvor godt et individs gener videreføres til neste generasjon.',
  },
  {
    id: 'evo_mcq_4',
    number: 4,
    relatedStepIndex: 3,
    topicBadge: 'Drivkrefter',
    question:
      'Hvilken mekanisme forklarer at påfuglhannen har en stor, fargerik hale som egentlig gjør den lettere å oppdage for rovdyr?',
    options: [
      'Genetisk drift',
      'Seksuell seleksjon',
      'Flaskehalseffekt',
      'Antibiotikaresistens',
    ],
    correctIndex: 1,
    explanation:
      'Seksuell seleksjon favoriserer trekk som gir høyere sjanse til å bli valgt som partner, selv om de kan ha en kostnad for overlevelse.',
  },
  {
    id: 'evo_mcq_5',
    number: 5,
    relatedStepIndex: 5,
    topicBadge: 'Eksempel',
    question: 'Hvorfor utvikler bakteriepopulasjoner resistens mot antibiotika?',
    options: [
      'Bakteriene blir immune fordi de «venner seg til» medisinen',
      'Antibiotika får bakteriene til å mutere med vilje',
      'Tilfeldig resistente bakterier overlever behandlingen og formerer seg uten konkurranse',
      'Menneskekroppen slutter å ta opp antibiotika',
    ],
    correctIndex: 2,
    explanation:
      'Det finnes ofte noen få tilfeldig resistente bakterier fra før. Antibiotika dreper de følsomme, og de resistente tar over.',
  },
  {
    id: 'evo_mcq_6',
    number: 6,
    relatedStepIndex: 6,
    topicBadge: 'Bevis',
    question:
      'Menneskearm, hvalfinne og flaggermusvinge har helt ulike funksjoner, men samme grunnleggende knokkelplan. Hva kalles dette?',
    options: [
      'Homologe strukturer – som tyder på felles forfader',
      'Tilfeldige mutasjoner uten slektskap',
      'Genetisk drift',
      'Seksuell seleksjon',
    ],
    correctIndex: 0,
    explanation:
      'Homologe strukturer er anatomiske trekk arvet fra en felles forfader som er tilpasset ulike levevis.',
  },
  {
    id: 'evo_mcq_7',
    number: 7,
    relatedStepIndex: 7,
    topicBadge: 'Bevis & artsdannelse',
    question: 'Hvordan oppstår nye arter oftest (allopatrisk artsdannelse)?',
    options: [
      'Ved at én organisme bestemmer seg for å bli en ny art',
      'Ved at en populasjon splittes av en geografisk barriere og utvikler seg ulikt over lang tid',
      'Ved at to helt ulike arter krysser seg hver vår',
      'Ved at alle mutasjoner forsvinner',
    ],
    correctIndex: 1,
    explanation:
      'Når to grupper isoleres geografisk, stopper genflyten. Over tid blir de så ulike at de ikke lenger kan få fruktbart avkom sammen.',
  },
];
