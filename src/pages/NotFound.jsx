import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const NotFound = () => {
  // Get icon components
  const AlertCircleIcon = getIcon('AlertCircle');
  const HomeIcon = getIcon('Home');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div 
        className="text-center max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-center mb-6">
          <AlertCircleIcon className="w-24 h-24 text-accent" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page Not Found</h2>
        
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/" className="btn inline-flex items-center bg-primary text-white px-6 py-3 rounded-xl shadow-lg hover:bg-primary-dark transition-colors">
          <HomeIcon className="mr-2 h-5 w-5" />
          Return Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;