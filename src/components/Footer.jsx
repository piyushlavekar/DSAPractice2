import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800/80 backdrop-blur-sm border-t border-gray-700 text-center py-4 px-4 flex-shrink-0">
      <p className="text-gray-400 text-sm">
        Made with ❤️ by <a 
          href="https://github.com/piyushlavekar" // --- ITHE TUMCHI GITHUB LINK TAKA ---
          target="_blank" 
          rel="noopener noreferrer" 
          className="font-semibold text-cyan-400 hover:underline"
        >
          Piyush
        </a>.
      </p>
      <p className="text-gray-500 text-xs mt-1">
        &copy; {currentYear} DSA Tracker. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer