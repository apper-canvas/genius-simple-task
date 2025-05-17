import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../App';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

const Home = () => {
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);
  
  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Don't render anything if not authenticated
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    setLoaded(true);
  }, []);

  // Get icon components
  const CheckIcon = getIcon('CheckCircle');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="fixed top-4 right-16 z-50 p-2 rounded-full bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-surface-100 transition-all hover:bg-surface-300 dark:hover:bg-surface-600"
        aria-label="Logout"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </button>
      <header className="container mx-auto px-4 py-6 md:py-8 lg:py-10">
        <motion.div 
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <CheckIcon className="text-primary h-8 w-8 md:h-10 md:w-10" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">SimpleTask</h1>
          </div>
          <p className="text-surface-600 dark:text-surface-400 text-lg md:text-xl max-w-2xl">
            A minimal, straightforward todo list for managing personal tasks
          </p>
        </motion.div>
      </header>

      <motion.main 
        className="container mx-auto px-4 py-6"
        variants={containerVariants}
        initial="hidden"
        animate={loaded ? "visible" : "hidden"}
      >
        <motion.div 
          variants={itemVariants}
          className="max-w-3xl mx-auto"
        >
          <MainFeature />
        </motion.div>
      </motion.main>

      <footer className="container mx-auto px-4 py-6 mt-8 text-center text-surface-500 dark:text-surface-400 text-sm">
        <p>© {new Date().getFullYear()} SimpleTask. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;