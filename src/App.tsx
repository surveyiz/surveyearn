import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AppLayout from './layouts/AppLayout';
import SurveysPage from './pages/app/SurveysPage';
import TakeSurveyPage from './pages/app/TakeSurveyPage';
import DashboardPage from './pages/app/DashboardPage';
import ReferralsPage from './pages/app/ReferralsPage';
import SettingsPage from './pages/app/SettingsPage';
import HelpPage from './pages/app/HelpPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import NotFoundPage from './pages/NotFoundPage';
import SubscriptionPage from './pages/app/SubscriptionPage';
import PaymentPage from './pages/app/PaymentPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* App routes */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="surveys" element={<SurveysPage />} />
          <Route path="surveys/:surveyId" element={<TakeSurveyPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="referrals" element={<ReferralsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="subscription" element={<SubscriptionPage />} />
          <Route path="payment" element={<PaymentPage />} />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;