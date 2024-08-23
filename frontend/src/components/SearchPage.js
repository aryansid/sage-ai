import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar'; // Import the NavBar component
import ExampleCard from './ExampleCard'; // Import the MiniCard component

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [publishedAfter, setPublishedAfter] = useState('');
  const [publishedBefore, setPublishedBefore] = useState('');
  const [documentType, setDocumentType] = useState('Patents');
  const [searchType, setSearchType] = useState('Novelty');
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate(); // Corrected variable name

  const handleSearch = () => {
    console.log('Searching for:', query, publishedAfter, publishedBefore, documentType, searchType);
    // Add your search logic here and update the results state
    const searchResults = [
      {
        title: 'Smart Medication Dispenser with Automated Alerts',
        author: 'Smith et al.',
        company: 'MedTech Solutions LLC',
        date: 'March 10, 2014',
        id: 'US20140121567A1',
        description: 'A medication dispensing apparatus equipped with integrated sensors and microcontrollers, configured to monitor and record the removal of individual doses. The system includes a wireless communication module that synchronizes with a mobile device, providing automated reminders and alerts for scheduled dosages. The apparatus further includes an algorithm that tracks patient adherence and provides real-time feedback to healthcare providers.'
      },
      {
        title: 'Electronic Cap for Medication Bottles with Reminder System',
        author: 'Johnson et al.',
        company: 'HealthTech Innovations',
        date: 'September 22, 2016',
        id: 'US20160234567A1',
        description: 'An advanced electronic cap designed for standard medication bottles, featuring an embedded microprocessor that records the time and date of each bottle opening. The cap is integrated with a visual and auditory reminder system that activates at predetermined intervals to prompt medication intake. The device is also capable of wireless data transmission to a cloud-based server, enabling remote monitoring of patient compliance by healthcare providers.'
      },
      {
        title: 'Patient Compliance Monitoring System for Medication Management',
        author: 'Garcia et al.',
        company: 'PharmaTech Corporation',
        date: 'December 15, 2012',
        id: 'US20120367123A1',
        description: 'A comprehensive system designed to enhance patient compliance with prescribed medication regimens. The system includes a sensor-enabled bottle cap that tracks each instance of medication access and communicates with a central database via Bluetooth. The system utilizes data analytics to detect patterns of non-compliance and generates reports for healthcare professionals, allowing for timely interventions. The system also supports integration with electronic health records (EHR) systems.'
      },  
      {
        title: 'Medication Adherence System with Integrated Feedback Mechanism',
        author: 'Nguyen et al.',
        company: 'BioMed Devices Inc.',
        date: 'May 3, 2018',
        id: 'US20180115678A1',
        description: 'A medication adherence system incorporating a smart cap with a multi-sensor array capable of detecting bottle openings, pill removal, and environmental conditions such as humidity and temperature. The system is designed to provide haptic feedback through vibrations and auditory cues to remind patients to take their medication. It further includes a mobile application that allows for real-time adherence tracking and data synchronization with cloud-based platforms for longitudinal health monitoring.'
      }
    ];    
    navigate('/search-results', { state: { results: searchResults } }); 
  };

  return (
    <>
      <NavBar /> {/* Include the NavBar component */}
      <div className="min-h-screen bg-white text-center flex flex-col justify-center items-center">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <div className="mb-4">
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800"
              placeholder="Describe what you want to search for"
            />
          </div>
          <div className="flex flex-wrap mb-4">
            <div className="w-full md:w-1/2 pr-2 mb-4 md:mb-0">
              <input
                type="date"
                id="publishedAfter"
                value={publishedAfter}
                onChange={(e) => setPublishedAfter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800"
                placeholder="YYYY-MM-DD"
              />
            </div>
            <div className="w-full md:w-1/2 pl-2">
              <input
                type="date"
                id="publishedBefore"
                value={publishedBefore}
                onChange={(e) => setPublishedBefore(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800"
                placeholder="YYYY-MM-DD"
              />
            </div>
          </div>
          <div className="flex flex-wrap mb-4">
            <div className="w-full md:w-1/2 pr-2 mb-4 md:mb-0">
              <div className="relative">
                <select
                  id="documentType"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 bg-gray-100 appearance-none"
                >
                  <option value="Patents">Patents</option>
                  <option value="Articles">Articles</option>
                  <option value="Books">Books</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 pl-2">
              <div className="relative">
                <select
                  id="searchType"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 bg-gray-100 appearance-none"
                >
                  <option value="Novelty">Novelty</option>
                  <option value="Validity">Validity</option>
                  <option value="Infringement">Infringement</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center mb-4">
            <button
              onClick={handleSearch}
              className="w-full px-4 py-3 bg-gray-800 text-white text-base rounded-md hover:bg-gray-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
        <div className="w-full max-w-2xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Automated Prescription Bottle Cap", description: "Tracks bottle usage and reminds users to take medication on time via alarm or smartphone." },
            { title: "Adaptive Office Lighting System", description: "Adjusts lighting based on time, natural light, and user activity to enhance productivity." },
            { title: "Smart Refrigerator Shelf", description: "Monitors freshness and quantity of items, alerts for low or expired items, and auto-generates shopping lists." },
            { title: "Automated Lawn Watering System", description: "Uses weather and soil data to optimize watering, conserving water and promoting healthy lawn growth." }
          ].map((card, index) => (
            <ExampleCard 
              key={index}
              title={card.title}
              description={card.description}
              isHovered={hoveredCard === index}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchPage;