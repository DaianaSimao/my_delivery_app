export interface ItemAcompanhamento {
  id: number;
  nome: string;
  preco: number;
  disponivel: boolean;
}

export interface Acompanhamento {
  id: number;
  nome: string;
  quantidade_maxima?: number;
  obrigatorio: boolean;
  item_acompanhamentos: ItemAcompanhamento[];
}

export interface ProdutoAcompanhamento {
  id: number;
  acompanhamento: Acompanhamento;
}

export interface Promocao {
  tipo: 'de_para' | 'desconto_percentual';
  valor_de?: number;
  valor_para?: number;
  desconto_percentual?: number;
  nome: string;
}

export interface MenuItem {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  preco_original?: number;
  imagem_url: string;
  disponivel: boolean;
  promocao?: Promocao;
  produto_acompanhamentos: ProdutoAcompanhamento[];
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
  id: string;
}

export interface RestaurantInfo {
  name: string;
  openingHours: string;
  minimumOrder: number;
  profileUrl: string;
}