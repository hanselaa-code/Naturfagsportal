import type {
  KarbonStepNode,
  KarbonControlQuestion,
  KarbonMcqQuestion,
} from './atomBindingData';

export type KarbonNodeCategory = 'core' | 'skeleton' | 'bonding' | 'materials_life';

export interface KarbonAtometStepNode extends KarbonStepNode {
  stepIndex: number;
  category: KarbonNodeCategory;
  formulaTag: string;
  x: number;
  y: number;
  ringLevel: 0 | 1 | 2;
  side: 'center' | 'left' | 'right' | 'top' | 'bottom';
}

export const KARBON_ATOMET_STEPS: KarbonAtometStepNode[] = [
  {
    id: 'karbon-4-bindinger',
    stepIndex: 0,
    stepNumber: 1,
    category: 'core',
    formulaTag: 'C (2, 4) • 4 bindinger • 109,5°',
    x: 820,
    y: 540,
    ringLevel: 0,
    side: 'center',
    title: 'Karbonatomet — 4 bindinger i 3D',
    shortLabel: 'Karbon (4 bindinger)',
    badgeText: 'Kjerne • Gruppe 14 • Oktettregelen',
    categoryLabel: 'Karbonkjernen',
    image: './assets/karbon/karbon_step1_tetrahedron.jpg',
    imageCaption:
      'Med 4 valenselektroner danner karbon 4 sterke elektronparbindinger som peker ut mot hjørnene i et 3D-tetraeder (109,5°).',
    summaryTitle: 'Naturens mest allsidige byggekloss',
    whatHappens:
      'Karbon (atomnummer 6) står i gruppe 14 i periodesystemet og har elektronfordelingen 2, 4. Med 4 valenselektroner ligger karbon midt mellom å gi bort og ta opp elektroner — derfor deler det elektroner og danner 4 sterke kovalente bindinger for å oppnå oktett (8 elektroner ytterst). Fordi de fire elektronparene frastøter hverandre mest mulig i rommet, får metan (CH₄) en tredimensjonal tetraederform med nøyaktig 109,5° mellom bindingene.',
    keyTraits: [
      {
        title: 'Alltid 4 bindinger i nøytrale molekyler',
        description:
          'Enten som fire enkeltbindinger, dobbeltbindinger eller trippelbindinger: tell strekene rundt hvert C-atom — summen blir 4.',
      },
      {
        title: '3D-tetraederform (109,5°)',
        description:
          'På papir tegner vi ofte metan flatt med 90° vinkler, men i virkeligheten danner karbon en 3D-pyramide med 109,5° mellom hver binding.',
      },
      {
        title: 'Sterke, stabile elektronparbindinger',
        description:
          'Karbonatomet er lite, slik at kjernen holder tett på de delte elektronene. Det gir sterke bindinger som tåler både temperatur og kjemiske reaksjoner.',
      },
    ],
    didYouKnow:
      'Karbon er det fjerde vanligste grunnstoffet i hele universet, og hvert eneste karbonatom i kroppen din ble en gang smidd inne i kjernen på en eldgammel stjerne!',
    classroomTest:
      'Klikk på sentrumsnoden i karbonkartet og følg pilene ut mot alle de 7 nabonodene. Hvorfor er det nettopp tallet 4 som gjør alt det andre i kartet mulig?',
    examples: ['C (2, 4)', '4 kovalente bindinger', 'Tetraeder (109,5°)', 'Metan (CH₄)'],
  },
  {
    id: 'karbon-kjeder',
    stepIndex: 1,
    stepNumber: 2,
    category: 'skeleton',
    formulaTag: 'C–C–C–C • Katenasjon',
    x: 340,
    y: 215,
    ringLevel: 1,
    side: 'left',
    title: 'Kjededannelse (katenasjon)',
    shortLabel: 'Karbonkjeder',
    badgeText: 'Skjelett • C–C-bindinger',
    categoryLabel: 'Karbonskjelett',
    image: './assets/karbon/karbon_step2_chains.jpg',
    imageCaption:
      'Karbonatomer kan binde seg til hverandre i nesten uendelig lange, stabile sikksakk-kjeder — en egenskap kalt katenasjon.',
    summaryTitle: 'Fra lette gasser til seige polymerer',
    whatHappens:
      'Karbons mest unike superkraft er katenasjon: evnen til å danne sterke, stabile bindinger til andre karbonatomer i lange kjeder. På grunn av tetraedervinkelen på 109,5° ligger ikke karbonkjeder helt rett, men i et karakteristisk sikksakk-mønster. Lengden på kjeden styrer egenskapene direkte: korte kjeder (1–4 C) er gasser ved romtemperatur, mellomlange (5–16 C) er væsker som bensin og diesel, og svært lange kjeder blir fast voks eller plast (polymerer).',
    keyTraits: [
      {
        title: 'Katenasjon = kjeder av like atomer',
        description:
          'Ingen andre grunnstoffer i periodesystemet danner like lange og stabile kjeder med seg selv som karbon.',
      },
      {
        title: 'Lengre kjede → høyere kokepunkt',
        description:
          'Jo flere karbonatomer i kjeden, desto sterkere blir tiltrekningskreftene mellom nabomolekylene — fra metangass til fast stearin.',
      },
      {
        title: 'Grunnlaget for plast og biomolekyler',
        description:
          'Både fettsyrer i kroppen og syntetiske polymerer som polyeten (plastposer) er bygget på lange karbonskjeletter.',
      },
    ],
    didYouKnow:
      'Én enkelt polyeten-kjede i en vanlig plastpose kan bestå av over 100 000 karbonatomer hektet sammen etter hverandre!',
    classroomTest:
      'Bruk utforskerkartet til å sammenligne noden «Karbonkjeder» med «Forgreninger & isomeri». Hva skjer med kokepunktet når en kjede blir lengre kontra når den forgrener seg?',
    examples: ['Katenasjon', 'Propan (C₃H₈)', 'Oktan (C₈H₁₈)', 'Polymerer'],
  },
  {
    id: 'karbon-forgreninger-isomeri',
    stepIndex: 2,
    stepNumber: 3,
    category: 'skeleton',
    formulaTag: 'C₄H₁₀ • n-butan vs. isobutan',
    x: 245,
    y: 540,
    ringLevel: 1,
    side: 'left',
    title: 'Forgreninger & strukturisomeri',
    shortLabel: 'Forgrening & isomeri',
    badgeText: 'Skjelett • Samme formel, ulik form',
    categoryLabel: 'Karbonskjelett',
    image: './assets/karbon/karbon_step3_isomers.jpg',
    imageCaption:
      'n-butan (rett kjede) og isobutan (forgrenet) har begge formelen C₄H₁₀, men ulik 3D-form gir ulikt kokepunkt.',
    summaryTitle: 'Samme oppskrift, helt forskjellige molekyler',
    whatHappens:
      'Så snart et molekyl har fire eller flere karbonatomer, kan de kobles sammen på mer enn én måte. Molekyler med nøyaktig samme molekylformel, men ulik oppbygning, kalles strukturisomerer. For eksempel har både n-butan (rett kjede) og isobutan (forgrenet) formelen C₄H₁₀. Fordi n-butan kan pakke seg tettere mot nabomolekyler, koker det ved −0,5 °C, mens den mer kuleformede isobutan koker allerede ved −11,7 °C.',
    keyTraits: [
      {
        title: 'Strukturisomeri skaper enorm variasjon',
        description:
          'C₄H₁₀ har bare 2 isomerer, men allerede ved C₁₀H₂₂ finnes det 75 ulike måter å koble atomene på — og ved C₂₀H₄₂ over 366 000!',
      },
      {
        title: 'Formen bestemmer egenskapene',
        description:
          'Forgrenede molekyler får mindre kontaktflate med nabomolekyler enn rette kjeder, og får derfor lavere kokepunkt.',
      },
      {
        title: 'Viktig i drivstoff og medisin',
        description:
          'Forgrenede hydrokarboner (som isooktan) brenner jevnere i bilmotorer enn rette kjeder, og i medisiner kan feil isomer være helt uvirksom.',
      },
    ],
    didYouKnow:
      'Med bare 40 karbonatomer (C₄₀H₈₂) finnes det teoretisk over 62 billioner (62 000 000 000 000) mulige strukturisomerer!',
    classroomTest:
      'Se på sammenligningen av C₄H₁₀ i detaljkortet: tell både C- og H-atomer i n-butan og isobutan, og forklar med egne ord hvorfor isobutan fordamper lettere.',
    examples: ['Strukturisomeri', 'n-butan (−0,5 °C)', 'Isobutan (−11,7 °C)', 'Forgrenet kjede'],
  },
  {
    id: 'karbon-dobbelt-trippel',
    stepIndex: 3,
    stepNumber: 4,
    category: 'bonding',
    formulaTag: 'C–C • C=C • C≡C',
    x: 340,
    y: 865,
    ringLevel: 1,
    side: 'left',
    title: 'Enkelt-, dobbelt- & trippelbindinger',
    shortLabel: 'Flerdoble bindinger',
    badgeText: 'Bindinger • 1, 2 eller 3 par',
    categoryLabel: 'Bindingstyper',
    image: './assets/karbon/karbon_step4_multiple_bonds.jpg',
    imageCaption:
      'Karbon kan dele 1, 2 eller 3 elektronpar med et nabokarbon — det endrer både vinkel, rotasjon og reaktivitet.',
    summaryTitle: 'Bindingstypen avgjør om molekylet er mykt, stivt eller rett',
    whatHappens:
      'To karbonatomer trenger ikke nøye seg med å dele ett elektronpar. De kan danne enkeltbinding (C–C, som i etan), dobbeltbinding (C=C, som i eten) eller trippelbinding (C≡C, som i etyn/acetylen). En enkeltbinding kan rotere fritt som en aksling og har 109,5° vinkel. En dobbeltbinding låser molekylet i en stiv, flat vinkel på 120°, mens en trippelbinding tvinger atomene inn på en helt rett linje (180°).',
    keyTraits: [
      {
        title: 'Enkeltbinding (C–C) — fri rotasjon (109,5°)',
        description:
          'Mettede forbindelser (alkaner og mettet fett) har bare enkeltbindinger og kan pakke seg tett sammen.',
      },
      {
        title: 'Dobbeltbinding (C=C) — stiv og plan (120°)',
        description:
          'Skaper en «knekk» i umettede fettsyrer (som olivenolje), slik at de ikke pakkes tett og derfor er flytende ved romtemperatur.',
      },
      {
        title: 'Trippelbinding (C≡C) — rettlinjet og energirik (180°)',
        description:
          'Deler 6 elektroner mellom to C-atomer. Etyn (acetylen) brenner med ekstremt varm flamme og brukes til sveising.',
      },
    ],
    didYouKnow:
      'Modne bananer og epler skiller ut den enkle gassen eten (C₂H₄, med én C=C-dobbeltbinding) som plantehormon — derfor modner frukt raskere i samme pose!',
    classroomTest:
      'Bruk kategori-filteret «Bindingstyper» i karbonkartet og sammenlign hvordan dobbeltbindinger (steg 4) og heteroatomer (steg 6) endrer reaktiviteten til et molekyl.',
    examples: ['C–C (109,5°)', 'C=C (120°, eten)', 'C≡C (180°, etyn)', 'Umettet fett'],
  },
  {
    id: 'karbon-ringer',
    stepIndex: 4,
    stepNumber: 5,
    category: 'skeleton',
    formulaTag: 'C₆H₁₂ • C₆H₆ (Benzen)',
    x: 820,
    y: 140,
    ringLevel: 1,
    side: 'top',
    title: 'Ringer & aromatiske strukturer',
    shortLabel: 'Karbonringer',
    badgeText: 'Skjelett • 5- og 6-ringer',
    categoryLabel: 'Karbonskjelett',
    image: './assets/karbon/karbon_step5_rings.jpg',
    imageCaption:
      'Karbonkjeder kan lukke seg til stabile 5- og 6-ringer, som sykloheksan, glukose og den aromatiske benzenringen (C₆H₆).',
    summaryTitle: 'Når karbonkjeden biter seg selv i halen',
    whatHappens:
      'Karbonkjeder kan bøye seg rundt og danne lukkede ringer — spesielt 5-ringer og 6-ringer er svært stabile fordi bindingsvinklene passer nesten perfekt med tetraedervinkelen. I sykloheksan (C₆H₁₂) har alle karbonatomene enkeltbindinger. I benzen (C₆H₆) deler seks karbonatomer i en flat sekskant på seks «delokaliserte» elektroner som flyter jevnt rundt hele ringen. Slike aromatiske ringer er usedvanlig stabile og finnes overalt i naturen og i medisiner.',
    keyTraits: [
      {
        title: '5- og 6-ringer er naturens favoritter',
        description:
          'Både druesukker (glukose), kolesterol, vitaminer og basene i DNA er bygget på lukkede karbonringer.',
      },
      {
        title: 'Benzen — delte elektroner i en stabil ring',
        description:
          'I stedet for tre faste dobbeltbindinger fordeles elektronene jevnt over hele 6-ringen, noe som gjør benzenringen ekstra stabil.',
      },
      {
        title: 'Duftstoffer, smak og legemidler',
        description:
          'Navnet «aromatisk» kom fordi mange av de første ringstoffene man fant hadde sterk lukt — som vanillin, kanel og paracetamol.',
      },
    ],
    didYouKnow:
      'Kjemikeren August Kekulé hevdet i 1865 at han løste gåten om benzenets ringstruktur etter å ha dagdrømt om en slange som bet seg selv i halen!',
    classroomTest:
      'Se på toppnoden i karbonkartet og sammenlign sykloheksan (C₆H₁₂) med benzen (C₆H₆). Hvorfor mangler benzen seks hydrogenatomer sammenlignet med sykloheksan?',
    examples: ['Sykloheksan (C₆H₁₂)', 'Benzen (C₆H₆)', 'Glukosering', 'DNA-baser'],
  },
  {
    id: 'karbon-heteroatomer',
    stepIndex: 5,
    stepNumber: 6,
    category: 'bonding',
    formulaTag: 'C + O, N, S, P • –OH / –NH₂',
    x: 1300,
    y: 215,
    ringLevel: 2,
    side: 'right',
    title: 'Karbon + O, N, S & P (funksjonelle grupper)',
    shortLabel: 'Funksjonelle grupper',
    badgeText: 'Bindinger • Heteroatomer',
    categoryLabel: 'Bindingstyper',
    image: './assets/karbon/karbon_step6_heteroatoms.jpg',
    imageCaption:
      'Når oksygen, nitrogen, svovel eller fosfor kobles på karbonskjelettet, får molekylet helt nye kjemiske egenskaper.',
    summaryTitle: 'Små grupper gir molekylet «personlighet»',
    whatHappens:
      'Rene hydrokarboner (bare C og H) er upolare og reagerer lite. Magien skjer for alvor når karbon binder seg til såkalte heteroatomer som oksygen (O), nitrogen (N), svovel (S) og fosfor (P). Disse danner funksjonelle grupper som styrer hvordan hele molekylet oppfører seg: en –OH-gruppe gjør molekylet til en vannløselig alkohol (etanol), en –COOH-gruppe gjør det til en syre (eddiksyre), en –NH₂-gruppe gir aminosyrer i proteiner, og fosfatgrupper (P + O) holder sammen ryggraden i DNA og lagrer energi i ATP.',
    keyTraits: [
      {
        title: 'Hydroksylgruppe (–OH) → alkoholer og sukker',
        description:
          'Oksygen trekker sterkt på elektronene og gjør molekylet polart, slik at etanol og glukose løser seg lett i vann.',
      },
      {
        title: 'Karboksylgruppe (–COOH) → organiske syrer',
        description:
          'Kan gi fra seg et H⁺-ion i vann — finnes i eddiksyre, sitronsyre og i alle fettsyrer og aminosyrer.',
      },
      {
        title: 'Nitrogen, svovel og fosfor i livets kjemi',
        description:
          'Aminogrupper (–NH₂) bygger proteiner, svovel lager sterke broer som krøller hår, og fosfat driver cellens energivaluta (ATP).',
      },
    ],
    didYouKnow:
      'Etan (C₂H₆) er en brennbar gass som ikke løser seg i vann. Bytter du ut bare ett eneste H-atom med –OH, får du etanol (C₂H₅OH) — en væske som blander seg fullstendig med vann!',
    classroomTest:
      'Klikk gjennom nodene i ytre ring til høyre i utforskerkartet. Hvilke grunnstoffer i tillegg til C og H trengs for å bygge både proteiner og DNA?',
    examples: ['–OH (Alkohol)', '–COOH (Syre)', '–NH₂ (Aminosyre)', 'Fosfat (DNA/ATP)'],
  },
  {
    id: 'karbon-allotroper',
    stepIndex: 6,
    stepNumber: 7,
    category: 'materials_life',
    formulaTag: 'Diamant (3D) • Grafitt (2D) • Grafen',
    x: 1395,
    y: 540,
    ringLevel: 2,
    side: 'right',
    title: 'Allotroper av rent karbon',
    shortLabel: 'Diamant, grafitt & grafen',
    badgeText: 'Materialer • 100 % karbon',
    categoryLabel: 'Materialer & liv',
    image: './assets/karbon/karbon_step7_allotropes.jpg',
    imageCaption:
      'Diamant, grafitt, grafen og fulleren består alle av 100 % karbon — men måten atomene er bundet sammen på skaper totalt ulike materialer.',
    summaryTitle: 'Samme grunnstoff, helt motsatte egenskaper',
    whatHappens:
      'At ett og samme grunnstoff kan finnes i ulike former med helt ulike egenskaper, kalles allotropi. I diamant er hvert karbonatom bundet til 4 naboer i et stivt 3D-tetraedergitter — derfor er diamant gjennomsiktig, superhardt og leder ikke strøm. I grafitt (blyantspiss) er hvert karbonatom bundet til bare 3 naboer i flate 2D-sekskantlag, mens det 4. elektronet flyter fritt mellom lagene. Derfor er grafitt svart, glatt og leder elektrisk strøm! Et enkelt ett-atoms lag av grafitt kalles grafen — 200 ganger sterkere enn stål.',
    keyTraits: [
      {
        title: 'Diamant — 4 bindinger i 3D-nettverk',
        description:
          'Alle valenselektroner er låst i sterke bindinger → verdens hardeste naturlige mineral og en elektrisk isolator.',
      },
      {
        title: 'Grafitt — 3 bindinger i 2D-flak + 1 fritt elektron',
        description:
          'Lagene glir lett av hverandre (perfekt i blyanter), og de frie elektronene gjør at grafitt leder strøm svært godt.',
      },
      {
        title: 'Grafen & fulleren — fremtidens nanomaterialer',
        description:
          'Grafen (ett lag karbon) og fulleren (C₆₀, formet som en fotball) brukes i forskning på superraske batterier, sensorer og lette kompositter.',
      },
    ],
    didYouKnow:
      'Nobelprisen i fysikk i 2010 gikk til to forskere som isolerte verdens første grafen ved rett og slett å dra vanlig Scotch-teip av og på en bit grafitt!',
    classroomTest:
      'Bruk kategori-filteret «Materialer & liv» og sammenlign diamant og grafitt: hvor mange nabokarboner har hvert C-atom i hver av dem, og hvor blir det av det 4. elektronet i grafitt?',
    examples: ['Diamant (3D)', 'Grafitt (2D-lag)', 'Grafen', 'Fulleren (C₆₀)'],
  },
  {
    id: 'karbon-livets-byggestein',
    stepIndex: 7,
    stepNumber: 8,
    category: 'materials_life',
    formulaTag: '>10 mill. stoffer • C vs. Si',
    x: 1300,
    y: 865,
    ringLevel: 2,
    side: 'right',
    title: 'Livets byggestein — hvorfor C og ikke Si?',
    shortLabel: 'Livets byggestein',
    badgeText: 'Helhet • >10 mill. forbindelser',
    categoryLabel: 'Materialer & liv',
    image: './assets/karbon/karbon_step8_life_silicon.jpg',
    imageCaption:
      'Karbon danner over 10 millioner kjente forbindelser — langt flere enn silisium, som står rett under karbon i gruppe 14.',
    summaryTitle: 'Hvorfor alt kjent liv er karbonbasert',
    whatHappens:
      'Det finnes i dag over 10 millioner kjente karbonforbindelser — langt flere enn alle forbindelser av de øvrige grunnstoffene til sammen. Alle livets stormolekyler (DNA, proteiner, karbohydrater og fett) er bygget på karbonskjeletter. Men hvorfor ikke silisium (Si), som står rett under karbon i gruppe 14 og også har 4 valenselektroner? Fordi silisiumatomet er større: Si–Si-bindinger er mye svakere enn C–C-bindinger, silisium lager nesten ikke stabile dobbeltbindinger, og mens CO₂ er en gass som lett løses i vann og driver fotosyntesen, er SiO₂ (kvarts/sand) et steinhardt fast stoff!',
    keyTraits: [
      {
        title: 'C–C er sterkere enn Si–Si',
        description:
          'Karbon har bare 2 elektronskall og danner korte, sterke bindinger som tåler vann og oksygen. Lange silisiumkjeder brytes lett ned.',
      },
      {
        title: 'CO₂ (gass) vs. SiO₂ (kvarts/stein)',
        description:
          'Når du puster ut, forlater karbon kroppen som CO₂-gass. Et silisiumbasert vesen måtte ha «pustet ut» fast sand!',
      },
      {
        title: 'Karbon gir livets molekylære verktøykasse',
        description:
          'Kombinasjonen av 4 bindinger, kjeder, forgreninger, ringer, flerdoble bindinger og heteroatomer gjør karbon uerstattelig for biokjemien.',
      },
    ],
    didYouKnow:
      'Over 95 % av alle kjemiske stoffer som noen gang er oppdaget eller laget av mennesker, inneholder karbon!',
    classroomTest:
      'Avslutt runden i karbonkartet ved å se hele bildet under ett: nevn minst tre grunner fra kartet til at astrobiologer leter etter karbonbasert liv på andre planeter.',
    examples: ['>10 mill. stoffer', 'C vs. Si', 'CO₂ vs. SiO₂', 'DNA & proteiner'],
  },
];

