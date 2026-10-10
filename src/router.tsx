import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import HomePage from '@/pages/HomePage';
import ConsentPage from '@/pages/ConsentPage';
import ProfilePage from '@/pages/ProfilePage';
import AssessmentHubPage from '@/pages/AssessmentHubPage';
import AssessmentPage from '@/pages/AssessmentPage';
import ComputingPage from '@/pages/ComputingPage';
import ReportPage from '@/pages/ReportPage';
import ShareReportPage from '@/pages/ShareReportPage';
import CareersPage from '@/pages/CareersPage';
import HistoryPage from '@/pages/HistoryPage';
import AboutPage from '@/pages/AboutPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/consent" element={<ConsentPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/hub" element={<AssessmentHubPage />} />
        <Route path="/assess/:moduleKey" element={<AssessmentPage />} />
        <Route path="/computing" element={<ComputingPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/share" element={<ShareReportPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
