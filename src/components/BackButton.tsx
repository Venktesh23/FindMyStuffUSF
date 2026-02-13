import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface BackButtonProps {
  className?: string;
  /** If set, navigates to this path instead of browser back */
  to?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ className = '', to }) => {
  const navigate = useNavigate();

  const content = (
    <>
      <ArrowLeft className="w-5 h-5 mr-2" />
      Back
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={`flex items-center text-usf-green hover:text-usf-green/80 transition-colors w-fit ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={`flex items-center text-usf-green hover:text-usf-green/80 transition-colors ${className}`}
    >
      {content}
    </button>
  );
};

export default BackButton;