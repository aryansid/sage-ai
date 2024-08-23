import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import SearchResults from './components/SearchResults'; // Import the SearchResults component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/search-results" element={<SearchResults />} /> {/* Add this route */}
      </Routes>
    </Router>
  );
};

export default App;