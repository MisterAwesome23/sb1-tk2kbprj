import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { JobListings } from './pages/JobListings';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/jobs" element={<JobListings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;