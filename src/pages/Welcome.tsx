import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Building2, Lock } from 'lucide-react';

const Welcome = () => {
  // UI-3: Atmospheric background - gradient + glow + subtle grain texture
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 via-usf-green-soft/30 to-gray-100 overflow-hidden">
      {/* UI-3: Subtle noise grain overlay for premium texture */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          opacity: 0.03,
          mixBlendMode: 'overlay'
        }} 
      />
      {/* UI-3: Atmospheric glow - 1200px wide, 120px blur, 6% opacity, centered behind hero */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-usf-green-glow rounded-full pointer-events-none" 
        style={{ 
          filter: 'blur(120px)', 
          opacity: 0.06,
          top: '180px'
        }} 
      />
      {/* UI-3 done - Atmospheric background: gradient + soft glow + subtle grain texture */}
      
      {/* UI-7: Navbar - reduced height, strengthened border, precise alignment with hero */}
      <nav className="relative z-10 w-full px-6 py-3 border-b animate-fade-in" style={{ borderColor: '#d1d5db', borderBottomWidth: '1.5px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Search className="h-7 w-7 text-usf-green" />
            <span className="text-xl font-bold">
              <span style={{ color: '#006747' }}>Find</span>
              <span className="text-gray-900">MyStuff</span>
            </span>
          </div>
        </div>
      </nav>
      {/* UI-7 done - Navbar refined: py-3, 1.5px border, max-w-7xl matches hero container */}

      {/* UX-1: Reduced top padding by 10-15% on desktop for less dead space */}
      <div className="relative z-10 flex items-center justify-center px-4 py-9 sm:py-14">
        <div className="max-w-7xl w-full">
          {/* UI-6: Hero Section - subtle depth separation with fade gradient and soft divider */}
          <div className="relative text-center mb-12 sm:mb-16 animate-fade-in-up pb-10" style={{ 
            background: 'linear-gradient(180deg, transparent 0%, transparent 82%, rgba(229, 231, 235, 0.2) 98%, rgba(209, 213, 219, 0.15) 100%)'
          }}>
            {/* UI-1: Title - weight 800, tracking -0.02em, two-tone branding */}
            <h1 
              className="text-[42px] sm:text-[56px] lg:text-[64px] mb-3 mt-8 animate-fade-in-up leading-tight font-heading" 
              style={{ 
                animationDelay: '100ms', 
                fontWeight: 800, 
                letterSpacing: '-0.02em'
              }}
            >
              <span style={{ color: '#006747' }}>Find</span>
              <span style={{ color: '#111827' }}>MyStuff</span>
            </h1>
            {/* UI-1: Subtitle - weight 500, opacity 92%, tracking 0.02em, max-width 540px centered */}
            <div className="max-w-[540px] mx-auto">
              <p 
                className="text-[20px] sm:text-[22px] lg:text-[24px] mb-2 animate-fade-in-up font-sans" 
                style={{ 
                  animationDelay: '200ms', 
                  fontWeight: 500,
                  letterSpacing: '0.02em', 
                  color: '#4b5563', 
                  opacity: 0.92 
                }}
              >
                A Lost & Found Platform for USF Bulls
              </p>
              {/* UI-1 & UI-8: Green tagline - NO ITALIC, weight 500, opacity 88%, tracking 0.01em */}
              <p 
                className="text-[16px] sm:text-[17px] lg:text-[18px] mb-8 animate-fade-in-up font-sans" 
                style={{ 
                  animationDelay: '300ms', 
                  fontWeight: 500,
                  opacity: 0.88, 
                  fontStyle: 'normal',
                  letterSpacing: '0.01em',
                  color: '#006747'
                }}
              >
                Bulls Helping Bulls Find Their Lost Items
              </p>
            {/* UI-8 done - Spacing aligned to 8px scale: Icon→Title:16px, Title→Sub:12px, Sub→Tag:8px, Tag→CTA:32px */}
            
            {/* Mobile vertical gap for tap safety */}
            <div className="flex flex-col items-center justify-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-4 max-w-md mx-auto mb-3 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                {/* UI-4: Primary button - subtle gradient, layered shadows, premium interactions */}
                <Link
                  to="/login"
                  className="group w-full sm:w-48 px-10 py-3.5 text-base font-semibold text-white transform hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-usf-green focus:ring-offset-2"
                  style={{ 
                    borderRadius: '14px',
                    background: 'linear-gradient(180deg, #007850 0%, #006747 100%)',
                    border: '1px solid rgba(0, 90, 60, 0.4)',
                    boxShadow: '0 2px 8px rgba(0, 103, 71, 0.15), 0 8px 24px rgba(0, 103, 71, 0.12)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 103, 71, 0.2), 0 12px 32px rgba(0, 103, 71, 0.18)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 103, 71, 0.15), 0 8px 24px rgba(0, 103, 71, 0.12)';
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
                    e.currentTarget.style.boxShadow = '0 1px 4px rgba(0, 103, 71, 0.2), 0 4px 12px rgba(0, 103, 71, 0.15)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 103, 71, 0.2), 0 12px 32px rgba(0, 103, 71, 0.18)';
                  }}
                >
                  Sign In
                </Link>
                {/* UI-4: Secondary button - subtle tint, soft border, layered shadows, same height */}
                <Link
                  to="/signup"
                  className="group w-full sm:w-44 px-8 py-3.5 text-base font-semibold transform hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-usf-green focus:ring-offset-2"
                  style={{ 
                    borderRadius: '14px',
                    backgroundColor: 'rgba(230, 242, 238, 0.4)',
                    border: '1.5px solid rgba(0, 103, 71, 0.25)',
                    color: '#006747',
                    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03), 0 4px 12px rgba(0, 0, 0, 0.04)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1)';
                    e.currentTarget.style.backgroundColor = 'rgba(230, 242, 238, 0.7)';
                    e.currentTarget.style.borderColor = 'rgba(0, 103, 71, 0.4)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06), 0 8px 20px rgba(0, 0, 0, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.backgroundColor = 'rgba(230, 242, 238, 0.4)';
                    e.currentTarget.style.borderColor = 'rgba(0, 103, 71, 0.25)';
                    e.currentTarget.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.03), 0 4px 12px rgba(0, 0, 0, 0.04)';
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.04), 0 2px 6px rgba(0, 0, 0, 0.06)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06), 0 8px 20px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  Sign Up
                </Link>
              </div>
              {/* UI-4 done - Both buttons: 14px radius, layered shadows, premium interactions, same height */}
              </div>
              {/* UI-5 done - 15px radius, diffused two-layer shadows, tinted bg, same height */}
              {/* UX-4: Trust microcopy with lock icon security cue */}
              <div className="flex items-center justify-center gap-1.5 text-sm text-gray-500 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                <Lock className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
                <p>Secure login. USF students only.</p>
              </div>
              {/* UX-6 done - Mobile: gap-5 (20px), full-width buttons, trust stays close */}
            </div>
          </div>
          {/* UI-6 done - Depth layering: gradient fade + subtle brightness shift between hero and cards */}

          {/* UI-5: Premium cards - 22px radius, layered shadows, soft border, gradient icons */}
          <div className="grid md:grid-cols-3 gap-12 lg:gap-14 max-w-6xl mx-auto">
            {[
              {
                icon: Search,
                title: 'Easy Search',
                description: 'Quickly search through all reported items across USF campus locations',
                delay: '500ms'
              },
              {
                icon: MapPin,
                title: 'Campus Coverage',
                description: 'Full coverage of USF Tampa campus including libraries, student centers, and academic buildings',
                delay: '600ms'
              },
              {
                icon: Building2,
                title: 'Key Locations',
                description: 'Integrated with USF\'s main facilities including Marshall Center, Library, and The Hub',
                delay: '700ms'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-7 border transform hover:-translate-y-1.5 transition-all duration-300 animate-fade-in-up h-full"
                style={{ 
                  animationDelay: feature.delay,
                  borderRadius: '22px',
                  borderColor: '#e8eae9',
                  borderWidth: '1px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03), 0 8px 24px rgba(0, 0, 0, 0.04)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.05), 0 16px 48px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(0, 103, 71, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.03), 0 8px 24px rgba(0, 0, 0, 0.04)';
                  e.currentTarget.style.borderColor = '#e8eae9';
                }}
              >
                <div className="flex flex-col items-center text-center">
                  {/* UI-5: Icon circle - radial gradient with inner highlight, 10% green tint */}
                  <div 
                    className="mb-5 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 relative overflow-hidden" 
                    style={{ 
                      background: 'radial-gradient(circle at 35% 28%, rgba(0, 103, 71, 0.13) 0%, rgba(0, 103, 71, 0.10) 55%, rgba(0, 103, 71, 0.08) 100%)'
                    }}
                  >
                    {/* Inner subtle highlight */}
                    <div 
                      className="absolute top-2 left-2 w-8 h-8 rounded-full" 
                      style={{ 
                        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%)',
                        filter: 'blur(4px)'
                      }} 
                    />
                    <feature.icon className="w-10 h-10 text-usf-green relative z-10" />
                  </div>
                  {/* UI-5: Typography refined - title weight 700, body #4b5563 */}
                  <h2 className="text-xl mb-3 font-heading" style={{ fontWeight: 700, color: '#111827' }}>
                    {feature.title}
                  </h2>
                  <p className="text-sm leading-relaxed font-sans" style={{ color: '#4b5563', lineHeight: '1.6' }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* UI-5 done - 22px radius, layered diffused shadows, soft border, gradient icons with highlight */}
        </div>
      </div>

      {/* UI-6: Subtle entrance animations - hero fades/slides, CTA follows, cards stagger */}
      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up,
          .animate-fade-in {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
        /* UI-9 done - Clean load sequence: navbar→icon→title→CTAs→trust→cards (50-100ms stagger), respects reduced motion */
      `}} />
    </div>
  );
};

export default Welcome;