export const KARBON_ATOMET_CONTROL_QUESTIONS: KarbonControlQuestion[] = [
  {
    id: 'kcq1',
    number: 1,
    question:
      'Hvorfor danner karbon alltid 4 kovalente bindinger, og hvilken 3D-form får metan (CH₄)?',
    contextHint: 'Koble karbonets plass i gruppe 14, oktettregelen og elektronparfrastøting.',
    points: [
      {
        heading: '4 valenselektroner i gruppe 14',
        detail:
          'Karbon (atomnummer 6) har elektronfordelingen 2, 4. For å oppnå fullt ytterste skall (8 elektroner) deler det 4 elektronpar med andre atomer.',
      },
      {
        heading: '3D-tetraederform (109,5°)',
        detail:
          'De fire bindende elektronparene frastøter hverandre og plasserer seg lengst mulig fra hverandre i rommet, noe som gir en tetraederform med 109,5° bindingsvinkel.',
      },
    ],
    takeaway:
      'Karbons 4 kovalente bindinger i 3D gjør det mulig å bygge komplekse, romlige molekyler.',
  },
  {
    id: 'kcq2',
    number: 2,
    question:
      'Hva er strukturisomeri, og hvorfor har n-butan og isobutan ulikt kokepunkt selv om begge har formelen C₄H₁₀?',
    contextHint: 'Sammenlign fasongen på en rett kjede med en forgrenet kjede.',
    points: [
      {
        heading: 'Samme molekylformel, ulik struktur',
        detail:
          'Strukturisomerer inneholder nøyaktig de samme atomene, men atomene er koblet sammen i ulik rekkefølge.',
      },
      {
        heading: 'Kontaktflate styrer kokepunktet',
        detail:
          'n-butan (rett kjede) har større kontaktflate mot nabomolekyler og sterkere tiltrekning (kokepunkt −0,5 °C), mens isobutan er mer kompakt/kuleformet og koker lettere (−11,7 °C).',
      },
    ],
    takeaway:
      'I organisk kjemi bestemmer ikke bare hvilke atomer et molekyl har, men også hvordan de er koblet sammen i rommet.',
  },
  {
    id: 'kcq3',
    number: 3,
    question:
      'Hvordan påvirker en dobbeltbinding (C=C) formen på et molekyl sammenlignet med en enkeltbinding (C–C)? Gi et eksempel fra hverdagen.',
    contextHint: 'Tenk på rotasjon, bindingsvinkel og forskjellen på smør og olivenolje.',
    points: [
      {
        heading: 'Fri rotasjon vs. stiv «knekk»',
        detail:
          'Enkeltbindinger (109,5°) roterer fritt, mens dobbeltbindinger (120°) er stive og låser atomene i samme plan.',
      },
      {
        heading: 'Mettet vs. umettet fett',
        detail:
          'Dobbeltbindinger skaper knekk i umettede fettsyrer (f.eks. olivenolje) slik at molekylene ikke pakkes tett — derfor er olje flytende ved romtemperatur, mens mettet fett (smør) er fast.',
      },
    ],
    takeaway:
      'Flerdoble bindinger endrer både geometrien (109,5° → 120° → 180°) og de fysiske egenskapene til stoffer.',
  },
  {
    id: 'kcq4',
    number: 4,
    question:
      'Både diamant og grafitt består av 100 % karbon. Forklar ut fra bindingsstrukturen hvorfor diamant er superhardt og isolerende, mens grafitt er mykt og leder strøm.',
    contextHint: 'Tell hvor mange naboer hvert karbonatom er bundet til i de to allotropene.',
    points: [
      {
        heading: 'Diamant (4 bindinger i 3D-gitter)',
        detail:
          'Hvert C-atom er bundet til 4 andre i et stivt tredimensjonalt nettverk uten frie elektroner → ekstremt hardt og leder ikke strøm.',
      },
      {
        heading: 'Grafitt (3 bindinger i 2D-lag + 1 fritt elektron)',
        detail:
          'Hvert C-atom binder seg til 3 naboer i flate lag som glir lett over hverandre (mykt). Det fjerde elektronet beveger seg fritt mellom lagene og leder elektrisk strøm.',
      },
    ],
    takeaway:
      'Allotropi viser at bindingsstrukturen alene kan gi helt motsatte materialegenskaper av nøyaktig samme grunnstoff.',
  },
  {
    id: 'kcq5',
    number: 5,
    question:
      'Silisium (Si) står rett under karbon i gruppe 14 og kan også danne 4 bindinger. Hvorfor er likevel livet på jorda bygget på karbon og ikke silisium?',
    contextHint: 'Sammenlign bindingsstyrke, dobbeltbindinger og egenskapene til CO₂ versus SiO₂.',
    points: [
      {
        heading: 'Sterkere kjeder og flerdoble bindinger',
        detail:
          'Karbon er mindre og danner mye sterkere C–C-bindinger samt stabile dobbelt- og trippelbindinger. Si–Si-kjeder brytes lett ned i vann og oksygen.',
      },
      {
        heading: 'CO₂ (gass) vs. SiO₂ (fast stein)',
        detail:
          'Karbondioksid (CO₂) er en gass som lett løses i vann og sirkulerer i fotosyntese og celleånding, mens silisiumdioksid (SiO₂) er hard kvarts/sand.',
      },
    ],
    takeaway:
      'Karbon kombinerer sterk katenasjon, flerdoble bindinger og gassformig oksid (CO₂) — en unik kombinasjon for liv.',
  },
];

