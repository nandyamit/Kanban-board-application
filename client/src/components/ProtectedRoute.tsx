// client/src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import Auth from '../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Check if user is logged in
  const isLoggedIn = Auth.loggedIn();

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Render children if logged in
  return <>{children}</>;
};

export default ProtectedRoute;