import axios, { AxiosInstance } from "axios";

// Configura a URL base do axios
const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000", // URL base da sua API
});

export const fetchMenu = async (restauranteId: string | number) => {
  const response = await api.get(`/api/v1/cardapio/${restauranteId}`);

  return response.data.data;
};

export const fetchProductDetails = async (id: number) => {
  const response = await api.get(`/api/v1/produtos/${id}`);
  return response.data.data;
};

export const fetchRestaurantInfo = async (restauranteId: string | number) => {
  const response = await api.get(`/api/v1/restaurantes/${restauranteId}`);
  return response.data.data; // Retorna as informações do restaurante
};

export const fetchClienteByWhatsApp = async (whatsapp: string) => {
  try {
    const response = await api.get(`/api/v1/clientes/?whatsapp=${whatsapp}`);
    console.log('Cliente encontrado axios:', response.data);
    return response.data; // Retorna os dados do client
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    return null;
  }
};