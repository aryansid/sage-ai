import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Search from './components/Search';
import SearchResultsPage from './components/SearchResultPage';

const App = () => {
  return (
    <Router>  
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/search-results" element={<SearchResultsPage />} />
      </Routes>
    </Router>
  );
};

export default App;