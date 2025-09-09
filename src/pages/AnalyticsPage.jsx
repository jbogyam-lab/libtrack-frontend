import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  BookOpen,
  Calendar,
  CreditCard,
  TrendingUp,
  Users,
  Clock,
  BookX
} from 'lucide-react';
import { bookApi } from '../api/bookApi';
import { userApi } from '../api/userApi';
import { reservationApi } from '../api/reservationApi';
import { fineApi } from '../api/fineApi';
import DashboardLayout from '../layouts/DashboardLayout';
import Loader from '../components/Loader';

const AnalyticsPage = () => {
  const { data: books = [], isLoading: booksLoading } = useQuery({
    queryKey: ['books'],
    queryFn: bookApi.getAllBooks
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: userApi.getAllUsers
  });

  const { data: reservations = [], isLoading: reservationsLoading } = useQuery({
    queryKey: ['allReservations'],
    queryFn: reservationApi.getAllReservations
  });

  const { data: fines = [], isLoading: finesLoading } = useQuery({
    queryKey: ['allFines'],
    queryFn: fineApi.getAllFines
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (booksLoading || usersLoading || reservationsLoading || finesLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader size="large" />
        </div>
      </DashboardLayout>
    );
  }

  // Calculate analytics
  const totalBooks = books.reduce((sum, book) => sum + book.totalCopies, 0);
  const availableBooks = books.reduce((sum, book) => sum + book.availableCopies, 0);
  const borrowedBooks = totalBooks - availableBooks;
  const activeReservations = reservations.filter(r => r.status === 'BORROWED').length;
  const overdueBooks = reservations.filter(r => {
    return r.status === 'BORROWED' && new Date(r.dueDate) < new Date();
  }).length;
  const totalFines = fines.reduce((sum, fine) => sum + fine.amount, 0);
  const pendingFines = fines.filter(f => f.status === 'PENDING')
    .reduce((sum, fine) => sum + fine.amount, 0);

  const stats = [
    {
      title: 'Total Books',
      value: totalBooks,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Borrowings',
      value: activeReservations,
      icon: Calendar,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Registered Users',
      value: users.length,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Books Borrowed',
      value: borrowedBooks,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Overdue Books',
      value: overdueBooks,
      icon: BookX,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Total Fines',
      value: formatCurrency(totalFines),
      icon: CreditCard,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Overview of library statistics and metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional analytics sections can be added here */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Book Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Status Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-gray-600">Available Books</span>
                </div>
                <span className="font-semibold">{availableBooks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-orange-600 mr-2" />
                  <span className="text-gray-600">Borrowed Books</span>
                </div>
                <span className="font-semibold">{borrowedBooks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookX className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-gray-600">Overdue Books</span>
                </div>
                <span className="font-semibold">{overdueBooks}</span>
              </div>
            </div>
          </div>

          {/* Financial Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-emerald-600 mr-2" />
                  <span className="text-gray-600">Total Fines Collected</span>
                </div>
                <span className="font-semibold">{formatCurrency(totalFines)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-gray-600">Pending Fines</span>
                </div>
                <span className="font-semibold">{formatCurrency(pendingFines)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
