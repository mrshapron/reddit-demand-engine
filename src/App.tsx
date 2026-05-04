import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Dashboard } from '@/pages/Dashboard';
import { CompanyProfile } from '@/pages/CompanyProfile';
import { Listen } from '@/pages/Listen';
import { RespondToPosts } from '@/pages/RespondToPosts';
import { GeneratePosts } from '@/pages/GeneratePosts';
import { Strategy } from '@/pages/Strategy';
import { Settings } from '@/pages/Settings';

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardShell />}>
        <Route index element={<Navigate to="/respond" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="company" element={<CompanyProfile />} />
        <Route path="listen" element={<Listen />} />
        <Route path="respond" element={<RespondToPosts />} />
        <Route path="generate" element={<GeneratePosts />} />
        <Route path="strategy" element={<Strategy />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/respond" replace />} />
      </Route>
    </Routes>
  );
}
