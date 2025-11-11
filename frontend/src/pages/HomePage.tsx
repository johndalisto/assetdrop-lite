import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Submit Your Assets with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                Confidence
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Professional asset submission platform for musicians, speakers, and film presenters. 
              Streamlined, secure, and built for creators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/submit" 
                className="bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <i className="fas fa-upload mr-2"></i>
                Submit Your Assets
              </Link>
              <Link 
                to="/signup" 
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-primary-700 transition-all duration-300"
              >
                <i className="fas fa-user-plus mr-2"></i>
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Simple, organized asset submission in three steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user-tag text-primary-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Select Your Role</h3>
              <p className="text-gray-600">Choose from Musician, Speaker, or Film Presenter</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-upload text-primary-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Upload Assets</h3>
              <p className="text-gray-600">Submit your bio, photos, and media files</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check-circle text-primary-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Submit & Track</h3>
              <p className="text-gray-600">Review and submit your materials for approval</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
