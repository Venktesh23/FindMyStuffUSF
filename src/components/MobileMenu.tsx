import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'tween' }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl"
          >
            <div className="p-4">
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="px-4 py-2">
              <Link
                to="/home"
                className="block py-2 text-lg hover:text-usf-green transition-colors"
                onClick={onClose}
              >
                Home
              </Link>
              <Link
                to="/search"
                className="block py-2 text-lg hover:text-usf-green transition-colors"
                onClick={onClose}
              >
                Search
              </Link>
              <Link
                to="/report"
                className="block py-2 text-lg hover:text-usf-green transition-colors"
                onClick={onClose}
              >
                Report Item
              </Link>
              <Link
                to="/profile"
                className="block py-2 text-lg hover:text-usf-green transition-colors"
                onClick={onClose}
              >
                Profile
              </Link>
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;