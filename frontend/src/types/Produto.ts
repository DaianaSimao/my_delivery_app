export interface Produto {
  id?: number;
  nome: string;
  preco: string;
  descricao: string;
  disponivel: boolean;
  imagem_url: string;
  restaurante_id: number;
  acompanhamentos_selecionados: number[],
  produto_acompanhamentos: {
    id?: number;
    acompanhamento_id: number
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
  secoes_selecionadas: number[],
  produto_secoes: {
    id?: number;
    secoes_cardapio_id: number
    secoes_cardapio: {
      id: number;
      nome: string;
      ordem: number;
    };
  }[];
}
