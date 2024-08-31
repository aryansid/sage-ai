import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
// import SearchPage from './components/SearchPage';
import SearchResultsPage from './components/SearchResultPage'; // Import the SearchResults component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/search" element={<SearchPage />} /> */}
        <Route path="/search-results" element={<SearchResultsPage />} /> {/* Add this route */}
      </Routes>
    </Router>
  );
};

export default App;