import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import Typed from 'typed.js';

// Add this import at the top of your file
import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [gradientVisible, setGradientVisible] = useState(false);
  const el = useRef<HTMLSpanElement>(null);
  const typed = useRef<Typed | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && el.current) {
      typed.current = new Typed(el.current, {
        strings: ['Prior Art Search'],
        typeSpeed: 100,
        backSpeed: 30,
        loop: false,
        showCursor: true,
        cursorChar: '|'
      });

      const timer = setTimeout(() => {
        setGradientVisible(true);
      }, 100);

      return () => {
        if (typed.current) {
          typed.current.destroy();
        }
        clearTimeout(timer);
      };
    }
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      <div 
        className={`absolute inset-0 bg-gradient-to-tl from-purple-900/50 to-transparent transition-opacity duration-1000 ease-in-out ${gradientVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ zIndex: 1 }}
      ></div>
      <div className="flex-grow flex flex-col items-center justify-center p-4 text-center relative" style={{ zIndex: 2 }}>
        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Revolutionize Your
          <br />
          <span className="text-5xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            <span ref={el}></span>
          </span>
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Type in your natural language patent query and watch as our AI driven solution uncovers prior art at lightning speed and unparalleled accuracy.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <button 
            onClick={() => navigate('/search')}
            className="bg-white text-black hover:bg-gray-200 text-lg px-7 py-5 rounded-full transition-transform hover:scale-105"
            style={{ zIndex: 3 }}
          >
            Begin Search
          </button>
        </motion.div>

        <motion.p 
          className="text-gray-500 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          Empowering lawyers with cutting-edge technology
        </motion.p>
      </div>
    </div>
  );
};

export default HomePage;