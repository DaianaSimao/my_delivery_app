export interface OrderItem {
  id: any;
  name: string;
  quantity: number;
  price: number;
  options?: string[];
  observation?: string;
  acompanhamentos: any[];
}
