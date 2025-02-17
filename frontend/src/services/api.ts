// src/services/api.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

// Configura a URL base do axios
const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000", // URL base da sua API
});

// Adiciona um interceptor para incluir o token no cabeçalho de todas as requisições
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Adiciona um interceptor para tratar erros globais
api.interceptors.response.use(
  (response: AxiosResponse) => response, // Retorna a resposta diretamente se não houver erro
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Se o erro for 401 (não autorizado), redireciona para a página de login
      localStorage.removeItem("token"); // Remove o token inválido
      window.location.href = "/login"; // Redireciona para a página de login
    }

    return Promise.reject(error); // Rejeita a promessa para que o erro seja tratado no componente
  }
);

export default api;