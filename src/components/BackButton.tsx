import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ className = '' }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center text-usf-green hover:text-usf-green/80 transition-colors ${className}`}
    >
      <ArrowLeft className="w-5 h-5 mr-2" />
      Back
    </button>
  );
};

export default BackButton;