import type { ClosingReflectionPrompt } from '../components/FullscreenClosingSlide';

export const REFLECTION_PROMPTS: Record<string, ClosingReflectionPrompt> = {
  // Livets tre / Biologi
  'livets-tre': {
    question:
      'Hvis jorda ble «restartet» for 3,8 milliarder år siden — tror du livets tre ville sett likt ut, og ville mennesker oppstått igjen?',
    hint: 'Tenk på rollen til tilfeldige mutasjoner, masseutryddelser (som dinosaurenes fall) og naturlig utvalg.',
  },
  'kroppens-evolusjon': {
    question:
      'Hvilket organsystem i menneskekroppen har flest tydelige «spor» fra vår fortid som fisk i havet?',
    hint: 'Tenk på ryggraden, gjellebuer på fosterstadiet, lemmer med 5 fingre eller svømmeblære/lunger.',
  },
  dyrecellen: {
    question:
      'Hvorfor har ikke én enkelt celle bare vokst seg kjempestor i stedet for at dyr består av billioner av bittesmå celler?',
    hint: 'Tenk på forholdet mellom overflate og volum, transport av oksygen/næring og spesialisering av celler.',
  },
  plantecellen: {
    question:
      'Hva ville skjedd med alt dyreliv på jorda i løpet av noen måneder hvis kloroplastene i plantecellene plutselig sluttet å virke?',
    hint: 'Koble fotosyntesen til både oksygenproduksjon og energien i bunnen av alle næringskjeder.',
  },
  'dna-replikasjon': {
    question:
      'DNA-polymerase gjør nesten ingen feil — men er det egentlig en fordel eller en ulempe for livet på jorda at noen ytterst få kopieringsfeil slipper gjennom?',
    hint: 'Skill mellom hva en mutasjon betyr for et enkeltindivid (f.eks. kreft) versus for en art over millioner av år (evolusjon).',
  },
  proteinsyntesen: {
    question:
      'Alle cellene i kroppen din har nøyaktig det samme DNA-et. Hvordan kan da en muskelcelle og en nervecelle lage helt ulike proteiner?',
    hint: 'Tenk på hvilke gener som skrus «på» og «av» under transkripsjonen.',
  },
  genetikk: {
    question:
      'Bør vi bruke moderne genteknologi som CRISPR til å fjerne arvelige sykdommer — og hvor bør i så fall grensen gå?',
    hint: 'Diskuter forskjellen på å behandle alvorlig sykdom versus å endre egenskaper som utseende eller styrke.',
  },
  evolusjon: {
    question:
      'Utvikler mennesker seg fortsatt gjennom evolusjon i dag, eller har moderne medisin og teknologi «stoppet» naturlig utvalg?',
    hint: 'Tenk på antibiotikaresistens, laktoseintoleranse, miljøendringer og hva naturlig utvalg faktisk krever.',
  },

  // Big Bang / Universet
  'big-bang': {
    question:
      'Når vi ser på en galakse 10 milliarder lysår unna, ser vi hvordan den så ut for 10 milliarder år siden. Hva betyr det for hvordan astronomer forsker på universets historie?',
    hint: 'Tenk på at lyshastigheten er endelig — teleskoper fungerer som «tidsmaskiner» bakover mot Big Bang.',
  },
  stjerner: {
    question:
      'Hvorfor sier astronomer ofte at «vi er laget av stjernestøv» — og hvordan ville jorda sett ut hvis ingen tunge stjerner noensinne hadde eksplodert som supernovaer?',
    hint: 'Tenk på hvor karbon, oksygen, jern og gull faktisk ble dannet.',
  },
  grunnstoffer: {
    question:
      'Hvis universet startet med nesten bare hydrogen og helium, hvorfor er det likevel så mye jern, silisium og oksygen på jorda?',
    hint: 'Koble kjernefusjon i stjerner, supernovaeksplosjoner og hvordan nye solsystemer samler opp gass og støv.',
  },
  straling: {
    question:
      'Menneskeøyet ser bare en bitteliten del av det elektromagnetiske spekteret. Hva ville vi gått glipp av i universet hvis vi bare brukte vanlige optiske teleskoper?',
    hint: 'Tenk på kosmisk bakgrunnsstråling (mikrobølger), infrarødt lys gjennom støvskyer og røntgenstråling fra svarte hull.',
  },
  galakser: {
    question:
      'Når Melkeveien og Andromedagalaksen kolliderer om ca. 4,5 milliarder år, vil nesten ingen stjerner krasje i hverandre. Hvordan er det mulig?',
    hint: 'Tenk på hvor enorme avstandene mellom stjernene er sammenlignet med størrelsen på selve stjernene.',
  },
  romtid: {
    question:
      'Hvordan kan GPS-en på mobilen din være et daglig bevis på at Einsteins relativitetsteori faktisk stemmer?',
    hint: 'Tenk på at klokkene i GPS-satellittene går litt annerledes både på grunn av farten deres og svakere tyngdekraft høyt over jorda.',
  },

  // Helse og ernæring
  naeringsstoffer: {
    question:
      'Mange reklamerer for «ekstra protein» i alt fra yoghurt til sjokolademelk. Når trenger kroppen egentlig ekstra protein — og hva skjer hvis vi får i oss mer enn vi trenger?',
    hint: 'Tenk på hva overskudd av protein brukes til i kroppen, og sammenlign en vanlig ungdom med en toppidrettsutøver.',
  },
  fordoyelsen: {
    question:
      'Hvorfor har mennesket en tynntarm som er 5–6 meter lang med millioner av tarmtotter, i stedet for et kort og rett rør fra magesekken til tykktarmen?',
    hint: 'Koble overflateareal, kjemisk nedbryting med enzymer og effektivt opptak av næringsstoffer til blodet.',
  },
  celleanding: {
    question:
      'Hvorfor puster du raskere og dypere når du løper opp en bratt bakke — og hvorfor får du til slutt «melkesyre» i beina hvis du sprinter helt til maks?',
    hint: 'Koble oksygentilførsel til aerob celleånding (30–32 ATP) versus anaerob forbrenning (bare 2 ATP + laktat).',
  },
  vaeskebalanse: {
    question:
      'Hvorfor er vanlig vann ofte bedre enn energidrikk eller sportsdrikk i en vanlig skolehverdag, og i hvilke situasjoner gir faktisk elektrolytter mening?',
    hint: 'Tenk på sukker, koffein, svettetap ved langvarig hard trening og hvordan nyrene regulerer væskebalansen.',
  },
  trening: {
    question:
      'Hvorfor blir du faktisk sterkere og i bedre form mens du hviler og sover etter trening — og ikke mens du løfter vekter eller løper?',
    hint: 'Tenk på superkompensasjon, restitusjon, proteinsyntese i musklene og risikoen ved for lite søvn.',
  },
  kosthold: {
    question:
      'Hvis du skulle designe den perfekte, realistiske skolekantina for Vg1-elever basert på kostrådene — hva ville du servert, og hva ville du kuttet ut?',
    hint: 'Tenk på fullkorn, frukt/grønt, fisk/belgfrukter, blodsukker og hva som faktisk gjør at elever holder konsentrasjonen oppe.',
  },
  kildekritikk: {
    question:
      'En populær influenser med 500 000 følgere anbefaler et dyrt kosttilskudd som «gir mer energi på 3 dager». Hvilke 3 kontrollspørsmål bør du stille før du tror på påstanden?',
    hint: 'Tenk på sponsing/interesser, forskningsgrunnlag (enkeltperson vs. kontrollerte studier) og om påstanden høres for god ut til å være sann.',
  },

  // Karbon
  'atommodell-bindinger': {
    question:
      'Både diamant og grafitt (blyantspiss) består av 100 % karbonatomer — hvordan kan det samme grunnstoffet lage verdens hardeste materiale og noe så mykt at det setter spor på papir?',
    hint: 'Tenk på hvordan de 4 kovalente bindingene til karbon er organisert i 3D (diamant) versus flate lag (grafitt).',
  },
  karbonatomet: {
    question:
      'Når astrobiologer leter etter liv på andre planeter, leter de nesten alltid etter karbonbasert liv i flytende vann — ikke silisiumbasert liv. Hvorfor er karbon så vanskelig å erstatte?',
    hint: 'Tenk på styrken i C–C-bindinger, evnen til å lage dobbeltbindinger og ringer, og forskjellen på å «puste ut» CO₂-gass versus fast SiO₂ (sand).',
  },
};
