import React, { createContext, useState, useEffect } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (token: string, restauranteId: string) => void;
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

  const login = (token: string, restauranteId: string) => {
    console.log('login', token, restauranteId)
    localStorage.setItem("token", token); // Salva o token no localStorage
    localStorage.setItem('restauranteId', restauranteId)
    setIsAuthenticated(true); // Atualiza o estado
  };

  const logout = () => {
    localStorage.removeItem("token"); // Remove o token
    localStorage.removeItem("restauranteId"); // Remove o restauranteId
    setIsAuthenticated(false); // Atualiza o estado
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};