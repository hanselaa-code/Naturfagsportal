import {
  CELL_CONTROL_QUESTIONS,
  CELL_MAIN_STEP_IDS,
  CELL_NODE_MAP,
  CELL_NODES,
} from './animalCellData';
import {
  DNA_CONTROL_QUESTIONS,
  DNA_MAIN_STEP_IDS,
  DNA_NODE_MAP,
  DNA_NODES,
} from './dnaReplicationData';
import {
  EVOLUTION_CONTROL_QUESTIONS,
  EVOLUTION_MAIN_STEP_IDS,
  EVOLUTION_MCQ_QUESTIONS,
  EVOLUTION_NODE_MAP,
  EVOLUTION_NODES,
} from './evolutionData';
import {
  GENETICS_CONTROL_QUESTIONS,
  GENETICS_MAIN_STEP_IDS,
  GENETICS_MCQ_QUESTIONS,
  GENETICS_NODE_MAP,
  GENETICS_NODES,
} from './geneticsData';
import {
  BODY_CONTROL_QUESTIONS,
  BODY_MAIN_STEP_IDS,
  BODY_NODE_MAP,
  BODY_NODES,
} from './humanBodyData';
import {
  BODY_MCQ_QUESTIONS,
  CELL_MCQ_QUESTIONS,
  DNA_MCQ_QUESTIONS,
  type McqQuestionItem,
  PLANT_CELL_MCQ_QUESTIONS,
  PROTEIN_MCQ_QUESTIONS,
  TREE_MCQ_QUESTIONS,
} from './mcqQuestionsData';
import {
  PLANT_CELL_CONTROL_QUESTIONS,
  PLANT_CELL_MAIN_STEP_IDS,
  PLANT_CELL_NODE_MAP,
  PLANT_CELL_NODES,
} from './plantCellData';
import {
  PROTEIN_CONTROL_QUESTIONS,
  PROTEIN_MAIN_STEP_IDS,
  PROTEIN_NODE_MAP,
  PROTEIN_NODES,
} from './proteinSynthesisData';
import {
  CONTROL_QUESTIONS,
  MAIN_STEP_IDS,
  NODE_MAP,
  TREE_NODES,
  type ControlQuestionItem,
  type TreeNodeData,
} from './treeOfLifeData';

export type ThemeId =
  | 'livets-tre'
  | 'kroppens-evolusjon'
  | 'dyrecellen'
  | 'plantecellen'
  | 'dna-replikasjon'
  | 'proteinsyntesen'
  | 'genetikk'
  | 'evolusjon';

export type AppView = 'biologi' | ThemeId;

