export interface ItemAcompanhamento {
  id: number;
  nome: string;
  preco: number;
  disponivel: boolean;
  _destroy?: boolean;
}