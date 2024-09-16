import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SearchPage from './SearchPage';
import ResultsPage from './ResultsPage';
import PricingPage from './PricingPage';
import SignUpPage from './SignUpPage';
import HomePage from './HomePage';  // Import your existing HomePage
import NavBar from './components/NavBar';  // Import the NavBar component
import { Button } from './@/components/ui/button';  // Make sure this path is correct
import SignInPage from './SignInPage';  // Import the SignInPage component
import ContactPage from './ContactPage';  // Import the ContactPage component

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
          <Route path="/signin" element={<SignInPage />} />  {/* Add this new route */}
          <Route path="/contact" element={<ContactPage />} />  
        </Routes>
      </div>
    </Router>
  );
}

export default App;