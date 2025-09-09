import { useEffect, useState } from "react";
import { FiDollarSign, FiClock, FiAlertCircle, FiCheckCircle, FiCreditCard } from 'react-icons/fi';

const FinesPage = () => {
  const [fines, setFines] = useState([
    {
      id: 1,
      amount: 150,
      status: "UNPAID",
      dueDate: "2025-09-20",
      book: "The Great Gatsby",
      daysOverdue: 5,
      reason: "Late Return"
    },
    {
      id: 2,
      amount: 75,
      status: "PAID",
      dueDate: "2025-09-01",
      book: "1984",
      daysOverdue: 3,
      reason: "Late Return",
      paidDate: "2025-09-03"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalUnpaidFines = fines
    .filter(fine => fine.status === "UNPAID")
    .reduce((total, fine) => total + fine.amount, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Fines & Payments
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your library fines and payments
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Unpaid Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <FiDollarSign className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            ₹{totalUnpaidFines}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Total Unpaid Fines
          </p>
        </div>

        {/* Active Fines Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <FiAlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {fines.filter(f => f.status === "UNPAID").length}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Active Fines
          </p>
        </div>

        {/* Paid Fines Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {fines.filter(f => f.status === "PAID").length}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Cleared Fines
          </p>
        </div>
      </div>

      {/* Fines List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Fine Details
          </h2>
        </div>

        {loading && (
          <div className="p-6 text-center text-gray-600 dark:text-gray-400">
            Loading fines...
          </div>
        )}

        {error && (
          <div className="p-6 text-center text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {!loading && fines.length === 0 && (
          <div className="p-6 text-center text-gray-600 dark:text-gray-400">
            No fines found.
          </div>
        )}

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {fines.map((fine) => (
            <div
              key={fine.id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <FiClock className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {fine.book}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {fine.reason} - {fine.daysOverdue} days overdue
                      </p>
                      <div className="mt-2 flex items-center gap-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Due: {new Date(fine.dueDate).toLocaleDateString()}
                        </span>
                        {fine.status === "PAID" && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Paid: {new Date(fine.paidDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      ₹{fine.amount}
                    </span>
                    <div className={`mt-1 text-sm font-medium ${
                      fine.status === "PAID"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}>
                      {fine.status}
                    </div>
                  </div>
                  {fine.status === "UNPAID" && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      <FiCreditCard className="w-4 h-4" />
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinesPage;
