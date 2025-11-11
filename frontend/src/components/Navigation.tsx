import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { NotificationSystem } from './NotificationSystem';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-primary-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <i className="fas fa-cloud-upload-alt text-2xl mr-2"></i>
              <span className="text-xl font-bold">AssetDrop Lite</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link 
                to="/submit" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/submit') ? 'bg-primary-900' : 'hover:bg-primary-600'
                }`}
              >
                Submit Assets
              </Link>
              <Link 
                to="/dashboard" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/dashboard') ? 'bg-primary-900' : 'hover:bg-primary-600'
                }`}
              >
                Dashboard
              </Link>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-primary-100">
                    Welcome, {user.name}
                  </span>
                  <NotificationSystem />
                  <button
                    onClick={logout}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-600"
                  >
                    <i className="fas fa-sign-out-alt mr-1"></i>
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link 
                    to="/signup" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/signup') ? 'bg-primary-900' : 'hover:bg-primary-600'
                    }`}
                  >
                    <i className="fas fa-user-plus mr-1"></i>
                    Sign Up
                  </Link>
                  <Link 
                    to="/login" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/login') ? 'bg-primary-900' : 'hover:bg-primary-600'
                    }`}
                  >
                    <i className="fas fa-sign-in-alt mr-1"></i>
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};