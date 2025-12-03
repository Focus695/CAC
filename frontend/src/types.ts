
export enum Category {
  AGARWOOD = '沉香',
  SANDALWOOD = '檀香',
  JADE = '玉石',
  TEA_WARE = '茶器',
  BURNER = '香具',
  ACCESSORY = '雅玩'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  description: string;
  imageUrl: string;
  benefits: string; // TCM benefits
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
}
