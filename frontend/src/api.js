// src/api.js
import axios from 'axios';

// Cria uma instância do axios
const api = axios.create({
  baseURL: 'http://localhost:3000', // URL base do backend
});

// Interceptor para adicionar o token no cabeçalho de todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Recupera o token do localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Adiciona o token no cabeçalho
  }
  return config;
});

export default api;