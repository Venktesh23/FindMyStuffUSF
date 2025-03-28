import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, GraduationCap, Building2 } from 'lucide-react';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-usf-green/10 to-white">
      {/* USF Header Banner */}
      <div className="bg-usf-green py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <GraduationCap className="h-8 w-8 text-usf-gold" />
          <p className="text-usf-gold text-sm">University of South Florida</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <GraduationCap className="h-24 w-24 text-usf-green" />
          </div>
          <h1 className="text-7xl font-bold text-usf-green mb-6">
            FindMyStuff
          </h1>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto mb-4">
            A Lost & Found Platform for USF Bulls
          </p>
          <p className="text-xl text-usf-green italic mb-12">
            Bulls Helping Bulls Find Their Lost Items
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-md mx-auto">
            <Link
              to="/login"
              className="w-full sm:w-48 px-8 py-4 text-xl font-semibold text-white bg-usf-green rounded-xl hover:bg-usf-green/90 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="w-full sm:w-48 px-8 py-4 text-xl font-semibold text-usf-green bg-white border-2 border-usf-green rounded-xl hover:bg-usf-green/5 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Sign Up
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-20">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="mb-4 bg-usf-green/5 p-4 rounded-lg">
              <Search className="w-16 h-16 text-usf-green mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Easy Search</h2>
              <p className="text-gray-600">
                Quickly search through all reported items across USF campus locations
              </p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="mb-4 bg-usf-green/5 p-4 rounded-lg">
              <MapPin className="w-16 h-16 text-usf-green mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Campus Coverage</h2>
              <p className="text-gray-600">
                Full coverage of USF Tampa campus including libraries, student centers, and academic buildings
              </p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="mb-4 bg-usf-green/5 p-4 rounded-lg">
              <Building2 className="w-16 h-16 text-usf-green mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Key Locations</h2>
              <p className="text-gray-600">
                Integrated with USF's main facilities including Marshall Center, Library, and The Hub
              </p>
            </div>
          </div>
        </div>

        {/* Community Spirit Section */}
        <div className="text-center mt-20 bg-usf-green/5 py-12 rounded-2xl">
          <h2 className="text-3xl font-bold text-usf-green mb-4">The Bulls Community Spirit</h2>
          <p className="text-xl text-gray-600">
            Together, we make USF a better place. Join fellow Bulls in helping each other reunite with their lost belongings.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-24 text-center border-t border-gray-200 pt-8">
          <GraduationCap className="h-12 w-12 text-usf-green mx-auto mb-4" />
          <p className="text-gray-600">© 2024 FindMyStuff - A service for the USF Bulls community</p>
          <p className="text-usf-green mt-2 font-medium">Go Bulls! 🤘</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;