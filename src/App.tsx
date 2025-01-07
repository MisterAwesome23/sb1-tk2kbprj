import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Hero } from './components/Hero';
import { JobListings } from './pages/JobListings';
import { ForEmployers } from './pages/ForEmployers';
import { Auth } from './pages/Auth';
import { About } from './pages/About';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { EmployerDashboard } from './pages/EmployerDashboard';
import { AuthProvider } from './contexts/AuthContext';
import { ROUTES } from './lib/constants';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path={ROUTES.HOME} element={<Hero />} />
            <Route path={ROUTES.JOBS} element={<JobListings />} />
            <Route path={ROUTES.EMPLOYERS} element={<ForEmployers />} />
            <Route path={ROUTES.ABOUT} element={<About />} />
            <Route path={ROUTES.LOGIN} element={<Auth />} />
            <Route path={ROUTES.EMPLOYEE_DASHBOARD} element={<EmployeeDashboard />} />
            <Route path={ROUTES.EMPLOYER_DASHBOARD} element={<EmployerDashboard />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;