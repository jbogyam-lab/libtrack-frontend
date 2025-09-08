import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">LibTrack</span>
          </Link>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gray-100 rounded-full">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">{user?.email}</p>
                  <p className="text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="small"
                onClick={logout}
                className="ml-2"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;