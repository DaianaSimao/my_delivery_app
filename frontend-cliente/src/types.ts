export interface MenuItem {
  [x: string]: any;
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem_url: string;
  disponivel: string;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
  id: string;
}

export interface Restaurante {
  nome: string;
  abertura: string;
  fechamento: string;
  pedido_minimo: number;
  taxa_entrega: number;
  tempo_medio_entrega: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
  options?: string[];
}