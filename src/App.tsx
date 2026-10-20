import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';

import { Dashboard } from './pages/Dashboard';
import { TodayPlan } from './pages/TodayPlan';
import { Roadmap } from './pages/Roadmap';
import { DsaTracker } from './pages/DsaTracker';
import { RevisionQueue } from './pages/RevisionQueue';
import { Skills } from './pages/Skills';
import { ProjectTracker } from './pages/ProjectTracker';
import { JobApplications } from './pages/JobApplications';
import { Reviews } from './pages/Reviews';
import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="today" element={<TodayPlan />} />
            <Route path="roadmap" element={<Roadmap />} />
            <Route path="dsa" element={<DsaTracker />} />
            <Route path="revision" element={<RevisionQueue />} />
            <Route path="skills" element={<Skills />} />
            <Route path="project" element={<ProjectTracker />} />
            <Route path="jobs" element={<JobApplications />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
