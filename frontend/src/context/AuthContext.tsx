// src/context/AuthContext.ts
import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

type AuthContextType = {
  isAuthenticated: boolean;
  restauranteId: string | null;
  login: (token: string, restauranteId: string) => void;
  logout: () => void;
  switchRestaurant: (restauranteId: string) => void;
  pedidos: any[];
  produtos: any[];
  entregas: any[];
  carregarPedidos: () => Promise<void>;
  carregarProdutos: () => Promise<void>;
  carregarEntregas: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("token"); // Verifica se existe um token salvo
  });

  const [restauranteId, setRestauranteId] = useState<string | null>(() => {
    return localStorage.getItem("restauranteId"); // Recupera o restauranteId salvo
  });

  const [pedidos, setPedidos] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [entregas, setEntregas] = useState<any[]>([]);

  useEffect(() => {
    // Atualiza o estado baseado no token e restauranteId salvos
    setIsAuthenticated(!!localStorage.getItem("token"));
    setRestauranteId(localStorage.getItem("restauranteId"));
  }, []);

  const login = (token: string, restauranteId: string) => {
    localStorage.setItem("token", token); // Salva o token no localStorage
    localStorage.setItem("restauranteId", restauranteId); // Salva o restauranteId no localStorage
    setIsAuthenticated(true); // Atualiza o estado
    setRestauranteId(restauranteId); // Define o restauranteId ativo
  };

  const logout = () => {
    localStorage.removeItem("token"); // Remove o token
    localStorage.removeItem("restauranteId"); // Remove o restauranteId
    setIsAuthenticated(false); // Atualiza o estado
    setRestauranteId(null); // Limpa o restauranteId
  };


  const switchRestaurant = async (restauranteId: string) => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/api/v1/switch_restaurant",
        { restaurante_id: restauranteId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem("restauranteId", restauranteId);
      setRestauranteId(restauranteId);
      await carregarPedidos();
      await carregarProdutos();
      await carregarEntregas();
    } catch (error) {
      console.error("Erro ao trocar de restaurante:", error);
    }
  };

  const carregarPedidos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/v1/pedidos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPedidos(response.data);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    }
  };

  const carregarProdutos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/v1/produtos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };

  const carregarEntregas = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/v1/entregas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntregas(response.data);
    } catch (error) {
      console.error("Erro ao carregar entregas:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        restauranteId,
        login,
        logout,
        switchRestaurant,
        pedidos,
        produtos,
        entregas,
        carregarPedidos,
        carregarProdutos,
        carregarEntregas,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};