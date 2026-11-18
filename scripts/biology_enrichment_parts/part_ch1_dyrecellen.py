# -*- coding: utf-8 -*-
"""
Kapittel 1: Dyrecellen – fordypningsstoff, læringsmål (LK20) og sammendrag
for Vg1 Naturfag Biologi.
"""

CH1_DATA = {
    "chapter_num": 1,
    "accent": "#0284C7",
    "accent_soft": "#E0F2FE",
    "accent_border": "#0EA5E9",
    "cover_image": "cell_central_clean.png",
    "learning_goals": [
        "Gjøre rede for oppbygningen av en eukaryot dyrecelle og forklare hovedfunksjonene til cellemembran, cytoplasma, cellekjerne, ribosomer, ER, Golgiapparat, vesikler, mitokondrier, lysosomer og cytoskjelett.",
        "Forklare hvordan cellemembranen regulerer transport av stoffer gjennom diffusjon, osmose, aktiv transport og endo-/eksocytose.",
        "Beskrive informasjonsflyten fra DNA i cellekjernen til ferdig protein (transkripsjon og translasjon) og videre sortering gjennom ER, Golgiapparatet og transportvesikler.",
        "Forklare hvordan mitokondriene frigjør energi i form av ATP gjennom aerob celleånding, og kjenne til hovedtrekkene i endosymbioseteorien.",
    ],
    "intro": (
        "Menneskekroppen består av rundt 30–37 billioner (30 000 milliarder) celler som samarbeider hvert eneste sekund. "
        "Enten det er en muskelcelle som trekker seg sammen, en nervecelle som sender lynraske elektriske signaler, eller en hvit blodcelle som jakter på bakterier, "
        "har alle disse cellene den samme eukaryote grunnmuren. I motsetning til planteceller mangler dyrecellen en stiv cellevegg – "
        "det gjør at dyreceller kan endre form, bevege seg og bygge alt fra fleksible muskler til komplekse sanseorganer. "
        "I dette kapittelet blir vi med på en reise gjennom dyrecellens ti viktigste strukturer: fra den selektive cellemembranen ytterst, "
        "inn til kommandosentralen i cellekjernen, langs samlebåndet av ribosomer, ER og Golgiapparatet, og ned til kraftverkene (mitokondriene) og gjenvinningsstasjonen (lysosomene)."
    ),
    "deep_dives": {
        0: {
            "title": "Transport over cellemembranen: Passiv vs. aktiv transport",
            "body": (
                "Cellemembranen er en <strong>halvgjennomtrengelig (semipermeabel)</strong> barriere bygget som en flytende mosaikk av fosfolipider, kolesterol og membranproteiner. "
                "Små, upolare gassmolekyler som <strong>O₂</strong> og <strong>CO₂</strong> glir fritt gjennom dobbeltlaget ved enkel <strong>diffusjon</strong> (alltid fra høy til lav konsentrasjon, uten energibruk). "
                "Vann passerer raskt gjennom egne vannkanaler (<em>akvaporiner</em>) ved <strong>osmose</strong>. "
                "Større molekyler som glukose og ladde ioner (Na⁺, K⁺, Ca²⁺) trenger hjelp av transportproteiner. Når cellen må pumpe ioner <em>mot</em> konsentrasjonsgradienten – "
                "som i <strong>natrium-kalium-pumpa</strong> (3 Na⁺ ut, 2 K⁺ inn) – kreves det energi i form av <strong>ATP</strong> (aktiv transport)."
            ),
        },
        2: {
            "title": "Fra gen til protein: Transkripsjon og translasjon",
            "body": (
                "Inne i cellekjernen ligger arvestoffet (<strong>DNA</strong>) beskyttet bak en dobbel kjernemembran med regulerte kjerneporer. "
                "Når cellen trenger et bestemt protein (for eksempel et enzym eller hormonet insulin), skjer proteinsyntesen i to hovedtrinn: "
                "<strong>(1) Transkripsjon (i kjernen):</strong> Det aktuelle genet kopieres over til en enkelttrådet arbeidskopi kalt <strong>mRNA</strong> (budbringer-RNA), som sendes ut gjennom en kjernepore. "
                "<strong>(2) Translasjon (på ribosomene):</strong> Ribosomet leser mRNA-koden tre baser av gangen (ett <em>kodon</em>), mens <strong>tRNA</strong> leverer riktige aminosyrer som kobles sammen til en ferdig proteinkjede."
            ),
        },
        4: {
            "title": "Cellens indre samlebånd: Ru ER → Golgi → Eksocytose",
            "body": (
                "Proteiner som skal brukes utenfor cellen eller settes inn i membraner, lages av ribosomer på overflaten av <strong>ru endoplasmatisk retikulum (ru ER)</strong>. "
                "Inne i ru ER foldes proteinkjeden til sin presise 3D-form før den sendes i en liten transportblære til <strong>Golgiapparatet</strong>. "
                "Golgi fungerer som cellens postkontor: Det modifiserer proteinene, fester kjemiske «adresselapper» (karbohydrat- eller fosfatgrupper) på dem og pakker dem inn i nye <strong>sekretoriske vesikler</strong>. "
                "Til slutt fraktes vesiklene langs cytoskjelettet til cellemembranen, smelter sammen med den og tømmer innholdet ut av cellen ved <strong>eksocytose</strong>."
            ),
        },
        7: {
            "title": "Mitokondriene, ATP og endosymbioseteorien",
            "body": (
                "Mitokondriene driver hoveddelen av den <strong>aerobe celleåndingen</strong>: <strong>C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + energi (ATP)</strong>. "
                "Den sterkt foldede indre membranen (<em>cristae</em>) gir enorm overflate for elektrontransportkjeden og enzymet ATP-syntase, som lader opp rundt 30–32 ATP per glukosemolekyl. "
                "At mitokondriene har <strong>dobbel membran</strong>, sitt eget <strong>ringformede DNA (mtDNA)</strong>, egne små ribosomer av bakterietype (70S) og deler seg selvstendig ved todeling, "
                "er hovedbevisene for <strong>endosymbioseteorien</strong>: Mitokondriene stammer fra frittlevende, oksygenbrukende bakterier som ble tatt opp av en ur-eukaryot celle for om lag 2 milliarder år siden."
            ),
        },
        8: {
            "title": "Lysosomer og peroksisomer: Sikkerhetslås og katalase",
            "body": (
                "Lysosomene inneholder rundt 40 kraftige hydrolytiske enzymer som bryter ned gamle organeller (<strong>autofagi</strong>) og inntrengende bakterier fanget opp ved <strong>fagocytose</strong>. "
                "For å hindre at cellen fordøyer seg selv, har lysosomene et surt indre (<strong>pH ~4,8</strong>); dersom et lysosom sprekker, blir enzymene nesten inaktive i det nøytrale cytoplasmaet (pH ~7,2). "
                "Ved siden av jobber <strong>peroksisomene</strong> med å bryte ned lange fettsyrer og uskadeliggjøre giftig hydrogenperoksid ved hjelp av enzymet <em>katalase</em>: <strong>2 H₂O₂ → 2 H₂O + O₂</strong>."
            ),
        },
    },
    "summary_points": [
        "Dyrecellen er en eukaryot celle med fleksibel fosfolipid-cellemembran (uten cellevegg) og indre støtte fra cytoskjelettet.",
        "Transport over cellemembranen skjer passivt (diffusjon og osmose uten ATP), aktivt (ionepumper med ATP) eller via membranblærer (endocytose og eksocytose).",
        "Proteinsyntese og sortering følger et fast samlebånd: DNA i cellekjernen (transkripsjon til mRNA) → ribosomer (translasjon) → ru ER (folding) → Golgiapparat (merking/pakking) → vesikler.",
        "Mitokondriene produserer ATP gjennom aerob celleånding og har eget ring-DNA og dobbel membran som spor etter sitt bakterielle opphav (endosymbioseteorien).",
        "Lysosomer og peroksisomer sørger for gjenvinning (autofagi), nedbrytning av bakterier og avgiftning av hydrogenperoksid.",
    ],
}
