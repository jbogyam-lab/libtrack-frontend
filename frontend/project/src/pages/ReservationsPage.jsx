import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Calendar,
  Clock,
  CheckCircle,
  BookOpen,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { reservationApi } from '../api/reservationApi';
import { authApi } from '../api/authApi';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/Button';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const ReservationsPage = () => {
  const queryClient = useQueryClient();
  
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.getCurrentUser
  });

  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ['reservations', currentUser?.id],
    queryFn: () => reservationApi.getUserReservations(currentUser.id),
    enabled: !!currentUser?.id
  });

  const borrowMutation = useMutation({
    mutationFn: reservationApi.borrow,
    onSuccess: () => {
      queryClient.invalidateQueries(['reservations']);
      toast.success('Book borrowed successfully!');
    }
  });

  const returnMutation = useMutation({
    mutationFn: reservationApi.return,
    onSuccess: () => {
      queryClient.invalidateQueries(['reservations']);
      toast.success('Book returned successfully!');
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'RESERVED':
        return 'bg-blue-100 text-blue-800';
      case 'BORROWED':
        return 'bg-orange-100 text-orange-800';
      case 'RETURNED':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'RESERVED':
        return <Calendar className="h-4 w-4" />;
      case 'BORROWED':
        return <Clock className="h-4 w-4" />;
      case 'RETURNED':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader size="large" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Reservations</h1>
          <p className="text-gray-600">Manage your book reservations and returns</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reserved</p>
                <p className="text-2xl font-bold text-blue-600">
                  {reservations.filter(r => r.status === 'RESERVED').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Borrowed</p>
                <p className="text-2xl font-bold text-orange-600">
                  {reservations.filter(r => r.status === 'BORROWED').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Returned</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {reservations.filter(r => r.status === 'RETURNED').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Reservations List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Reservations</h2>
          </div>

          {reservations.length === 0 ? (
            <div className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No reservations found</p>
              <p className="text-sm text-gray-400 mt-1">
                Visit the Books page to reserve your first book
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {reservation.book?.title}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                          {getStatusIcon(reservation.status)}
                          <span className="ml-1 capitalize">{reservation.status.toLowerCase()}</span>
                        </span>
                        {reservation.status === 'BORROWED' && reservation.dueDate && isOverdue(reservation.dueDate) && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Overdue
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mt-1">by {reservation.book?.author}</p>
                      
                      <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Reserved:</span> {formatDate(reservation.borrowDate)}
                        </div>
                        {reservation.dueDate && (
                          <div>
                            <span className="font-medium">Due:</span> {formatDate(reservation.dueDate)}
                          </div>
                        )}
                        {reservation.returnDate && (
                          <div>
                            <span className="font-medium">Returned:</span> {formatDate(reservation.returnDate)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {reservation.status === 'RESERVED' && (
                        <Button
                          onClick={() => borrowMutation.mutate(reservation.id)}
                          disabled={borrowMutation.isLoading}
                          size="small"
                        >
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Borrow
                        </Button>
                      )}
                      
                      {reservation.status === 'BORROWED' && (
                        <Button
                          variant="success"
                          onClick={() => returnMutation.mutate(reservation.id)}
                          disabled={returnMutation.isLoading}
                          size="small"
                        >
                          <ArrowLeft className="h-4 w-4 mr-1" />
                          Return
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReservationsPage;