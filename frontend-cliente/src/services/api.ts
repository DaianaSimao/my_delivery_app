import axios, { AxiosInstance } from "axios";

// Configura a URL base do axios
const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000", // URL base da sua API
});

export const fetchMenu = async (restauranteId: string | number) => {
  try {
    const response = await api.get(`/api/v1/cardapio/${restauranteId}`);
    return response.data.data;
  }
  catch (error) {
    console.error("Erro ao buscar cardápio:", error);
    throw error;
  }
};

export const fetchProductDetails = async (id: number) => {
  try {  
    const response = await api.get(`/api/v1/cardapio/produto/${id}`);
    return response.data.data; // Retorna diretamente o produto formatado
  }
  catch (error) {
    console.error("Erro ao buscar detalhes do produto:", error);
    throw error;
  }
};

export const fetchRestaurantInfo = async (restauranteId: string | number) => {
  try {
    const response = await api.get(`/api/v1/restaurantes/${restauranteId}`);
    return response.data.data;
  }
  catch (error) {
    console.error("Erro ao buscar informações do restaurante:", error);
    throw error
  }
};

export const fetchClienteByWhatsApp = async (whatsapp: string) => {
  try {
    const response = await api.get(`/api/v1/clientes/?whatsapp=${whatsapp}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    throw error;
  }
};

export const fetchEnderecoById = async (enderecoId: number) => {
  try {
    const response = await api.get(`/api/v1/enderecos/${enderecoId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar endereço:", error);
    throw error;
  }
};

export const fetchPedidoById = async (pedidoId: string | number) => {
  try {
    const response = await api.get(`/api/v1/pedidos/rastreio_pedido/${pedidoId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    throw error;
  }
};

export const criarCliente = async (clienteData: any) => {
  try {
    const response = await api.post("/api/v1/clientes", clienteData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return null;
  }
};

export const criarEndereco = async (dadosEndereco: any) => {
  try {
    const response = await api.post('/api/v1/enderecos', dadosEndereco);
    return response.data
  } catch (error) {
    console.error('Erro ao criar endereço:', error);
    throw error;
  }
};

export const criarPedido = async (pedidoData: any) => {
  try {
    const response = await api.post("/api/v1/pedidos", pedidoData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    throw error;
  }
};

export const atualizarCliente = async (clienteId: string, dadosAtualizados: { nome: string; sobrenome:string; telefone: string; }) => {
  try {
    const response = await api.put(`/api/v1/clientes/${clienteId}`, dadosAtualizados);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    throw error;
  }
};

export const atualizarEnderecoCliente = async (clienteId: string, dadosAtualizados: { endereco_id: string; }) => {
  try {
    const response = await api.put(`/api/v1/clientes/${clienteId}`, dadosAtualizados);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    throw error;
  }
};

export const atualizarEndereco = async (enderecoId: number, dadosAtualizados: any) => {
  try {
    const response = await api.put(`/api/v1/enderecos/${enderecoId}`, dadosAtualizados);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar endereço:', error);
    throw error;
  }
};

export const fetchRegioesEntrega = async (restauranteId: string | number) => {
  try {
    const response = await api.get(`/api/v1/restaurantes/regioes_entrega/${restauranteId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar regiões de entrega:', error);
    throw error;
  }
}

export const fetchMaisPedidos = async (restauranteId: string | number) => {
  try {
    const response = await api.get(`/api/v1/restaurantes/${restauranteId}/mais_pedidos`);
    return response.data.data;
  } catch (error) {
    console.error("Erro ao buscar itens mais pedidos:", error);
    throw error;
  }
};

export const fetchSecoes = async (restauranteId: string | number) => {
  try {
    const response = await api.get(`/api/v1/restaurantes/${restauranteId}/secoes`);
    return response.data.data;
  } catch (error) {
    console.error("Erro ao buscar seções do cardápio:", error);
    throw error;
  }
};

export const fetchPromocoesAtivas = async (restauranteId: string) => {
  try {  
    const response = await api.get(`/api/v1/restaurantes/${restauranteId}/promocoes`);
    return response.data.data;
  } catch (error) {
    console.error("Erro ao buscar seções do cardápio:", error);
    throw error;
  }
};