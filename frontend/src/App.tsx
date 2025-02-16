import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import { Header } from "./components/Header";

const restaurantInfo: RestaurantInfo = {
  name: "Sushi Express",
  openingHours: "Seg-Dom: 11:30 - 23:00",
  minimumOrder: 30,
  profileUrl: "#",
};

const App: React.FC = () => {
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
    <Router>
      <AuthProvider>
        <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
          <Header restaurantInfo={restaurantInfo} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
          <Routes>
            {/* Redireciona para login se o usuário acessar a raiz "/" */}
            <Route path="/" element={<Navigate to="/login" />} />


            <Route path="/login" element={<Login />} />

            {/* Protege a rota do dashboard */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
