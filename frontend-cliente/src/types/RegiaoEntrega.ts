export interface RegiaoEntrega {
  id: number;
  bairro: string;
  cidade: string;
  taxa_entrega: number;
  ativo: boolean;
  restaurante_id: number;
}