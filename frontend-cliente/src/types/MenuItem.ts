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

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  popular?: boolean;
  promotion?: {
    originalPrice: number;
    discountPercentage: number;
  };
}