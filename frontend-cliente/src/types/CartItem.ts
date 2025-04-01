import { MenuItem } from './MenuItem';

export interface CartItem extends MenuItem {
  quantity: number;
  options?: string[];
  observation?: string;
  name: string;
  price: number;
  acompanhamentos: any[];
}