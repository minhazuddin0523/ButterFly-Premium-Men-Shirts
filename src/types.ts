export interface Product {
  id: number | string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  stock?: number;
  original_id?: string | number;
  created_at?: any;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}
