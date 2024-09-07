import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SearchPage from './SearchPage';
import ResultsPage from './ResultsPage';
import PricingPage from './PricingPage';
import SignUpPage from './SignUpPage';
import HomePage from './HomePage';  // Import your existing HomePage
import { Button } from './@/components/ui/button';  // Make sure this path is correct

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          {/* ... existing routes ... */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;