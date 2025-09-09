import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreditCard,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { fineApi } from '../api/fineApi';
import { authApi } from '../api/authApi';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/Button';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const FinesPage = () => {
  const queryClient = useQueryClient();
  
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.getCurrentUser
  });

  const { data: fines = [], isLoading } = useQuery({
    queryKey: ['fines', currentUser?.id],
    queryFn: () => fineApi.getFines(currentUser.id),
    enabled: !!currentUser?.id
  });

  const payFineMutation = useMutation({
    mutationFn: fineApi.payFine,
    onSuccess: () => {
      queryClient.invalidateQueries(['fines']);
      toast.success('Fine paid successfully!');
    }
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const totalFines = fines.reduce((sum, fine) => sum + fine.amount, 0);
  const pendingFines = fines.filter(fine => fine.status === 'PENDING');
  const paidFines = fines.filter(fine => fine.status === 'PAID');

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
          <h1 className="text-2xl font-bold text-gray-900">Fines & Payments</h1>
          <p className="text-gray-600">Manage your library fines and payments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Fines</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalFines)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-gray-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(pendingFines.reduce((sum, fine) => sum + fine.amount, 0))}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(paidFines.reduce((sum, fine) => sum + fine.amount, 0))}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Pending Fines */}
        {pendingFines.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                Pending Fines
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {pendingFines.map((fine) => (
                <div key={fine.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {formatCurrency(fine.amount)}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pending
                        </span>
                      </div>
                      
                      {fine.reservation?.book && (
                        <p className="text-gray-600 mb-2">
                          Book: {fine.reservation.book.title}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Calculated: {formatDate(fine.calculatedOn)}
                        </div>
                      </div>
                    </div>

                    <div className="ml-6">
                      <Button
                        onClick={() => payFineMutation.mutate(fine.id)}
                        disabled={payFineMutation.isLoading}
                        variant="success"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay Fine
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Fines History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Fine History</h2>
          </div>

          {fines.length === 0 ? (
            <div className="p-8 text-center">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No fines found</p>
              <p className="text-sm text-gray-400 mt-1">
                You're all caught up with your library obligations!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {fines.map((fine) => (
                <div key={fine.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {formatCurrency(fine.amount)}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          fine.status === 'PAID' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {fine.status === 'PAID' ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {fine.status}
                        </span>
                      </div>
                      
                      {fine.reservation?.book && (
                        <p className="text-gray-600 mb-2">
                          Book: {fine.reservation.book.title}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Calculated: {formatDate(fine.calculatedOn)}
                        </div>
                        {fine.paidOn && (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Paid: {formatDate(fine.paidOn)}
                          </div>
                        )}
                      </div>
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

export default FinesPage;