export const KARBON_ATOMET_MCQ_QUESTIONS: KarbonMcqQuestion[] = [
  {
    id: 'kmcq1',
    number: 1,
    relatedStepIndex: 0,
    topicBadge: '4 bindinger i 3D',
    question: 'Hvilken romlig form og bindingsvinkel har metanmolekylet (CH₄)?',
    options: [
      'Flatt kvadrat med 90° vinkel',
      'Tredimensjonalt tetraeder med ca. 109,5° vinkel',
      'Rett linje med 180° vinkel',
      'Flat trekant med 120° vinkel',
    ],
    correctIndex: 1,
    explanation:
      'De fire elektronparene rundt karbon frastøter hverandre maksimalt i tre dimensjoner og danner et tetraeder med 109,5° mellom bindingene.',
  },
  {
    id: 'kmcq2',
    number: 2,
    relatedStepIndex: 1,
    topicBadge: 'Katenasjon',
    question: 'Hva skjer vanligvis med kokepunktet når en rett karbonkjede blir lengre (flere C-atomer)?',
    options: [
      'Kokepunktet synker fordi molekylet blir lettere',
      'Kokepunktet er alltid det samme uansett kjedelengde',
      'Kokepunktet øker fordi tiltrekningen mellom molekylene blir sterkere',
      'Stoffet slutter å ha kovalente bindinger',
    ],
    correctIndex: 2,
    explanation:
      'Lengre karbonkjeder gir større kontaktflate og sterkere mellom-molekylære krefter, slik at korte kjeder er gasser, mellomlange er væsker og lange er faste stoffer.',
  },
  {
    id: 'kmcq3',
    number: 3,
    relatedStepIndex: 2,
    topicBadge: 'Strukturisomeri',
    question: 'Hva kjennetegner to molekyler som er strukturisomerer (som n-butan og isobutan)?',
    options: [
      'De har ulik molekylformel, men helt like egenskaper',
      'De har samme molekylformel, men atomene er koblet sammen på ulik måte',
      'De består av ulike grunnstoffer fra samme gruppe',
      'De har alltid nøyaktig samme kokepunkt',
    ],
    correctIndex: 1,
    explanation:
      'Strukturisomerer har samme molekylformel (f.eks. C₄H₁₀), men ulik struktur — og dermed også ulike fysiske egenskaper som kokepunkt.',
  },
  {
    id: 'kmcq4',
    number: 4,
    relatedStepIndex: 3,
    topicBadge: 'Flerdoble bindinger',
    question: 'Hva er sant om en dobbeltbinding (C=C) sammenlignet med en enkeltbinding (C–C)?',
    options: [
      'Dobbeltbindingen roterer enda friere enn enkeltbindingen',
      'Dobbeltbindingen deler to elektronpar, er stiv (roterer ikke fritt) og har ca. 120° vinkel',
      'Dobbeltbindingen deler tre elektronpar og er 180° rett',
      'Dobbeltbindingen finnes bare i salter og metaller',
    ],
    correctIndex: 1,
    explanation:
      'I en C=C-dobbeltbinding deles to elektronpar. Det låser rotasjonen og gir en plan geometri med ca. 120° vinkel (som i eten og umettet fett).',
  },
  {
    id: 'kmcq5',
    number: 5,
    relatedStepIndex: 4,
    topicBadge: 'Karbonringer',
    question: 'Hva gjør benzenringen (C₆H₆) så usedvanlig stabil?',
    options: [
      'Den inneholder ionebindinger mellom karbon og hydrogen',
      'Den har seks delokaliserte elektroner som deles jevnt rundt hele 6-ringen',
      'Den har bare enkeltbindinger og 18 hydrogenatomer',
      'Den består av silisium i midten',
    ],
    correctIndex: 1,
    explanation:
      'I benzen fordeles seks elektroner jevnt over hele den flate 6-ringen (aromatisk stabilitet), noe som gjør ringen svært stabil og vanlig i medisiner og biomolekyler.',
  },
  {
    id: 'kmcq6',
    number: 6,
    relatedStepIndex: 5,
    topicBadge: 'Funksjonelle grupper',
    question: 'Hva skjer når vi bytter ut ett hydrogenatom i etan (C₂H₆) med en –OH-gruppe slik at vi får etanol (C₂H₅OH)?',
    options: [
      'Molekylet blir helt upolart og uløselig i vann',
      'Molekylet blir polart, får høyere kokepunkt og løser seg svært godt i vann',
      'Molekylet blir et metall som leder strøm',
      'Karbonatomet mister en av sine 4 bindinger',
    ],
    correctIndex: 1,
    explanation:
      'Hydroksylgruppen (–OH) gjør molekylet polart og i stand til å danne hydrogenbindinger med vann — derfor er etanol væske og fullt blandbar med vann.',
  },
  {
    id: 'kmcq7',
    number: 7,
    relatedStepIndex: 6,
    topicBadge: 'Allotroper',
    question: 'Hvorfor leder grafitt elektrisk strøm, mens diamant ikke gjør det?',
    options: [
      'Grafitt inneholder kobberatomer mellom lagene',
      'I grafitt bruker hvert karbonatom 3 elektroner til bindinger i flate lag, mens det 4. elektronet beveger seg fritt',
      'Diamant består ikke av rent karbon',
      'Grafitt har ionebindinger mellom karbonatomene',
    ],
    correctIndex: 1,
    explanation:
      'I diamant er alle 4 valenselektronene låst i 3D-bindinger. I grafitt er bare 3 brukt i 2D-lagene, mens det 4. elektronet per C-atom flyter fritt og leder strøm.',
  },
  {
    id: 'kmcq8',
    number: 8,
    relatedStepIndex: 7,
    topicBadge: 'Karbon vs. silisium',
    question: 'Hvilken påstand forklarer best hvorfor karbon egner seg mye bedre enn silisium som byggestein for liv?',
    options: [
      'Silisium har bare 2 valenselektroner og kan ikke danne kjeder',
      'Karbon danner sterkere C–C-bindinger, stabile dobbeltbindinger og gassformig CO₂ (mens SiO₂ er fast stein)',
      'Karbon er mye tyngre og større enn silisium',
      'Silisium finnes nesten ikke i jordskorpa',
    ],
    correctIndex: 1,
    explanation:
      'Selv om både C og Si står i gruppe 14, gir karbon mye sterkere kjeder, stabile flerdoble bindinger og gassformig CO₂ som lett inngår i livets kretsløp.',
  },
];
