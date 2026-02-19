import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import AnalyzerPage from './pages/AnalyzerPage';
import ResultsPage from './pages/ResultsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AboutPage from './pages/AboutPage';
import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="analyze" element={<AnalyzerPage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
