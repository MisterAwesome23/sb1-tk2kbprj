import React, { useState } from 'react';
import { Menu, X, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ProfileMenu } from '../ProfileMenu';
import { NotificationBadge } from '../NotificationBadge';
import { ROUTES } from '../../lib/constants';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">HireFusion</span>
            </Link>
            <div className="hidden ml-10 space-x-8 lg:block">
              <Link to="/jobs" className="text-base font-medium text-gray-700 hover:text-indigo-600">
                Find Jobs
              </Link>
              <Link to="/employers" className="text-base font-medium text-gray-700 hover:text-indigo-600">
                For Employers
              </Link>
              <Link to="/employees" className="text-base font-medium text-gray-700 hover:text-indigo-600">
                For Employees
              </Link>
              <Link to="/games" className="text-base font-medium text-gray-700 hover:text-indigo-600">
                Games
              </Link>
              <Link to="/about" className="text-base font-medium text-gray-700 hover:text-indigo-600">
                About
              </Link>
            </div>
          </div>
          <div className="ml-10 space-x-4 flex items-center">
            {user && <NotificationBadge />}
            
            {user ? (
              <ProfileMenu />
            ) : (
              <Link to="/login" className="inline-block bg-indigo-600 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-indigo-700">
                Sign in
              </Link>
            )}
          </div>
          <div className="lg:hidden">
            <button
              type="button"
              className="bg-white p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link to="/jobs" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600">
                Find Jobs
              </Link>
              <Link to="/employers" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600">
                For Employers
              </Link>
              <Link to="/employees" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600">
                For Employees
              </Link>
              <Link to="/games" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600">
                Games
              </Link>
              <Link to="/about" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600">
                About
              </Link>
              {user && (
                <Link to="/notifications" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600">
                  Notifications
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}