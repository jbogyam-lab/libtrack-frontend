import React from 'react';
import { BookOpen } from 'lucide-react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">LibTrack</h1>
          <p className="text-gray-600 mt-2">Library Management System</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;