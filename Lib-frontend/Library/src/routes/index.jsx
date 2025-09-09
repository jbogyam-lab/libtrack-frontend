import { Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import BooksPage from '../pages/BooksPage';
import UsersPage from '../pages/UsersPage';
import ReservationsPage from '../pages/ReservationsPage';
import FinesPage from '../pages/FinesPage';
import PaymentSuccess from '../pages/PaymentSuccess';
import PaymentCancel from '../pages/PaymentCancel';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

// Route configurations based on user roles
const roleBasedRoutes = {
  admin: [
    { path: 'books', element: <BooksPage /> },
    { path: 'users', element: <UsersPage /> },
    { path: 'reservations', element: <ReservationsPage /> },
  ],
  librarian: [
    { path: 'books', element: <BooksPage /> },
    { path: 'reservations', element: <ReservationsPage /> },
  ],
  member: [
    { path: 'books', element: <BooksPage /> },
    { path: 'fines', element: <FinesPage /> },
    { path: 'payment-success', element: <PaymentSuccess /> },
    { path: 'payment-cancel', element: <PaymentCancel /> },
  ],
};

// Public routes accessible without authentication
export const publicRoutes = [
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
];

// Get protected routes based on user role
export const getProtectedRoutes = (role) => {
  const routes = roleBasedRoutes[role] || [];
  return [
    {
      element: <DashboardLayout />,
      children: [
        ...routes,
        // Redirect to default page based on role
        {
          path: '*',
          element: <Navigate to={routes[0]?.path || '/'} replace />,
        },
      ],
    },
  ];
};

// Default redirect for unknown roles or unauthenticated users
export const defaultRedirect = {
  path: '*',
  element: <Navigate to="/" replace />,
};
