import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Menu } from 'lucide-react';
import NotificationBell from './NotificationBell';
import MobileMenu from './MobileMenu';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-usf-green text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-3">
            <motion.span 
              className="text-2xl font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              FindMyStuff
            </motion.span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link 
              to="/home" 
              className="text-white hover:text-usf-gold transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/search" 
              className="text-white hover:text-usf-gold transition-colors"
            >
              Search
            </Link>
            <Link 
              to="/report" 
              className="text-white hover:text-usf-gold transition-colors"
            >
              Report Item
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <NotificationBell />
            <Link 
              to="/profile" 
              className="p-2 rounded-full hover:bg-usf-green/80 transition-colors"
            >
              <User className="w-6 h-6" />
            </Link>
            <button 
              className="md:hidden p-2 rounded-full hover:bg-usf-green/80 transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;