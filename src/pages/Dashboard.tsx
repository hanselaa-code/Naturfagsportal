import {
  Atom,
  BookOpen,
  FlaskConical,
  Globe2,
  HeartPulse,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TreeDeciduous,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AntiCheatAssignment, OralAiExaminer } from '../core/assessment';
import {
  PortalTopBar,
  ProgressBar,
  TopicCard,
  type TopicCardConfig,
} from '../core/components';
import { usePortalProgress } from '../core/storage';

const NAT01_05_TOPICS: TopicCardConfig[] = [
  {
    id: 'big-bang',
    emneNumber: 1,
    code: 'NAT01-05',
    title: 'Universet, bølger & stråling',
    subtitle: 'Big Bang',
    description:
      'Utforsk universets historie fra Big Bang til i dag, stjernenes livssyklus, grunnstoffenes opprinnelse, galakser, tid-rom og elektromagnetisk stråling.',
    route: '/big-bang',
    available: true,
    accentColor: 'amber',
    icon: Atom,
    subtopics: [
      'Big Bang',
      'Grunnstoffer',
      'Stjerner',
      'Galakser',
      'Stråling',
      'Tid-rom',
    ],
    competenceGoalsCount: 4,
  },
  {
    id: 'kjemiske-bindinger',
    emneNumber: 2,
    code: 'NAT01-05',
    title: 'Kjemiske bindinger & karbonkjemi',
    subtitle: 'Kjemi i hverdagen',
    description:
      'Elektronparbindinger, ionebindinger, hydrokarboner, alkoholer, karboksylsyrer og plast/polymerer i miljø og industri.',
    available: false,
    accentColor: 'violet',
    icon: FlaskConical,
    subtopics: ['Atommodell', 'Bindingstyper', 'Alkaner & alkoholer', 'Polymerer'],
    competenceGoalsCount: 3,
  },
  {
    id: 'miljo-klima',
    emneNumber: 3,
    code: 'NAT01-05',
    title: 'Miljøgifter, klima & mangfold',
    subtitle: 'Bærekraftig utvikling',
    description:
      'Drivhuseffekten, karbonsyklusen, bioakkumulering av miljøgifter i næringskjeder og bevaring av biologisk mangfold.',
    available: false,
    accentColor: 'rose',
    icon: Globe2,
    subtopics: ['Drivhuseffekt', 'Miljøgifter', 'Økosystemer', 'Klima'],
    competenceGoalsCount: 4,
  },
  {
    id: 'helse-ernering',
    emneNumber: 4,
    code: 'NAT01-05',
    title: 'Næringsstoffer, kosthold & helse',
    subtitle: 'Helse og Ernæring',
    description:
      'Lær om makro- og mikronæringsstoffer, fordøyelsessystemet, celleånding, væskebalanse, trening, kostholdsråd og kildekritikk.',
    route: '/helse-ernering',
    available: true,
    accentColor: 'cyan',
    icon: HeartPulse,
    subtopics: [
      'Næringsstoffer',
      'Fordøyelsen',
      'Celleånding',
      'Trening',
      'Kosthold',
      'Kildekritikk',
    ],
    competenceGoalsCount: 5,
  },
  {
    id: 'livets-tre',
    emneNumber: 5,
    code: 'NAT01-05',
    title: 'Celler, DNA, proteinsyntese & evolusjon',
    subtitle: 'Livets tre',
    description:
      'Reis gjennom evolusjonens fylogenetiske tre, utforsk dyre- og planteceller, DNA-replikasjon, proteinsyntese og evolusjonære spor i menneskekroppen.',
    route: '/livets-tre',
    available: true,
    accentColor: 'emerald',
    icon: TreeDeciduous,
    subtopics: [
      'Livets tre',
      'Dyre- & plantecelle',
      'DNA-replikasjon',
      'Proteinsyntese',
      'Evolusjon i kroppen',
    ],
    competenceGoalsCount: 5,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { progress, resetAllProgress } = usePortalProgress();
  const [activeAssessmentTab, setActiveAssessmentTab] = useState<
    'anticheat' | 'oral'
  >('anticheat');

  useEffect(() => {
    document.title = 'Naturfag Vg1 (NAT01-05) | Interaktiv Læringsportal';
  }, []);

  const activeTopics = NAT01_05_TOPICS.filter((t) => t.available);
  const totalCompleted = activeTopics.reduce(
    (sum, t) => sum + progress[t.id].completedSubchapters.length,
    0,
  );
  const totalSubchapters = activeTopics.reduce(
    (sum, t) => sum + progress[t.id].totalSubchapters,
    0,
  );
  const overallPercentage =
    totalSubchapters > 0
      ? Math.round((totalCompleted / totalSubchapters) * 100)
      : 0;

  return (
    <div className="min-h-screen portal-canvas text-slate-100">
      <PortalTopBar overallPercentage={overallPercentage} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        {/* Hero / Overview Banner */}
        <section className="glass-panel mb-10 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-300">
                <Sparkles className="h-3.5 w-3.5" />
                Vg1 Naturfag • Læreplan NAT01-05
              </div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
                Din interaktive naturfagportal
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                Utforsk visuelle tidslinjer, interaktive modeller og quizer for
                alle hovedemnene i Naturfag Vg1. Fremdriften din lagres
                automatisk lokalt i nettleseren.
              </p>
            </div>

            <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/75 p-5 lg:w-80">
              <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                  <BookOpen className="h-4 w-4 text-sky-400" />
                  Samlet fremdrift
                </span>
                <button
                  type="button"
                  onClick={resetAllProgress}
                  title="Nullstill lagret fremdrift"
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
                >
                  <RotateCcw className="h-3 w-3" />
                  Nullstill
                </button>
              </div>
              <ProgressBar
                value={totalCompleted}
                max={totalSubchapters}
                label={`${totalCompleted} av ${totalSubchapters} aktive delkapitler`}
                accentColor="emerald"
              />
              <p className="mt-3 text-[11px] text-slate-400">
                3 av 5 emner er aktive nå. Hver modul lastes dynamisk når du
                åpner den.
              </p>
            </div>
          </div>
        </section>

        {/* 5 Topics Grid */}
        <section className="mb-12">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-white">
                Hovedemner i NAT01-05
              </h2>
              <p className="text-xs text-slate-400">
                Velg et aktivt emne for å starte utforskingen
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {NAT01_05_TOPICS.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                progress={progress[topic.id]}
                onSelect={(route) => navigate(route)}
              />
            ))}
          </div>
        </section>

        {/* Core Assessment Tools Section */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                <ShieldCheck className="h-4 w-4" />
                Felles vurderingsverktøy (src/core/assessment)
              </div>
              <h2 className="font-display mt-1 text-xl font-bold text-white">
                Klargjorte moduler for skriftlig og muntlig vurdering
              </h2>
            </div>

            <div className="inline-flex rounded-xl border border-slate-800 bg-slate-900/80 p-1">
              <button
                type="button"
                onClick={() => setActiveAssessmentTab('anticheat')}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                  activeAssessmentTab === 'anticheat'
                    ? 'bg-sky-500/20 text-sky-200 ring-1 ring-sky-400/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Kopisperre-innlevering
              </button>
              <button
                type="button"
                onClick={() => setActiveAssessmentTab('oral')}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                  activeAssessmentTab === 'oral'
                    ? 'bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Muntlig AI-sensor
              </button>
            </div>
          </div>

          {activeAssessmentTab === 'anticheat' ? (
            <AntiCheatAssignment />
          ) : (
            <OralAiExaminer />
          )}
        </section>
      </main>
    </div>
  );
}
