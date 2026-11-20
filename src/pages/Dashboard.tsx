import {
  ArrowRight,
  Atom,
  BookOpen,
  ClipboardCheck,
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
import { QrShareModal } from '../components/QrShareModal';
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
    imageUrl: './assets/portal/card_big_bang.jpg',
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
    title: 'Karbon',
    subtitle: 'Kjemi i hverdagen',
    description:
      'Atommodell og bindinger, karbonatomet, hydrokarboner, alkoholer, karboksylsyrer & estere, polymerer/plast og karbonsyklusen.',
    route: '/karbon',
    available: true,
    accentColor: 'violet',
    icon: FlaskConical,
    imageUrl: './assets/portal/card_karbon.jpg',
    subtopics: [
      'Bindinger',
      'Karbonatomet',
      'Hydrokarboner',
      'Alkoholer',
      'Syrer & estere',
      'Plast',
      'Karbonsyklusen',
    ],
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
    imageUrl: './assets/portal/card_miljo_klima.jpg',
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
    imageUrl: './assets/portal/card_helse_ernering.jpg',
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
    title: 'Biologi – Celler, DNA & evolusjon',
    subtitle: 'Biologi',
    description:
      'Utforsk dyre- og planteceller, DNA-replikasjon, proteinsyntese, livets tre gjennom 3,7 milliarder år og evolusjonære spor i menneskekroppen.',
    route: '/livets-tre',
    available: true,
    accentColor: 'emerald',
    icon: TreeDeciduous,
    imageUrl: './assets/portal/card_biologi.jpg',
    subtopics: [
      'Dyrecelle',
      'Plantecelle',
      'DNA-replikasjon',
      'Proteinsyntese',
      'Livets tre',
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
  const [isQrOpen, setIsQrOpen] = useState(false);

  useEffect(() => {
    document.title = 'Naturfag Vg1 (NAT01-05) | Interaktiv Læringsportal';
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (
        (e.key === 'k' || e.key === 'K') &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        e.preventDefault();
        setIsQrOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
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
      <PortalTopBar
        overallPercentage={overallPercentage}
        onOpenQrModal={() => setIsQrOpen(true)}
      />

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

            <button
              type="button"
              onClick={() => navigate('/innlevering')}
              className="group glass-panel relative flex flex-col justify-between overflow-hidden rounded-2xl text-left transition-all duration-300 cursor-pointer hover:border-sky-400/45 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/10"
            >
              <div className="relative aspect-video w-full overflow-hidden border-b border-slate-800/80 bg-gradient-to-br from-sky-950/90 via-[#0B1324] to-emerald-950/80 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/30 transition-transform duration-500 group-hover:scale-110">
                  <ClipboardCheck className="h-8 w-8" />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B1222] via-transparent to-black/20" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/30 bg-sky-500/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase text-sky-300 backdrop-blur-md">
                    Portal • Innlevering
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400 ring-1 ring-sky-400/30">
                        <ClipboardCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-slate-50">
                          Innlevering
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="mb-4 text-sm leading-relaxed text-slate-300/90">
                    Logg inn som elev eller lærer for å levere oppgaver med
                    kamera, filopplasting eller kopisperre, og motta automatisk
                    AI-vurdering.
                  </p>

                  <div className="mb-5 flex flex-wrap gap-1.5">
                    {[
                      'Elev-innlogging',
                      'Kamera & fil',
                      'Kopisperre',
                      'AI-sensor',
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg bg-slate-800/75 px-2.5 py-1 text-xs font-medium text-slate-300 ring-1 ring-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 border-t border-slate-800/80 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      Krever innlogging
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-sky-400/30 bg-sky-500/15 px-3.5 py-1.5 text-xs font-semibold text-sky-200 transition-colors hover:bg-sky-500/25">
                      Gå til innlevering
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            </button>
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

      <QrShareModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        routePath="/"
        badgeLabel="Hovedside"
        title="Naturfag VG1"
        accent="sky"
      />
    </div>
  );
}
