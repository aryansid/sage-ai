import React, { useEffect, useRef, useState } from 'react';
import SearchResultCard from './SearchResultCard';
import NavBar from './NavBar';

const SearchResultPage = () => {
  const [visibleCards, setVisibleCards] = useState({});
  const observerRef = useRef(null);
  const cardRefs = useRef({});

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setVisibleCards((prev) => ({
            ...prev,
            [entry.target.id]: entry.intersectionRatio
          }));
        });
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    // Observe all existing card refs
    Object.values(cardRefs.current).forEach((el) => {
      if (el) observerRef.current.observe(el);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // This is mock data. In a real application, you'd fetch this from an API
  const mockPatents = [
    {
      id: 'US10234567B2',
      title: 'Adaptive Trawl Door System for Enhanced Marine Fishing Efficiency',
      inventor: 'John D. Fisher, Sarah M. Ocean',
      assignee: 'OceanTech Innovations, Inc.',
      publicationDate: 'June 15, 2021',
      abstract: 'An adaptive trawl door system for marine fishing operations, featuring a dynamically adjustable concave or angled structure. The system incorporates advanced sensors and actuators to optimize hydrodynamic performance in real-time, improving fuel efficiency and reducing environmental impact. The trawl doors automatically adjust their angle and shape based on water current, depth, and fish school detection, maximizing catch efficiency while minimizing bycatch. This innovative design also includes a smart release mechanism to prevent overfishing and promote sustainable practices. The system\'s data logging and analysis capabilities provide valuable insights for fisheries management and marine conservation efforts.'
    },
    {
      id: 'US20210987654A1',
      title: 'Smart Buoy Network for Ocean Data Collection',
      inventor: 'Emily R. Wave, Michael T. Current',
      assignee: 'MarineData Systems Ltd.',
      publicationDate: 'August 3, 2021',
      abstract: 'A network of interconnected smart buoys designed to collect and transmit real-time oceanographic data. Each buoy is equipped with various sensors to measure water temperature, salinity, pH levels, and marine life activity. The network utilizes advanced machine learning algorithms to process and analyze data on-site, reducing transmission loads and enabling rapid response to environmental changes. The buoys are powered by a combination of solar panels and wave energy converters, ensuring long-term autonomous operation. The system includes a centralized data hub for researchers and policymakers, facilitating informed decision-making on climate change, marine conservation, and sustainable resource management. Additionally, the buoys feature modular designs for easy sensor upgrades and maintenance, adapting to evolving research needs and technological advancements.'
    },
    {
      id: 'US11223344C1',
      title: 'Autonomous Underwater Vehicle for Deep Sea Exploration',
      inventor: 'Robert L. Depth, Sophia K. Abyss',
      assignee: 'DeepSea Robotics Corp.',
      publicationDate: 'September 22, 2021',
      abstract: 'An advanced autonomous underwater vehicle (AUV) designed for extended deep-sea exploration missions. The AUV features improved battery life, enhanced sensors for detailed seafloor mapping, and a robust communication system for real-time data transmission to surface vessels. The vehicle incorporates a revolutionary propulsion system that mimics the efficient movement of marine animals, significantly extending its operational range. Equipped with high-resolution cameras and a suite of scientific instruments, the AUV can conduct in-situ chemical analysis, collect biological samples, and perform environmental DNA sequencing. Its adaptive AI-driven navigation system allows for intelligent obstacle avoidance and optimal path planning in complex underwater terrains. The AUV also includes a docking station for automated battery recharging and data offloading, enabling truly long-term autonomous operations in the most challenging deep-sea environments.'
    }
  ];

  return (
    <div className="min-h-screen bg-white relative">
      <NavBar transparent={true} />
      <div className="absolute inset-x-0 bottom-0 h-[87%] bg-custom-bg-gray rounded-t-[40px] overflow-hidden shadow-[0_-8px_12px_-3px_rgba(0,0,0,0.07)] border-t border-l border-r ">
        <div className="absolute inset-0 shadow-[0_-15px_15px_-15px_rgba(0,0,0,0.3)]"></div>
        <div className="relative h-full overflow-y-auto scroll-smooth custom-scrollbar">
          <div className="max-w-[1500px] mx-auto pt-8 pb-8 px-4 sm:px-6 lg:px-8">
            <div className="space-y-16">
              {mockPatents.map((patent) => (
                <div
                  key={patent.id}
                  id={patent.id}
                  ref={(el) => {
                    cardRefs.current[patent.id] = el;
                    if (el && observerRef.current) observerRef.current.observe(el);
                  }}
                  style={{
                    opacity: visibleCards[patent.id] || 0,
                    filter: `blur(${(1 - (visibleCards[patent.id] || 0)) * 5}px)`,
                    transition: 'opacity 0.3s, filter 0.3s'
                  }}
                >
                  <SearchResultCard patent={patent} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultPage;
