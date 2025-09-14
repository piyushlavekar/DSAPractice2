import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    // --- NEW: Updated background and border to match the new theme ---
    <footer className="bg-slate-900/80 backdrop-blur-sm border-t border-slate-800 text-center py-4 px-4 flex-shrink-0">
      <p className="text-slate-400 text-sm">
        Made with ❤️ by <a 
          href="https://github.com/piyushlavekar"
          target="_blank" 
          rel="noopener noreferrer" 
          className="font-semibold text-cyan-400 hover:underline"
        >
          Piyush
        </a>.
      </p>
      <p className="text-slate-500 text-xs mt-1">
        &copy; {currentYear} DSA Tracker. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;