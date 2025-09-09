import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Calendar,
  CreditCard,
  BarChart3,
  Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { hasRole } = useAuth();

  const menuItems = [
    {
      label: 'Books',
      path: '/books',
      icon: BookOpen,
      roles: ['STUDENT', 'LIBRARIAN', 'GLOBAL_ADMIN']
    },
    {
      label: 'Reservations',
      path: '/reservations',
      icon: Calendar,
      roles: ['STUDENT', 'LIBRARIAN', 'GLOBAL_ADMIN']
    },
    {
      label: 'Fines',
      path: '/fines',
      icon: CreditCard,
      roles: ['STUDENT', 'LIBRARIAN', 'GLOBAL_ADMIN']
    },
    {
      label: 'Users',
      path: '/users',
      icon: Users,
      roles: ['LIBRARIAN', 'GLOBAL_ADMIN']
    },
    {
      label: 'Analytics',
      path: '/analytics',
      icon: BarChart3,
      roles: ['LIBRARIAN', 'GLOBAL_ADMIN']
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: Settings,
      roles: ['GLOBAL_ADMIN']
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-white border-r border-gray-200 w-64 min-h-screen">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const hasAccess = item.roles.some(role => hasRole(role));
            if (!hasAccess) return null;

            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`h-5 w-5 mr-3 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;