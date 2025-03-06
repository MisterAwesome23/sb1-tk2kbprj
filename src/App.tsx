import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Layout } from './components/layout/Layout';
import { Hero } from './components/Hero';
import { JobListings } from './pages/JobListings';
import { ForEmployers } from './pages/ForEmployers';
import { ForEmployees } from './pages/ForEmployees';
import { Auth } from './pages/Auth';
import { AuthCallback } from './pages/AuthCallback';
import { About } from './pages/About';
import { Profile } from './pages/Profile';
import { Games } from './pages/Games';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { EmployerDashboard } from './pages/EmployerDashboard';
import { NegotiationGame } from './pages/games/NegotiationGame';
import { CreateJob } from './pages/jobs/CreateJob';
import { JobDetail } from './pages/jobs/JobDetail';
import { JobApplications } from './pages/jobs/JobApplications';
import { InterviewScheduler } from './pages/jobs/InterviewScheduler';
import { Notifications } from './pages/Notifications';
import { AuthProvider } from './contexts/AuthContext';
import { ROUTES } from './lib/constants';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path={ROUTES.HOME} element={<Hero />} />
            <Route path={ROUTES.JOBS} element={<JobListings />} />
            <Route path={ROUTES.EMPLOYERS} element={<ForEmployers />} />
            <Route path={ROUTES.EMPLOYEES} element={<ForEmployees />} />
            <Route path={ROUTES.ABOUT} element={<About />} />
            <Route path={ROUTES.LOGIN} element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
            <Route path={ROUTES.GAMES} element={<Games />} />
            <Route path={ROUTES.EMPLOYEE_DASHBOARD} element={<EmployeeDashboard />} />
            <Route path={ROUTES.EMPLOYER_DASHBOARD} element={<EmployerDashboard />} />
            <Route path={ROUTES.NEGOTIATION_GAME} element={<NegotiationGame />} />
            <Route path={ROUTES.CREATE_JOB} element={<CreateJob />} />
            <Route path={ROUTES.JOB_DETAIL} element={<JobDetail />} />
            <Route path="/jobs/:id/applications" element={<JobApplications />} />
            <Route path="/jobs/:id/applications/:applicationId/schedule" element={<InterviewScheduler />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={5000} />
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;