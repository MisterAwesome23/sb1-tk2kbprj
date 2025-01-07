import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Hero } from './components/Hero';
import { JobListings } from './pages/JobListings';
import { ForEmployers } from './pages/ForEmployers';
import { ROUTES } from './lib/constants';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path={ROUTES.HOME} element={<Hero />} />
          <Route path={ROUTES.JOBS} element={<JobListings />} />
          <Route path={ROUTES.EMPLOYERS} element={<ForEmployers />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;