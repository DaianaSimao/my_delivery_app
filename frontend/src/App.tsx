// src/App.tsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import Login from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { Header } from "./components/Header";
import Produtos from "./components/Produtos";


const restaurantInfo = {
  name: "Sushi Express",
  openingHours: "Seg-Dom: 11:30 - 23:00",
  minimumOrder: 30,
  profileUrl: "#",
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

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
      {/* Se NÃO estiver autenticado, mostra apenas o Header */}
      {!isAuthenticated && <Header isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />}

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* Aplicando layout autenticado */}
        {isAuthenticated && (
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <div className="flex">
                  {/* Sidebar e Navbar aparecem apenas quando autenticado */}
                  <Dashboard isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
                  
                  {/* Área principal do conteúdo */}
                  <div className="flex-1 p-4">
                    <Routes>
                      <Route path="/dashboard" element={<h1>Bem-vindo ao Dashboard</h1>} />
                      <Route path="/produtos" element={<Produtos />} />
                    </Routes>
                  </div>
                </div>
              }
            >
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Route>
          </Route>
        )}
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
