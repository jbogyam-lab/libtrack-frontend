import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { DarkModeProvider } from './context/DarkModeContext';
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BooksPage from "./pages/BooksPage";
import UsersPage from "./pages/UsersPage";
import ReservationsPage from "./pages/ReservationsPage";
import FinesPage from "./pages/FinesPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// AuthWrapper component to handle authentication state
const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    // If user is authenticated and trying to access public routes, redirect to appropriate dashboard
    if (isAuthenticated && ["/", "/login", "/register"].includes(location.pathname)) {
      const roleDefaultRoutes = {
        admin: "/dashboard/users",
        librarian: "/dashboard/books",
        member: "/dashboard/books"
      };
      navigate(roleDefaultRoutes[userRole] || "/dashboard", { replace: true });
    }

    // If user is not authenticated and trying to access protected routes, redirect to login
    if (!isAuthenticated && location.pathname.startsWith("/dashboard")) {
      navigate("/login", { 
        replace: true,
        state: { from: location.pathname }  // Save the attempted route
      });
    }
  }, [isAuthenticated, location, navigate, userRole]);

  return children;
};

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <AuthWrapper>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Admin Routes */}
              <Route
                path="users"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Admin and Librarian Routes */}
              <Route
                path="books"
                element={
                  <ProtectedRoute allowedRoles={["admin", "librarian", "member"]}>
                    <BooksPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="reservations"
                element={
                  <ProtectedRoute allowedRoles={["admin", "librarian"]}>
                    <ReservationsPage />
                  </ProtectedRoute>
                }
              />

              {/* Member Routes */}
              <Route
                path="fines"
                element={
                  <ProtectedRoute allowedRoles={["member"]}>
                    <FinesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="payment-success"
                element={
                  <ProtectedRoute allowedRoles={["member"]}>
                    <PaymentSuccess />
                  </ProtectedRoute>
                }
              />
              <Route
                path="payment-cancel"
                element={
                  <ProtectedRoute allowedRoles={["member"]}>
                    <PaymentCancel />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthWrapper>
      </Router>
    </DarkModeProvider>
  );
}

export default App;
