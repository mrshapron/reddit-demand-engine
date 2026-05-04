import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Dashboard } from '@/pages/Dashboard';
import { CompanyProfile } from '@/pages/CompanyProfile';
import { Listen } from '@/pages/Listen';
import { RespondToPosts } from '@/pages/RespondToPosts';
import { GeneratePosts } from '@/pages/GeneratePosts';
import { Strategy } from '@/pages/Strategy';
import { Settings } from '@/pages/Settings';
import { Onboarding } from '@/pages/Onboarding';
import { useCompanyProfile } from '@/store/companyStore';

function RequireOnboarded({ children }: { children: React.ReactNode }) {
  const { isComplete, loading } = useCompanyProfile();
  const location = useLocation();
  if (loading) return null;
  if (!isComplete) {
    return <Navigate to="/onboarding" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route
        element={
          <RequireOnboarded>
            <DashboardShell />
          </RequireOnboarded>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="company" element={<CompanyProfile />} />
        <Route path="listen" element={<Listen />} />
        <Route path="respond" element={<RespondToPosts />} />
        <Route path="generate" element={<GeneratePosts />} />
        <Route path="strategy" element={<Strategy />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
