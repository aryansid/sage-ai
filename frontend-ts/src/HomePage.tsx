import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useNavigate, Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
      <motion.h1 
        className="text-4xl md:text-6xl font-bold text-white mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Revolutionize Your
        <br />
        <span className="text-5xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Prior Art Search
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
        <Link to="/signup">
          <button
            className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6 rounded-full transition-transform hover:scale-105"
          >
            Start Your Search
          </button>
        </Link>
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
  );
};

export default HomePage;