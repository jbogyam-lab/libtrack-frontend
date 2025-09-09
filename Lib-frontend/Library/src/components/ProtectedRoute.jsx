import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const userRole = localStorage.getItem('role');
  const isAuthenticated = localStorage.getItem('token');

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to a default route if user doesn't have permission
    const defaultRoutes = {
      admin: '/users',
      librarian: '/books',
      member: '/books'
    };
    return <Navigate to={defaultRoutes[userRole] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
