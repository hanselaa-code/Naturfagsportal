# -*- coding: utf-8 -*-
"""
Kapittel 4: Proteinsyntesen – Fra gen til ferdig protein – Vg1 Naturfag (LK20)
Pedagogisk fordypningsstoff, læringsmål, faglige dypdykk, oppsummering og ekstra kontrollspørsmål.
"""

CH4_DATA = {
    "chapter_num": 4,
    "accent": "#DB2777",
    "accent_soft": "#FCE7F3",
    "accent_border": "#EC4899",
    "cover_image": "prot_step2_transcription.png",
    "learning_goals": [
        "Forklare molekylærbiologiens sentrale dogme (DNA → mRNA → protein) og hvorfor cellen lager en mRNA-kopi i stedet for å sende DNA ut av cellekjernen.",
        "Beskrive hva som skjer under transkripsjonen i cellekjernen, inkludert rollen til promotor, RNA-polymerase, baseparing med urasil (U) og spleising av introner og eksoner.",
        "Forklare hvordan den genetiske koden leses i tripletter (kodon på mRNA), hvordan tRNA med antikodon kobler riktig aminosyre, og hvilken rolle startkodonet AUG og stoppkodonene (UAA, UAG, UGA) spiller.",
        "Beskrive translasjonen på ribosomet (initiering, elongering med peptidbindinger i A-, P- og E-setet, og terminering) og hvordan 3D-folding gir proteinet sin funksjon.",
        "Forutsi og forklare konsekvensene av ulike mutasjoner (stille mutasjon, punktmutasjon/substitusjon og leserammemutasjon) for det ferdige proteinet.",
    ],
    "intro": (
        "At du har 20 000 gener i DNA-et ditt, hjelper lite dersom oppskriftene bare blir liggende låst inne i cellekjernen. "
        "For at en celle skal kunne fordøye mat, trekke sammen muskler, frakte oksygen eller bekjempe virus, må oppskriftene i DNA oversettes til kroppens arbeidsmaskiner: <strong>proteinene</strong>. "
        "Denne todelte prosessen – <strong>proteinsyntesen</strong> – kalles ofte molekylærbiologiens sentrale dogme: <strong>DNA → mRNA → Protein</strong>. "
        "I dette kapittelet følger vi reisen fra det øyeblikket et gen åpnes i cellekjernen (<em>transkripsjon</em> og spleising), gjennom kjerneporen ut i cytoplasma, og fram til ribosomene der koden leses tre og tre baser av gangen (<em>translasjon</em>) og foldes til presise tredimensjonale verktøy."
    ),
    "deep_dives": {
        1: {
            "title": "Transkripsjon: Hvorfor erstattes tymin (T) med urasil (U)?",
            "body": (
                "Under <strong>transkripsjonen</strong> binder enzymet <strong>RNA-polymerase</strong> seg til promotoren foran genet og leser den ene DNA-tråden (<strong>maltråden</strong>, 3' → 5') for å bygge en komplementær enkelttrådet RNA-kopi (5' → 3'). "
                "Her gjelder baseparingen C ↔ G og T (DNA) → A (RNA), mens <strong>A på DNA gir urasil (U) i RNA</strong>. "
                "Urasil er kjemisk litt enklere og billigere for cellen å lage enn tymin til kortlevde arbeidskopier, mens DNA bruker tymin fordi det gjør det lettere for reparasjonsenzymer å oppdage vanlige kjemiske skader (når cytosin spontant omdannes til urasil) i det permanente arkivet."
            ),
        },
        2: {
            "title": "Eukaryot redigering: Spleising og alternativ spleising",
            "body": (
                "Råutkastet fra transkripsjonen hos eukaryoter kalles <strong>pre-mRNA</strong> og inneholder både ikke-kodende mellomstykker (<strong>introner</strong>) og kodende oppskriftsbiter (<strong>eksoner</strong>). "
                "Et enzymkompleks kalt <strong>spleisosomet</strong> klipper ut intronene og skjøter eksonene sammen til modent mRNA, som også får en beskyttende <strong>5'-hette</strong> og en <strong>poly-A-hale</strong> før det slipper ut gjennom kjerneporen. "
                "Ved <strong>alternativ spleising</strong> kan cellen velge ulike kombinasjoner av eksoner fra det samme genet – derfor kan menneskets ~20 000 gener lage over 100 000 forskjellige proteiner!"
            ),
        },
        4: {
            "title": "Den genetiske koden: 64 kodon til 20 aminosyrer",
            "body": (
                "Språket i mRNA har bare fire bokstaver (A, U, C, G), mens proteiner bygges av <strong>20 ulike aminosyrer</strong>. "
                "Med tre baser i hvert ord (ett <strong>kodon</strong>) finnes det 4³ = <strong>64 mulige kombinasjoner</strong>. "
                "61 kodon koder for aminosyrer (inkludert startkodonet <strong>AUG</strong> = metionin), mens 3 er stoppkodon (<strong>UAA, UAG, UGA</strong>). "
                "At flere kodon gir samme aminosyre, gjør koden <strong>redundant</strong> og demper effekten av mange punktmutasjoner. Dessuten er koden <strong>universell</strong> – nesten alt liv på jorda bruker nøyaktig samme kodontabell."
            ),
        },
        6: {
            "title": "På ribosomet: A-sete, P-sete, E-sete og peptidbindinger",
            "body": (
                "Ute i cytoplasma fester den lille og store ribosomdelen (bygd av <strong>rRNA</strong> og proteiner) seg ved startkodonet <strong>AUG</strong> og låser <strong>leserammen</strong>. "
                "Under kjedeforlengelsen (elongering) jobber tre seter i ribosomet som et samlebånd: "
                "Nytt <strong>tRNA</strong> med riktig antikodon og aminosyre lander i <strong>A-setet</strong> (Ankomst), selve rRNA-enzymet smir en sterk kovalent <strong>peptidbinding</strong> slik at hele kjeden i <strong>P-setet</strong> (Polypeptid) flyttes over på den nye aminosyren, og det tomme tRNA-et forlater <strong>E-setet</strong> (Exit) når ribosomet rykker ett kodon fram."
            ),
        },
        8: {
            "title": "Fra perlekjede til 3D-verktøy – og hva denaturering betyr",
            "body": (
                "En rett polypeptidkjede kan ikke gjøre noen jobb før den folder seg til en presis <strong>tredimensjonal struktur</strong>. "
                "Samspill mellom hydrofile, hydrofobe og ladde aminosyrer – pluss hydrogenbindinger og sterke svovelbroer – skaper lokale spiraler (<em>alfa-helikser</em>) og <em>beta-flak</em> (sekundærstruktur), som brettes videre til en ferdig 3D-form (tertiærstruktur, og eventuelt kvartærstruktur med flere kjeder som i hemoglobin). "
                "Ved høy varme eller feil pH ryker svake bindinger og proteinet mister formen sin (<strong>denaturering</strong>) – akkurat som når flytende eggehvite stivner i stekepanna."
            ),
        },
    },
    "summary_points": [
        "Molekylærbiologiens sentrale dogme beskriver informasjonsflyten fra DNA via mRNA til ferdig protein (DNA → mRNA → Protein).",
        "Transkripsjon skjer i cellekjernen: RNA-polymerase leser maltråden i genet og bygger pre-mRNA etter regelen A→U, T→A, C→G, G→C.",
        "Under spleising klippes introner ut og eksoner skjøtes sammen, før modent mRNA med 5'-hette og poly-A-hale fraktes ut gjennom en kjernepore.",
        "Translasjon skjer på ribosomer i cytoplasma (eller på ru ER): mRNA leses tre og tre baser (kodon) fra startkodonet AUG til et stoppkodon (UAA, UAG eller UGA).",
        "Transport-RNA (tRNA) har et komplementært antikodon som passer til mRNA-kodonet og leverer riktig aminosyre, som kobles til kjeden med peptidbindinger.",
        "Polypeptidkjeden folder seg til en nøyaktig 3D-struktur som avgjør proteinets funksjon (enzym, hormon, transportprotein, antistoff eller strukturprotein).",
    ],
    "extra_control_questions": [
        {
            "id": "psq_extra_dna_mrna",
            "number": 4,
            "question": "Sammenlign DNA og mRNA grundig med tanke på oppbygning, kjemiske byggesteiner, stabilitet, plassering i cellen og funksjon i proteinsyntesen.",
            "contextHint": "Få med antall tråder, sukkertype, nitrogenbaser, størrelse/levetid og hvor i den eukaryote cellen de finnes.",
            "points": [
                {
                    "heading": "Kjemisk oppbygning og stabilitet",
                    "detail": "DNA er dobbelttrådet med sukkeret deoksyribose og basene A, T, C og G – en svært slitesterk arkivstruktur. mRNA er enkelttrådet med sukkeret ribose (som har én ekstra -OH-gruppe) og basen urasil (U) i stedet for tymin (T), noe som gjør det mer kortlevd og egnet som midlertidig arbeidskopi.",
                    "badge": "Kjemi",
                },
                {
                    "heading": "Størrelse, plassering og oppgave",
                    "detail": "Ett DNA-molekyl utgjør et helt kromosom med hundrevis eller tusenvis av gener og forlater aldri cellekjernen. Ett mRNA-molekyl er en redigert kopi (uten introner) av bare ett enkelt gen, som fraktes gjennom kjerneporen ut til ribosomene i cytoplasma.",
                    "badge": "Funksjon",
                },
            ],
            "comparisonTable": {
                "headers": ["Egenskap", "DNA (Deoksyribonukleinsyre)", "mRNA (Budbringer-RNA)"],
                "rows": [
                    ["Antall tråder", "Dobbelttrådet spiral (dobbelheliks)", "Enkelttrådet kjede"],
                    ["Sukkertype i nukleotidet", "Deoksyribose (mangler ett O-atom på C2')", "Ribose (har -OH-gruppe på C2')"],
                    ["Nitrogenbaser", "Adenin (A), Tymin (T), Cytosin (C), Guanin (G)", "Adenin (A), Urasil (U), Cytosin (C), Guanin (G)"],
                    ["Lengde og innhold", "Svært langt; inneholder hundrevis/tusenvis av gener + reguleringsområder", "Kort; inneholder kun spleisede eksoner for ett (eller noen få) gener"],
                    ["Plassering i eukaryot celle", "Fast i cellekjernen (+ små ringer i mitokondrier/kloroplaster)", "Lages i cellekjernen og eksporteres gjennom kjerneporen til cytoplasma/ribosomer"],
                    ["Levetid og hovedoppgave", "Permanent gjennom hele cellens liv; lagrer hele arvestoffet trygt", "Midlertidig (minutter–timer); frakter én genoppskrift til ribosomet"],
                ],
            },
            "takeaway": "DNA er det permanente hovedbiblioteket inne i cellekjernen, mens mRNA er den kortlivede engangsutskriften av én enkelt oppskrift som sendes ut til proteinfabrikken på ribosomet.",
        },
    ],
}
