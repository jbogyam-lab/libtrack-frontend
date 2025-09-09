import React from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiUsers, FiClock, FiShield } from 'react-icons/fi';
import Button from '../components/Button';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to <span className="text-indigo-600 dark:text-indigo-400">LibTrack</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Your modern solution for library management. Simple, efficient, and powerful.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button variant="primary" size="large">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="large">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<FiBook />}
            title="Book Management"
            description="Easily manage your library's collection with our intuitive interface"
          />
          <FeatureCard
            icon={<FiUsers />}
            title="User Management"
            description="Keep track of members, their borrowings, and preferences"
          />
          <FeatureCard
            icon={<FiClock />}
            title="Reservations"
            description="Efficient reservation system for better resource allocation"
          />
          <FeatureCard
            icon={<FiShield />}
            title="Secure Access"
            description="Role-based access control for different user types"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          © 2025 LibTrack. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700/50">
    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-2xl mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300">
      {description}
    </p>
  </div>
);

export default LandingPage;
