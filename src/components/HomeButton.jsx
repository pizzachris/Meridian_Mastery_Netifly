import React from 'react';
import TriskelionLogo from './TriskelionLogo';

const HomeButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center px-4 py-2 mb-4 bg-dark border-2 border-gold text-gold font-bold rounded-lg shadow hover:bg-gold hover:text-deepred transition"
    aria-label="Go to Home"
  >
    <TriskelionLogo size={24} className="mr-2" />
    Home
  </button>
);

export default HomeButton; 