export interface ThemeConfig {
  id: ThemeId;
  hash: string;
  title: string;
  dropdownTitle: string;
  dropdownBadge: string;
  dropdownDescription: string;
  subtitle: string;
  stepWord: string;
  showAllLabel: string;
  progressiveLabel: string;
  quizTitle: string;
  backFromQuizLabel: string;
  summaryHeadingPrefix: string;
  traitsHeading: string;
  classroomBoxHeading: string;
  examplesHeading: string;
  mainStepIds: string[];
  allNodes: TreeNodeData[];
  nodeMap: Record<string, TreeNodeData>;
  controlQuestions: ControlQuestionItem[];
  mcqQuestions: McqQuestionItem[];
  quizShortcuts: { label: string; idx: number }[];
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'livets-tre': {
    id: 'livets-tre',
    hash: '#livets-tre',
    title: 'Livets Tre – Fra LUCA til Homo sapiens',
    dropdownTitle: 'Livets Tre',
    dropdownBadge: 'Stamtre • 3700 ma → nåtid',
    dropdownDescription:
      'Interaktivt stamtre med 46 grener og over 200 arter fra livets opprinnelse i urhavet til mennesket.',
    subtitle:
      'Interaktiv klasseromspresentasjon • 3,7 milliarder års evolusjon (Vg1 Naturfag / Biologi)',
    stepWord: 'Steg',
    showAllLabel: 'Vis hele treet',
    progressiveLabel: 'Stegvis modus',
    quizTitle: 'Kontrollspørsmål: Livets utvikling',
    backFromQuizLabel: 'Tilbake til Livets Tre',
    summaryHeadingPrefix: 'Hva skjer her?',
    traitsHeading: 'Evolusjonære nøkkeltrekk',
    classroomBoxHeading: 'Prøv selv i klasserommet!',
    examplesHeading: 'Eksempler på arter og grupper',
    mainStepIds: MAIN_STEP_IDS,
    allNodes: TREE_NODES,
    nodeMap: NODE_MAP,
    controlQuestions: CONTROL_QUESTIONS,
    mcqQuestions: TREE_MCQ_QUESTIONS,
    quizShortcuts: [
      { label: 'Steg 2: Eukaryoter (2000 ma)', idx: 1 },
      { label: 'Steg 3: Dyr (660 ma)', idx: 2 },
      { label: 'Steg 4: Virveldyr (450 ma)', idx: 3 },
      { label: 'Steg 6: Pattedyr (178 ma)', idx: 5 },
      { label: 'Steg 10: Homo sapiens', idx: 9 },
    ],
  },
  'kroppens-evolusjon': {
    id: 'kroppens-evolusjon',
    hash: '#kroppens-evolusjon',
    title: 'Menneskekroppens evolusjonære spor',
    dropdownTitle: 'Menneskekroppens evolusjonære spor',
    dropdownBadge: 'Tankekart • Kroppen i midten',
    dropdownDescription:
      'Utforsk halebein, gåsehud, blindtarm, visdomstenner, hikke og S-ryggsøyle på vår egen kropp.',
    subtitle:
      'Interaktivt anatomisk tankekart • Levende spor fra 500 millioner års evolusjon i din egen kropp',
    stepWord: 'Spor',
    showAllLabel: 'Vis alle spor',
    progressiveLabel: 'Stegvis modus',
    quizTitle: 'Kontrollspørsmål: Menneskekroppens evolusjonære spor',
    backFromQuizLabel: 'Tilbake til menneskekroppen',
    summaryHeadingPrefix: 'Hvorfor har vi dette?',
    traitsHeading: 'Evolusjonære mekanismer og spor',
    classroomBoxHeading: 'Prøv selv i klasserommet!',
    examplesHeading: 'Eksempler og evolusjonære paralleller',
    mainStepIds: BODY_MAIN_STEP_IDS,
    allNodes: BODY_NODES,
    nodeMap: BODY_NODE_MAP,
    controlQuestions: BODY_CONTROL_QUESTIONS,
    mcqQuestions: BODY_MCQ_QUESTIONS,
    quizShortcuts: [
      { label: 'Spor 1: Øynene & blind flekk', idx: 0 },
      { label: 'Spor 3: Visdomstenner', idx: 2 },
      { label: 'Spor 4: S-ryggsøyle & bekken', idx: 3 },
      { label: 'Spor 7: Blindtarmen', idx: 6 },
      { label: 'Spor 8: Halebeinet', idx: 7 },
      { label: 'Spor 10: Fotbuen & nåtid', idx: 9 },
    ],
  },
  dyrecellen: {
    id: 'dyrecellen',
    hash: '#dyrecellen',
    title: 'Eukaryot dyrecelle – Oppbygning og organeller',
    dropdownTitle: 'Eukaryot dyrecelle',
    dropdownBadge: 'Cellemodell • Cellemembran & organeller',
    dropdownDescription:
      '3D-snitt av en dyrecelle i midten – fra cellemembranen inn til cellekjerne, ribosomer, ER, Golgi og mitokondrier.',
    subtitle:
      'Interaktiv cellemodell • Fra cellemembranen gjennom alle organellene og deres funksjon',
    stepWord: 'Del',
    showAllLabel: 'Vis alle organeller',
    progressiveLabel: 'Stegvis modus',
    quizTitle: 'Kontrollspørsmål: Eukaryot dyrecelle',
    backFromQuizLabel: 'Tilbake til dyrecellen',
    summaryHeadingPrefix: 'Oppgave i cellen',
    traitsHeading: 'Oppbygning og nøkkelfunksjoner',
    classroomBoxHeading: 'Husketriks & kobling i timen',
    examplesHeading: 'Nøkkelbegreper å kunne',
    mainStepIds: CELL_MAIN_STEP_IDS,
    allNodes: CELL_NODES,
    nodeMap: CELL_NODE_MAP,
    controlQuestions: CELL_CONTROL_QUESTIONS,
    mcqQuestions: CELL_MCQ_QUESTIONS,
    quizShortcuts: [
      { label: 'Del 1: Cellemembranen', idx: 0 },
      { label: 'Del 3: Cellekjernen (DNA)', idx: 2 },
      { label: 'Del 4: Ribosomer', idx: 3 },
      { label: 'Del 5: Ru & glatt ER', idx: 4 },
      { label: 'Del 6: Golgiapparatet', idx: 5 },
      { label: 'Del 8: Mitokondrier (ATP)', idx: 7 },
    ],
  },
  plantecellen: {
    id: 'plantecellen',
    hash: '#plantecellen',
    title: 'Eukaryot plantecelle – Cellevegg, kloroplaster og organeller',
    dropdownTitle: 'Eukaryot plantecelle',
    dropdownBadge: 'Cellemodell • Cellevegg, fotosyntese & vakuole',
    dropdownDescription:
      '3D-snitt av en plantecelle i midten – fra cellevegg og membran til kloroplaster, vakuole, kjerne og mitokondrier.',
    subtitle:
      'Interaktiv cellemodell • Fra celleveggen gjennom kloroplaster, vakuole og alle plantecellens organeller',
    stepWord: 'Del',
    showAllLabel: 'Vis alle organeller',
    progressiveLabel: 'Stegvis modus',
    quizTitle: 'Kontrollspørsmål: Eukaryot plantecelle',
    backFromQuizLabel: 'Tilbake til plantecellen',
    summaryHeadingPrefix: 'Oppgave i plantecellen',
    traitsHeading: 'Oppbygning og nøkkelfunksjoner',
    classroomBoxHeading: 'Husketriks & kobling i timen',
    examplesHeading: 'Nøkkelbegreper å kunne',
    mainStepIds: PLANT_CELL_MAIN_STEP_IDS,
    allNodes: PLANT_CELL_NODES,
    nodeMap: PLANT_CELL_NODE_MAP,
    controlQuestions: PLANT_CELL_CONTROL_QUESTIONS,
    mcqQuestions: PLANT_CELL_MCQ_QUESTIONS,
    quizShortcuts: [
      { label: 'Del 1: Celleveggen', idx: 0 },
      { label: 'Del 3: Kloroplaster', idx: 2 },
      { label: 'Del 4: Sentralvakuolen', idx: 3 },
      { label: 'Del 5: Cellekjernen', idx: 4 },
      { label: 'Del 8: Golgi & celleplate', idx: 7 },
      { label: 'Del 9: Mitokondrier (ATP)', idx: 8 },
    ],
  },
  'dna-replikasjon': {
    id: 'dna-replikasjon',
    hash: '#dna-replikasjon',
    title: 'DNA-struktur og replikasjon – Hva DNA er og hvordan det kopieres',
    dropdownTitle: 'DNA-struktur og replikasjon',
    dropdownBadge: 'Dobbelheliks & Y-gaffel • Hva DNA er',
    dropdownDescription:
      'Fra kromosomer, histoner og nukleotider (A–T og C–G) til hvordan DNA kopierer seg før celledeling – og hvordan mutasjoner skaper evolusjon.',
    subtitle:
      'Interaktiv DNA- og replikasjonsgaffel-modell • Fra nukleotid og dobbelheliks til celledeling, mutasjoner og evolusjon',
    stepWord: 'Steg',
    showAllLabel: 'Vis hele DNA-modellen',
    progressiveLabel: 'Stegvis modus',
    quizTitle: 'Kontrollspørsmål: DNA-struktur og replikasjon',
    backFromQuizLabel: 'Tilbake til DNA-modellen',
    summaryHeadingPrefix: 'Hva ser vi her?',
    traitsHeading: 'Oppbygning, enzymer og nøkkelmekanismer',
    classroomBoxHeading: 'Husketriks & kobling i timen',
    examplesHeading: 'Nøkkelbegreper på dette steget',
    mainStepIds: DNA_MAIN_STEP_IDS,
    allNodes: DNA_NODES,
    nodeMap: DNA_NODE_MAP,
    controlQuestions: DNA_CONTROL_QUESTIONS,
    mcqQuestions: DNA_MCQ_QUESTIONS,
    quizShortcuts: [
      { label: 'Steg 1: 46 kromosomer i kjernen', idx: 0 },
      { label: 'Steg 3: Nukleotidets 3 deler', idx: 2 },
      { label: 'Steg 4: Baseparing A–T & C–G', idx: 3 },
      { label: 'Steg 7: Helikase & replikasjonsgaffel', idx: 6 },
      { label: 'Steg 8: DNA-polymerase & Okazaki', idx: 7 },
      { label: 'Steg 9: Mutasjoner & evolusjon', idx: 8 },
    ],
  },
  proteinsyntesen: {
    id: 'proteinsyntesen',
    hash: '#proteinsyntesen',
    title: 'Proteinsyntesen – Fra DNA-gen til ferdig 3D-protein',
    dropdownTitle: 'Proteinsyntesen (steg for steg)',
    dropdownBadge: 'Tidslinje • DNA → mRNA → Protein',
    dropdownDescription:
      'Steg-for-steg tidslinje gjennom transkripsjon og spleising i cellekjernen, ut gjennom kjerneporen til ribosom, tRNA og 3D-folding.',
    subtitle:
      'Interaktiv tidslinje • 10 steg fra DNA i cellekjernen via mRNA og ribosom til ferdig foldet protein',
    stepWord: 'Steg',
    showAllLabel: 'Vis hele tidslinjen',
    progressiveLabel: 'Stegvis modus',
    quizTitle: 'Kontrollspørsmål: Proteinsyntesen',
    backFromQuizLabel: 'Tilbake til tidslinjen',
    summaryHeadingPrefix: 'Hva skjer i dette steget?',
    traitsHeading: 'Molekylære mekanismer og nøkkelpunkter',
    classroomBoxHeading: 'Husketriks & tavleøvelse i timen',
    examplesHeading: 'Nøkkelbegreper på dette steget',
    mainStepIds: PROTEIN_MAIN_STEP_IDS,
    allNodes: PROTEIN_NODES,
    nodeMap: PROTEIN_NODE_MAP,
    controlQuestions: PROTEIN_CONTROL_QUESTIONS,
    mcqQuestions: PROTEIN_MCQ_QUESTIONS,
    quizShortcuts: [
      { label: 'Steg 1: DNA-genet åpnes', idx: 0 },
      { label: 'Steg 2: Transkripsjon (mRNA)', idx: 1 },
      { label: 'Steg 3: Spleising (intron/ekson)', idx: 2 },
      { label: 'Steg 5: Kodon & tRNA', idx: 4 },
      { label: 'Steg 6: Startkodon AUG', idx: 5 },
      { label: 'Steg 9: 3D-folding & Golgi', idx: 8 },
    ],
  },
  genetikk: {
    id: 'genetikk',
    hash: '#genetikk',
    title: 'Genetikk – Arv, alleler, meiose & krysningsskjema',
    dropdownTitle: 'Genetikk',
    dropdownBadge: 'Arvelighetskart & Punnett • 8 steg',
    dropdownDescription:
      'Utforsk gener og alleler, dominant/recessiv arv, meiose, interaktivt krysningsskjema, XX/XY, epigenetikk og CRISPR.',
    subtitle:
      'Interaktivt arvelighetskart & krysningsskjema • Fra gener og alleler til meiose, sannsynlighet og genteknologi',
    stepWord: 'Steg',
    showAllLabel: 'Vis hele kartet',
    progressiveLabel: 'Stegvis modus',
    quizTitle: 'Kontrollspørsmål: Genetikk',
    backFromQuizLabel: 'Tilbake til Genetikk',
    summaryHeadingPrefix: 'Kjernepoeng',
    traitsHeading: 'Sentrale begreper & mekanismer',
    classroomBoxHeading: 'Visste du dette?',
    examplesHeading: 'Viktige eksempler & begreper',
    mainStepIds: GENETICS_MAIN_STEP_IDS,
    allNodes: GENETICS_NODES,
    nodeMap: GENETICS_NODE_MAP,
    controlQuestions: GENETICS_CONTROL_QUESTIONS,
    mcqQuestions: GENETICS_MCQ_QUESTIONS,
    quizShortcuts: [
      { label: 'Steg 1: Gener & alleler', idx: 0 },
      { label: 'Steg 2: Genotype & fenotype', idx: 1 },
      { label: 'Steg 3: Dominant & recessiv arv', idx: 2 },
      { label: 'Steg 4: Meiose (46 → 23)', idx: 3 },
      { label: 'Steg 5: Krysningsskjema', idx: 4 },
      { label: 'Steg 6: XX / XY & kjønnsbundet arv', idx: 5 },
      { label: 'Steg 8: CRISPR & genteknologi', idx: 7 },
    ],
  },
  evolusjon: {
    id: 'evolusjon',
    hash: '#evolusjon',
    title: 'Hva er evolusjon? – Drivkrefter, eksempler og bevis',
    dropdownTitle: 'Hva er evolusjon?',
    dropdownBadge: 'Grunnprinsipper • 8 steg',
    dropdownDescription:
      'Forstå hva evolusjon er, hvilke mekanismer som driver den, kjente eksempler og hvordan vi vet at den skjer.',
    subtitle:
      'Interaktiv klasseromspresentasjon • Naturlig utvalg, mutasjoner, eksempler & bevis',
    stepWord: 'Steg',
    showAllLabel: 'Vis alle 8 steg',
    progressiveLabel: 'Stegvis modus',
    quizTitle: 'Kontrollspørsmål: Hva er evolusjon?',
    backFromQuizLabel: 'Tilbake til Hva er evolusjon?',
    summaryHeadingPrefix: 'Kjernepoeng',
    traitsHeading: 'Viktige begreper & mekanismer',
    classroomBoxHeading: 'Prøv selv i klasserommet!',
    examplesHeading: 'Sentrale eksempler',
    mainStepIds: EVOLUTION_MAIN_STEP_IDS,
    allNodes: EVOLUTION_NODES,
    nodeMap: EVOLUTION_NODE_MAP,
    controlQuestions: EVOLUTION_CONTROL_QUESTIONS,
    mcqQuestions: EVOLUTION_MCQ_QUESTIONS,
    quizShortcuts: [
      { label: 'Steg 1: Hva er evolusjon?', idx: 0 },
      { label: 'Steg 3: Naturlig utvalg', idx: 2 },
      { label: 'Steg 5: Darwins finker & målere', idx: 4 },
      { label: 'Steg 6: Antibiotikaresistens', idx: 5 },
      { label: 'Steg 7: Fossiler & anatomi', idx: 6 },
      { label: 'Steg 8: DNA & artsdannelse', idx: 7 },
    ],
  },
};

