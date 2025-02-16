export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
  promotion?: {
    discountPercentage: number;
    originalPrice: number;
  };
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
  id: string;
}

export interface RestaurantInfo {
  name: string;
  openingHours: string;
  minimumOrder: number;
  profileUrl: string;
}