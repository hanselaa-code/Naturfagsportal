# -*- coding: utf-8 -*-
"""
Kapittel 3: DNA og DNA-replikasjon – Vg1 Naturfag (LK20)
Pedagogisk fordypningsstoff, læringsmål, faglige dypdykk og oppsummering.
"""

CH3_DATA = {
    "chapter_num": 3,
    "accent": "#7C3AED",
    "accent_soft": "#EDE9FE",
    "accent_border": "#8B5CF6",
    "cover_image": "dna_step5_double_helix.png",
    "learning_goals": [
        "Gjøre rede for hvordan arvestoffet er organisert i cellekjernen som kromosomer, kromatin og nukleosomer (DNA pakket rundt histoner), og forklare hva et gen er.",
        "Beskrive den kjemiske oppbygningen av et DNA-nukleotid (fosfatgruppe, deoksyribose og nitrogenbase) og bruke baseparingsregelen (A–T og C–G) og Chargaffs regel.",
        "Forklare hvorfor kombinasjonen av sterke kovalente bindinger i sukker-fosfat-ryggraden og svake hydrogenbindinger mellom basene gjør DNA både stabilt og mulig å kopiere, samt hva antiparallelle tråder (5' → 3' og 3' → 5') innebærer.",
        "Beskrive trinn for trinn hvordan semikonservativ DNA-replikasjon foregår i S-fasen ved hjelp av helikase, topoisomerase, primase, DNA-polymerase (ledende tråd vs. Okazaki-fragmenter på forsinket tråd) og DNA-ligase.",
        "Forklare hvordan korrekturlesing og reparasjonsenzymer hindrer de fleste kopieringsfeil, skille mellom mutasjoner i kroppsceller og kjønnsceller, og drøfte hvorfor sjeldne mutasjoner er avgjørende for evolusjonen.",
    ],
    "intro": (
        "Inne i cellekjernen til nesten hver eneste celle i kroppen din ligger omtrent to meter supertynn DNA-tråd pakket ned på et område som er hundre ganger tynnere enn et hårstrå. "
        "Dette molekylet – <strong>deoksyribonukleinsyre (DNA)</strong> – rommer hele oppskriftsverket for hvordan kroppen din bygges, vedlikeholdes og fungerer. "
        "I dette kapittelet beveger vi oss fra makronivået i cellekjernen med 46 kromosomer og spoleproteiner (histoner), helt ned til den kjemiske finmekanikken i nukleotidene og dobbelheliksen. "
        "Deretter følger vi det molekylære enzymmaskineriet som kopierer hele arvestoffet med ekstrem presisjon før hver celledeling – og ser hvordan de ørsmå feilene som likevel slipper gjennom, skaper nye genvarianter og driver evolusjonen videre."
    ),
    "deep_dives": {
        1: {
            "title": "Faglig dypdykk: Pakking, histoner og epigenetisk genstyring",
            "body": (
                "En menneskecelle har rundt <strong>2 meter DNA</strong> fordelt på 46 kromosomer, mens cellekjernen bare er om lag 6 mikrometer bred. "
                "For å unngå floker snurres den negativt ladde DNA-tråden rundt kuler av åtte positivt ladde <strong>histon-proteiner</strong> og danner <strong>nukleosomer</strong> – omtrent som perler på en snor. "
                "Denne pakkingen er ikke bare plassbesparende, den er også en aktiv bryter for genene: Når kromatinet ligger løst (<strong>eukromatin</strong>), kan enzymer lese genene; når det pakkes stramt (<strong>heterokromatin</strong>), er genene fysisk låst. "
                "Kjemiske merkelapper på histoner og DNA (<strong>epigenetikk</strong>) kan dermed skru gener av og på uten at selve bokstavrekkefølgen A, T, C og G endres."
            ),
        },
        3: {
            "title": "Kjemi i fokus: Chargaffs regel og styrken i hydrogenbindinger",
            "body": (
                "I et dobbelttrådet DNA-molekyl peker nitrogenbasene inn mot midten og danner presise par mellom én stor dobbeltring (<strong>purin</strong>: A og G) og én liten enkeltring (<strong>pyrimidin</strong>: T og C). "
                "<strong>Adenin (A)</strong> danner <strong>2 hydrogenbindinger</strong> med <strong>tymin (T)</strong>, mens <strong>cytosin (C)</strong> danner <strong>3 hydrogenbindinger</strong> med <strong>guanin (G)</strong>. "
                "Dette gir den berømte <strong>Chargaffs regel</strong>: andelen A er alltid lik andelen T, og andelen C er alltid lik andelen G. "
                "Fordi C≡G har tre hydrogenbindinger mot to i A=T, krever det høyere temperatur å skille C–G-rike områder – og cellen starter derfor ofte åpning av DNA i A–T-rike felter."
            ),
        },
        4: {
            "title": "3D-arkitektur: Antiparallelle tråder og Foto 51",
            "body": (
                "De to sukker-fosfat-vangene i DNA holdes sammen av ursterke <strong>kovalente bindinger</strong> (fosfodiesterbindinger) slik at rekkefølgen av baser aldri går i stykker. "
                "Karbonatomene i sukkerringen deoksyribose nummereres fra 1' til 5'. I den ene enden av tråden sitter en fri fosfatgruppe på karbon <strong>5'</strong>, mens den andre enden har en fri hydroksylgruppe (-OH) på karbon <strong>3'</strong>. "
                "For at basene skal møtes riktig i midten av vindeltrappen, må de to trådene løpe i motsatt retning – de er <strong>antiparallelle</strong> (5' → 3' mot 3' → 5'). "
                "Rosalind Franklins røntgenbilde <em>Foto 51</em> avslørte i 1952–1953 spiralformen med ti basepar per omdreining og la grunnlaget for Watson og Cricks modell."
            ),
        },
        7: {
            "title": "Replikasjonsgaffelen: Hvorfor bygges trådene forskjellig?",
            "body": (
                "Under <strong>S-fasen</strong> i cellesyklus åpner <strong>helikase</strong> DNA-glidelåsen ved tusenvis av replikasjonsbobler samtidig, mens <strong>topoisomerase</strong> fjerner snurrespenning foran gaffelen og <strong>primase</strong> legger korte RNA-primere. "
                "Enzymet <strong>DNA-polymerase</strong> kan kjemisk sett <em>bare</em> hekte nye nukleotider på den frie 3'-OH-enden – det bygger altså alltid ny tråd i retningen <strong>5' → 3'</strong>. "
                "På den <strong>ledende tråden</strong> kan DNA-polymerase kjøre sammenhengende rett inn i gaffelen. På den antiparallelle <strong>forsinkede tråden</strong> må enzymet derimot bygge stykkevis bakover ut fra gaffelen i korte <strong>Okazaki-fragmenter</strong>, før RNA-primerne erstattes med DNA og <strong>DNA-ligase</strong> sveiser skjøtene sammen."
            ),
        },
        8: {
            "title": "Kvalitetskontroll, mutagener og arvelighet",
            "body": (
                "DNA-polymerase gjør først omtrent én feil per 100 000 baser, men sin innebygde <strong>korrekturlesing</strong> (proofreading) og påfølgende <strong>reparasjonsenzymer</strong> retter 99,9 % av feilene – slik at det bare blir rundt <strong>1 varig mutasjon per milliard basepar</strong>. "
                "Ytre faktorer som UV-stråling, røntgenstråling og mutagene kjemikalier (<strong>mutagener</strong>) kan øke skadefrekvensen. "
                "Husk hovedskillet i genetikk og medisin: Mutasjoner i <strong>kroppsceller</strong> (somatiske celler) kan gi kreft hos individet selv, men går <em>ikke</em> i arv. Kun mutasjoner i <strong>kjønnsceller</strong> (egg- og sædceller) føres videre til neste generasjon og skaper nye alleler for evolusjonen."
            ),
        },
    },
    "summary_points": [
        "Menneskets arvestoff i kroppsceller består av 46 kromosomer (23 homologe par), der DNA-tråden er pakket rundt positivt ladde histoner til nukleosomer og kromatin.",
        "Et DNA-nukleotid består av en fosfatgruppe, femkarbonsukkeret deoksyribose og én av fire nitrogenbaser: adenin (A), tymin (T), cytosin (C) eller guanin (G).",
        "Baseparingsregelen sier at A alltid parer med T (2 hydrogenbindinger) og C med G (3 hydrogenbindinger); sterke kovalente bindinger danner det ytre sukker-fosfat-reisverket.",
        "De to trådene i dobbelheliksen er antiparallelle (5' → 3' mot 3' → 5'), og DNA-replikasjonen i S-fasen er semikonservativ: hvert nytt DNA-molekyl består av én gammel maltråd og én nylaget tråd.",
        "I replikasjonsgaffelen åpner helikase trådene, primase legger RNA-primer, DNA-polymerase bygger ledende tråd kontinuerlig (5' → 3') og forsinket tråd i Okazaki-fragmenter, og DNA-ligase limer skjøtene.",
        "Korrekturlesing og reparasjonsenzymer gir ekstremt høy nøyaktighet (~1 feil per milliard baser); sjeldne mutasjoner i kjønnsceller skaper genetisk variasjon og er råmaterialet for evolusjon.",
    ],
}
