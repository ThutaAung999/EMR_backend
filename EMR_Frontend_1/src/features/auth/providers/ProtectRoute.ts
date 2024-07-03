import React, { useContext, ComponentType } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthContext'; // Adjust the import path as necessary

interface ProtectedRouteProps {
  component: ComponentType<any>;
  path: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { auth } = authContext;

  return (
    <Route
      path={rest.path}
      element={auth.isAuthenticated ? <Component /> : <Navigate to="/login" />}
    />
  );
};

export default ProtectedRoute;
