# -*- coding: utf-8 -*-
"""
Kapittel 2: Plantecellen – fordypningsstoff, læringsmål (LK20), sammendrag
og sammenligningstabell (Dyrecelle vs. Plantecelle) for Vg1 Naturfag Biologi.
"""

CH2_DATA = {
    "chapter_num": 2,
    "accent": "#059669",
    "accent_soft": "#D1FAE5",
    "accent_border": "#10B981",
    "cover_image": "plant_central_clean.png",
    "learning_goals": [
        "Gjøre rede for plantecellens særtrekk – stiv cellevegg av cellulose med plasmodesmata, kloroplaster og stor sentralvakuole – og forklare hvordan de henger sammen med plantens livsform.",
        "Forklare hva som skjer i kloroplastene under fotosyntesen (lysreaksjoner i tylakoidene og Calvinsyklus i stroma), og koble dette til endosymbioseteorien.",
        "Forklare begrepene osmose, saftspenning (turgortrykk) og plasmolyse, og beskrive hvordan sentralvakuolen og celleveggen samarbeider om å holde urteaktige planter oppreist.",
        "Avlive myten om at planter ikke har mitokondrier, og forklare samspillet mellom fotosyntese (kun i lys) og aerob celleånding (døgnet rundt).",
        "Sammenligne en eukaryot plantecelle og en eukaryot dyrecelle med vekt på både felles organeller og avgjørende forskjeller.",
    ],
    "intro": (
        "Planter kan verken gå på jakt etter mat eller søke ly når det blåser og tørker. Likevel danner de selve grunnlaget for nesten alt liv på landjorda – "
        "ved å fange sollys, karbondioksid og vann og bygge energirike karbohydrater og oksygen. "
        "Hemmeligheten ligger i plantecellens spesielle arkitektur. Som en eukaryot celle deler plantecellen den samme grunnpakken av cellekjerne, cellemembran, "
        "ribosomer, ER, Golgiapparat og mitokondrier som dyrecellen. Men utenpå har den en sterk rustning av cellulose (celleveggen), "
        "inni har den grønne solcellefabrikker (kloroplaster) og et enormt vannlager (sentralvakuolen) som fungerer som hydraulisk skjelett. "
        "I dette kapittelet utforsker vi alle de ti delene av plantecellen og ser hvordan de skiller seg fra – og ligner på – våre egne celler."
    ),
    "deep_dives": {
        0: {
            "title": "Celleveggen og plasmodesmata: Armert betong med fiberkabler",
            "body": (
                "Utenpå cellemembranen har plantecellen en porøs, men svært sterk <strong>cellevegg</strong> bygget av <strong>cellulosemikrofibriller</strong> "
                "støpt inn i et nettverk av hemicellulose og limt sammen til nabocellene med <strong>pektin</strong> (midtlamellen). "
                "I vedceller i trær forsterkes veggen i tillegg med det harde stoffet <em>lignin</em>. "
                "Likevel er ikke plantecellene avskåret fra hverandre: Tusenvis av mikroskopiske tunneler kalt <strong>plasmodesmata</strong> "
                "går tvers gjennom celleveggen og kobler cytoplasmaet (og til og med tynne rør av ER) mellom naboceller direkte sammen, slik at vann, sukker og signaler kan strømme fritt."
            ),
        },
        2: {
            "title": "Fotosyntesen i kloroplastene: To sammenkoblede trinn",
            "body": (
                "Kloroplasten er omgitt av en <strong>dobbel membran</strong> og har sitt eget ringformede DNA (spor etter opprinnelige cyanobakterier via <strong>endosymbiose</strong>). "
                "Selve fotosyntesen – <strong>6 CO₂ + 6 H₂O + lysenergi → C₆H₁₂O₆ + 6 O₂</strong> – foregår i to trinn inne i kloroplasten: "
                "<strong>(1) Lysreaksjonene (i tylakoidmembranene / grana):</strong> Klorofyll fanger sollys, spalter vannmolekyler (H₂O), frigjør <strong>O₂</strong> til lufta og lader opp energibærerne ATP og NADPH. "
                "<strong>(2) Calvinsyklusen (i stroma):</strong> Enzymet RuBisCO bruker energien fra ATP og NADPH til å binde CO₂ fra lufta inn i energirikt druesukker (<strong>glukose</strong>)."
            ),
        },
        3: {
            "title": "Saftspenning (turgortrykk) og plasmolyse",
            "body": (
                "I en utvokst plantecelle opptar <strong>sentralvakuolen</strong> (omgitt av membranen <em>tonoplasten</em>) ofte 50–90 % av volumet. "
                "Når cellen pumper salter og sukker inn i vakuolen, strømmer vann etter ved <strong>osmose</strong>. "
                "Vakuolen svulmer opp og presser cellemembranen hardt ut mot den stive celleveggen, noe som skaper et indre vanntrykk på 5–10 bar kalt <strong>saftspenning (turgortrykk)</strong>. "
                "Mister planten vann i tørke eller saltvann, siver vannet ut av vakuolen: Saftspenningen faller, cellemembranen løsner fra celleveggen (<strong>plasmolyse</strong>), og planten visner."
            ),
        },
        8: {
            "title": "Knus myten: Kloroplaster vs. mitokondrier i samme celle",
            "body": (
                "En av de vanligste misforståelsene i biologien er å tro at «dyreceller har mitokondrier, mens planteceller har kloroplaster i stedet». "
                "<strong>Planteceller har BEGGE deler!</strong> ATP-en som lages i kloroplastene brukes opp inne i kloroplasten til å bygge glukose. "
                "For å få ATP til aktiv transport, celledeling og proteinsyntese – og for å overleve om natta, om vinteren og i rotceller under jorda der det ikke finnes sollys – "
                "må plantecellens <strong>mitokondrier</strong> drive <strong>aerob celleånding døgnet rundt</strong>. I godt sollys går fotosyntesen langt raskere enn celleåndingen (netto O₂ ut), "
                "mens i mørke tar planten opp O₂ og skiller ut CO₂ akkurat som dyr."
            ),
        },
        9: {
            "title": "Celledeling uten centrioler – og olje til sukker i frø",
            "body": (
                "Selv om plantecellen har en stiv cellevegg, styrer et indre <strong>cytoskjelett</strong> (mikrotubuli og aktinfilamenter) både cytoplasmastrømningen og retningen cellen vokser i. "
                "Ved celledeling mangler blomsterplanter <strong>centrioler</strong>, men bygger likevel spindeltråder og reiser en ny skillevegg (<strong>celleplaten</strong>) fra midten og ut ved hjelp av vesikler fra Golgiapparatet. "
                "Plantecellens <strong>peroksisomer</strong> samarbeider dessuten med kloroplastene i sterkt lys, og i spirende frø gjør spesialiserte peroksisomer (<em>glyoksysomer</em>) lagret frøolje om til sukker før spiren når sollyset."
            ),
        },
    },
    "summary_points": [
        "Plantecellen er eukaryot og har samme grunnpakke som dyrecellen (kjerne, cellemembran, ribosomer, ER, Golgi, peroksisomer, cytoskjelett og mitokondrier).",
        "De tre store særtrekkene til plantecellen er: (1) stiv cellevegg av cellulose med plasmodesmata, (2) kloroplaster for fotosyntese og (3) stor sentralvakuole for saftspenning og gjenvinning.",
        "Osmose inn i sentralvakuolen mot celleveggen skaper saftspenning (turgortrykk); vanntap i tørke eller saltvann gir plasmolyse.",
        "Kloroplaster driver fotosyntese i lys (lager glukose og O₂), mens mitokondrier driver aerob celleånding dag og natt (lager ATP til cellens arbeid).",
        "Plantecellen mangler centrioler og lysosomer (sentralvakuolen overtar nedbrytningsrollen) og deler seg ved å bygge en celleplate fra Golgi-vesikler.",
    ],
    "extra_control_questions": [
        {
            "question": (
                "Lag en oversiktlig sammenligning av en eukaryot dyrecelle og en eukaryot plantecelle "
                "med utgangspunkt i strukturene cellevegg, kloroplaster, sentralvakuole, mitokondrier og cellekjerne."
            ),
            "contextHint": (
                "Husk at begge celletypene er eukaryote – noen strukturer er helt unike for plantecellen, "
                "mens andre er felles for både dyr og planter."
            ),
            "answer": (
                "Både dyreceller og planteceller er eukaryote celler og har derfor både cellekjerne med DNA og mitokondrier for aerob celleånding. "
                "Forskjellene speiler de to ulike livsstrategiene: Plantecellen er autotrof og stasjonær med cellevegg av cellulose, kloroplaster for fotosyntese "
                "og en stor sentralvakuole som skaper saftspenning (turgortrykk) og tar seg av nedbrytning. Dyrecellen er heterotrof og fleksibel uten cellevegg, "
                "mangler kloroplaster og stor sentralvakuole, og bruker i stedet små spesialiserte lysosomer til nedbrytning."
            ),
            "comparisonTable": {
                "headers": [
                    "Struktur / Organell",
                    "Eukaryot dyrecelle",
                    "Eukaryot plantecelle",
                ],
                "rows": [
                    [
                        "Cellevegg",
                        "Nei – har kun fleksibel cellemembran og indre cytoskjelett (gir bevegelighet og formendring).",
                        "Ja – stiv cellevegg av cellulose utenpå cellemembranen, med plasmodesmata mellom naboceller.",
                    ],
                    [
                        "Kloroplaster",
                        "Nei – dyrecellen er heterotrof og må få ferdig organisk næring utenfra.",
                        "Ja (i grønne celler) – driver fotosyntese med klorofyll og lager glukose og O₂ i sollys.",
                    ],
                    [
                        "Sentralvakuole",
                        "Nei – kan ha små, midlertidige vesikler, men bruker lysosomer til nedbrytning.",
                        "Ja – stor væskefylt sentralvakuole (50–90 % av volumet) som gir saftspenning (turgortrykk), lagrer stoffer og bryter ned avfall.",
                    ],
                    [
                        "Mitokondrier",
                        "Ja – cellens kraftverk som lager ATP gjennom aerob celleånding hele tiden.",
                        "Ja – planteceller har OGSÅ mitokondrier og driver aerob celleånding både dag og natt (og i røtter uten lys).",
                    ],
                    [
                        "Cellekjerne",
                        "Ja – dobbel kjernemembran med kjerneporer og lineært DNA (kromosomer); deler seg med centrioler og innsnøring.",
                        "Ja – dobbel kjernemembran med kjerneporer og lineært DNA; deler seg uten centrioler ved å bygge en celleplate.",
                    ],
                ],
            },
        },
    ],
}
