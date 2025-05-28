import React from 'react';
import { Route, Navigate, Routes } from 'react-router-dom';  // Asegúrate de importar Routes
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ element, ...rest }) => {
  const { isAuthenticated } = useAuth();  // Obtén el estado de autenticación desde el contexto

  return (
    <Routes>
      <Route
        {...rest}
        element={isAuthenticated ? element : <Navigate to="/login" />}  // Usa Navigate para redirigir
      />
    </Routes>
  );
};

export default ProtectedRoute;
