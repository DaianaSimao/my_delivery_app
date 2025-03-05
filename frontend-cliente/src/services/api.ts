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
    return response.data; // Retorna os dados do client
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    throw error;
  }
};

export const fetchEnderecoById = async (enderecoId: number) => {
  try {
    const response = await api.get(`/api/v1/enderecos/${enderecoId}`);
    return response.data; // Retorna os dados do endereço
  } catch (error) {
    console.error("Erro ao buscar endereço:", error);
    throw error;
  }
};

// Novas funções
export const criarCliente = async (clienteData: any) => {
  try {
    const response = await api.post("/api/v1/clientes", clienteData);
    return response.data; // Retorna o cliente criado
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return null;
  }
};

export const criarEndereco = async (dadosEndereco: any) => {
  try {
    const response = await api.post('/api/v1/enderecos', dadosEndereco);
    return response.data; // Retorna o endereço criado
  } catch (error) {
    console.error('Erro ao criar endereço:', error);
    throw error;
  }
};

export const criarPedido = async (pedidoData: any) => {
  try {
    const response = await api.post("/api/v1/pedidos", pedidoData);
    return response.data; // Retorna o pedido criado
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    throw error;
  }
};

export const atualizarCliente = async (clienteId: string, dadosAtualizados: { nome: string; telefone: string; }) => {
  try {
    const response = await api.put(`/api/v1/clientes/${clienteId}`, dadosAtualizados);
    return response.data; // Retorna o cliente atualizado
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    throw error; // Lança o erro para ser tratado no componente
  }
};

export const atualizarEnderecoCliente = async (clienteId: string, dadosAtualizados: { endereco_id: string; }) => {
  try {
    const response = await api.put(`/api/v1/clientes/${clienteId}`, dadosAtualizados);
    return response.data; // Retorna o cliente atualizado
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    throw error; // Lança o erro para ser tratado no componente
  }
};

export const atualizarEndereco = async (enderecoId: number, dadosAtualizados: any) => {
  try {
    const response = await api.put(`/api/v1/enderecos/${enderecoId}`, dadosAtualizados);
    return response.data; // Retorna o endereço atualizado
  } catch (error) {
    console.error('Erro ao atualizar endereço:', error);
    throw error;
  }
};