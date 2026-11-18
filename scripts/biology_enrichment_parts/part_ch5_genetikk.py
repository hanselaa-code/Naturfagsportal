# -*- coding: utf-8 -*-
"""
Kapittel 5: Genetikk og arv – Vg1 Naturfag (LK20)
Pedagogisk fordypningsstoff, læringsmål, faglige dypdykk, oppsummering og ekstra kontrollspørsmål.
"""

CH5_DATA = {
    "chapter_num": 5,
    "accent": "#9333EA",
    "accent_soft": "#F3E8FF",
    "accent_border": "#A855F7",
    "cover_image": "gen_step5_punnett.jpg",
    "learning_goals": [
        "Gjøre rede for sammenhengen mellom kromosomer, gener, alleler og lokus, og skille klart mellom genotype og fenotype samt homozygot og heterozygot.",
        "Forklare dominant og recessiv arv, og sette opp og tolke krysningsskjema (Punnett-kvadrat) for å beregne sannsynlighet for ulike genotyper og fenotyper.",
        "Sammenligne mitose (vekst og vedlikehold) og meiose (dannelse av kjønnsceller), og forklare hvordan overkrysning og tilfeldig fordeling skaper genetisk variasjon.",
        "Forklare hvordan biologisk kjønn bestemmes (XX og XY), og gjøre rede for hvorfor X-bundne recessive egenskaper (som rød-grønn fargeblindhet) opptrer oftere hos gutter enn hos jenter.",
        "Drøfte samspillet mellom arv, miljø og epigenetikk, samt muligheter og etiske problemstillinger knyttet til moderne genteknologi som CRISPR-Cas9.",
    ],
    "intro": (
        "Hvorfor ligner søsken på foreldrene sine – og på hverandre – men er likevel helt unike? "
        "Svaret ligger i hvordan gener og kromosomer fordeles når nye kjønnsceller dannes og møtes ved befruktning. "
        "I dette kapittelet bygger vi bro fra DNA og proteinsyntese til klassisk og moderne <strong>genetikk</strong>: "
        "Vi lærer grunnbegrepene allel, genotype og fenotype, bruker Mendels arvelover og krysningsskjemaer til å regne ut sannsynligheter, utforsker reduksjonsdelingen (<strong>meiose</strong>) og kjønnsbundet arv, og avslutter med samspillet mellom arv, miljø, epigenetikk og genredigering med <strong>CRISPR-Cas9</strong>."
    ),
    "deep_dives": {
        1: {
            "title": "Begrepspresisjon: Genotype, fenotype og ulike arveganger",
            "body": (
                "En vanlig feil i genetikkoppgaver er å blande sammen <strong>genotype</strong> (hvilke bokstaver/alleler du bærer i DNA, som <em>BB</em>, <em>Bb</em> eller <em>bb</em>) og <strong>fenotype</strong> (den observerbare egenskapen, som brune eller blå øyne). "
                "To personer kan ha identisk fenotype (brune øyne), men ulik genotype (<em>BB</em> vs. <em>Bb</em>). "
                "I tillegg til klassisk <strong>dominant/recessiv arv</strong> finnes <strong>kodominans</strong> (begge alleler kommer fullt til uttrykk, som blodtype AB) og <strong>polygen arv</strong>, der mange gener virker sammen – slik som ved høyde, hudfarge og øyefarge hos mennesker."
            ),
        },
        3: {
            "title": "Meiose og genetisk variasjon: Hvorfor er søsken så ulike?",
            "body": (
                "Mens vanlig celledeling (<strong>mitose</strong>) lager to genetisk identiske kroppsceller (2n = 46 → 2n = 46), halverer <strong>meiose</strong> kromosomtallet gjennom to påfølgende delinger til fire haploide kjønnsceller (2n = 46 → n = 23). "
                "I første deling skjer to ting som skaper enorm variasjon: (1) <strong>Overkrysning</strong>, der homologe kromosomer fra mor og far bytter DNA-biter med hverandre, og (2) <strong>tilfeldig fordeling</strong> av hvilken av de to kromosomkopiene i hvert av de 23 parene som havner i hvilken kjønnscelle (2²³ ≈ 8,4 millioner kombinasjoner før man engang regner med overkrysning!)."
            ),
        },
        4: {
            "title": "Matematikk i genetikken: Slik bruker du Punnett-kvadratet",
            "body": (
                "I et <strong>krysningsskjema</strong> skriver du mors mulige kjønnscelle-alleler langs den ene kanten og fars langs den andre. "
                "Husk tre klassiske utfall å kjenne igjen med én gang: "
                "(1) <strong>Aa × Aa</strong> gir genotypeforhold 1 : 2 : 1 (25 % AA, 50 % Aa, 25 % aa) og fenotypeforhold <strong>3 : 1</strong> (75 % dominant, 25 % recessiv). "
                "(2) <strong>Aa × aa</strong> gir <strong>50 % Aa og 50 % aa</strong> (1 : 1). "
                "(3) <strong>AA × aa</strong> gir <strong>100 % Aa</strong> (alle blir heterozygote bærere med dominant fenotype). "
                "Husk at skjemaet viser <em>sannsynlighet per befruktning</em> – ikke en garanti for fordelingen i en søskenflokk."
            ),
        },
        5: {
            "title": "X-bundet arv: Hvorfor rammes gutter oftere?",
            "body": (
                "Kvinner har to X-kromosomer (<strong>XX</strong>), mens menn har ett X-kromosom og ett mye mindre Y-kromosom (<strong>XY</strong>). "
                "Fordi X-kromosomet har rundt 800–900 gener som mangler motpart på Y-kromosomet, har gutter bare én kopi av disse genene. "
                "Hvis et recessivt sykdomsallel (f.eks. for rød-grønn fargeblindhet eller hemofili/blødersykdom) ligger på X-kromosomet, vil en gutt med genet (<strong>XᵃY</strong>) alltid få egenskapen, mens en jente (<strong>XᴬXᵃ</strong>) blir frisk bærer fordi det dominante allelet på det andre X-kromosomet dekker over feilen. "
                "Merk også at en far aldri kan gi et X-bundet trekk videre til sønnen sin (sønnen arver Y fra far), men alle døtrene hans vil arve farens X-kromosom!"
            ),
        },
        7: {
            "title": "Genteknologi og CRISPR-Cas9: Muligheter og etiske grenser",
            "body": (
                "Med <strong>CRISPR-Cas9</strong> bruker forskere en skreddersydd guide-RNA til å lede Cas9-enzymet til et nøyaktig sted i DNA og klippe over tråden. "
                "I Norge reguleres bruk på mennesker strengt av <strong>bioteknologiloven</strong>: Det skilles skarpt mellom genredigering i <strong>kroppsceller</strong> (genterapi for å kurere sykdom hos én pasient, f.eks. sigdcelleanemi) og genredigering i <strong>kjønnsceller eller befruktede egg</strong>, som ville gått i arv til alle kommende generasjoner og reiser tunge etiske spørsmål om sikkerhet og «designbabyer»."
            ),
        },
    },
    "summary_points": [
        "Kroppsceller er diploide (2n = 46 kromosomer i 23 homologe par); ulike varianter av samme gen på samme lokus kalles alleler.",
        "Genotypen er selve allelkombinasjonen (AA, Aa eller aa), mens fenotypen er den synlige eller målbare egenskapen – formet av både gener og miljø.",
        "Et dominant allel (A) kommer til uttrykk både hos homozygote (AA) og heterozygote (Aa), mens et recessivt allel (a) krever dobbel dose (aa) for å vises.",
        "Meiose halverer kromosomtallet fra 46 til 23 i kjønnsceller og skaper stor genetisk variasjon gjennom overkrysning og tilfeldig fordeling.",
        "Krysningsskjema (Punnett-kvadrat) brukes til å regne ut sannsynligheten for barnets genotype og fenotype; ved Aa × Aa blir fenotypeforholdet 3 : 1.",
        "Recessive gener på X-kromosomet slår oftere ut hos gutter (XY) enn hos jenter (XX), fordi gutter bare har ett X-kromosom.",
        "De fleste egenskaper skyldes samspill mellom mange gener, miljø og epigenetikk; moderne genteknologi som CRISPR-Cas9 gir nye medisinske muligheter, men krever tydelige etiske rammer.",
    ],
    "extra_control_questions": [
        {
            "id": "gq_extra_mitosis_meiosis",
            "number": 4,
            "question": "Sammenlign mitose og meiose: Hvor i kroppen skjer de to formene for celledeling, hvor mange celler dannes, hva skjer med kromosomtallet, og hvorfor er begge livsviktige?",
            "contextHint": "Sammenlign formål, antall delinger, kromosomtall før og etter (2n vs. n), overkrysning og om dattercellene blir genetisk like eller ulike.",
            "points": [
                {
                    "heading": "Mitose – vekst, fornyelse og reparasjon (2n → 2n)",
                    "detail": "Skjer i vanlige kroppsceller gjennom én celledeling etter DNA-replikasjonen. Resultatet er 2 genetisk identiske, diploide datterceller med 46 kromosomer hver – avgjørende for at vi kan vokse fra én befruktet eggcelle og erstatte slitte hud-, blod- og tarmceller.",
                    "badge": "Kroppsceller",
                },
                {
                    "heading": "Meiose – kjønnsceller og genetisk mangfold (2n → n)",
                    "detail": "Skjer kun i kjønnskjertlene (testikler og eggstokker) gjennom to påfølgende delinger. Resultatet er 4 haploide kjønnsceller med 23 kromosomer hver, som alle er genetisk unike takket være overkrysning og tilfeldig fordeling av homologe kromosomer.",
                    "badge": "Kjønnsceller",
                },
            ],
            "comparisonTable": {
                "headers": ["Egenskap", "Mitose (vanlig celledeling)", "Meiose (reduksjonsdeling)"],
                "rows": [
                    ["Hvor skjer det?", "I vanlige kroppsceller (somatiske celler)", "Kun i kjønnskjertlene (eggstokker og testikler)"],
                    ["Hovedformål", "Vekst fra foster til voksen, reparasjon og utskifting av celler", "Lage kjønnsceller (egg- og sædceller) til kjønnet formering"],
                    ["Antall celledelinger", "1 celledeling (etter DNA-replikasjon)", "2 påfølgende delinger (meiose I og II, etter én DNA-replikasjon)"],
                    ["Antall datterceller", "2 datterceller", "4 datterceller (hos kvinner blir én til moden eggcelle + pollegemer)"],
                    ["Kromosomtall hos mennesket", "Diploid → Diploid (2n = 46 → 2n = 46)", "Diploid → Haploid (2n = 46 → n = 23)"],
                    ["Overkrysning & genetisk likhet", "Ingen overkrysning; dattercellene er 100 % genetisk identiske", "Overkrysning + tilfeldig fordeling gir genetisk unike kjønnsceller"],
                ],
            },
            "takeaway": "Mitose bevarer kromosomtallet (46 → 46) og lager identiske arbeidsceller til kroppen, mens meiose halverer kromosomtallet (46 → 23) og stokker genene slik at hvert nytt barn får sitt eget unike DNA.",
        },
    ],
}
