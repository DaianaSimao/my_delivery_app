export interface Produto {
  id: number;
  nome: string;
  preco: string;
  descricao: string;
  disponivel: boolean;
  imagem_url: string;
  restaurante_id: number;
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
  }[];
}