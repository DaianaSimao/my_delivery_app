import React, { createContext, useState, useEffect } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("token"); // Verifica se existe um token salvo
  });

  useEffect(() => {
    // Atualiza o estado baseado no token salvo
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token); // Salva o token no localStorage
    setIsAuthenticated(true); // Atualiza o estado
  };

  const logout = () => {
    localStorage.removeItem("token"); // Remove o token
    setIsAuthenticated(false); // Atualiza o estado
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};