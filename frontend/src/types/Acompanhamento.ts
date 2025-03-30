import { ItemAcompanhamento } from "./ItemAcompanhamento";

export interface Acompanhamento {
  id?: number;
  nome: string;
  quantidade_maxima: number;
  item_acompanhamentos: ItemAcompanhamento[];
}