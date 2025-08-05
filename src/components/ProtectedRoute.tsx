import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();

  if (location.state?.fromSelectMode !== true) {
    // If the user didn't come from the select mode screen, redirect them.
    return <Navigate to="/select-mode" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