export const THEME_LIST: ThemeConfig[] = [
  THEMES.dyrecellen,
  THEMES.plantecellen,
  THEMES['dna-replikasjon'],
  THEMES.proteinsyntesen,
  THEMES.genetikk,
  THEMES.evolusjon,
  THEMES['livets-tre'],
  THEMES['kroppens-evolusjon'],
];

export function parseThemeFromHash(hash: string): ThemeId {
  const clean = hash.replace(/^#/, '').trim().toLowerCase();
  if (clean === 'kroppens-evolusjon' || clean === 'kroppen') {
    return 'kroppens-evolusjon';
  }
  if (
    clean === 'dyrecellen' ||
    clean === 'dyrecelle' ||
    clean === 'eukaryot-dyrecelle'
  ) {
    return 'dyrecellen';
  }
  if (
    clean === 'plantecellen' ||
    clean === 'plantecelle' ||
    clean === 'eukaryot-plantecelle'
  ) {
    return 'plantecellen';
  }
  if (
    clean === 'dna-replikasjon' ||
    clean === 'dna' ||
    clean === 'dna-struktur' ||
    clean === 'replikasjon'
  ) {
    return 'dna-replikasjon';
  }
  if (
    clean === 'proteinsyntesen' ||
    clean === 'proteinsyntese' ||
    clean === 'dna-til-protein'
  ) {
    return 'proteinsyntesen';
  }
  if (clean === 'genetikk' || clean === 'arv' || clean === 'punnett') {
    return 'genetikk';
  }
  if (clean === 'evolusjon') {
    return 'evolusjon';
  }
  return 'livets-tre';
}
