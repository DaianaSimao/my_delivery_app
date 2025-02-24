// src/App.tsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/autenticacao/Login";
import { Dashboard } from "./components/admin/Dashboard";
import { Header } from "./components/autenticacao/Header";
import Produtos from "./components/produtos/Produtos";
import { Toaster } from "react-hot-toast";
import Acompanhamentos from './components/acompanhamentos/Acompanhamentos';
import AcompanhamentosForm from './components/acompanhamentos/AcompanhamentosForm';

const restaurantInfo = {
  name: "Sushi Express",
  openingHours: "Seg-Dom: 11:30 - 23:00",
  minimumOrder: 30,
  profileUrl: "#",
};

const AppContent: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
        <Toaster />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          {/* Criação de um layout com Header */}
          <Route 
            path="/login" 
            element={
              <>
                <Header isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
                <Login />
              </>
            } 
          />
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <div className="flex">
                  <Dashboard restaurantInfo={restaurantInfo} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
                    
                  <div className="w-full mt-5">
                    <Routes>
                      <Route path="/dashboard" element={<h1>Bem-vindo ao Dashboard</h1>} />
                      <Route path="/produtos" element={<Produtos />} />
                      <Route path="/acompanhamentos" element={<Acompanhamentos />} />
                      <Route path="/acompanhamentos/new" element={<AcompanhamentosForm />} />
                    </Routes>
                  </div>
                </div>
              }
            >
            <Route path="*" element={<Navigate to="/dashboard" />} />
            </Route>
          </Route>
        </Routes>
  </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
