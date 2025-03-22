export interface MenuItem {
  [x: string]: any;
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem_url: string;
  disponivel: string;
  produto_acompanhamentos: {
    id: number;
    acompanhamento: {
      [x: string]: any;
      id: number;
      nome: string;
      item_acompanhamentos: {
        preco: number;
        id: number;
        nome: string;
      }[];
    };
  }[]
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
  id: string;
  
}

export interface Restaurante {
  id: number;
  nome: string;
  descricao?: string;
  categoria?: string;
  abertura: string;
  fechamento: string;
  pedido_minimo: number;
  taxa_entrega: number;
  tempo_medio_entrega: number;
  avaliacao?: number;
  telefone?: string;
  email?: string;
  dias_funcionamento?: string;
  endereco?: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    complemento?: string;
    cep: string;
  };
}

export interface RegiaoEntrega {
  id: number;
  bairro: string;
  cidade: string;
  taxa_entrega: number;
  ativo: boolean;
  restaurante_id: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
  options?: string[];
  observation?: string;
}
