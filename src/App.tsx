import { Loader2 } from 'lucide-react';
import { Suspense, lazy } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PortalTopBar } from './core/components';
import Dashboard from './pages/Dashboard';

const BigBangModule = lazy(() => import('./modules/big-bang/BigBangModule'));
const LivetsTreModule = lazy(
  () => import('./modules/livets-tre/LivetsTreModule'),
);
const HelseErneringModule = lazy(
  () => import('./modules/helse-ernering/HelseErneringModule'),
);

function ModuleLoadingFallback({ title }: { title: string }) {
  return (
    <div className="flex min-h-screen flex-col portal-canvas text-slate-100">
      <PortalTopBar />
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
        <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
        <p className="font-display text-sm font-semibold text-slate-200">
          Laster inn {title}...
        </p>
      </div>
    </div>
  );
}

function ModuleShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#080D1A]">
      <PortalTopBar />
      <div className="flex-1">{children}</div>
    </div>
  );
}

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/big-bang"
          element={
            <Suspense fallback={<ModuleLoadingFallback title="Big Bang" />}>
              <ModuleShell>
                <BigBangModule />
              </ModuleShell>
            </Suspense>
          }
        />
        <Route
          path="/livets-tre"
          element={
            <Suspense fallback={<ModuleLoadingFallback title="Livets tre" />}>
              <ModuleShell>
                <LivetsTreModule />
              </ModuleShell>
            </Suspense>
          }
        />
        <Route
          path="/helse-ernering"
          element={
            <Suspense
              fallback={<ModuleLoadingFallback title="Helse og Ernæring" />}
            >
              <ModuleShell>
                <HelseErneringModule />
              </ModuleShell>
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
