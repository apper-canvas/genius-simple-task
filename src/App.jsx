import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { getIcon } from './utils/iconUtils';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check for user preference in localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Update document class for dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Get the appropriate icon component
  const DarkModeIcon = getIcon(darkMode ? 'Sun' : 'Moon');

  return (
    <div className="min-h-screen">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-surface-100 transition-all hover:bg-surface-300 dark:hover:bg-surface-600"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        <DarkModeIcon size={20} />
      </button>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        toastClassName="rounded-xl font-sans text-sm"
      />
    </div>
  );
}

export default App;