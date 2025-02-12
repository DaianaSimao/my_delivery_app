import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Importações corretas
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Produtos from './components/Produtos';

// Componente para proteger rotas
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Verifica se o token existe
  return token ? children : <Navigate to="/login" replace />; // Redireciona para o login se não houver token
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard userData={JSON.parse(localStorage.getItem('userData'))} />
              <Produtos />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} /> {/* Redireciona para o login por padrão */}
      </Routes>
    </Router>
  );
};

export default App;