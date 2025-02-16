import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Produtos from './components/Produtos';
import Navbar from './components/Navbar';
import { ThemeProvider } from './context/ThemeContext';
// Componente para proteger rotas
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Verifica se o token existe
  return token ? children : <Navigate to="/login" replace />; // Redireciona para o login se não houver token
};

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Navbar /> {/* Navbar é renderizado fora das rotas para aparecer em todas as páginas */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard userData={JSON.parse(localStorage.getItem('userData'))} />
              </ProtectedRoute>
            }
          />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="*" element={<Navigate to="/login" replace />} /> {/* Redireciona para o login por padrão */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;