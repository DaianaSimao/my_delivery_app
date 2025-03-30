export interface Promocao {
  tipo: 'de_para' | 'desconto_percentual';
  valor_de?: number;
  valor_para?: number;
  desconto_percentual?: number;
  nome: string;
}

export interface RestaurantInfo {
  name: string;
  openingHours: string;
  minimumOrder: number;
  profileUrl: string;
}