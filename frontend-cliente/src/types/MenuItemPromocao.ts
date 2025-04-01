export interface MenuItemPromocao {
  [x: string]: any;
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