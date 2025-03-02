export interface MenuItem {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem_url: string;
  disponivel: string;
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

export interface CartItem extends MenuItem {
  quantity: number;
  options?: string[];
}